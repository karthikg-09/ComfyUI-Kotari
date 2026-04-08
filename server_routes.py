import os
import sys
import json
import shutil
import asyncio
import aiohttp
import traceback
from pathlib import Path
from datetime import datetime

from server import PromptServer
from aiohttp import web

routes = PromptServer.instance.routes

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _safe_path(raw: str) -> str:
    """Resolve a path and ensure it's absolute. Prevents trivial traversal."""
    p = os.path.realpath(os.path.expanduser(raw))
    return p


def _format_size(size_bytes: int) -> str:
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if abs(size_bytes) < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} PB"


def _comfyui_base() -> str:
    """Best-effort detection of ComfyUI root directory."""
    # server.py lives at the ComfyUI root
    import folder_paths
    return os.path.dirname(os.path.abspath(folder_paths.__file__))


# ---------------------------------------------------------------------------
# GET /kotari/system_info — quick-nav paths
# ---------------------------------------------------------------------------

@routes.get("/kotari/system_info")
async def kotari_system_info(request):
    try:
        import folder_paths
        base = _comfyui_base()
        info = {
            "comfyui_base": base,
            "shortcuts": {
                "Models": folder_paths.models_dir,
                "Output": folder_paths.get_output_directory(),
                "Input": folder_paths.get_input_directory(),
                "Custom Nodes": os.path.join(base, "custom_nodes"),
            },
        }
        return web.json_response(info)
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# GET /kotari/browse?path=...
# ---------------------------------------------------------------------------

@routes.get("/kotari/browse")
async def kotari_browse(request):
    raw = request.query.get("path", "/")
    target = _safe_path(raw)

    if not os.path.isdir(target):
        return web.json_response({"error": f"Not a directory: {target}"}, status=400)

    items = []
    try:
        for entry in sorted(os.scandir(target), key=lambda e: (not e.is_dir(), e.name.lower())):
            try:
                stat = entry.stat(follow_symlinks=False)
                items.append({
                    "name": entry.name,
                    "is_dir": entry.is_dir(follow_symlinks=False),
                    "size": stat.st_size if not entry.is_dir() else None,
                    "size_h": _format_size(stat.st_size) if not entry.is_dir() else None,
                    "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    "is_symlink": entry.is_symlink(),
                })
            except PermissionError:
                items.append({
                    "name": entry.name,
                    "is_dir": False,
                    "size": None,
                    "size_h": None,
                    "modified": None,
                    "is_symlink": False,
                    "error": "permission denied",
                })
    except PermissionError:
        return web.json_response({"error": "Permission denied"}, status=403)

    return web.json_response({
        "path": target,
        "parent": os.path.dirname(target),
        "items": items,
    })


# ---------------------------------------------------------------------------
# GET /kotari/read_file?path=...&max_lines=200
# ---------------------------------------------------------------------------

@routes.get("/kotari/read_file")
async def kotari_read_file(request):
    raw = request.query.get("path", "")
    max_lines = int(request.query.get("max_lines", "200"))
    target = _safe_path(raw)

    if not os.path.isfile(target):
        return web.json_response({"error": "Not a file"}, status=400)

    size = os.path.getsize(target)
    # Don't try to read binary files larger than 5 MB as text
    if size > 5 * 1024 * 1024:
        return web.json_response({
            "path": target,
            "size": size,
            "size_h": _format_size(size),
            "truncated": True,
            "content": "[File too large to preview]",
        })

    try:
        with open(target, "r", errors="replace") as f:
            lines = []
            for i, line in enumerate(f):
                if i >= max_lines:
                    break
                lines.append(line)
        content = "".join(lines)
        return web.json_response({
            "path": target,
            "size": size,
            "size_h": _format_size(size),
            "truncated": len(lines) >= max_lines,
            "content": content,
        })
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# GET /kotari/disk_usage?path=/
# ---------------------------------------------------------------------------

@routes.get("/kotari/disk_usage")
async def kotari_disk_usage(request):
    raw = request.query.get("path", "/")
    target = _safe_path(raw)
    try:
        usage = shutil.disk_usage(target)
        return web.json_response({
            "total": usage.total,
            "used": usage.used,
            "free": usage.free,
            "total_h": _format_size(usage.total),
            "used_h": _format_size(usage.used),
            "free_h": _format_size(usage.free),
            "percent_used": round(usage.used / usage.total * 100, 1),
        })
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /kotari/mkdir  {path}
# ---------------------------------------------------------------------------

@routes.post("/kotari/mkdir")
async def kotari_mkdir(request):
    data = await request.json()
    target = _safe_path(data.get("path", ""))
    try:
        os.makedirs(target, exist_ok=True)
        return web.json_response({"ok": True, "path": target})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /kotari/delete  {path, confirm: true}
# ---------------------------------------------------------------------------

@routes.post("/kotari/delete")
async def kotari_delete(request):
    data = await request.json()
    target = _safe_path(data.get("path", ""))
    if not data.get("confirm"):
        return web.json_response({"error": "confirm flag required"}, status=400)

    if not os.path.exists(target):
        return web.json_response({"error": "Path does not exist"}, status=404)

    try:
        if os.path.isdir(target):
            shutil.rmtree(target)
        else:
            os.remove(target)
        return web.json_response({"ok": True})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /kotari/move  {source, destination}
# ---------------------------------------------------------------------------

@routes.post("/kotari/move")
async def kotari_move(request):
    data = await request.json()
    src = _safe_path(data.get("source", ""))
    dst = _safe_path(data.get("destination", ""))

    if not os.path.exists(src):
        return web.json_response({"error": "Source does not exist"}, status=404)

    try:
        shutil.move(src, dst)
        return web.json_response({"ok": True, "destination": dst})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /kotari/download  {url, destination, filename?}
# ---------------------------------------------------------------------------

@routes.post("/kotari/download")
async def kotari_download(request):
    data = await request.json()
    url = data.get("url", "").strip()
    dest_dir = _safe_path(data.get("destination", "."))
    filename = data.get("filename", "").strip()

    if not url:
        return web.json_response({"error": "url required"}, status=400)

    os.makedirs(dest_dir, exist_ok=True)

    try:
        timeout = aiohttp.ClientTimeout(total=None, connect=30)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url, allow_redirects=True) as resp:
                if resp.status != 200:
                    return web.json_response(
                        {"error": f"HTTP {resp.status} from remote"}, status=502
                    )

                # Determine filename
                if not filename:
                    # Try Content-Disposition header
                    cd = resp.headers.get("Content-Disposition", "")
                    if "filename=" in cd:
                        filename = cd.split("filename=")[-1].strip(' "\'')
                    else:
                        filename = url.split("/")[-1].split("?")[0]
                    if not filename:
                        filename = "downloaded_file"
                    # Clean up filename: remove semicolons and other problematic chars
                    filename = filename.split(";")[0].strip()

                filepath = os.path.join(dest_dir, filename)
                total = resp.content_length or 0
                downloaded = 0

                with open(filepath, "wb") as f:
                    async for chunk in resp.content.iter_chunked(1024 * 256):
                        f.write(chunk)
                        downloaded += len(chunk)
                        # Send progress every 256KB chunk
                        PromptServer.instance.send_sync("kotari.download.progress", {
                            "filename": filename,
                            "downloaded": downloaded,
                            "downloaded_h": _format_size(downloaded),
                            "total": total,
                            "total_h": _format_size(total) if total else "unknown",
                            "percent": round(downloaded / total * 100, 1) if total else 0,
                        })

                PromptServer.instance.send_sync("kotari.download.complete", {
                    "filename": filename,
                    "path": filepath,
                    "size": downloaded,
                    "size_h": _format_size(downloaded),
                })

                return web.json_response({
                    "ok": True,
                    "path": filepath,
                    "size": downloaded,
                    "size_h": _format_size(downloaded),
                })
    except asyncio.CancelledError:
        return web.json_response({"error": "Download cancelled"}, status=499)
    except Exception as e:
        traceback.print_exc()
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /kotari/git_clone  {repo_url, destination, branch?}
# ---------------------------------------------------------------------------

@routes.post("/kotari/git_clone")
async def kotari_git_clone(request):
    data = await request.json()
    repo_url = data.get("repo_url", "").strip()
    dest = _safe_path(data.get("destination", ""))
    branch = data.get("branch", "").strip()

    if not repo_url:
        return web.json_response({"error": "repo_url required"}, status=400)
    if not dest:
        return web.json_response({"error": "destination required"}, status=400)

    cmd = ["git", "clone", "--progress"]
    if branch:
        cmd += ["-b", branch]
    cmd += [repo_url, dest]

    try:
        PromptServer.instance.send_sync("kotari.clone.progress", {
            "status": "started",
            "repo_url": repo_url,
            "destination": dest,
        })

        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate()

        if process.returncode == 0:
            PromptServer.instance.send_sync("kotari.clone.complete", {
                "repo_url": repo_url,
                "destination": dest,
            })
            return web.json_response({"ok": True, "destination": dest})
        else:
            err = stderr.decode(errors="replace")
            return web.json_response({"error": err}, status=500)
    except Exception as e:
        traceback.print_exc()
        return web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /kotari/upload  (multipart: file + destination)
# ---------------------------------------------------------------------------

@routes.post("/kotari/upload")
async def kotari_upload(request):
    try:
        reader = await request.multipart()
        dest_dir = None
        filename = None
        filepath = None

        async for part in reader:
            if part.name == "destination":
                dest_dir = _safe_path((await part.text()).strip())
            elif part.name == "file":
                filename = part.filename
                if not dest_dir:
                    dest_dir = _safe_path(".")
                os.makedirs(dest_dir, exist_ok=True)
                filepath = os.path.join(dest_dir, filename)
                with open(filepath, "wb") as f:
                    while True:
                        chunk = await part.read_chunk(1024 * 256)
                        if not chunk:
                            break
                        f.write(chunk)

        if filepath and os.path.exists(filepath):
            size = os.path.getsize(filepath)
            return web.json_response({
                "ok": True,
                "path": filepath,
                "size": size,
                "size_h": _format_size(size),
            })
        return web.json_response({"error": "No file received"}, status=400)
    except Exception as e:
        traceback.print_exc()
        return web.json_response({"error": str(e)}, status=500)

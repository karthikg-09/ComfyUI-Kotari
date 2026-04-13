import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

// =========================================================================
// Kotari File Manager — ComfyUI Sidebar Extension
// =========================================================================

const STYLE = `
.kotari-fm {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.kotari-fm * { box-sizing: border-box; }

/* Header / Quick Nav */
.kotari-header {
  padding: 10px;
  border-bottom: 1px solid #444;
  flex-shrink: 0;
}
.kotari-header h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.kotari-quick-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}
.kotari-quick-nav button {
  padding: 3px 8px;
  font-size: 11px;
  background: #383838;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.kotari-quick-nav button:hover { background: #4a4a4a; color: #fff; }

/* Path bar */
.kotari-path-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}
.kotari-path-bar input {
  flex: 1;
  padding: 4px 6px;
  font-size: 12px;
  background: #2a2a2a;
  color: #ddd;
  border: 1px solid #555;
  border-radius: 4px;
  outline: none;
}
.kotari-path-bar input:focus { border-color: #7b8cde; }

/* Toolbar */
.kotari-toolbar {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}
.kotari-btn {
  padding: 4px 10px;
  font-size: 12px;
  background: #383838;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.kotari-btn:hover { background: #4a4a4a; color: #fff; }
.kotari-btn-primary {
  background: #4a6fa5;
  border-color: #5a80b6;
  color: #fff;
}
.kotari-btn-primary:hover { background: #5a80b6; }
.kotari-btn-danger {
  background: #8b3a3a;
  border-color: #a04a4a;
  color: #fff;
}
.kotari-btn-danger:hover { background: #a04a4a; }

/* Disk usage */
.kotari-disk {
  font-size: 11px;
  color: #999;
  margin-bottom: 4px;
}
.kotari-disk-bar {
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 2px;
}
.kotari-disk-bar-fill {
  height: 100%;
  background: #5b8cde;
  transition: width 0.3s;
}

/* File list */
.kotari-file-list {
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid #444;
}
.kotari-file-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: 1px solid #333;
  gap: 8px;
}
.kotari-file-item:hover { background: #353535; }
.kotari-file-item.selected { background: #3a4a6a; }
.kotari-file-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
.kotari-file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.kotari-file-size {
  font-size: 11px;
  color: #888;
  flex-shrink: 0;
}
.kotari-file-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}
.kotari-file-item:hover .kotari-file-actions { opacity: 1; }
.kotari-file-actions button {
  padding: 2px 5px;
  font-size: 11px;
  background: #444;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 3px;
  cursor: pointer;
}
.kotari-file-actions button:hover { background: #666; color: #fff; }
.kotari-file-actions button.danger:hover { background: #a04a4a; }

/* Actions panel */
.kotari-actions-panel {
  border-top: 1px solid #444;
  padding: 10px;
  flex-shrink: 0;
}
.kotari-actions-panel h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.kotari-action-btns {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kotari-action-btns button {
  width: 100%;
  text-align: left;
}

/* Modal overlay */
.kotari-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.kotari-modal {
  background: #2a2a2a;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 20px;
  min-width: 360px;
  max-width: 500px;
  width: 90%;
}
.kotari-modal h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #fff;
}
.kotari-modal label {
  display: block;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 4px;
  margin-top: 8px;
}
.kotari-modal input, .kotari-modal select {
  width: 100%;
  padding: 6px 8px;
  font-size: 13px;
  background: #1e1e1e;
  color: #ddd;
  border: 1px solid #555;
  border-radius: 4px;
  outline: none;
}
.kotari-modal input:focus { border-color: #7b8cde; }
.kotari-modal-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

/* Progress */
.kotari-progress {
  margin-top: 10px;
}
.kotari-progress-bar {
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
}
.kotari-progress-bar-fill {
  height: 100%;
  background: #5b8cde;
  transition: width 0.2s;
  width: 0%;
}
.kotari-progress-text {
  font-size: 11px;
  color: #aaa;
  margin-top: 4px;
}

/* Preview panel */
.kotari-preview {
  flex: 1;
  overflow: auto;
  padding: 10px;
  background: #1e1e1e;
  border-top: 1px solid #444;
}
.kotari-preview pre {
  margin: 0;
  font-size: 12px;
  font-family: "SF Mono", "Fira Code", monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: #ccc;
}
.kotari-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: #2a2a2a;
  border-top: 1px solid #444;
  flex-shrink: 0;
}

/* Status bar */
.kotari-status {
  padding: 4px 10px;
  font-size: 11px;
  color: #888;
  border-top: 1px solid #444;
  flex-shrink: 0;
  min-height: 22px;
}
.kotari-status.error { color: #e88; }
.kotari-status.success { color: #8e8; }

/* Loading */
.kotari-loading {
  text-align: center;
  padding: 20px;
  color: #888;
}

/* Empty state */
.kotari-empty {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 12px;
}
`;

// =========================================================================
// State
// =========================================================================

let state = {
  currentPath: "/",
  items: [],
  shortcuts: {},
  selectedItem: null,
  previewMode: false,
  previewContent: null,
  diskUsage: null,
  downloading: false,
  downloadProgress: null,
  cloning: false,
  statusMsg: "",
  statusType: "",
};

let rootEl = null;

// =========================================================================
// API helpers
// =========================================================================

async function apiFetch(path, options = {}) {
  const resp = await api.fetchApi(path, options);
  return await resp.json();
}

async function browse(dirPath) {
  state.selectedItem = null;
  state.previewMode = false;
  state.previewContent = null;
  const data = await apiFetch(`/kotari/browse?path=${encodeURIComponent(dirPath)}`);
  if (data.error) {
    setStatus(data.error, "error");
    return;
  }
  state.currentPath = data.path;
  state.items = data.items;
  setStatus(`${data.items.length} items`);
  render();
}

async function fetchSystemInfo() {
  const data = await apiFetch("/kotari/system_info");
  if (!data.error) {
    state.shortcuts = data.shortcuts || {};
    state.currentPath = data.comfyui_base || "/";
  }
}

async function fetchDiskUsage() {
  const data = await apiFetch(`/kotari/disk_usage?path=${encodeURIComponent(state.currentPath)}`);
  if (!data.error) {
    state.diskUsage = data;
  }
}

async function readFile(filePath) {
  const data = await apiFetch(`/kotari/read_file?path=${encodeURIComponent(filePath)}`);
  return data;
}

async function doDelete(itemPath) {
  const data = await apiFetch("/kotari/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: itemPath, confirm: true }),
  });
  return data;
}

async function doMove(source, destination) {
  const data = await apiFetch("/kotari/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, destination }),
  });
  return data;
}

async function doMkdir(dirPath) {
  const data = await apiFetch("/kotari/mkdir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: dirPath }),
  });
  return data;
}

async function doDownload(url, destination, filename) {
  const data = await apiFetch("/kotari/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, destination, filename }),
  });
  return data;
}

async function doGitClone(repoUrl, destination, branch) {
  const data = await apiFetch("/kotari/git_clone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl, destination, branch }),
  });
  return data;
}

async function doUpload(file, destination) {
  const formData = new FormData();
  formData.append("destination", destination);
  formData.append("file", file);
  const resp = await api.fetchApi("/kotari/upload", {
    method: "POST",
    body: formData,
  });
  return await resp.json();
}

// =========================================================================
// Status
// =========================================================================

function setStatus(msg, type = "") {
  state.statusMsg = msg;
  state.statusType = type;
  const el = rootEl?.querySelector(".kotari-status");
  if (el) {
    el.textContent = msg;
    el.className = "kotari-status" + (type ? " " + type : "");
  }
}

// =========================================================================
// Modal helpers
// =========================================================================

function showModal(title, fields, onSubmit) {
  const overlay = document.createElement("div");
  overlay.className = "kotari-modal-overlay";

  const modal = document.createElement("div");
  modal.className = "kotari-modal";

  let html = `<h3>${title}</h3>`;
  for (const f of fields) {
    html += `<label>${f.label}</label>`;
    html += `<input type="${f.type || "text"}" id="kotari-field-${f.id}" value="${f.value || ""}" placeholder="${f.placeholder || ""}" />`;
  }
  html += `<div class="kotari-progress" id="kotari-modal-progress" style="display:none">
    <div class="kotari-progress-bar"><div class="kotari-progress-bar-fill" id="kotari-modal-progress-fill"></div></div>
    <div class="kotari-progress-text" id="kotari-modal-progress-text"></div>
  </div>`;
  html += `<div class="kotari-modal-btns">
    <button class="kotari-btn" id="kotari-modal-cancel">Cancel</button>
    <button class="kotari-btn kotari-btn-primary" id="kotari-modal-ok">OK</button>
  </div>`;

  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.querySelector("#kotari-modal-cancel").onclick = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector("#kotari-modal-ok").onclick = async () => {
    const values = {};
    for (const f of fields) {
      values[f.id] = overlay.querySelector(`#kotari-field-${f.id}`).value;
    }
    await onSubmit(values, overlay);
  };

  // Focus first input
  setTimeout(() => {
    const first = overlay.querySelector("input");
    if (first) first.focus();
  }, 50);

  // Enter key submits
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") overlay.querySelector("#kotari-modal-ok").click();
  });

  return overlay;
}

function showConfirm(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "kotari-modal-overlay";
  const modal = document.createElement("div");
  modal.className = "kotari-modal";
  modal.innerHTML = `
    <h3>Confirm</h3>
    <p style="color:#ccc;font-size:13px;margin:8px 0">${message}</p>
    <div class="kotari-modal-btns">
      <button class="kotari-btn" id="kotari-confirm-no">Cancel</button>
      <button class="kotari-btn kotari-btn-danger" id="kotari-confirm-yes">Delete</button>
    </div>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  overlay.querySelector("#kotari-confirm-no").onclick = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector("#kotari-confirm-yes").onclick = async () => {
    overlay.remove();
    await onConfirm();
  };
}

// =========================================================================
// File type helpers
// =========================================================================

function getFileIcon(item) {
  if (item.is_dir) return "\uD83D\uDCC1"; // folder
  const ext = item.name.split(".").pop().toLowerCase();
  const images = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"];
  const code = ["py", "js", "json", "yaml", "yml", "toml", "cfg", "ini", "sh", "bat"];
  const models = ["safetensors", "ckpt", "pt", "pth", "bin", "onnx", "gguf"];
  if (images.includes(ext)) return "\uD83D\uDDBC\uFE0F"; // image
  if (code.includes(ext)) return "\uD83D\uDCDD"; // code
  if (models.includes(ext)) return "\uD83E\uDDE0"; // model
  if (ext === "md" || ext === "txt" || ext === "log") return "\uD83D\uDCC4"; // doc
  return "\uD83D\uDCC4"; // generic file
}

function isPreviewable(name) {
  const ext = name.split(".").pop().toLowerCase();
  const textExts = ["py", "js", "json", "yaml", "yml", "toml", "cfg", "ini", "sh", "bat",
                     "md", "txt", "log", "csv", "xml", "html", "css", "conf", "env",
                     "gitignore", "dockerfile"];
  return textExts.includes(ext) || name.startsWith(".");
}

// =========================================================================
// Render
// =========================================================================

function render() {
  if (!rootEl) return;

  // Build quick nav buttons
  const shortcutBtns = Object.entries(state.shortcuts)
    .map(([label, path]) => `<button data-nav="${path}">${label}</button>`)
    .join("");

  // Disk usage
  let diskHtml = "";
  if (state.diskUsage) {
    const d = state.diskUsage;
    diskHtml = `
      <div class="kotari-disk">
        ${d.free_h} free / ${d.total_h} total (${d.percent_used}% used)
        <div class="kotari-disk-bar"><div class="kotari-disk-bar-fill" style="width:${d.percent_used}%"></div></div>
      </div>
    `;
  }

  // File list
  let fileListHtml = "";
  if (state.items.length === 0) {
    fileListHtml = `<div class="kotari-empty">Empty directory</div>`;
  } else {
    for (const item of state.items) {
      const icon = getFileIcon(item);
      const sizeStr = item.size_h || "";
      const selected = state.selectedItem === item.name ? " selected" : "";
      const previewBtn = !item.is_dir && isPreviewable(item.name)
        ? `<button data-preview="${item.name}" title="Preview">👁</button>`
        : "";
      fileListHtml += `
        <div class="kotari-file-item${selected}" data-name="${item.name}" data-isdir="${item.is_dir}">
          <span class="kotari-file-icon">${icon}</span>
          <span class="kotari-file-name" title="${item.name}">${item.name}</span>
          <span class="kotari-file-size">${sizeStr}</span>
          <span class="kotari-file-actions">
            ${previewBtn}
            <button data-rename="${item.name}" title="Rename">✏️</button>
            <button class="danger" data-delete="${item.name}" title="Delete">🗑</button>
          </span>
        </div>
      `;
    }
  }

  // Preview panel
  let previewHtml = "";
  if (state.previewMode && state.previewContent) {
    const escaped = state.previewContent.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    previewHtml = `
      <div class="kotari-preview-header">
        <span style="font-size:12px;color:#aaa">${state.previewContent.path?.split("/").pop() || "Preview"} (${state.previewContent.size_h || ""})</span>
        <button class="kotari-btn" id="kotari-close-preview">Close</button>
      </div>
      <div class="kotari-preview"><pre>${escaped}</pre></div>
    `;
  }

  rootEl.innerHTML = `
    <div class="kotari-header">
      <h3>\uD83D\uDCC2 Kotari File Manager</h3>
      <div class="kotari-quick-nav">
        <button data-nav="/">Root</button>
        ${shortcutBtns}
      </div>
      <div class="kotari-path-bar">
        <button class="kotari-btn" id="kotari-up" title="Go up">\u2191</button>
        <input type="text" id="kotari-path-input" value="${state.currentPath}" />
        <button class="kotari-btn" id="kotari-go" title="Navigate">Go</button>
      </div>
      <div class="kotari-toolbar">
        <button class="kotari-btn" id="kotari-refresh" title="Refresh">\u21BB</button>
        <button class="kotari-btn" id="kotari-new-folder" title="New folder">+ Folder</button>
      </div>
      ${diskHtml}
    </div>
    <div class="kotari-file-list" id="kotari-file-list">
      ${fileListHtml}
    </div>
    ${previewHtml}
    <div class="kotari-actions-panel">
      <h4>Actions</h4>
      <div class="kotari-action-btns">
        <button class="kotari-btn kotari-btn-primary" id="kotari-download-btn">\u2B07 Download from URL</button>
        <button class="kotari-btn kotari-btn-primary" id="kotari-clone-btn">\uD83D\uDD17 Clone Git Repo</button>
        <button class="kotari-btn" id="kotari-upload-btn">\u2B06 Upload File</button>
      </div>
    </div>
    <div class="kotari-status ${state.statusType}">${state.statusMsg}</div>
  `;

  bindEvents();
}

// =========================================================================
// Event Binding
// =========================================================================

function bindEvents() {
  if (!rootEl) return;

  // Quick nav
  rootEl.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.onclick = () => {
      browse(btn.dataset.nav);
      fetchDiskUsage().then(render);
    };
  });

  // Path input
  const pathInput = rootEl.querySelector("#kotari-path-input");
  const goBtn = rootEl.querySelector("#kotari-go");
  if (goBtn) goBtn.onclick = () => browse(pathInput.value);
  if (pathInput) pathInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") browse(pathInput.value);
  });

  // Up
  const upBtn = rootEl.querySelector("#kotari-up");
  if (upBtn) upBtn.onclick = () => {
    const parent = state.currentPath.replace(/\/[^/]+\/?$/, "") || "/";
    browse(parent);
  };

  // Refresh
  const refreshBtn = rootEl.querySelector("#kotari-refresh");
  if (refreshBtn) refreshBtn.onclick = () => {
    browse(state.currentPath);
    fetchDiskUsage().then(render);
  };

  // New folder
  const newFolderBtn = rootEl.querySelector("#kotari-new-folder");
  if (newFolderBtn) newFolderBtn.onclick = () => {
    showModal("New Folder", [
      { id: "name", label: "Folder name", placeholder: "new_folder" },
    ], async (values, overlay) => {
      if (!values.name) return;
      const result = await doMkdir(state.currentPath + "/" + values.name);
      overlay.remove();
      if (result.ok) {
        setStatus(`Created: ${values.name}`, "success");
        browse(state.currentPath);
      } else {
        setStatus(result.error, "error");
      }
    });
  };

  // File items — click to navigate / select
  rootEl.querySelectorAll(".kotari-file-item").forEach((el) => {
    el.onclick = (e) => {
      // Don't handle clicks on action buttons
      if (e.target.closest(".kotari-file-actions")) return;

      const name = el.dataset.name;
      const isDir = el.dataset.isdir === "true";
      if (isDir) {
        browse(state.currentPath + "/" + name);
      } else {
        state.selectedItem = state.selectedItem === name ? null : name;
        render();
      }
    };
  });

  // Preview buttons
  rootEl.querySelectorAll("[data-preview]").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const name = btn.dataset.preview;
      const filePath = state.currentPath + "/" + name;
      setStatus("Loading preview...");
      const data = await readFile(filePath);
      if (data.error) {
        setStatus(data.error, "error");
      } else {
        state.previewMode = true;
        state.previewContent = data;
        setStatus("");
        render();
      }
    };
  });

  // Close preview
  const closePreviewBtn = rootEl.querySelector("#kotari-close-preview");
  if (closePreviewBtn) closePreviewBtn.onclick = () => {
    state.previewMode = false;
    state.previewContent = null;
    render();
  };

  // Rename buttons
  rootEl.querySelectorAll("[data-rename]").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const oldName = btn.dataset.rename;
      showModal("Rename / Move", [
        { id: "newpath", label: "New name or full path", value: state.currentPath + "/" + oldName },
      ], async (values, overlay) => {
        const src = state.currentPath + "/" + oldName;
        const dst = values.newpath;
        if (!dst || src === dst) { overlay.remove(); return; }
        const result = await doMove(src, dst);
        overlay.remove();
        if (result.ok) {
          setStatus(`Moved: ${oldName}`, "success");
          browse(state.currentPath);
        } else {
          setStatus(result.error, "error");
        }
      });
    };
  });

  // Delete buttons
  rootEl.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const name = btn.dataset.delete;
      showConfirm(`Delete <strong>${name}</strong>? This cannot be undone.`, async () => {
        const result = await doDelete(state.currentPath + "/" + name);
        if (result.ok) {
          setStatus(`Deleted: ${name}`, "success");
          browse(state.currentPath);
          fetchDiskUsage().then(render);
        } else {
          setStatus(result.error, "error");
        }
      });
    };
  });

  // Download button
  const dlBtn = rootEl.querySelector("#kotari-download-btn");
  if (dlBtn) dlBtn.onclick = () => {
    const overlay = showModal("Download File from URL", [
      { id: "url", label: "URL", placeholder: "https://huggingface.co/..." },
      { id: "destination", label: "Save to directory", value: state.currentPath },
      { id: "filename", label: "Filename (optional)", placeholder: "auto-detect" },
    ], async (values, ov) => {
      if (!values.url) return;
      const progressEl = ov.querySelector("#kotari-modal-progress");
      const fillEl = ov.querySelector("#kotari-modal-progress-fill");
      const textEl = ov.querySelector("#kotari-modal-progress-text");
      const okBtn = ov.querySelector("#kotari-modal-ok");
      progressEl.style.display = "block";
      okBtn.disabled = true;
      okBtn.textContent = "Downloading...";
      textEl.textContent = "Starting download...";

      state.downloading = true;

      const result = await doDownload(values.url, values.destination, values.filename);
      state.downloading = false;

      if (result.ok) {
        fillEl.style.width = "100%";
        textEl.textContent = `Done! ${result.size_h}`;
        setStatus(`Downloaded: ${result.path}`, "success");
        setTimeout(() => {
          ov.remove();
          browse(state.currentPath);
          fetchDiskUsage().then(render);
        }, 1000);
      } else {
        textEl.textContent = `Error: ${result.error}`;
        okBtn.disabled = false;
        okBtn.textContent = "Retry";
        setStatus(result.error, "error");
      }
    });
  };

  // Clone button
  const cloneBtn = rootEl.querySelector("#kotari-clone-btn");
  if (cloneBtn) cloneBtn.onclick = () => {
    const defaultDest = state.shortcuts["Custom Nodes"] || state.currentPath;
    showModal("Clone Git Repository", [
      { id: "repo_url", label: "Repository URL", placeholder: "https://github.com/user/repo.git" },
      { id: "destination", label: "Clone to", value: defaultDest },
      { id: "branch", label: "Branch (optional)", placeholder: "default branch" },
    ], async (values, ov) => {
      if (!values.repo_url) return;
      const progressEl = ov.querySelector("#kotari-modal-progress");
      const textEl = ov.querySelector("#kotari-modal-progress-text");
      const okBtn = ov.querySelector("#kotari-modal-ok");
      progressEl.style.display = "block";
      okBtn.disabled = true;
      okBtn.textContent = "Cloning...";
      textEl.textContent = "Cloning repository...";

      // Determine final destination path
      let dest = values.destination;
      const repoName = values.repo_url.replace(/\.git$/, "").split("/").pop();
      if (dest && !dest.endsWith(repoName)) {
        dest = dest.replace(/\/$/, "") + "/" + repoName;
      }

      const result = await doGitClone(values.repo_url, dest, values.branch);

      if (result.ok) {
        textEl.textContent = "Clone complete!";
        setStatus(`Cloned to: ${result.destination}`, "success");
        setTimeout(() => {
          ov.remove();
          browse(state.currentPath);
        }, 1000);
      } else {
        textEl.textContent = `Error: ${result.error}`;
        okBtn.disabled = false;
        okBtn.textContent = "Retry";
        setStatus(result.error, "error");
      }
    });
  };

  // Upload button
  const uploadBtn = rootEl.querySelector("#kotari-upload-btn");
  if (uploadBtn) uploadBtn.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      setStatus(`Uploading ${file.name}...`);
      const result = await doUpload(file, state.currentPath);
      if (result.ok) {
        setStatus(`Uploaded: ${file.name} (${result.size_h})`, "success");
        browse(state.currentPath);
        fetchDiskUsage().then(render);
      } else {
        setStatus(result.error, "error");
      }
    };
    input.click();
  };
}

// =========================================================================
// WebSocket event listeners for download/clone progress
// =========================================================================

function setupProgressListeners() {
  api.addEventListener("kotari.download.progress", (event) => {
    const d = event.detail;
    const fillEl = document.querySelector("#kotari-modal-progress-fill");
    const textEl = document.querySelector("#kotari-modal-progress-text");
    if (fillEl && d.percent) fillEl.style.width = d.percent + "%";
    if (textEl) textEl.textContent = `${d.filename}: ${d.downloaded_h} / ${d.total_h} (${d.percent}%)`;
  });

  api.addEventListener("kotari.download.complete", (event) => {
    const d = event.detail;
    const fillEl = document.querySelector("#kotari-modal-progress-fill");
    const textEl = document.querySelector("#kotari-modal-progress-text");
    if (fillEl) fillEl.style.width = "100%";
    if (textEl) textEl.textContent = `Complete: ${d.filename} (${d.size_h})`;
  });

  api.addEventListener("kotari.clone.progress", (event) => {
    const textEl = document.querySelector("#kotari-modal-progress-text");
    if (textEl) textEl.textContent = event.detail.status === "started"
      ? `Cloning ${event.detail.repo_url}...`
      : event.detail.status;
  });

  api.addEventListener("kotari.clone.complete", (event) => {
    const textEl = document.querySelector("#kotari-modal-progress-text");
    if (textEl) textEl.textContent = "Clone complete!";
  });
}

// =========================================================================
// Extension Registration
// =========================================================================

app.registerExtension({
  name: "kotari.filemanager",
  async setup() {
    // Inject styles
    const styleEl = document.createElement("style");
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);

    // Set up progress listeners
    setupProgressListeners();

    // Register sidebar tab
    app.extensionManager.registerSidebarTab({
      id: "kotari-file-manager",
      icon: "pi pi-folder",
      title: "Kotari File Manager",
      tooltip: "File Manager — browse, download, manage files",
      type: "custom",
      render: async (el) => {
        rootEl = el;
        rootEl.classList.add("kotari-fm");
        rootEl.innerHTML = `<div class="kotari-loading">Loading...</div>`;

        // Initialize
        await fetchSystemInfo();
        await browse(state.currentPath);
        await fetchDiskUsage();
        render();
      },
    });
  },
});

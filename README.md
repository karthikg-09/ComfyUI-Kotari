# ComfyUI-Kotari

A sidebar file manager for ComfyUI. Download models, clone repos, and manage files entirely through the UI—no terminal needed.

## Installation

### Option 1: ComfyUI Manager (Recommended)
1. Open ComfyUI Manager in your sidebar
2. Click "Custom Nodes Manager"
3. Search for "Kotari"
4. Click Install
5. Restart ComfyUI

### Option 2: Git Clone
```bash
cd /path/to/ComfyUI/custom_nodes
git clone https://github.com/karthikg-09/ComfyUI-Kotari.git
```

Then restart ComfyUI.

**Done!** Click the folder icon (📁) in the left sidebar to open the file manager.

## Features

- **Browse & navigate** directories with point-and-click
- **Download files** from URLs with progress tracking
- **Clone Git repos** to custom_nodes or anywhere
- **Upload files** from your browser
- **Create, rename, delete** folders and files
- **Preview text files** (code, logs, configs, etc.)
- **View disk usage** at a glance

## Usage

| Action | How |
|--------|-----|
| Download model | Click "⬇️ Download from URL", paste link |
| Clone repo | Click "🔗 Clone Git Repo", paste repo URL |
| Upload file | Click "⬆️ Upload File", select from browser |
| Navigate | Click folders or use quick-nav buttons (Models, Output, etc.) |
| Rename/Move | Click ✏️ pencil icon next to file |
| Delete | Click 🗑️ trash icon (confirms before deleting) |
| Preview | Click 👁️ eye icon on text files |

## Requirements

- ComfyUI (any recent version)
- Python 3.8+
- Git (optional, for cloning repos)

## Security

- Path validation prevents directory traversal
- Confirmation dialogs on destructive actions
- No external dependencies
- Uses official ComfyUI APIs only

---

**Perfect for cloud instances, remote deployments, and users without terminal access.**

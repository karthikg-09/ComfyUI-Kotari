# ComfyUI-Kotari

A powerful file management system for ComfyUI that enables users to download models, clone repositories, and manage files entirely through the web interface—**without requiring terminal access**.

## 🎯 The Problem

ComfyUI users often face a significant challenge: **managing files and downloading models requires terminal access or file explorer navigation on the server machine**. This creates barriers for:

- **Cloud-hosted instances** where terminal access is unavailable or restricted
- **Remote deployments** where SSH/terminal usage is complex or blocked
- **Non-technical users** who are uncomfortable with command-line tools
- **Workflow teams** needing intuitive file management alongside their creative work

Traditional solutions require switching between multiple tools, making the workflow fragmented and inefficient.

## ✨ The Solution

ComfyUI-Kotari provides an **integrated sidebar-based file manager** directly within ComfyUI. Everything you need for file operations is accessible from a clean, professional UI—right where you're already working.

## 🚀 Key Features

### 📁 File Browser
- **Navigate directories** with point-and-click folder traversal
- **View file details**: size, type, and last modified date
- **Quick-nav shortcuts** to Models, Output, Input, and Custom Nodes directories
- **Disk usage indicator** showing available storage space

### ⬇️ Download Models & Files
- **Download from URL** with real-time progress tracking
- Works with popular sources:
  - HuggingFace Model Hub
  - CivitAI
  - GitHub releases
  - Direct file links
- **Smart filename detection** from URL or HTTP headers
- **Customize save location** or use default directories

### 🔗 Clone Git Repositories
- **Clone custom nodes** directly to your installation
- **Select branches** during cloning
- Supports any public Git repository
- **Smart destination defaults** to custom_nodes folder

### 📤 Upload & Manage Files
- **Upload files** directly from your browser to the server
- **Create new folders** anywhere in your directory structure
- **Rename & move** files and folders with inline editing
- **Delete files** with confirmation to prevent accidents
- **Preview text files** (code, configs, logs, markdown, etc.)

## 📦 Installation

### Method 1: Copy the Folder
```bash
# Navigate to your ComfyUI installation
cd /path/to/ComfyUI

# Copy the ComfyUI-Kotari folder to custom_nodes
cp -r /path/to/ComfyUI-Kotari custom_nodes/
```

### Method 2: Clone from GitHub
```bash
cd /path/to/ComfyUI/custom_nodes
git clone https://github.com/karthikg-09/ComfyUI-Kotari.git
```

### Verify Installation
1. **Restart ComfyUI** — the server will automatically detect the new custom node
2. **Look for the folder icon** 📁 in the left sidebar
3. **Click it** to open the file manager

## 🎮 How to Use

### Opening the File Manager
Click the **folder icon** (📁) in the left sidebar of ComfyUI. The file manager will expand in a dedicated panel.

### Navigating Directories
- **Click folders** to open them
- **Click the up arrow** (↑) or use the parent directory button to go back
- **Use quick-nav buttons** (Models, Output, Input, Custom Nodes, Root) for instant access
- **Type a path** in the address bar and press Enter for direct navigation

### Downloading Models
1. Click **"⬇️ Download from URL"** button
2. Paste the file URL (e.g., a HuggingFace model link)
3. (Optional) Customize the save location and filename
4. Click **OK** — the download will begin with a live progress bar
5. Once complete, the file appears in your directory

### Cloning Repositories
1. Click **"🔗 Clone Git Repo"** button
2. Paste the repository URL (e.g., `https://github.com/user/custom-node.git`)
3. (Optional) Select a specific branch or change the destination folder
4. Click **OK** — cloning begins with status updates
5. The repository will appear in your chosen directory

### Uploading Files
1. Click **"⬆️ Upload File"** button
2. Select a file from your computer
3. The file will be uploaded to the current directory
4. Status message confirms completion

### Managing Files
- **Rename/Move**: Click the ✏️ pencil icon next to a file, edit the path, and press OK
- **Delete**: Click the 🗑️ trash icon and confirm deletion
- **Preview**: Click the 👁️ eye icon on text files to view contents

## 🔐 Security & Safety

- **Path validation** prevents directory traversal attacks
- **Confirmation dialogs** protect against accidental deletions
- **No external dependencies** — pure Python and JavaScript implementation
- **Sandboxed operations** respect your file system permissions
- **Secure file uploads** with proper multipart handling

## ⚙️ Technical Details

### Architecture
- **Backend**: Python-based API routes using aiohttp (ComfyUI's framework)
- **Frontend**: Vanilla JavaScript sidebar extension (no build tools required)
- **Compatibility**: Works with all ComfyUI versions using official APIs

### API Endpoints
All operations communicate through secure REST endpoints:
- `/kotari/browse` — List directory contents
- `/kotari/download` — Download files with progress tracking
- `/kotari/git_clone` — Clone repositories
- `/kotari/upload` — Upload files
- `/kotari/delete`, `/kotari/move`, `/kotari/mkdir` — File operations
- `/kotari/disk_usage` — View storage information

### Why It's Future-Proof
- Uses **official ComfyUI APIs** (`PromptServer`, `registerSidebarTab`)
- **No monkey-patching** of ComfyUI internals
- **Vanilla JavaScript** — no framework version dependencies
- **Minimal dependencies** — uses only Python standard library + aiohttp

## 🛠️ Troubleshooting

### The folder icon doesn't appear in the sidebar
- **Solution**: Restart ComfyUI after installing
- Check ComfyUI logs for any import errors

### Downloads are slow
- **Cause**: Limited network bandwidth
- **Solution**: Check your internet connection and server bandwidth limits

### Permission denied when accessing certain directories
- **Cause**: File system permissions on the server
- **Solution**: Ensure the ComfyUI process has read/write access to target directories

### Filename has extra characters (e.g., `;charset=utf-8`)
- **Solution**: This has been fixed in recent versions. Update to the latest version.

## 📋 Requirements

- **ComfyUI** installation (any recent version)
- **Python 3.8+** (comes with ComfyUI)
- **Git** (optional, only needed for cloning repositories)
- **Web browser** with JavaScript enabled

## 💡 Use Cases

### For Model Collectors
Download hundreds of models from HuggingFace or CivitAI without SSH access.

### For Custom Node Developers
Clone your development repositories directly into custom_nodes, test, and iterate.

### For Teams
Share ComfyUI instances with team members who may not be comfortable with terminals.

### For Cloud Deployments
Manage files on expensive cloud instances without hourly terminal session costs.

## 🤝 Contributing

Found a bug? Have a feature request? Visit the [GitHub repository](https://github.com/karthikg-09/ComfyUI-Kotari) to:
- Report issues
- Request features
- Submit pull requests

## 📄 License

This project is provided as-is for use with ComfyUI. Modify and distribute freely while maintaining proper attribution.

## 🙏 Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/karthikg-09/ComfyUI-Kotari/issues) page
2. Review the Troubleshooting section above
3. Ensure ComfyUI and dependencies are up to date

---

**Made for ComfyUI enthusiasts who value simplicity, efficiency, and professional workflows.** 🎨✨

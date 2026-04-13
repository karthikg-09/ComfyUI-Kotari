"""
ComfyUI-Kotari: File Manager for ComfyUI
A sidebar-based file manager for downloading models, cloning repos, and managing files.
"""

from .server_routes import *

WEB_DIRECTORY = "./web/js"
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']

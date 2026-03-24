"""
FastAPI server for Simple SPA Example.

Usage:
    pip install fastapi uvicorn
    python run.py
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "FRONTEND"

app = FastAPI(title="Simple SPA")

# Serve all frontend files (html, css, js, images)
STATIC_FILES = {f.name: f for f in FRONTEND.iterdir() if f.is_file() and f.suffix in (".html", ".css", ".js", ".png", ".ico")}


@app.get("/{filename}")
async def static_file(filename: str):
    if filename in STATIC_FILES:
        return FileResponse(STATIC_FILES[filename])
    # Fallback to index.html for SPA routing
    return FileResponse(FRONTEND / "index.html")


@app.get("/")
async def index():
    return FileResponse(FRONTEND / "index.html")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)

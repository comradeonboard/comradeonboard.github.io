#!/usr/bin/env python3
"""WSGI fallback for Render's default 'gunicorn app:app' start command.

Render services created manually with a blank Start Command use that default.
This module serves the same files as server.py, from ./dist when the build
command created it, otherwise from the repository root.
"""

import mimetypes
import os
from pathlib import Path

BASE = Path(__file__).resolve().parent
DIST = BASE / "dist"
ROOT = DIST if DIST.is_dir() else BASE

TEXT_TYPES = {
    "application/javascript",
    "application/json",
    "application/xml",
    "image/svg+xml",
}


def _headers(content_type, length):
    return [
        ("Content-Type", content_type),
        ("Content-Length", str(length)),
        ("Cache-Control", "no-store"),
    ]


def _not_found(start_response, head=False):
    error_page = ROOT / "404.html"
    body = error_page.read_bytes() if error_page.is_file() else b"404 Not Found"
    start_response("404 Not Found", _headers("text/html; charset=utf-8", len(body)))
    return [] if head else [body]


def app(environ, start_response):
    """Minimal read-only WSGI static file app."""
    head = environ.get("REQUEST_METHOD", "GET").upper() == "HEAD"
    raw_path = environ.get("PATH_INFO", "/")
    relative = raw_path.lstrip("/") or "index.html"

    candidate = (ROOT / relative).resolve()
    try:
        candidate.relative_to(ROOT.resolve())
    except ValueError:
        return _not_found(start_response, head)

    if candidate.is_dir():
        candidate = candidate / "index.html"

    if not candidate.is_file():
        return _not_found(start_response, head)

    body = candidate.read_bytes()
    content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
    if content_type.startswith("text/") or content_type in TEXT_TYPES:
        content_type += "; charset=utf-8"

    start_response("200 OK", _headers(content_type, len(body)))
    return [] if head else [body]


if __name__ == "__main__":
    from wsgiref.simple_server import make_server

    port = int(os.environ.get("PORT", "8000"))
    print("Serving %s on 0.0.0.0:%d" % (ROOT, port), flush=True)
    make_server("0.0.0.0", port, app).serve_forever()

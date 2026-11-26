"""WSGI app for Render's default `gunicorn app:app` start command."""

import mimetypes
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
}


def application(environ, start_response):
    path = environ.get("PATH_INFO", "/") or "/"
    if path.endswith("/"):
        path += "index.html"
    relative = path.lstrip("/")
    full = os.path.normpath(os.path.join(ROOT, relative))

    if not full.startswith(ROOT) or not os.path.isfile(full):
        start_response("404 Not Found", [("Content-Type", "text/plain")])
        return [b"Not Found"]

    content_type = TYPES.get(os.path.splitext(full)[1].lower())
    if content_type is None:
        content_type = mimetypes.guess_type(full)[0] or "application/octet-stream"

    with open(full, "rb") as handle:
        body = handle.read()

    start_response("200 OK", [
        ("Content-Type", content_type),
        ("Content-Length", str(len(body))),
        ("Cache-Control", "no-store"),
    ])
    return [body]


app = application

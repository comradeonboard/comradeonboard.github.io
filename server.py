#!/usr/bin/env python3
"""Minimal static-file server for the portfolio on a Render Web Service.

Render sets PORT at runtime. The build step copies the site into ./dist, so
this server only has to serve that directory.
"""

import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "8000"))
BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE, "dist")
ROOT = DIST if os.path.isdir(DIST) else BASE


class PortfolioHandler(SimpleHTTPRequestHandler):
    def list_directory(self, path):
        """Do not expose directory listings."""
        self.send_error(404, "Not found")

    def send_error(self, code, message=None, explain=None):
        """Serve the site's own 404.html for missing pages."""
        if code == 404:
            error_page = os.path.join(ROOT, "404.html")
            if os.path.isfile(error_page):
                with open(error_page, "rb") as fh:
                    body = fh.read()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(body)
                return
        super().send_error(code, message, explain)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    handler = partial(PortfolioHandler, directory=ROOT)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print("Serving %s on 0.0.0.0:%d" % (ROOT, PORT), flush=True)
    server.serve_forever()

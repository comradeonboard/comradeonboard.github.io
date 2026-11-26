import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

PORT = int(os.environ.get("PORT", "10000"))
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    handler = partial(Handler, directory=ROOT)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print("Serving portfolio on port {}".format(PORT), flush=True)
    server.serve_forever()

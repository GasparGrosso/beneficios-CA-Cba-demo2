# serve.py — servidor estático local SIN caché (prototipo en iteración).
# Equivale a `python -m http.server` pero manda Cache-Control: no-store, así el
# navegador nunca reutiliza un HTML o un store.js viejos entre cambios.
# Uso: python serve.py [puerto]   (por defecto 5500)
import sys, os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f'Servidor sin caché en http://localhost:{port}/  (Ctrl+C para detener)')
    ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()

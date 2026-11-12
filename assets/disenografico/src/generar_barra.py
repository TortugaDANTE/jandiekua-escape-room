#!/usr/bin/env python3
"""barra_institucional.svg: barra azul 1080x148 con los logos oficiales en blanco, a la misma altura.
Los logos NO se modifican: se incrusta tal cual el <image> de cada SVG oficial (mismos píxeles), solo con
posición y escala proporcional. UASLP a la izquierda, Agenda Ambiental a la derecha."""
import re
from pathlib import Path
A = Path(__file__).resolve().parents[1]
def img(n):
    s = (A / "logos" / n).read_text()
    m = re.search(r'<image width="(\d+)" height="(\d+)" href="([^"]+)"', s)
    return int(m.group(1)), int(m.group(2)), m.group(3)
(uw, uh, ud), (aw, ah, ad) = img("logo_uaslp_blanco.svg"), img("logo_aa_blanco.svg")
H = 100                       # altura común de los dos logos (px del lienzo)
W_U, W_A = H * uw / uh, H * aw / ah
M = 40                        # margen lateral
y = (144 - H) / 2
f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1080 148" width="1080" height="148" role="img" aria-label="Universidad Autónoma de San Luis Potosí · Agenda Ambiental">
<defs><linearGradient id="filete" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2E6B4E"/><stop offset=".5" stop-color="#C59B27"/><stop offset="1" stop-color="#4A8B68"/></linearGradient></defs>
<rect width="1080" height="148" fill="#003B71"/>
<image x="{M}" y="{f(y)}" width="{f(W_U)}" height="{H}" href="{ud}"/>
<image x="{f(1080-M-W_A)}" y="{f(y)}" width="{f(W_A)}" height="{H}" href="{ad}"/>
<rect y="144" width="1080" height="4" fill="url(#filete)"/>
</svg>
'''
(A / "barra_institucional.svg").write_text(svg)
print("barra_institucional.svg", round(len(svg)/1024,1), "KB", f(W_U), f(W_A))

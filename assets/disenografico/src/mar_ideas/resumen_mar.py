#!/usr/bin/env python3
"""Arma preview/mar_ideas_resumen.png con las 8 capturas (recorte de la zona del mar + pantalla completa)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
A = Path(__file__).resolve().parents[2]; P = A / "preview"
def fuente(t, b=False):
    for f in (["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"] if b else ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]):
        try: return ImageFont.truetype(f, t)
        except OSError: pass
    return ImageFont.load_default()
grupos = [("Hundimiento en el tiempo", ["hundimiento_1", "hundimiento_2", "hundimiento_3"], ["~1.5 s", "~4 s", "~11 s (asentadas)"]),
          ("Tamaño según cantidad", ["tamano_pocas", "tamano_muchas"], ["8 ideas (juego real)", "30 ideas (demo ?ideas=30)"]),
          ("Arrastre al tanque", ["arrastre_1", "arrastre_2", "arrastre_3"], ["agarrar: se levanta", "estela de burbujas", "tanque resaltado"])]
items = [("Hundimiento 1 · ~1.5 s: las ideas entran", "hundimiento_1"), ("Hundimiento 2 · ~4 s: caen con vaivén", "hundimiento_2"),
         ("Hundimiento 3 · ~11 s: se asientan en el fondo", "hundimiento_3"), ("Tamaño · 8 ideas (juego real): grandes", "tamano_pocas"),
         ("Tamaño · 30 ideas (demo ?ideas=30): más chicas", "tamano_muchas"), ("Arrastre 1 · agarrar: se levanta con sombra", "arrastre_1"),
         ("Arrastre 2 · estela de burbujas", "arrastre_2"), ("Arrastre 3 · tanque resaltado, suelta aquí", "arrastre_3")]
W = 420; Hh = int(W * 2022 / 1080); M = 24; TOP = 120; ROW = Hh + 60
im = Image.new("RGB", (4 * (W + M) + M, TOP + 2 * ROW), "#102438"); d = ImageDraw.Draw(im)
d.text((M, 24), "Mar de ideas: hundimiento, tamaño y arrastre", font=fuente(36, True), fill="#F5F7F9")
d.text((M, 76), "Prototipo sobre la copia de imagen-institucional · capturas a 1080×2022", font=fuente(20), fill="#D8E8DF")
for k, (pie, i) in enumerate(items):
    x = M + (k % 4) * (W + M); y = TOP + (k // 4) * ROW
    t = Image.open(P / f"mar_ideas_{i}.png").convert("RGB").resize((W, Hh))
    im.paste(t, (x, y)); d.rectangle([x - 1, y - 1, x + W, y + Hh], outline="#4A8B68")
    d.text((x, y + Hh + 12), pie, font=fuente(17), fill="#E0B43C" if k in (0, 3, 5) else "#D8E8DF")
im.save(P / "mar_ideas_resumen.png", optimize=True); print(im.size)

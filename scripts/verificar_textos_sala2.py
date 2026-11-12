#!/usr/bin/env python3
"""Verifica js/textos_sala2.js contra la Revista Jandiekua publicada (https://leka.uaslp.mx/index.php/jandiekua/).

Para cada fragmento comprueba que:
  1. «original» es una cita TEXTUAL (subcadena exacta) del texto de la página del artículo (solo lectura, un GET por artículo);
  2. «erroneo» solo difiere del original en signos de puntuación quitados y/o la primera letra de alguna palabra pasada a minúscula;
  3. la fuente declara título, autores, número, año y URL.
Uso: python3 scripts/verificar_textos_sala2.py [--sin-red]   (con --sin-red solo se hacen las comprobaciones 2 y 3)
"""
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIGNOS = set(",.;:«»“”\"¿?¡!()—'‘’…")
FR = json.loads(re.search(r"export const FRAGMENTOS = (\[.*\]);", (ROOT / "js/textos_sala2.js").read_text(encoding="utf-8"), re.S).group(1))


def limpia(s):
    return re.sub(r"\s+", " ", s.replace("\u00a0", " ")).strip()


def texto_pagina(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (verificacion de citas, solo lectura)"})
    h = urllib.request.urlopen(req, timeout=90).read().decode("utf-8", "replace")
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", h, flags=re.S)
    return limpia(html.unescape(re.sub(r"<[^>]+>", " ", h)))


def sin_signos(s):
    return "".join(c for c in s if c not in SIGNOS).lower()


def main():
    red = "--sin-red" not in sys.argv
    mal = 0
    for f in FR:
        errs = []
        if red:
            try:
                if f["original"] not in texto_pagina(f["fuente"]["url"]):
                    errs.append("el original NO es subcadena exacta del artículo")
            except Exception as e:  # noqa: BLE001
                errs.append(f"no se pudo leer {f['fuente']['url']}: {e}")
        if sin_signos(f["original"]) != sin_signos(f["erroneo"]):
            errs.append("el erróneo difiere en algo más que signos/mayúsculas")
        if f["original"] == f["erroneo"]:
            errs.append("no hay errores que corregir")
        if len(f["original"].split(" ")) != len(f["erroneo"].split(" ")):
            errs.append("distinto número de palabras")
        s = f["fuente"]
        if not all(s.get(k) for k in ("titulo", "autores", "volumen", "numero", "anio", "url")):
            errs.append("fuente incompleta")
        print(("FALLA " if errs else "ok    ") + f["id"] + (" — " + "; ".join(errs) if errs else ""))
        mal += bool(errs)
    print(f"{len(FR) - mal}/{len(FR)} fragmentos correctos")
    sys.exit(1 if mal else 0)


main()

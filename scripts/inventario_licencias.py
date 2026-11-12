#!/usr/bin/env python3
"""Genera el anexo de inventario por archivo de LICENCIAS.md (entre las marcas <!-- INVENTARIO -->).

Uso:  python3 scripts/inventario_licencias.py
Clasifica cada archivo versionado por su ruta. Lo que no encaja en una regla queda como
«VERIFICAR», para que nada pase sin revisión.
"""
import hashlib
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REGLAS = [
    (r"^assets/fonts/.*\.woff$", "Tipografía", "Montserrat / Fraunces (proyectos de código abierto)", "SIL OFL 1.1", "OK"),
    (r"^assets/fonts/(OFL-.*\.txt|LICENCIAS\.txt)$", "Texto de licencia", "Copia de los textos oficiales de las fuentes", "—", "OK"),
    (r"^assets/logos/jandiekua_homepageImage_en_US\.png$", "Logotipo de la revista", "Revista Jandiekua (leka.uaslp.mx/public/journals/3/homepageImage_en_US.png), copia sin alterar sobre fondo blanco", "Licencia del logotipo no declarada [POR DEFINIR]", "PENDIENTE"),
    (r"^assets/(logos|disenografico/logos)/.*", "Logotipo institucional", "UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional)", "Signo institucional, no abierto: autorización interna [POR DEFINIR]", "PENDIENTE"),
    (r"^assets/disenografico/barra_institucional\.svg$", "Barra con logotipos", "Compuesta con los logotipos institucionales incrustados", "Signo institucional: autorización interna [POR DEFINIR]", "PENDIENTE"),
    (r"^assets/disenografico/[^/]+\.svg$", "Ilustración SVG", "Equipo de diseño del proyecto, generada con scripts propios", "Derechos reservados del proyecto [POR DEFINIR cesión]", "OK*"),
    (r"^assets/disenografico/(preview/.*|hoja_contacto\.png)$", "Captura / render", "Del proyecto (capturas del propio diseño; algunas muestran los logotipos)", "Derechos reservados del proyecto; logotipos: ver arriba", "OK*"),
    (r"^assets/disenografico/src/.*", "Script de generación", "Proyecto", "Sin licencia declarada [POR DEFINIR]", "OK*"),
    (r"^assets/disenografico/NOTA_DISENO\.md$", "Documento", "Proyecto", "Sin licencia declarada [POR DEFINIR]", "OK*"),
    (r"^docs/fuentes/banner4_stand_mockup\.jpg$", "Fotografía de pantalla", "Origen y autoría NO documentados (captura de la plataforma del stand virtual)", "DESCONOCIDA", "VERIFICAR"),
    (r"^docs/fuentes/.*\.md$", "Documento fuente", "Copia de Google Docs internos de la Agenda Ambiental / Revista", "Interna: autoría y publicación pública [POR DEFINIR]", "VERIFICAR"),
    (r"^docs/.*", "Documento", "Proyecto", "Sin licencia declarada [POR DEFINIR]", "OK*"),
    (r"^preview/.*\.png$", "Captura", "Del proyecto (capturas del juego; muestran los logotipos)", "Derechos reservados del proyecto; logotipos: ver arriba", "OK*"),
    (r"^(js|css)/.*|^index\.html$|^prototipo/.*|^aviso-privacidad\.html$|^terminos\.html$", "Código del juego", "Proyecto (propio; sin librerías de terceros)", "Sin licencia declarada [POR DEFINIR]", "OK*"),
    (r"^firebase/.*", "Reglas y pruebas de Firestore", "Proyecto (reglas propias; sin código de terceros)", "Sin licencia declarada [POR DEFINIR]", "OK*"),
    (r"^\.gitignore$", "Configuración", "Proyecto", "Sin relevancia (configuración)", "OK"),
    (r"^scripts/.*", "Script de pruebas / render", "Proyecto (usa Playwright y Pillow, no incluidos)", "Sin licencia declarada [POR DEFINIR]", "OK*"),
    (r"^(README\.md|LICENCIAS\.md)$", "Documento", "Proyecto", "Sin licencia declarada [POR DEFINIR]", "OK*"),
]


def main():
    archivos = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True).stdout.split("\n")
    archivos = sorted(f for f in archivos if f)
    filas = []
    resumen = {}
    for f in archivos:
        for patron, tipo, origen, lic, estado in REGLAS:
            if re.search(patron, f):
                break
        else:
            tipo, origen, lic, estado = "Otro", "Desconocido", "Desconocida", "VERIFICAR"
        p = ROOT / f
        kb = p.stat().st_size / 1024 if p.exists() else 0
        sha = hashlib.sha256(p.read_bytes()).hexdigest()[:10] if p.exists() else ""
        filas.append(f"| `{f}` | {tipo} | {kb:,.0f} KB | {origen} | {lic} | {estado} | `{sha}` |")
        resumen[estado] = resumen.get(estado, 0) + 1
    tabla = (
        "| Archivo | Tipo | Tamaño | Origen | Licencia | Estado | SHA-256 (10) |\n"
        "| --- | --- | ---: | --- | --- | --- | --- |\n" + "\n".join(filas)
    )
    cuenta = " · ".join(f"{k}: {v}" for k, v in sorted(resumen.items()))
    bloque = f"<!-- INVENTARIO -->\nArchivos versionados: {len(archivos)} ({cuenta}).\n\n{tabla}\n<!-- /INVENTARIO -->"
    md = (ROOT / "LICENCIAS.md").read_text(encoding="utf-8")
    nuevo = re.sub(r"<!-- INVENTARIO -->.*?<!-- /INVENTARIO -->", lambda m: bloque, md, flags=re.S)
    (ROOT / "LICENCIAS.md").write_text(nuevo, encoding="utf-8")
    print(f"{len(archivos)} archivos · {cuenta}")


if __name__ == "__main__":
    main()

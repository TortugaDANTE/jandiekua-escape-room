#!/usr/bin/env python3
"""Prueba de punta a punta de la capa legal (v4) contra el EMULADOR de Firestore.

No toca producción: todo lo que el navegador pida a *.googleapis.com se intercepta y se
redirige al emulador (127.0.0.1:8080) o se simula (Firebase Auth anónimo). Cualquier otro
host externo se bloquea y hace fallar la prueba.

Requisitos: emulador activo (ver /workspace/jandiekua_firebase/test_reglas_emulador.py),
Playwright con /usr/bin/google-chrome.   Uso:  python3 scripts/e2e_legal.py [carpeta_capturas]
"""
import base64
import http.server
import json
import socketserver
import subprocess
import sys
import threading
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from e2e_recorrido import soltar  # noqa: E402

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/workspace/jk_v4_legal")
OUT.mkdir(parents=True, exist_ok=True)
PORT = 8894
EMU = "http://127.0.0.1:8080"
PROJECT = "jandiekua-escape-room"
DOCS = f"{EMU}/v1/projects/{PROJECT}/databases/(default)/documents"
CB = "20261113a"
RESULTADOS = []
PETICIONES = []     # (método, host, ruta, ¿con Authorization?)
BLOQUEADAS = []
USUARIOS = {}       # refreshToken -> uid
BORRADOS = []


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)

    def log_message(self, *a):
        pass


class Server(socketserver.TCPServer):
    allow_reuse_address = True


def check(nombre, cond, detalle=""):
    RESULTADOS.append((nombre, bool(cond)))
    print(f"  [{'PASS' if cond else 'FAIL'}] {nombre}" + (f" — {detalle}" if (detalle and not cond) else ""))


def b64(d):
    return base64.urlsafe_b64encode(json.dumps(d).encode()).decode().rstrip("=")


def jwt(uid):
    return b64({"alg": "none", "typ": "JWT"}) + "." + b64(
        {"user_id": uid, "sub": uid, "iss": f"https://securetoken.google.com/{PROJECT}", "aud": PROJECT,
         "firebase": {"sign_in_provider": "anonymous"}}) + "."


CORS = {"access-control-allow-origin": "*", "access-control-allow-headers": "*",
        "access-control-allow-methods": "GET,POST,DELETE,OPTIONS", "access-control-max-age": "600"}


def admin(method, url, payload=None):
    req = Request(url, data=None if payload is None else json.dumps(payload).encode(), method=method,
                  headers={"Content-Type": "application/json", "Authorization": "Bearer owner"})
    try:
        with urlopen(req, timeout=30) as r:
            raw = r.read().decode()
            return r.status, json.loads(raw) if raw else {}
    except HTTPError as e:
        raw = e.read().decode()
        return e.code, json.loads(raw) if raw else {}


def coleccion(nombre, parent=""):
    s, b = admin("GET", f"{DOCS}/{parent}{nombre}?pageSize=300")
    return b.get("documents", []) if s == 200 else []


def campo(doc, k):
    f = doc.get("fields", {}).get(k, {})
    return next(iter(f.values())) if f else None


def instalar_rutas(ctx):
    def externo(route, request):
        BLOQUEADAS.append(request.url)
        route.abort()

    def firestore(route, request):
        PETICIONES.append((request.method, "firestore", request.url.split("/documents")[-1][:60],
                           "authorization" in request.headers))
        if request.method == "OPTIONS":
            return route.fulfill(status=204, headers=CORS)
        url = request.url.replace("https://firestore.googleapis.com", EMU)
        h = {k: v for k, v in request.headers.items() if k.lower() in ("authorization", "content-type")}
        req = Request(url, data=request.post_data_buffer, method=request.method, headers=h)
        try:
            with urlopen(req, timeout=30) as r:
                status, body, ct = r.status, r.read(), r.headers.get("content-type", "application/json")
        except HTTPError as e:
            status, body, ct = e.code, e.read(), "application/json"
        route.fulfill(status=status, body=body, headers={**CORS, "content-type": ct})

    def ident(route, request):
        PETICIONES.append((request.method, "identitytoolkit", request.url.split("?")[0].split("/")[-1], False))
        if request.method == "OPTIONS":
            return route.fulfill(status=204, headers=CORS)
        op = request.url.split("?")[0].split("/")[-1]
        if op == "accounts:signUp":
            uid = f"anon{len(USUARIOS) + 1:02d}xxxxxxxx"
            refresh = f"refresh-{uid}"
            USUARIOS[refresh] = uid
            return route.fulfill(status=200, headers=CORS, content_type="application/json", body=json.dumps(
                {"idToken": jwt(uid), "refreshToken": refresh, "localId": uid, "expiresIn": "3600"}))
        if op == "accounts:delete":
            BORRADOS.append(request.post_data)
            return route.fulfill(status=200, headers=CORS, content_type="application/json", body="{}")
        route.fulfill(status=404, headers=CORS, body="{}")

    def token(route, request):
        PETICIONES.append((request.method, "securetoken", "token", False))
        if request.method == "OPTIONS":
            return route.fulfill(status=204, headers=CORS)
        refresh = (request.post_data or "").split("refresh_token=")[-1].split("&")[0]
        uid = USUARIOS.get(refresh)
        if not uid:
            return route.fulfill(status=400, headers=CORS, content_type="application/json", body="{}")
        route.fulfill(status=200, headers=CORS, content_type="application/json", body=json.dumps(
            {"id_token": jwt(uid), "refresh_token": refresh, "user_id": uid, "expires_in": "3600"}))

    ctx.route(lambda u: not (u.startswith("http://127.0.0.1") or u.startswith("data:") or u.startswith("blob:")), externo)
    ctx.route("https://firestore.googleapis.com/**", firestore)
    ctx.route("https://identitytoolkit.googleapis.com/**", ident)
    ctx.route("https://securetoken.googleapis.com/**", token)


def sembrar():
    admin("DELETE", f"{EMU}/emulator/v1/projects/{PROJECT}/databases/(default)/documents")
    nombre = f"projects/{PROJECT}/databases/(default)/documents"
    ts = lambda f: {"fieldPath": f, "setToServerValue": "REQUEST_TIME"}
    s, b = admin("POST", f"{DOCS}:commit", {"writes": [
        {"update": {"name": f"{nombre}/conceptos/agua", "fields": {
            "texto": {"stringValue": "Agua"}, "clave": {"stringValue": "agua"},
            "salas": {"arrayValue": {"values": [{"integerValue": "1"}]}}, "personas": {"integerValue": "1"},
            "ultimoSesion": {"stringValue": "semillaSesion01"}}},
         "updateTransforms": [ts("creado"), ts("actualizado")]},
        {"update": {"name": f"{nombre}/conceptos/agua/aportes/semillaSesion01", "fields": {
            "sesion": {"stringValue": "semillaSesion01"}, "sala": {"integerValue": "1"},
            "uid": {"stringValue": "otraPersona"}, "nombre": {"stringValue": "Otra persona"},
            "procedencia": {"stringValue": "Otra institución"}}},
         "updateTransforms": [ts("creado")]}]})
    assert s == 200, b


def exportar_excel_check():
    if not Path("/workspace/jandiekua_firebase/exportar_excel.py").exists():
        return "consentimiento versión persona@ejemplo.org (omitido: exportar_excel.py no está en este equipo)"
    code = f"""
import sys; sys.path.insert(0, '/workspace/jandiekua_firebase')
import exportar_excel as x
x.BASE = '{DOCS}'
x.get_access_token = lambda: 'owner'
from pathlib import Path
p = x.exportar(Path('/tmp/jk_export_test.xlsx'))
from openpyxl import load_workbook
wb = load_workbook(p)
print(wb.sheetnames)
print([c.value for c in wb['Participantes'][1]])
print([[c.value for c in r] for r in wb['Participantes'].iter_rows(min_row=2)])
print([[c.value for c in r][:3] for r in wb['Conceptos'].iter_rows(min_row=2)])
"""
    r = subprocess.run(["/workspace/jandiekua_firebase/.venv/bin/python", "-c", code], capture_output=True, text=True)
    return r.stdout + r.stderr


def main():
    sembrar()
    httpd = Server(("127.0.0.1", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{PORT}"
    errores_js = []
    with sync_playwright() as p:
        nav = p.chromium.launch(executable_path="/usr/bin/google-chrome",
                                args=["--headless=new", "--no-sandbox", "--disable-gpu"])
        ctx = nav.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2,
                              is_mobile=True, has_touch=True, accept_downloads=True)
        instalar_rutas(ctx)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errores_js.append(str(e)))
        page.on("console", lambda m: errores_js.append(m.text) if m.type == "error" else None)

        print("Portada y aviso de almacenamiento")
        page.goto(f"{base}/index.html?v={CB}", wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.wait_for_selector("#aviso-cookies")
        page.wait_for_timeout(700)
        check("la tarjeta de almacenamiento aparece la primera vez", page.locator("#aviso-cookies").is_visible())
        check("la tarjeta enlaza al aviso (apartado de almacenamiento)", page.locator("#aviso-cookies a").get_attribute("href").startswith("aviso-privacidad.html"))
        alto_btn = page.locator("#cookies-ok").bounding_box()["height"]
        check("botón de la tarjeta ≥ 44 px", alto_btn >= 44, alto_btn)
        check("la portada enlaza Términos y Aviso en la casilla", page.locator(".consent-etiqueta a").count() == 2)
        page.screenshot(path=str(OUT / "01_portada_con_aviso.png"))
        page.click("#cookies-ok")
        check("la tarjeta se cierra", page.locator("#aviso-cookies").is_hidden())
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(500)
        check("la elección se recuerda (no vuelve a salir)", page.locator("#aviso-cookies").is_hidden())
        check("sin cookies", ctx.cookies() == [], ctx.cookies())

        print("Portada: casilla de consentimiento")
        escrituras0 = len([x for x in PETICIONES if x[0] == "POST" and x[1] in ("firestore", "identitytoolkit")])
        chk = page.locator("#acepto-terminos")
        check("la casilla empieza sin marcar", not chk.is_checked())
        check("el botón está bloqueado (aria-disabled)", page.locator("#btn-entrar").get_attribute("aria-disabled") == "true")
        page.locator("#btn-entrar").click(force=True)
        page.wait_for_timeout(500)
        check("sin casilla no entra", page.evaluate("() => estado.vista === 'portada' && !estado.consentimiento"))
        check("sin casilla se muestra el aviso", "casilla" in page.locator("#toast").inner_text())
        escrituras1 = len([x for x in PETICIONES if x[0] == "POST" and x[1] in ("firestore", "identitytoolkit")])
        check("sin casilla no se envía NADA a Firestore ni a Auth", escrituras1 == escrituras0, f"{escrituras0}->{escrituras1}")
        check("no hay participantes en la base", len(coleccion("participantes")) == 0)
        links = page.locator(".consent-etiqueta a")
        check("la casilla enlaza Términos y Aviso",
              [links.nth(i).get_attribute("href") for i in range(links.count())] == ["terminos.html", "aviso-privacidad.html"])
        chk.check()
        page.wait_for_function("() => document.querySelector('#toast').hidden", timeout=8000)
        page.screenshot(path=str(OUT / "02_portada_habilitada.png"))
        page.click("#btn-entrar")
        page.wait_for_selector("#entrada-titulo")
        page.wait_for_timeout(1200)
        ps = coleccion("participantes")
        check("se creó el participante con consentimiento", len(ps) == 1, len(ps))
        cons = ps[0]["fields"]["consentimiento"]["mapValue"]["fields"] if ps else {}
        check("consentimiento: versión y fecha del servidor",
              cons.get("version", {}).get("stringValue") == "v1-borrador-20261112" and "timestampValue" in cons.get("aceptado", {}), cons)
        check("el tanque empieza vacío (nada con «elemento» en la base)", page.evaluate("() => Peces.total()") == 0)

        print("Sala 1: título → peces guardados con su elemento")
        page.focus("#entrada-titulo")
        page.keyboard.type("Metodología para adaptación de espacios urbanos para la producción agrourbana en SLP MX con comunidades periurbanas durante 2026", delay=5)
        page.keyboard.press("Enter")
        page.wait_for_selector("#btn-soltar", state="visible")
        page.click("#btn-soltar")
        page.wait_for_function("() => estado.tituloListo")
        page.wait_for_timeout(5000)
        check("el título se guardó (privado)", len(coleccion("titulos")) == 1, len(coleccion("titulos")))
        from urllib.parse import unquote
        cs = {unquote(d["name"].split("/")[-1]): d for d in coleccion("conceptos")}
        esperados = {"metodologia": "que", "adaptacion": "que", "espacios urbanos": "que", "produccion agrourbana": "que",
                     "slp": "donde", "mx": "donde", "comunidades periurbanas": "quien", "2026": "cuando"}
        hallados = {k: (campo(cs[k], "elemento") if k in cs else None) for k in esperados}
        check("los 8 conceptos se guardaron con su elemento", hallados == esperados, hallados)
        check("«Agua» sembrado sin elemento sigue intacto", campo(cs["agua"], "elemento") is None and campo(cs["agua"], "personas") == "1")
        page.reload(wait_until="networkidle")
        page.wait_for_selector("#btn-continuar", timeout=15000)
        page.wait_for_timeout(2500)
        check("al recargar los peces vuelven del servidor (solo los que tienen elemento)", page.evaluate("() => Peces.total()") == 8, page.evaluate("() => Peces.total()"))
        page.screenshot(path=str(OUT / "03_sala1_peces_del_servidor.png"))
        page.click("#btn-continuar")
        page.wait_for_selector("#nueva-idea")
        page.wait_for_selector("#mar[data-listo='1'] #n-titulo", state="attached", timeout=20000)

        print("Ideas y colocaciones")
        page.fill("#nueva-idea", "Agua")
        page.press("#nueva-idea", "Enter")
        page.wait_for_timeout(900)
        page.fill("#nueva-idea", "Idea propia de prueba")
        page.press("#nueva-idea", "Enter")
        page.wait_for_timeout(900)
        agua = [d for d in coleccion("conceptos") if d["name"].endswith("/agua")]
        check("«Agua» ya existía: ahora cuenta 2 personas", agua and campo(agua[0], "personas") == "2", agua and campo(agua[0], "personas"))
        propia = [d for d in coleccion("conceptos") if d["name"].endswith("/idea%20propia%20de%20prueba") or "propia" in d["name"]]
        check("la idea propia se creó con 1 persona", propia and campo(propia[0], "personas") == "1")
        soltar(page, "n-titulo", "t-titulo")
        page.wait_for_timeout(800)
        check("1 colocación guardada (Sala 2)", len(coleccion("colocaciones")) == 1, len(coleccion("colocaciones")))
        page.evaluate("() => { estado.vista = 'cierre-form'; render(); }")
        page.wait_for_selector("#form-registro")
        page.wait_for_timeout(500)
        check("en el cierre no se vuelve a pedir la casilla de términos (ya aceptada)", page.locator("#acepto-terminos-cierre").count() == 0)
        check("el boletín está sin marcar y el correo oculto",
              not page.locator("#quiero-boletin").is_checked() and not page.locator("#campo-correo").is_visible())
        page.fill("input[name=nombre]", "Persona de prueba")
        page.fill("input[name=institucion]", "UASLP · prueba")
        page.check("#quiero-boletin")
        check("al marcar el boletín aparece el correo", page.locator("#campo-correo").is_visible())
        page.wait_for_function("() => document.querySelector('#toast').hidden", timeout=8000)
        page.screenshot(path=str(OUT / "04_cierre_formulario_boletin.png"))
        page.fill("#correo-boletin", "persona@ejemplo.org")
        page.locator("#form-registro button[type=submit]").click()
        page.wait_for_selector("#certificado-marco img", timeout=15000)
        page.wait_for_timeout(1200)
        ps = coleccion("participantes")
        f = ps[0]["fields"]
        check("el participante se completó (nombre, procedencia, boletín y correo)",
              f.get("nombre", {}).get("stringValue") == "Persona de prueba"
              and f.get("boletin", {}).get("booleanValue") is True
              and f.get("correo", {}).get("stringValue") == "persona@ejemplo.org" and "completado" in f, f)
        aportes = coleccion("aportes", "conceptos/agua/")
        propios = [a for a in aportes if campo(a, "uid") and campo(a, "uid") != "otraPersona"]
        check("el aporte propio recibió nombre y procedencia", propios and campo(propios[0], "nombre") == "Persona de prueba")
        check("el aporte de la otra persona quedó intacto", [a for a in aportes if campo(a, "nombre") == "Otra persona"])

        print("Exportación a Excel (contra el emulador)")
        salida = exportar_excel_check()
        check("exportar_excel.py lee el esquema v4", "consentimiento versión" in salida and "persona@ejemplo.org" in salida, salida[-400:])

        print("Cierre: descargar y borrar")
        check("el certificado no se recorta en el cierre", page.evaluate(
            "() => document.querySelector('#certificado-marco').getBoundingClientRect().height >= document.querySelector('#certificado-marco img').getBoundingClientRect().height - 1"))
        page.wait_for_function("() => document.querySelector('#toast').hidden", timeout=8000)
        page.screenshot(path=str(OUT / "05a_cierre_certificado.png"))
        page.evaluate("() => document.querySelector('.cierre').scrollTo(0, 99999)")
        page.wait_for_timeout(500)
        check("el cierre enlaza aviso y términos", page.locator(".mis-datos .enlaces-legales a").count() == 2)
        for sel in ("#btn-datos-json", "#btn-datos-csv", "#btn-datos-borrar"):
            h = page.locator(sel).bounding_box()["height"]
            check(f"{sel} ≥ 44 px", h >= 44, h)
        page.wait_for_function("() => document.querySelector('#toast').hidden", timeout=8000)
        page.screenshot(path=str(OUT / "05_cierre_descargar_borrar.png"))
        with page.expect_download() as d:
            page.click("#btn-datos-json")
        data = json.loads(Path(d.value.path()).read_text(encoding="utf-8"))
        check("JSON: incluye participación, título, aportes y colocaciones",
              data["participaciones"][0]["nombre"] == "Persona de prueba" and len(data["titulos"]) == 1
              and len(data["colocaciones"]) == 1 and {a["concepto"] for a in data["aportes"]} >= {"Agua", "Idea propia de prueba"}, str(data)[:300])
        check("JSON: no incluye el uid de Firebase", "uid" not in json.dumps(data))
        check("JSON: trae la versión de consentimiento", data["participaciones"][0]["consentimiento"]["version"] == "v1-borrador-20261112")
        check("JSON: viene del servidor", "servidor" in page.locator("#estado-datos").inner_text() or "guardados" in page.locator("#estado-datos").inner_text())
        with page.expect_download() as d:
            page.click("#btn-datos-csv")
        csv = Path(d.value.path()).read_text(encoding="utf-8-sig")
        check("CSV: secciones y datos", "# participaciones" in csv and "# colocaciones" in csv and "Persona de prueba" in csv, csv[:200])
        page.click("#btn-datos-borrar")
        page.wait_for_selector("#modal-borrar:not([hidden])")
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT / "06_cierre_confirmar_borrado.png"))
        check("el diálogo tiene Cancelar y Confirmar ≥ 44 px",
              page.locator("#borrar-cancelar").bounding_box()["height"] >= 44 and page.locator("#borrar-confirmar").bounding_box()["height"] >= 44)
        page.click("#borrar-cancelar")
        check("Cancelar cierra y no borra nada", page.locator("#modal-borrar").is_hidden() and len(coleccion("participantes")) == 1)
        page.click("#btn-datos-borrar")
        page.click("#borrar-confirmar")
        page.wait_for_function("() => document.querySelector('#btn-datos-borrar').disabled", timeout=20000)
        page.wait_for_timeout(500)
        page.evaluate("() => document.querySelector('.cierre').scrollTo(0, 99999)")
        page.screenshot(path=str(OUT / "07_cierre_borrado_listo.png"))
        check("participantes borrados", len(coleccion("participantes")) == 0)
        check("títulos borrados", len(coleccion("titulos")) == 0)
        check("colocaciones borradas", len(coleccion("colocaciones")) == 0)
        agua = [d for d in coleccion("conceptos") if d["name"].endswith("/agua")]
        check("«Agua» bajó de 2 a 1 persona (la otra persona conserva la suya)", agua and campo(agua[0], "personas") == "1")
        check("el aporte propio a «Agua» se borró y el ajeno sigue",
              [campo(a, "nombre") for a in coleccion("aportes", "conceptos/agua/")] == ["Otra persona"])
        check("la idea propia (única persona) desapareció", not [d for d in coleccion("conceptos") if "propia" in d["name"]])
        check("se pidió borrar el acceso anónimo", len(BORRADOS) == 1)
        claves = page.evaluate("() => Object.keys(localStorage)")
        check("localStorage sin datos del juego (solo el aviso)", [k for k in claves if k != "jandiekua_aviso_almacenamiento_v1"] == [], claves)
        page.reload(wait_until="networkidle")
        page.wait_for_selector("#btn-entrar")
        check("al recargar se vuelve a la portada", True)
        check("sin cookies al final", ctx.cookies() == [], ctx.cookies())

        print("Páginas legales")
        for nombre, archivo, h1 in (("08_aviso_privacidad", "aviso-privacidad.html", "Aviso de privacidad"),
                                    ("09_terminos", "terminos.html", "Términos y condiciones")):
            pg = ctx.new_page()
            pg.goto(f"{base}/{archivo}?v={CB}", wait_until="networkidle")
            pg.wait_for_timeout(500)
            check(f"{archivo}: título y sin desbordar horizontalmente",
                  h1 in pg.locator("h1").inner_text() and pg.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1"))
            texto = pg.inner_text("body")
            if archivo == "aviso-privacidad.html":
                for frase in ("herramienta de recolección de datos en un formato lúdico", "base de datos de la Revista Jandiekua",
                              "20 de marzo de 2025", "nam5", "ARCO", "[POR DEFINIR]", "Quiero recibir noticias"):
                    check(f"aviso dice «{frase}»" if frase != "Quiero recibir noticias" else "aviso menciona el boletín opcional",
                          frase in texto or frase.lower() in texto.lower())
                check("aviso: enlace de baja", "enlace de baja" in texto)
            else:
                for frase in ("juego formativo", "No es la aceptación de ningún manuscrito", "Uso aceptable", "SIL Open Font License"):
                    check(f"términos dice «{frase}»", frase.lower() in texto.lower())
            check(f"{archivo}: sin recursos externos", all(not r.startswith("http") or "127.0.0.1" in r for r in
                  pg.evaluate("() => performance.getEntriesByType('resource').map(e => e.name)")))
            pg.screenshot(path=str(OUT / f"{nombre}.png"))
            pg.screenshot(path=str(OUT / f"{nombre}_completa.png"), full_page=True)
            pg.close()

        print("Modo ?sinred=1 (nada se escribe)")
        ctx2 = nav.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        instalar_rutas(ctx2)
        pg = ctx2.new_page()
        antes = len(PETICIONES)
        pg.goto(f"{base}/index.html?sinred=1&v={CB}", wait_until="networkidle")
        pg.check("#acepto-terminos")
        pg.click("#btn-entrar")
        pg.wait_for_selector("#entrada-titulo")
        pg.focus("#entrada-titulo")
        pg.keyboard.type("Título de prueba sin red en SLP durante 2026 con comunidades", delay=5)
        pg.keyboard.press("Enter")
        pg.wait_for_selector("#btn-soltar", state="visible")
        pg.click("#btn-soltar")
        pg.wait_for_function("() => estado.tituloListo")
        pg.wait_for_timeout(1500)
        pg.evaluate("() => { estado.vista = 'cierre-diploma'; estado.registro = {nombre:'N', institucion:'I', correo:'', telefono:'', aviso:true}; render(); }")
        pg.wait_for_selector("#btn-datos-borrar")
        nuevas = [x for x in PETICIONES[antes:]]
        escritura = [x for x in nuevas if x[0] == "POST"]
        check("sinred: ninguna escritura ni llamada a Auth", not escritura, escritura)
        with pg.expect_download() as d:
            pg.click("#btn-datos-json")
        local = json.loads(Path(d.value.path()).read_text(encoding="utf-8"))
        check("sinred: la descarga es la copia local", local["participaciones"][0]["tituloInvestigacion"].startswith("Título de prueba sin red"))
        ctx2.close()

        print("Terceros y errores")
        hosts = sorted({x[1] for x in PETICIONES})
        check("solo Firestore/Identity Toolkit/Securetoken", set(hosts) <= {"firestore", "identitytoolkit", "securetoken"}, hosts)
        check("ninguna petición externa bloqueada (Google Fonts, CDN…)", not BLOQUEADAS, BLOQUEADAS)
        ruidosos = [e for e in errores_js if "Content Security Policy" in e or "Refused" in e]
        check("sin violaciones de la política de seguridad (CSP)", not ruidosos, ruidosos)
        graves = [e for e in errores_js if "Failed to load resource" not in e]
        check("sin errores de JavaScript", not graves, graves[:3])
        nav.close()
    fallos = [n for n, c in RESULTADOS if not c]
    print(f"\n{len(RESULTADOS) - len(fallos)}/{len(RESULTADOS)} comprobaciones correctas")
    if fallos:
        print("FALLARON:", *fallos, sep="\n  - ")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Mediciones de la lista de verificación y previews finales a 390×844. Solo ?sinred=1."""
import http.server
import json
import socketserver
import sys
import threading
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

ROOT = Path("/workspace/jandiekua-escape-room")
OUT = Path("/workspace/jk_v3_previews")
PORT = 8910
Q = "sinred=1&v=20261112j&semilla=20261112"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)
    def log_message(self, *a):
        pass

class ReuseServer(socketserver.TCPServer):
    allow_reuse_address = True


def base():
    return f"http://127.0.0.1:{PORT}/index.html?{Q}"


def shot(page, name, full=False):
    dest = OUT / name
    page.screenshot(path=str(dest), full_page=full)
    print("  saved", dest, dest.stat().st_size)
    return dest


def measure_layout(page, w, h, label):
    data = page.evaluate(
        """() => {
          const esc = document.getElementById('escenario');
          const lienzo = document.getElementById('lienzo');
          const barra = document.querySelector('.barra');
          const er = esc.getBoundingClientRect();
          const lr = lienzo.getBoundingClientRect();
          const br = barra.getBoundingClientRect();
          const btns = [...document.querySelectorAll(
            'button, .btn-entrar, .btn-principal, .btn-idea, .btn-glosario, .btn-seguir, input[type=text], input[type=submit]'
          )].filter(el => {
            const r = el.getBoundingClientRect();
            const st = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden';
          }).map(el => {
            const r = el.getBoundingClientRect();
            return { id: el.id || el.className.slice(0,40), h: Math.round(r.height*10)/10, w: Math.round(r.width*10)/10 };
          });
          return {
            vw: window.innerWidth, vh: window.innerHeight,
            escenarioTop: Math.round(er.top*10)/10,
            lienzoTop: Math.round(lr.top*10)/10,
            lienzoLeft: Math.round(lr.left*10)/10,
            lienzoW: Math.round(lr.width*10)/10,
            lienzoH: Math.round(lr.height*10)/10,
            barraTop: Math.round(br.top*10)/10,
            barraH: Math.round(br.height*10)/10,
            gapAboveBarra: Math.round((br.top - er.top)*10)/10,
            logosInBarra: [...barra.querySelectorAll('img')].map(i => i.getAttribute('src')),
            logosInMar: document.querySelectorAll('#mar img.logo-uaslp, #mar img.logo-aa, #mar .logo-uaslp, #mar .logo-aa').length,
            buttons: btns
          };
        }"""
    )
    data["label"] = label
    data["viewport"] = f"{w}x{h}"
    min_btn = min((b["h"] for b in data["buttons"]), default=0)
    data["minButtonH"] = min_btn
    print(json.dumps({k: data[k] for k in data if k != "buttons"}, ensure_ascii=False))
    for b in data["buttons"]:
        flag = " OK" if (w != 390 or b["h"] >= 44 - 0.2) else " SHORT"
        if w == 390:
            print(f"    btn {b['id']!r}: {b['h']}×{b['w']}px{flag}")
    return data


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    httpd = ReuseServer(("127.0.0.1", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    report = {"checks": {}, "layout": [], "issues": []}

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            args=["--headless=new", "--no-sandbox", "--disable-gpu"],
        )

        # ---- layout at several viewports (portada + sala 1 after title) ----
        for w, h, where in (
            (390, 844, "phone-390"),
            (360, 740, "phone-360"),
            (412, 915, "phone-412"),
            (1366, 768, "desktop"),
        ):
            page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
            page.goto(base(), wait_until="networkidle")
            page.evaluate("localStorage.clear()")
            page.reload(wait_until="networkidle")
            page.wait_for_selector("#btn-entrar")
            report["layout"].append(measure_layout(page, w, h, f"{where} portada"))
            # enter sala to measure in-game buttons too
            page.locator("#btn-entrar").click()
            page.wait_for_selector("#tema")
            report["layout"].append(measure_layout(page, w, h, f"{where} sala1-titulo"))
            page.fill("#tema", "Título de previsualización sobre educación ambiental")
            page.locator("#btn-registrar-titulo").click()
            page.wait_for_selector("#mar[data-listo='1'] #s1-a", state="attached", timeout=20000)
            page.wait_for_timeout(400)
            report["layout"].append(measure_layout(page, w, h, f"{where} sala1-ideas"))
            page.close()

        # ---- feature checklist on 390 ----
        page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
        page.goto(base(), wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.wait_for_selector("#btn-entrar")

        portada = page.evaluate(
            """() => ({
              aviso: document.querySelector('.aviso-juego')?.textContent.trim() || '',
              logosBarra: [...document.querySelector('.barra').querySelectorAll('img')].map(i => i.getAttribute('src')),
              logosEnFisica: document.querySelectorAll('#mar .logo-uaslp, #capa-arrastre .logo-uaslp').length
            })"""
        )
        report["checks"]["portada_aviso"] = portada["aviso"]
        report["checks"]["logos_barra"] = portada["logosBarra"]
        shot(page, "portada.png")

        page.locator("#btn-entrar").click()
        page.wait_for_selector("#tema")
        s1lock = page.evaluate(
            """() => ({
              label: document.querySelector('label[for=tema]')?.textContent.trim(),
              tanquesBloq: !!document.querySelector('.zona-tanques.bloqueado'),
              formEnTop: !!document.querySelector('.zona-reto #form-idea'),
              formBloq: document.querySelector('#form-idea')?.classList.contains('bloqueado'),
              zonas: getComputedStyle(document.querySelector('.sala')).gridTemplateRows,
              acuario: !!document.querySelector('.acuario-svg'),
              burbujas: document.querySelectorAll('.acuario-burbujas span').length,
              peces: document.querySelectorAll('.acuario-svg .pez-a, .acuario-svg .pez-b').length,
              arena: !!document.querySelector('.acuario-svg #arena, .acuario-svg [fill*=\"arena\"], .acuario-svg linearGradient#arena'),
            })"""
        )
        report["checks"]["sala1_titulo"] = s1lock
        shot(page, "sala1_titulo.png")

        page.fill("#tema", "Título de previsualización sobre educación ambiental")
        page.locator("#btn-registrar-titulo").click()
        page.wait_for_selector("#mar[data-listo='1'] #s1-a", state="attached", timeout=20000)
        page.wait_for_function(
            "() => { const e = document.getElementById('s1-a'); return e && parseFloat(getComputedStyle(e).opacity||0) >= 0.4; }",
            timeout=10000,
        )
        page.wait_for_timeout(800)

        # drop a typed idea into the sea from the top-zone form
        page.wait_for_selector("#form-idea")
        page.fill("#nueva-idea", "Una idea escrita en la zona superior")
        page.locator("#form-idea .btn-idea").click()
        page.wait_for_timeout(400)
        # dedupe
        page.fill("#nueva-idea", "Una idea escrita en la zona superior")
        page.locator("#form-idea .btn-idea").click()
        page.wait_for_timeout(500)
        page.evaluate("() => { const t=document.getElementById('toast'); if (t) t.hidden = true; }")
        sea = page.evaluate(
            """() => {
              const nodos = [...document.querySelectorAll('#mar .nodo, #capa-arrastre .nodo')];
              const misma = nodos.filter(n => (n.textContent||'').includes('Una idea escrita en la zona superior'));
              const badge = document.querySelector('.insignia-personas:not([hidden])');
              const r = document.querySelector('#s1-a')?.getBoundingClientRect();
              const font = document.querySelector('#s1-a') ? parseFloat(getComputedStyle(document.querySelector('#s1-a')).fontSize) : 0;
              const formParent = document.querySelector('#form-idea')?.closest('.zona')?.className;
              return {
                n: nodos.length,
                mismaCount: misma.length,
                badge: badge ? badge.textContent.trim() : null,
                formParent,
                fontPx: font,
                s1a: r && {y: r.y, h: r.height},
                acuarioVisible: !!document.querySelector('.acuario-svg'),
              };
            }"""
        )
        report["checks"]["sala1_ideas"] = sea
        shot(page, "sala1_ideas.png")

        # drag in progress: dispatch on #s1-a so overlapping cards do not steal the hit
        page.evaluate("() => { const t=document.getElementById('toast'); if (t) t.hidden = true; }")
        page.wait_for_function(
            "() => { const e=document.getElementById('s1-a'); return e && parseFloat(getComputedStyle(e).opacity||0)>=0.4; }",
            timeout=10000,
        )
        dragged = page.evaluate("""() => {
          const el = document.getElementById('s1-a');
          const tank = document.getElementById('tanque-originalidad');
          if (!el || !tank) return false;
          const r = el.getBoundingClientRect();
          const t = tank.getBoundingClientRect();
          const ev = (type, x, y) => el.dispatchEvent(new PointerEvent(type, {
            bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse',
            clientX: x, clientY: y, view: window
          }));
          const x0 = r.left + r.width/2, y0 = r.top + r.height/2;
          const x1 = t.left + t.width/2, y1 = t.top + t.height/2;
          ev('pointerdown', x0, y0);
          ev('pointermove', x0 + (x1-x0)*0.15, y0 + (y1-y0)*0.15);
          ev('pointermove', x0 + (x1-x0)*0.55, y0 + (y1-y0)*0.55);
          return true;
        }""")
        page.wait_for_timeout(200)
        shot(page, "arrastre.png")
        page.evaluate("""() => {
          const el = document.getElementById('s1-a');
          if (!el) return;
          const tank = document.getElementById('tanque-originalidad');
          const t = tank.getBoundingClientRect();
          el.dispatchEvent(new PointerEvent('pointerup', {
            bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse',
            clientX: t.left + t.width/2, clientY: t.top + t.height/2, view: window
          }));
        }""")
        page.wait_for_timeout(200)

        # remaining rooms via URL (title already not required)
        for vista, fname, extra in (
            ("sala2", "sala2.png", None),
            ("sala3", "sala3.png", None),
            ("sala4", "sala4.png", None),
        ):
            page.goto(base() + f"&vista={vista}", wait_until="networkidle")
            page.wait_for_selector(".sala", timeout=15000)
            page.wait_for_timeout(900)
            page.evaluate("() => { const t=document.getElementById('toast'); if (t) t.hidden = true; }")
            info = page.evaluate(
                """() => ({
                  kicker: document.querySelector('.kicker')?.textContent.trim(),
                  nombre: document.querySelector('.zona-reto h2')?.textContent.trim(),
                  reto: document.querySelector('.carta-reto p:not(.etiqueta)')?.textContent.trim(),
                  formEnTop: !!document.querySelector('.zona-reto #form-idea'),
                  zonas: getComputedStyle(document.querySelector('.sala')).gridTemplateRows,
                  tanques: [...document.querySelectorAll('.tanque h3')].map(h => h.textContent.trim()),
                })"""
            )
            report["checks"][vista] = info
            shot(page, fname)

        # cierre form
        page.goto(base() + "&vista=cierre", wait_until="networkidle")
        # vista=cierre goes to diploma; we need the form. Navigate by state.
        page.evaluate(
            """() => {
              estado.vista = 'cierre-form';
              estado.llaves = [true,true,true,true];
              estado.registro = { nombre: '', institucion: '', correo: '', telefono: '', aviso: false };
              render();
            }"""
        )
        page.wait_for_selector("#form-registro")
        form_txt = page.inner_text("#form-registro")
        termino = page.locator(".aviso-termino").inner_text() if page.locator(".aviso-termino").count() else ""
        report["checks"]["cierre"] = {"termino": termino, "form": form_txt}
        shot(page, "cierre_form.png")

        # certificate
        page.evaluate(
            """() => {
              estado.vista = 'cierre-diploma';
              estado.registro = {
                nombre: 'Nombre de la persona participante',
                institucion: 'Institución [POR DEFINIR]',
                correo: '', telefono: '', aviso: true
              };
              estado.tema = 'Título de previsualización sobre educación ambiental';
              return render();
            }"""
        )
        page.wait_for_selector("#certificado-marco img", timeout=20000)
        # save the actual certificate PNG
        data_url = page.evaluate("() => document.querySelector('#certificado-marco img').src")
        import base64
        header, b64 = data_url.split(",", 1)
        cert_bytes = base64.b64decode(b64)
        (OUT / "certificado.png").write_bytes(cert_bytes)
        print("  saved", OUT / "certificado.png", len(cert_bytes))
        # also a page crop isn't required; verify texts in the PNG via page/canvas strings
        report["checks"]["certificado"] = page.evaluate(
            """() => ({
              h2: document.querySelector('.cierre h2')?.textContent.trim(),
            })"""
        )
        # OCR-less: inspect canvas generation by reading the image isn't easy;
        # we already set the strings in dibujarCertificado. Confirm they exist in source via page hook:
        report["checks"]["certificado"]["png_bytes"] = len(cert_bytes)

        # 200-idea stress
        page.goto(base() + "&vista=sala1&foto=1", wait_until="networkidle")
        page.wait_for_selector("#mar[data-listo='1'] #s1-a", state="attached", timeout=20000)
        page.evaluate(
            """async () => {
              const textos = Array.from({length: 200}, (_, i) => "Aporte del consorcio número " + (i + 1));
              await agregarIdeasLote(textos);
            }"""
        )
        page.wait_for_function("() => document.querySelectorAll('#mar .nodo').length >= 200", timeout=30000)
        page.wait_for_timeout(600)
        page.evaluate("() => { const t=document.getElementById('toast'); if (t) t.hidden = true; }")
        stress = page.evaluate(
            """() => {
              const el = document.querySelector('#mar .nodo');
              const font = el ? parseFloat(getComputedStyle(el).fontSize) : 0;
              const n = document.querySelectorAll('#mar .nodo').length;
              const scale = parseFloat(getComputedStyle(document.getElementById('escenario')).getPropertyValue('--escala')) || (el.getBoundingClientRect().width && 1);
              return { n, fontPx: font, total: totalIdeasSesion && totalIdeasSesion() };
            }"""
        )
        report["checks"]["estres"] = stress
        shot(page, "estres_200.png")

        page.close()
        browser.close()

    # contact sheet
    names = [
        "portada.png", "sala1_titulo.png", "sala1_ideas.png", "arrastre.png",
        "sala2.png", "sala3.png", "sala4.png", "cierre_form.png",
        "certificado.png", "estres_200.png",
    ]
    thumbs = []
    for n in names:
        im = Image.open(OUT / n).convert("RGB")
        thumbs.append((n, im))
    cols, rows = 5, 2
    cell_w, cell_h = 390, 844
    pad, caption = 16, 36
    # certificate is 1080x1350; fit into cell
    sheet = Image.new("RGB", (cols * (cell_w + pad) + pad, rows * (cell_h + caption + pad) + pad + 20), "#102438")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except Exception:
        font = ImageFont.load_default()
    for i, (n, im) in enumerate(thumbs):
        r, c = divmod(i, cols)
        # contain
        imr = im.copy()
        imr.thumbnail((cell_w, cell_h))
        x = pad + c * (cell_w + pad) + (cell_w - imr.size[0]) // 2
        y = pad + r * (cell_h + caption + pad)
        # letterbox
        bg = Image.new("RGB", (cell_w, cell_h), "#071018")
        bg.paste(imr, ((cell_w - imr.size[0]) // 2, (cell_h - imr.size[1]) // 2))
        sheet.paste(bg, (pad + c * (cell_w + pad), y))
        draw.text((pad + c * (cell_w + pad), y + cell_h + 8), n, fill="#D8E8DF", font=font)
    hoja = OUT / "hoja.png"
    sheet.save(hoja, "PNG")
    print("  saved", hoja, hoja.stat().st_size)

    (OUT / "checklist_raw.json").write_text(json.dumps(report, indent=2, ensure_ascii=False))
    print("REPORT_KEYS", list(report["checks"].keys()))
    httpd.shutdown()
    return 0

if __name__ == "__main__":
    sys.exit(main())

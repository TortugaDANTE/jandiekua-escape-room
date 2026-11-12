#!/usr/bin/env python3
"""Hoja de contacto (hoja_contacto.png) con todos los assets y el antes/después."""
from pathlib import Path
from playwright.sync_api import sync_playwright
A = Path(__file__).resolve().parents[1]; P = A / "preview"; R = A.parent.parent / "preview"
u = lambda p: p.as_uri()
chips = "".join(f'<span class="chip" style="background:{c}"><b>{c}</b></span>' for c in ["#003B71","#2E6B4E","#4A8B68","#D8E8DF","#C59B27","#102438"])
html = f'''<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:Fr;src:url("{u(A.parent/'fonts'/'Fraunces-Italic.woff')}")}}
@font-face{{font-family:Mo;src:url("{u(A.parent/'fonts'/'Montserrat.woff')}");font-weight:100 900}}
*{{box-sizing:border-box;margin:0}}
body{{width:2400px;background:#0b1a28;color:#D8E8DF;font-family:Mo,sans-serif;padding:70px 80px 80px}}
h1{{font-family:Fr;font-style:italic;font-size:76px;color:#fff;font-weight:500}}
.sub{{font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:#E0B43C;font-weight:700;margin:10px 0 30px}}
h2{{font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:#E0B43C;margin:64px 0 8px;font-weight:700;border-top:1px solid rgba(216,232,223,.25);padding-top:26px}}
p.n{{font-size:20px;line-height:1.45;max-width:1700px;color:rgba(216,232,223,.85);margin-bottom:22px}}
.fila{{display:flex;gap:34px;align-items:flex-start;flex-wrap:wrap}}
.ad figure{{width:340px}}
figure{{display:flex;flex-direction:column;gap:10px}}
figcaption{{font-size:17px;letter-spacing:.06em;color:rgba(216,232,223,.8)}}
figcaption b{{color:#fff}}
img{{display:block;border-radius:6px;outline:1px solid rgba(216,232,223,.18)}}
.chip{{display:inline-block;width:150px;height:56px;border-radius:8px;margin-right:12px;padding:8px 10px;font-size:14px;color:#fff;text-shadow:0 1px 2px #000;vertical-align:top}}
.claro{{background:#F5F7F9;padding:18px;border-radius:10px}}
.az{{background:#003B71;padding:18px;border-radius:10px}}
</style>
<h1>Mar de las Ideas</h1>
<div class="sub">Propuesta de diseño gráfico · Revista Jandiekua · hoja de contacto</div>
<div>{chips}</div>
<h2>1 · Antes / después (lienzo 1080 × 2022, escala 1:3)</h2>
<div class="fila ad">
 <figure><img src="{u(R/'sala1.png')}" width="340"><figcaption><b>Antes</b> · Sala 1</figcaption></figure>
 <figure><img src="{u(P/'propuesta_sala1_estados.png')}" width="340"><figcaption><b>Propuesta</b> · Sala 1 con tanque lleno y nodo elegido</figcaption></figure>
 <figure><img src="{u(R/'sala2.png')}" width="340"><figcaption><b>Antes</b> · Sala 2</figcaption></figure>
 <figure><img src="{u(P/'propuesta_sala2.png')}" width="340"><figcaption><b>Propuesta</b> · Sala 2, compartimentos</figcaption></figure>
 <figure><img src="{u(R/'cierre.png')}" width="340"><figcaption><b>Antes</b> · Cierre</figcaption></figure>
 <figure><img src="{u(P/'propuesta_cierre.png')}" width="340"><figcaption><b>Propuesta</b> · Cierre con insignia</figcaption></figure>
</div>
<div class="fila ad" style="margin-top:34px">
 <figure><img src="{u(R/'portada.png')}" width="340"><figcaption><b>Antes</b> · Portada</figcaption></figure>
 <figure><img src="{u(P/'propuesta_portada.png')}" width="340"><figcaption><b>Propuesta</b> · Portada (el logo Jandiekua sigue [POR DEFINIR])</figcaption></figure>
 <figure><img src="{u(R/'sala3.png')}" width="340"><figcaption><b>Antes</b> · Sala 3</figcaption></figure>
 <figure><img src="{u(P/'propuesta_sala3.png')}" width="340"><figcaption><b>Propuesta</b> · Sala 3</figcaption></figure>
 <figure><img src="{u(R/'sala4.png')}" width="340"><figcaption><b>Antes</b> · Sala 4</figcaption></figure>
 <figure><img src="{u(P/'propuesta_sala4.png')}" width="340"><figcaption><b>Propuesta</b> · Sala 4</figcaption></figure>
</div>
<h2>2 · Fondo del mar · fondo_mar.svg</h2>
<p class="n">Cinco capas con id (rayos, retícula de carta náutica, isobatas, plancton, oleaje en cinco bandas, algas, burbujas). Retícula de 54 px y 216 px muy sutil; el centro queda calmado para que se lean los tanques.</p>
<div class="fila"><figure><img src="{u(P/'fondo_mar.png')}" width="540"><figcaption>fondo_mar.svg · 1080×2022 · 39 KB</figcaption></figure></div>
<h2>3 · Tanques · tanque_vacio / activo / lleno · tanque_agua</h2>
<div class="fila">
 <figure><img src="{u(P/'tanque_vacio.png')}" width="700"><figcaption>tanque_vacio.svg · 1000×591</figcaption></figure>
 <figure><img src="{u(P/'tanque_activo.png')}" width="700"><figcaption>tanque_activo.svg (aceptando)</figcaption></figure>
 <figure><img src="{u(P/'tanque_lleno.png')}" width="700"><figcaption>tanque_lleno.svg (lleno)</figcaption></figure>
</div>
<div class="fila" style="margin-top:30px">
 <figure><img src="{u(P/'tanque_compartimento_vacio.png')}" width="488"><figcaption>compartimento_vacio · 488×136</figcaption></figure>
 <figure><img src="{u(P/'tanque_compartimento_activo.png')}" width="488"><figcaption>compartimento_activo</figcaption></figure>
 <figure><img src="{u(P/'tanque_compartimento_lleno.png')}" width="488"><figcaption>compartimento_lleno</figcaption></figure>
 <figure><img src="{u(P/'tanque_agua.png')}" width="300" style="background:#0b1c2c"><figcaption>tanque_agua.svg · capa de progreso (se desplaza en Y)</figcaption></figure>
 <figure><img src="{u(P/'propuesta_sala1_nivel50.png')}" width="340"><figcaption>Prueba: nivel de agua al 50 % (--nivel: .5)</figcaption></figure>
</div>
<h2>4 · Nodos · nodo_inactivo / nodo_activo / nodo_burbujas</h2>
<div class="fila">
 <figure><img src="{u(P/'nodo_inactivo.png')}" width="440"><figcaption>nodo_inactivo.svg · 220×76 (rebanado 9)</figcaption></figure>
 <figure><img src="{u(P/'nodo_activo.png')}" width="440"><figcaption>nodo_activo.svg · arrastre o elegido</figcaption></figure>
 <figure><img src="{u(P/'nodo_burbujas.png')}" width="208" style="background:#102438"><figcaption>nodo_burbujas.svg · adorno</figcaption></figure>
</div>
<h2>5 · Llaves · una por sala, con motivo y color de gema propios</h2>
<p class="n">1 Pertinencia: arco circular con hoja verde. 2 Estructura: arco cuadrado con retícula 2×2 azul (IMRyD). 3 Validación Científica: dos aros entrelazados (pares) con verificación. 4 Definitiva: roseta de 8 puntas con perla. Cada una tiene su versión bloqueada (silueta plana y candado), así se distingue cuál falta.</p>
<div class="fila">
 {''.join(f'<figure><img class="" src="{u(P/f)}" width="256"><figcaption>{f[:-4]}</figcaption></figure>' for f in ["llave_1_pertinencia.png","llave_2_estructura.png","llave_3_validacion.png","llave_4_definitiva.png"])}
</div>
<div class="fila" style="margin-top:20px">
 {''.join(f'<figure><img src="{u(P/f)}" width="256"><figcaption>{f[:-4]}</figcaption></figure>' for f in ["llave_1_pertinencia_bloqueada.png","llave_2_estructura_bloqueada.png","llave_3_validacion_bloqueada.png","llave_4_definitiva_bloqueada.png"])}
 <figure><div class="az" style="display:flex;gap:6px;align-items:center"><img src="{u(P/'llave_1_pertinencia.png')}" width="72" style="outline:0"><img src="{u(P/'llave_2_estructura.png')}" width="72" style="outline:0"><img src="{u(P/'llave_3_validacion_bloqueada.png')}" width="72" style="outline:0"><img src="{u(P/'llave_4_definitiva_bloqueada.png')}" width="72" style="outline:0"></div><figcaption>Tamaño real en la franja (72 px, escala 1:1 del lienzo)</figcaption></figure>
</div>
<h2>6 · Insignia · insignia.svg e insignia_sello.svg</h2>
<p class="n">Sin texto: el nombre de la insignia sigue [POR DEFINIR] (se escribirá sobre la cinta por código cuando Dante lo confirme). Cuatro gemas = las cuatro llaves; libro abierto con brote = publicación científica y educación ambiental.</p>
<div class="fila">
 <figure><img src="{u(P/'insignia.png')}" width="400"><figcaption>insignia.svg · 400×480 con cinta</figcaption></figure>
 <figure><img src="{u(P/'insignia_sello.png')}" width="400"><figcaption>insignia_sello.svg · 400×400 (certificado)</figcaption></figure>
 <figure><div class="claro"><img src="{u(A/'insignia_sello.svg')}" width="200" style="outline:0"></div><figcaption>Sobre papel claro (certificado)</figcaption></figure>
 <figure><div class="claro"><img src="{u(A/'insignia_sello.svg')}" width="124" style="outline:0"></div><figcaption>Tamaño en certificado (124 px)</figcaption></figure>
</div>
</html>'''
t = Path("/tmp/_hoja.html"); t.write_text(html)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 2400, "height": 1000})
    pg.goto(t.as_uri()); pg.wait_for_timeout(800)
    pg.screenshot(path=str(A / "hoja_contacto.png"), full_page=True)
    b.close()
print("ok")

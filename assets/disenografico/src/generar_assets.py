#!/usr/bin/env python3
"""Genera los SVG de la propuesta de diseño gráfico (Mar de las Ideas · Jandiekua).
Sin dependencias externas. Uso:  python3 generar_assets.py   (escribe en ../)
Todos los SVG son vectoriales puros: sin texto, sin fuentes, sin imágenes externas.
Paleta de la especificación: #003B71 #2E6B4E #4A8B68 #D8E8DF #C59B27 #102438
(más #004A8F, #E0B43C y #F5F7F9, que la especificación y el CSS ya citan)."""
import math, random
from pathlib import Path

OUT = Path(__file__).resolve().parents[1]

AZUL, AZUL2 = "#003B71", "#004A8F"
VERDE, VERDE2 = "#2E6B4E", "#4A8B68"
ESPUMA, PAPEL = "#D8E8DF", "#F5F7F9"
ORO, ORO2 = "#C59B27", "#E0B43C"
ABISMO = "#102438"
ORO_CLARO, ORO_OSCURO = "#F3E3A4", "#8A6A12"

def f(x):
    return f"{x:.1f}".rstrip("0").rstrip(".")

def svg(w, h, body, defs="", titulo=None):
    t = f"<title>{titulo}</title>" if titulo else ""
    d = f"<defs>{defs}</defs>" if defs else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-hidden="true">{t}{d}{body}</svg>\n')

def guardar(nombre, contenido):
    (OUT / nombre).write_text(contenido, encoding="utf-8")
    print(f"{nombre:34s} {len(contenido.encode())/1024:6.1f} KB")

def catmull(pts):
    """Curva suave (Catmull-Rom -> Bézier) por una lista de puntos."""
    d = f"M{f(pts[0][0])} {f(pts[0][1])}"
    n = len(pts)
    for i in range(n - 1):
        p0 = pts[max(i - 1, 0)]; p1 = pts[i]; p2 = pts[i + 1]; p3 = pts[min(i + 2, n - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}"
    return d

def ola(y0, amp, period, fase, x0=-60, x1=1140, step=30, amp2=0.0, per2=1.0, fase2=0.0):
    pts = []
    x = x0
    while x <= x1:
        y = y0 + amp * math.sin((x / period) * 2 * math.pi + fase) + amp2 * math.sin((x / (period * per2)) * 2 * math.pi + fase2)
        pts.append((x, y)); x += step
    return pts

def banda(pts, y_fondo):
    d = catmull(pts)
    return d + f"L{f(pts[-1][0])} {y_fondo}L{f(pts[0][0])} {y_fondo}Z"

def rr_dif(x, y, w, h, rt, rb):
    """Rectángulo con radios superior e inferior distintos (como .tanque del CSS)."""
    return (f"M{f(x+rt)} {f(y)}H{f(x+w-rt)}A{rt} {rt} 0 0 1 {f(x+w)} {f(y+rt)}V{f(y+h-rb)}"
            f"A{rb} {rb} 0 0 1 {f(x+w-rb)} {f(y+h)}H{f(x+rb)}A{rb} {rb} 0 0 1 {f(x)} {f(y+h-rb)}"
            f"V{f(y+rt)}A{rt} {rt} 0 0 1 {f(x+rt)} {f(y)}Z")

GRAD_ORO = (f'<linearGradient id="{{p}}oro" x1="0" y1="0" x2="1" y2="1">'
            f'<stop offset="0" stop-color="{ORO_CLARO}"/><stop offset=".42" stop-color="{ORO2}"/>'
            f'<stop offset=".72" stop-color="{ORO}"/><stop offset="1" stop-color="{ORO_OSCURO}"/></linearGradient>')

# ====================================================================== FONDO
def fondo_mar():
    W, H = 1080, 2022
    rnd = random.Random(2026)
    defs = f'''
<linearGradient id="agua" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{AZUL}"/><stop offset=".13" stop-color="#0a2c50"/>
 <stop offset=".36" stop-color="{ABISMO}"/><stop offset=".72" stop-color="#0d2b33"/>
 <stop offset="1" stop-color="#0f3a2e"/></linearGradient>
<linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{ESPUMA}" stop-opacity=".15"/><stop offset=".6" stop-color="{ESPUMA}" stop-opacity=".04"/>
 <stop offset="1" stop-color="{ESPUMA}" stop-opacity="0"/></linearGradient>
<pattern id="malla" width="54" height="54" patternUnits="userSpaceOnUse">
 <path d="M54 0H0V54" fill="none" stroke="{ESPUMA}" stroke-opacity=".05" stroke-width="1"/></pattern>
<pattern id="mallaM" width="216" height="216" patternUnits="userSpaceOnUse">
 <path d="M216 0H0V216" fill="none" stroke="{ESPUMA}" stroke-opacity=".09" stroke-width="1.2"/>
 <circle cx="0" cy="0" r="3" fill="{ORO2}" fill-opacity=".45"/></pattern>
<linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#fff"/><stop offset=".62" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient>
<mask id="mMalla"><rect width="{W}" height="{H}" fill="url(#mGrad)"/></mask>
<radialGradient id="vineta" cx=".5" cy=".45" r=".78">
 <stop offset=".55" stop-color="#050e17" stop-opacity="0"/><stop offset="1" stop-color="#050e17" stop-opacity=".62"/></radialGradient>
<linearGradient id="bandaV" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{VERDE2}" stop-opacity=".30"/><stop offset="1" stop-color="{VERDE}" stop-opacity=".05"/></linearGradient>
<linearGradient id="bandaA" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{AZUL2}" stop-opacity=".34"/><stop offset="1" stop-color="{AZUL}" stop-opacity=".04"/></linearGradient>
<linearGradient id="bandaF" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{VERDE}" stop-opacity=".62"/><stop offset="1" stop-color="#0a2a22" stop-opacity=".9"/></linearGradient>
<radialGradient id="plancton"><stop offset="0" stop-color="{ORO_CLARO}" stop-opacity=".9"/><stop offset="1" stop-color="{ORO2}" stop-opacity="0"/></radialGradient>
'''
    b = [f'<rect width="{W}" height="{H}" fill="url(#agua)"/>']
    # --- capa 1: rayos de luz (id para animar si se inserta en línea)
    rayos = [(150, 270, 330, 640, 0.9), (380, 470, 640, 800, 0.6), (640, 720, 890, 1010, 0.8), (840, 900, 1060, 1160, 0.45)]
    b.append('<g id="capa-rayos">')
    for a, c, d, e, o in rayos:
        b.append(f'<path d="M{a} 0L{c} 0L{e} 1450L{d} 1450Z" fill="url(#rayo)" opacity="{o}"/>')
    b.append('</g>')
    # --- capa 2: retícula sutil de carta náutica (menor 54 px, mayor 216 px) + marcas de escala
    b.append(f'<g id="capa-malla" mask="url(#mMalla)"><rect width="{W}" height="{H}" fill="url(#malla)"/>'
             f'<rect width="{W}" height="{H}" fill="url(#mallaM)"/></g>')
    ticks = []
    for y in range(243, 1968, 27):
        mayor = ((y - 243) // 27) % 4 == 0
        ln = 15 if mayor else 8
        ticks.append(f"M0 {y}h{ln}M{W} {y}h-{ln}")
    b.append(f'<path d="{"".join(ticks)}" stroke="{ESPUMA}" stroke-opacity=".22" stroke-width="1.4" fill="none"/>')
    # --- capa 3: isobatas (curvas de nivel) muy tenues en la zona de reto y de tanques
    b.append('<g id="capa-isobatas" fill="none" stroke="#D8E8DF" stroke-width="1.3">')
    for i in range(9):
        y0 = 330 + i * 118
        pts = ola(y0, 20 + (i % 3) * 7, 520 + i * 25, i * 1.3, step=60, amp2=9, per2=.43, fase2=i)
        b.append(f'<path d="{catmull(pts)}" stroke-opacity="{0.075 if i % 2 else 0.05}"/>')
    b.append('</g>')
    # --- capa 4: plancton dorado (puntos de luz)
    b.append('<g id="capa-plancton">')
    for _ in range(26):
        x = rnd.uniform(30, 1050); y = rnd.uniform(260, 1950); r = rnd.choice([5, 7, 9, 12])
        b.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="url(#plancton)" opacity="{rnd.choice([.25,.35,.5])}"/>')
    b.append('</g>')
    # --- capa 5: Mar de Ideas, oleaje en bandas (zona inferior 1363–1968)
    b.append('<g id="capa-oleaje">')
    capas = [
        (1425, 26, 640, 0.3, "bandaA", ESPUMA, .20),
        (1520, 30, 520, 2.1, "bandaV", ESPUMA, .16),
        (1625, 34, 700, 4.0, "bandaA", ORO2, .32),
        (1735, 30, 460, 1.0, "bandaV", ESPUMA, .18),
        (1840, 26, 600, 3.2, "bandaF", ORO, .30),
    ]
    for i, (y0, amp, per, fase, g, sc, so) in enumerate(capas):
        pts = ola(y0, amp, per, fase, amp2=amp * .35, per2=.41, fase2=fase * 2)
        b.append(f'<g id="ola-{i+1}"><path d="{banda(pts, H)}" fill="url(#{g})"/>'
                 f'<path d="{catmull(pts)}" fill="none" stroke="{sc}" stroke-opacity="{so}" stroke-width="{2.2 if i%2==0 else 1.4}"/></g>')
    b.append('</g>')
    # --- capa 6: algas (frondas estilizadas en los márgenes) y fondo marino
    def alga(x0, alto, deriva, fase, color, op, n=9, ancho=34):
        s = [f'<g fill="{color}" fill-opacity="{op}" stroke="none">']
        tallo = []
        for k in range(21):
            t = k / 20
            tallo.append((x0 + deriva * math.sin(t * 3.4 + fase) * t, H + 10 - alto * t))
        s.append(f'<path d="{catmull(tallo)}" fill="none" stroke="{color}" stroke-opacity="{op}" stroke-width="5" stroke-linecap="round"/>')
        for i in range(n):
            t = .18 + .8 * i / (n - 1)
            px = x0 + deriva * math.sin(t * 3.4 + fase) * t; py = H + 10 - alto * t
            tang = math.degrees(math.atan2(deriva * (math.sin((t + .01) * 3.4 + fase) * (t + .01) - math.sin(t * 3.4 + fase) * t), -alto * .01))
            lado = 1 if i % 2 == 0 else -1
            ang = tang * 0 + lado * (38 + 6 * (i % 3))
            lar = ancho * (1.9 - 1.1 * t); anc = ancho * .46 * (1.25 - .5 * t)
            hoja = (f"M0 0C{f(anc)} {f(-lar*.25)} {f(anc*.85)} {f(-lar*.8)} 0 {f(-lar)}"
                    f"C{f(-anc*.85)} {f(-lar*.8)} {f(-anc)} {f(-lar*.25)} 0 0Z")
            s.append(f'<path d="{hoja}" transform="translate({f(px)} {f(py)}) rotate({f(ang)})"/>')
        s.append('</g>')
        return "".join(s)
    b.append('<g id="capa-algas">')
    b.append(alga(34, 560, 26, 0.4, VERDE2, .55, 11, 56))
    b.append(alga(96, 400, -18, 2.2, VERDE, .7, 9, 46))
    b.append(alga(1046, 600, -28, 1.1, VERDE2, .55, 11, 56))
    b.append(alga(984, 380, 16, 3.3, VERDE, .7, 9, 46))
    b.append(alga(540, 150, 20, 0.8, VERDE, .6, 6, 30))
    b.append('</g>')
    pts = ola(1958, 14, 380, 1.2, amp2=6, per2=.5, fase2=.7)
    b.append(f'<path d="{banda(pts, H)}" fill="#08201a" fill-opacity=".88"/>')
    # --- capa 7: burbujas (anillo + brillo)
    b.append('<g id="capa-burbujas" fill="none" stroke="#D8E8DF">')
    cols = [(60, 0), (118, 0), (1020, 0), (958, 0), (300, 1), (780, 1)]
    for cx, _ in cols:
        y = rnd.uniform(1500, 1900)
        for k in range(rnd.randint(3, 5)):
            r = rnd.choice([4, 6, 8, 11, 15]); x = cx + rnd.uniform(-26, 26); y -= rnd.uniform(40, 120)
            if y < 1380: break
            b.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" stroke-opacity=".34" stroke-width="1.6"/>'
                     f'<path d="M{f(x-r*.55)} {f(y-r*.1)}A{f(r*.6)} {f(r*.6)} 0 0 1 {f(x-r*.1)} {f(y-r*.55)}" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>')
    b.append('</g>')
    b.append(f'<rect width="{W}" height="{H}" fill="url(#vineta)"/>')
    return svg(W, H, "".join(b), defs, "Fondo del Mar de las Ideas")

# ====================================================================== TANQUES
def agua_cuerpo(p, x0, x1, ytop, ybot, fase, amp=9, per=300, claro=False):
    pts = ola(ytop, amp, per, fase, x0=x0 - 20, x1=x1 + 20, step=25, amp2=amp * .4, per2=.5, fase2=fase * 1.7)
    d = catmull(pts) + f"L{f(x1+20)} {ybot}L{f(x0-20)} {ybot}Z"
    return d, catmull(pts)

def tanque(w, h, estado, grande=True):
    """estado: vacio | activo | lleno. Medidas reales del CSS: 1000x591 (grande) y 488x136 (compartimento)."""
    p = "tq"
    rt, rb = (34, 44) if grande else (24, 24)
    ins = 3
    cuerpo = rr_dif(ins, ins, w - 2 * ins, h - 2 * ins, rt, rb)
    nivel = {"vacio": 0.0, "activo": 0.0, "lleno": 0.8 if grande else 0.9}[estado]
    dorado = estado in ("activo", "lleno")
    defs = f'''
<clipPath id="{p}c"><path d="{cuerpo}"/></clipPath>
<linearGradient id="{p}v" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{ESPUMA}" stop-opacity=".20"/><stop offset=".4" stop-color="{ABISMO}" stop-opacity=".16"/>
 <stop offset="1" stop-color="{VERDE}" stop-opacity=".30"/></linearGradient>
<linearGradient id="{p}a" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{VERDE2}" stop-opacity=".82"/><stop offset=".55" stop-color="{VERDE}" stop-opacity=".92"/>
 <stop offset="1" stop-color="#0c3326" stop-opacity=".98"/></linearGradient>
<linearGradient id="{p}t" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0" stop-color="{AZUL}"/><stop offset=".5" stop-color="{AZUL2}"/><stop offset="1" stop-color="{AZUL}"/></linearGradient>
<linearGradient id="{p}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="{p}m" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="{ESPUMA}" stroke-opacity=".05"/></pattern>
<filter id="{p}g" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="7"/></filter>
'''
    b = []
    if estado == "activo":
        b.append(f'<path d="{cuerpo}" fill="none" stroke="{ORO2}" stroke-opacity=".7" stroke-width="10" filter="url(#{p}g)"/>')
    b.append(f'<path d="{cuerpo}" fill="url(#{p}v)"/>')
    b.append(f'<g clip-path="url(#{p}c)">')
    b.append(f'<rect width="{w}" height="{h}" fill="url(#{p}m)"/>')
    # agua
    if nivel:
        ytop = h - 16 - (h - 16 - (30 if grande else 18)) * nivel
        d, crest = agua_cuerpo(p, 0, w, ytop, h, 1.3, amp=10 if grande else 4, per=330 if grande else 160)
        d2, crest2 = agua_cuerpo(p, 0, w, ytop + (14 if grande else 6), h, 3.0, amp=8 if grande else 3, per=250 if grande else 120)
        b.append(f'<path d="{d}" fill="url(#{p}a)"/>')
        b.append(f'<path d="{d2}" fill="{AZUL}" fill-opacity=".16"/>')
        b.append(f'<path d="{crest}" fill="none" stroke="{ESPUMA}" stroke-opacity=".7" stroke-width="2.2"/>')
        b.append(f'<path d="{crest2}" fill="none" stroke="{ORO2}" stroke-opacity=".38" stroke-width="1.4"/>')
        rnd = random.Random(7)
        for _ in range(14 if grande else 6):
            x = rnd.uniform(40, w - 40); y = rnd.uniform(ytop + 30, h - 30); r = rnd.choice([3, 4, 6, 8])
            b.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="none" stroke="{ESPUMA}" stroke-opacity=".38" stroke-width="1.4"/>')
    else:
        # sedimento: la pecera espera
        b.append(f'<rect x="0" y="{h*0.78 if grande else h*0.62}" width="{w}" height="{h*0.22 if grande else h*0.38}" fill="{VERDE}" fill-opacity=".14"/>')
    # reflejos del vidrio
    if grande:
        b.append(f'<rect x="{w*0.06}" y="46" width="14" height="{h*0.62}" rx="7" fill="#fff" fill-opacity=".07"/>')
        b.append(f'<rect x="{w*0.06+26}" y="46" width="5" height="{h*0.4}" rx="2.5" fill="#fff" fill-opacity=".05"/>')
        b.append(f'<rect x="{w*0.69}" y="22" width="{w*0.21}" height="14" rx="7" fill="url(#{p}r)"/>')
    else:
        b.append(f'<rect x="{w*0.69}" y="8" width="{w*0.16}" height="8" rx="4" fill="url(#{p}r)"/>')
    b.append('</g>')
    # escala graduada (tipo probeta) en el borde izquierdo y derecho
    if grande:
        marcas = []
        y0, y1 = 70, h - 60
        for i in range(0, 21):
            y = y1 - (y1 - y0) * i / 20
            ln = 20 if i % 5 == 0 else 10
            marcas.append(f"M12 {f(y)}h{ln}M{w-12} {f(y)}h-{ln}")
        b.append(f'<path d="{"".join(marcas)}" stroke="{ESPUMA}" stroke-opacity=".42" stroke-width="1.8" fill="none"/>')
    else:
        b.append(f'<path d="M12 36h10M12 50h6M12 64h10M12 78h6M12 92h10M{w-12} 36h-10M{w-12} 50h-6M{w-12} 64h-10M{w-12} 78h-6M{w-12} 92h-10" stroke="{ESPUMA}" stroke-opacity=".38" stroke-width="1.6" fill="none"/>')
    # blanco objetivo (suelta aquí)
    if estado in ("vacio", "activo"):
        col = ORO2 if estado == "activo" else ESPUMA
        op = .85 if estado == "activo" else .42
        if grande:
            cx, cy = w / 2, h * 0.56
            b.append(f'<g fill="none" stroke="{col}" stroke-opacity="{op}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'
                     f'<circle cx="{cx}" cy="{cy}" r="64" stroke-dasharray="3 13"/><circle cx="{cx}" cy="{cy}" r="38" stroke-opacity="{op*.6}"/>'
                     f'<path d="M{cx} {cy-14}V{cy+14}M{cx-12} {cy+4}L{cx} {cy+16}L{cx+12} {cy+4}"/></g>')
        else:
            cx, cy = w - 54, h / 2
            b.append(f'<g fill="none" stroke="{col}" stroke-opacity="{op}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
                     f'<circle cx="{cx}" cy="{cy}" r="22" stroke-dasharray="2 8"/>'
                     f'<path d="M{cx} {cy-8}V{cy+8}M{cx-7} {cy+2}L{cx} {cy+9}L{cx+7} {cy+2}"/></g>')
    # marco de vidrio
    ec = ORO if dorado else ESPUMA
    b.append(f'<path d="{cuerpo}" fill="none" stroke="{ec}" stroke-opacity="{1 if estado=="lleno" else (1 if estado=="activo" else .55)}" stroke-width="{4 if estado=="activo" else 2.6}"/>')
    b.append(f'<path d="{rr_dif(ins+7, ins+7, w-2*ins-14, h-2*ins-14, rt-6, rb-6)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>')
    if grande:
        # tapa superior y zócalo (metal azul con filetes dorados)
        b.append(f'<g clip-path="url(#{p}c)"><rect x="0" y="0" width="{w}" height="16" fill="url(#{p}t)"/>'
                 f'<rect x="0" y="16" width="{w}" height="2.5" fill="{ORO}" fill-opacity=".8"/>'
                 f'<rect x="0" y="{h-14}" width="{w}" height="14" fill="url(#{p}t)"/>'
                 f'<rect x="0" y="{h-16.5}" width="{w}" height="2.5" fill="{ORO}" fill-opacity=".8"/></g>')
        for x in (46, w - 46):
            b.append(f'<circle cx="{x}" cy="8" r="3.4" fill="{ORO2}"/><circle cx="{x}" cy="{h-7}" r="3.4" fill="{ORO2}"/>')
    if estado == "activo":
        b.append(f'<g fill="none" stroke="{ORO2}" stroke-width="5" stroke-linecap="round">'
                 f'<path d="M{rt+4} 28H{rt+44}M8 {rt+6}V{rt+46}"/><path d="M{w-rt-4} 28H{w-rt-44}M{w-8} {rt+6}V{rt+46}"/>'
                 f'<path d="M{rb+4} {h-28}H{rb+44}M8 {h-rb-6}V{h-rb-46}"/><path d="M{w-rb-4} {h-28}H{w-rb-44}M{w-8} {h-rb-6}V{h-rb-46}"/></g>')
    if estado == "lleno":
        cx, cy, r = (w - 58, 62, 22) if grande else (w - 44, h / 2, 17)
        defs += GRAD_ORO.format(p=p)
        b.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{p}oro)" stroke="{ORO_OSCURO}" stroke-width="1.5"/>'
                 f'<path d="M{cx-r*.42} {cy+r*.02}L{cx-r*.1} {cy+r*.36}L{cx+r*.46} {cy-r*.34}" fill="none" stroke="{ABISMO}" stroke-width="{r*.19}" stroke-linecap="round" stroke-linejoin="round"/>')
    return svg(w, h, "".join(b), defs, f"Tanque ({estado})")

def tanque_agua():
    """Capa de agua independiente: se desplaza en Y para mostrar el progreso."""
    w, h = 1000, 591
    p = "ag"
    pts = ola(26, 10, 330, 1.3, x0=-20, x1=w + 20, step=25, amp2=4, per2=.5, fase2=2.2)
    d = catmull(pts) + f"L{w+20} {h}L-20 {h}Z"
    defs = f'''<linearGradient id="{p}a" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="{VERDE2}" stop-opacity=".82"/><stop offset=".55" stop-color="{VERDE}" stop-opacity=".92"/>
 <stop offset="1" stop-color="#0c3326" stop-opacity=".98"/></linearGradient>'''
    rnd = random.Random(11)
    burb = "".join(f'<circle cx="{f(rnd.uniform(40,960))}" cy="{f(rnd.uniform(70,560))}" r="{rnd.choice([3,4,6,8])}" fill="none" stroke="{ESPUMA}" stroke-opacity=".36" stroke-width="1.4"/>' for _ in range(16))
    body = (f'<path d="{d}" fill="url(#{p}a)"/><path d="{catmull(pts)}" fill="none" stroke="{ESPUMA}" stroke-opacity=".7" stroke-width="2.2"/>'
            f'<path d="{catmull(ola(40, 8, 250, 3.0, x0=-20, x1=w+20, step=25))}" fill="none" stroke="{ORO2}" stroke-opacity=".38" stroke-width="1.4"/>{burb}')
    return svg(w, h, body, defs, "Agua del tanque (capa)")

# ====================================================================== NODOS
def nodo(activo):
    """220x76: píldora 200x56 con 10 px de margen para sombra/halo. Rebanado 9: 38 px."""
    p = "nd"
    W, H = 220, 76
    defs = f'''
<linearGradient id="{p}f" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="{PAPEL}"/><stop offset="1" stop-color="{ESPUMA}"/></linearGradient>
<linearGradient id="{p}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="{p}s" x="-10%" y="-20%" width="120%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
<clipPath id="{p}c"><rect x="10" y="10" width="200" height="56" rx="28"/></clipPath>
'''
    b = []
    if activo:
        b.append(f'<rect x="10" y="10" width="200" height="56" rx="28" fill="none" stroke="{ORO2}" stroke-width="9" stroke-opacity=".75" filter="url(#{p}s)"/>')
    else:
        b.append(f'<rect x="12" y="15" width="196" height="54" rx="27" fill="#000" fill-opacity=".34" filter="url(#{p}s)"/>')
    b.append(f'<rect x="10" y="10" width="200" height="56" rx="28" fill="url(#{p}f)"/>')
    b.append(f'<g clip-path="url(#{p}c)"><rect x="10" y="10" width="200" height="26" fill="url(#{p}b)"/>'
             f'<path d="M10 52Q60 44 110 52T210 50V66H10Z" fill="{VERDE2}" fill-opacity="{.20 if activo else .12}"/></g>')
    b.append(f'<rect x="15" y="15" width="190" height="46" rx="23" fill="none" stroke="{AZUL}" stroke-opacity=".14" stroke-width="1"/>')
    b.append(f'<rect x="10" y="10" width="200" height="56" rx="28" fill="none" stroke="{ORO2 if activo else ORO}" stroke-opacity="{1 if activo else .5}" stroke-width="{3.5 if activo else 1.6}"/>')
    b.append('<ellipse cx="38" cy="19" rx="11" ry="3.6" fill="#fff" fill-opacity=".9"/>')
    return svg(W, H, "".join(b), defs, "Nodo " + ("activo" if activo else "inactivo"))

def nodo_burbujas():
    b = (f'<g fill="{ESPUMA}" fill-opacity=".14" stroke="{ESPUMA}" stroke-opacity=".55" stroke-width="1.6">'
         '<circle cx="14" cy="12" r="9"/><circle cx="34" cy="26" r="5.5"/><circle cx="46" cy="10" r="3.5"/></g>'
         '<g fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"><path d="M9 9A6 6 0 0 1 14 6"/><path d="M31 24A3 3 0 0 1 33 22"/></g>')
    return svg(52, 38, b, "", "Burbujas decorativas del nodo")

# ====================================================================== LLAVES
def llave(n, bloqueada=False):
    """n = 1..4. Viewbox 96x96. Misma silueta base; cambian el arco (motivo), los dientes y la gema."""
    p = f"k{n}{'b' if bloqueada else ''}"
    motivos = {1: ("Pertinencia", VERDE2), 2: ("Estructura", "#2F7FD0"), 3: ("Validación Científica", PAPEL), 4: ("Definitiva de Publicación", ORO_CLARO)}
    nombre, gema = motivos[n]
    defs = GRAD_ORO.format(p=p) + f'<radialGradient id="{p}g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="{gema}"/><stop offset="1" stop-color="{AZUL}" stop-opacity=".9"/></radialGradient>'
    oro = f"url(#{p}oro)"
    ink = ORO_OSCURO
    if bloqueada:
        fill_, stroke_ = "#27597f", f'stroke="#9fc0d0" stroke-width="1.6" stroke-linejoin="round"'
    else:
        fill_, stroke_ = oro, f'stroke="{ink}" stroke-width="1.6" stroke-linejoin="round"'
    # horizontal: arco a la izquierda (cx=22,cy=48), caña hasta x=82
    vastago = f'<rect x="38" y="44" width="46" height="8" rx="3.2" fill="{fill_}" {stroke_}/>'
    collar = f'<rect x="40" y="41" width="6" height="14" rx="2" fill="{fill_}" {stroke_}/><rect x="52" y="42" width="4" height="12" rx="2" fill="{fill_}" {stroke_}/>'
    dientes = {
        1: "M66 52h6v8h-6zM76 52h8v12h-8z",
        2: "M62 52h6v7h-6zM70 52h6v12h-6zM78 52h6v7h-6z",
        3: "M64 52h5v10h5v-6h4v10h6V52z",
        4: "M60 52h5v7h-5zM68 52h5v13h-5zM76 52h8v9h-8z",
    }[n]
    diente = f'<path d="{dientes}" fill="{fill_}" {stroke_}/>'
    def aro(tag, w):
        """Anillo dorado (o silueta plana si está bloqueada)."""
        if bloqueada:
            return tag.format(c="#9fc0d0", w=w + 3) + tag.format(c="#27597f", w=w)
        return tag.format(c=oro, w=w)
    if n == 1:   # arco circular con hoja
        arco = (aro('<circle cx="22" cy="48" r="17" fill="none" stroke="{c}" stroke-width="{w}"/>', 7) +
                (f'<circle cx="22" cy="48" r="20.6" fill="none" stroke="{ink}" stroke-width="1.2"/>'
                 f'<circle cx="22" cy="48" r="13.4" fill="none" stroke="{ink}" stroke-width="1.2"/>' if not bloqueada else ''))
        motivo = (f'<path d="M14 54C14 42 22 36 32 36C32 46 26 54 14 54Z" fill="{gema if not bloqueada else "none"}" stroke="{ESPUMA if bloqueada else AZUL}" stroke-opacity="{.55 if bloqueada else 1}" stroke-width="1.4"/>'
                  f'<path d="M14 54L26 42" stroke="{ESPUMA if bloqueada else ESPUMA}" stroke-opacity="{.5 if bloqueada else .9}" stroke-width="1.4" stroke-linecap="round"/>')
    elif n == 2:  # arco cuadrado con retícula 2x2 (IMRyD)
        arco = (aro('<rect x="4" y="30" width="36" height="36" rx="9" fill="none" stroke="{c}" stroke-width="{w}"/>', 7) +
                (f'<rect x="1.6" y="27.6" width="40.8" height="40.8" rx="11" fill="none" stroke="{ink}" stroke-width="1.2"/>' if not bloqueada else ''))
        c = gema if not bloqueada else "none"
        s = f'stroke="{ESPUMA if bloqueada else AZUL}" stroke-opacity="{.55 if bloqueada else 1}" stroke-width="1.2"'
        motivo = (f'<rect x="12" y="38" width="9" height="9" rx="2" fill="{c}" {s}/><rect x="23" y="38" width="9" height="9" rx="2" fill="{c}" {s}/>'
                  f'<rect x="12" y="49" width="9" height="9" rx="2" fill="{c}" {s}/><rect x="23" y="49" width="9" height="9" rx="2" fill="{c}" {s}/>')
    elif n == 3:  # dos círculos entrelazados (pares) y verificación
        arco = (aro('<circle cx="15" cy="48" r="14" fill="none" stroke="{c}" stroke-width="{w}"/>', 6) +
                aro('<circle cx="29" cy="48" r="14" fill="none" stroke="{c}" stroke-width="{w}"/>', 6))
        motivo = (f'<g transform="rotate(-45 22 48)"><path d="M14 49L20 55L31 41" fill="none" stroke="{ink if not bloqueada else ESPUMA}" stroke-opacity="{1 if not bloqueada else .55}" stroke-width="7.4" stroke-linecap="round" stroke-linejoin="round"/>'
                  f'<path d="M14 49L20 55L31 41" fill="none" stroke="{gema if not bloqueada else ESPUMA}" stroke-opacity="{1 if not bloqueada else .55}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></g>')
    else:         # roseta de 8 puntas con gema central (definitiva)
        pts = []
        for i in range(16):
            r = 21 if i % 2 == 0 else 14
            a = math.radians(i * 22.5 - 90)
            pts.append(f"{f(22 + r*math.cos(a))},{f(48 + r*math.sin(a))}")
        arco = (f'<polygon points="{" ".join(pts)}" fill="{fill_}" {stroke_}/>'
                f'<circle cx="22" cy="48" r="9" fill="none" stroke="{ink if not bloqueada else ESPUMA}" stroke-opacity="{1 if not bloqueada else .5}" stroke-width="1.4"/>')
        motivo = (f'<circle cx="22" cy="48" r="7" fill="{"url(#"+p+"g)" if not bloqueada else "none"}" stroke="{ESPUMA if bloqueada else AZUL}" stroke-opacity="{.5 if bloqueada else 1}" stroke-width="1.4"/>')
    cuerpo = f'<g id="llave-{n}" transform="rotate(45 48 48)">{vastago}{collar}{diente}{arco}{motivo}'
    if n == 4 and not bloqueada:
        cuerpo += f'<circle cx="22" cy="48" r="2.4" fill="#fff"/>'
    cuerpo += '</g>'
    if not bloqueada:
        cuerpo += f'<g transform="rotate(45 48 48)"><ellipse cx="62" cy="46.2" rx="14" ry="1.2" fill="#fff" fill-opacity=".55"/></g>'
    if bloqueada:
        # candado pequeño abajo a la izquierda
        cuerpo += (f'<g transform="translate(6 70)"><path d="M5 9V6a5 5 0 0 1 10 0v3" fill="none" stroke="{ESPUMA}" stroke-opacity=".8" stroke-width="2.2"/>'
                   f'<rect x="2" y="9" width="16" height="12" rx="3" fill="{ABISMO}" stroke="{ESPUMA}" stroke-opacity=".8" stroke-width="1.8"/>'
                   f'<circle cx="10" cy="15" r="2" fill="{ESPUMA}" fill-opacity=".8"/></g>')
    return svg(96, 96, cuerpo, defs, f"Llave {n}: {nombre}" + (" (bloqueada)" if bloqueada else ""))

# ====================================================================== INSIGNIA
def insignia(con_cinta=True):
    """Sello 400x400 (+ cinta: 400x480). Sin texto; el nombre [POR DEFINIR] se pondrá en la cinta por código."""
    p = "in"
    W, H = 400, (480 if con_cinta else 400)
    cx, cy = 200, 196
    defs = GRAD_ORO.format(p=p) + f'''
<radialGradient id="{p}d" cx=".5" cy=".38" r=".75"><stop offset="0" stop-color="{AZUL2}"/><stop offset=".6" stop-color="{AZUL}"/><stop offset="1" stop-color="{ABISMO}"/></radialGradient>
<linearGradient id="{p}c1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{AZUL2}"/><stop offset="1" stop-color="{AZUL}"/></linearGradient>
<linearGradient id="{p}c2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{VERDE2}"/><stop offset="1" stop-color="{VERDE}"/></linearGradient>
<clipPath id="{p}k"><circle cx="{cx}" cy="{cy}" r="116"/></clipPath>
<linearGradient id="{p}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="{p}gm"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="{ESPUMA}"/><stop offset="1" stop-color="{VERDE2}"/></radialGradient>
'''
    b = []
    if con_cinta:
        # colas de la cinta
        b.append(f'<g stroke="{ORO_OSCURO}" stroke-width="1.5" stroke-linejoin="round">'
                 f'<path d="M118 330L84 460L132 438L160 470L190 340Z" fill="url(#{p}c1)"/>'
                 f'<path d="M282 330L316 460L268 438L240 470L210 340Z" fill="url(#{p}c2)"/></g>'
                 f'<path d="M127 354L103 436M273 354L297 436" stroke="{ORO2}" stroke-width="2" stroke-dasharray="4 5" stroke-opacity=".8"/>')
    # escalopa exterior (24 festones)
    fest = []
    for i in range(24):
        a = math.radians(i * 15)
        fest.append(f'<circle cx="{f(cx+170*math.cos(a))}" cy="{f(cy+170*math.sin(a))}" r="17"/>')
    b.append(f'<g fill="url(#{p}oro)" stroke="{ORO_OSCURO}" stroke-width="1.5"><circle cx="{cx}" cy="{cy}" r="170"/>{"".join(fest)}</g>')
    b.append(f'<circle cx="{cx}" cy="{cy}" r="170" fill="url(#{p}oro)"/>')
    # anillo con marcas de meridiano
    marcas = "".join(f"M{f(cx+142*math.cos(math.radians(i*6)))} {f(cy+142*math.sin(math.radians(i*6)))}L{f(cx+(150 if i%5==0 else 147)*math.cos(math.radians(i*6)))} {f(cy+(150 if i%5==0 else 147)*math.sin(math.radians(i*6)))}" for i in range(60))
    b.append(f'<circle cx="{cx}" cy="{cy}" r="156" fill="none" stroke="{ORO_OSCURO}" stroke-width="1.4" stroke-opacity=".8"/>'
             f'<circle cx="{cx}" cy="{cy}" r="136" fill="{AZUL}"/><path d="{marcas}" stroke="{ORO_CLARO}" stroke-width="1.6" stroke-opacity=".9"/>')
    b.append(f'<circle cx="{cx}" cy="{cy}" r="124" fill="url(#{p}oro)"/><circle cx="{cx}" cy="{cy}" r="118" fill="url(#{p}d)"/>')
    # disco interior: mar en bandas + retícula
    b.append(f'<g clip-path="url(#{p}k)">')
    b.append(f'<path d="{"M60 70H340M60 118H340M60 166H340M60 214H340M60 262H340"}" stroke="{ESPUMA}" stroke-opacity=".06"/><path d="M104 70V330M152 70V330M200 70V330M248 70V330M296 70V330" stroke="{ESPUMA}" stroke-opacity=".06"/>')
    for i, (y0, g, op) in enumerate([(236, VERDE2, .32), (262, VERDE, .55), (290, "#0c3326", .8)]):
        pts = ola(y0, 9, 150, i * 1.7, x0=60, x1=340, step=25)
        b.append(f'<path d="{banda(pts, 330)}" fill="{g}" fill-opacity="{op}"/><path d="{catmull(pts)}" fill="none" stroke="{ESPUMA}" stroke-opacity=".35" stroke-width="1.4"/>')
    b.append(f'<ellipse cx="{cx-30}" cy="{cy-82}" rx="76" ry="26" fill="url(#{p}h)" transform="rotate(-18 {cx-30} {cy-82})"/>')
    b.append('</g>')
    # libro abierto
    b.append(f'<g stroke="{AZUL}" stroke-width="1.6" stroke-linejoin="round">'
             f'<path d="M200 252C176 238 144 236 118 244V190C144 182 176 184 200 198Z" fill="{PAPEL}"/>'
             f'<path d="M200 252C224 238 256 236 282 244V190C256 182 224 184 200 198Z" fill="{ESPUMA}"/></g>'
             f'<path d="M200 198V252" stroke="{AZUL}" stroke-width="2"/>'
             f'<path d="M128 204C148 199 170 201 190 211M128 216C148 211 170 213 190 223M128 228C148 223 170 225 190 235M272 204C252 199 230 201 210 211M272 216C252 211 230 213 210 223M272 228C252 223 230 225 210 235" fill="none" stroke="{AZUL}" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>')
    b.append(f'<path d="M112 250C142 238 172 242 200 258C228 242 258 238 288 250" fill="none" stroke="{ORO2}" stroke-width="3" stroke-linecap="round"/>')
    # brote: tallo + hojas (verde y espuma)
    b.append(f'<path d="M200 198C200 176 200 160 200 140" stroke="{ESPUMA}" stroke-width="5" stroke-linecap="round" fill="none"/>')
    hoja = lambda tx, ty, ang, s, col: (f'<path d="M0 0C{14*s} {-10*s} {20*s} {-32*s} 0 {-52*s}C{-20*s} {-32*s} {-14*s} {-10*s} 0 0Z" transform="translate({tx} {ty}) rotate({ang})" fill="{col}" stroke="{AZUL}" stroke-width="1.4" stroke-linejoin="round"/>')
    b.append(hoja(200, 172, -52, 1.0, VERDE2) + hoja(200, 172, 52, 1.0, ESPUMA) + hoja(200, 152, -22, .85, ESPUMA) + hoja(200, 152, 22, .85, VERDE2) + hoja(200, 142, 0, .95, ORO2))
    b.append(f'<path d="M200 146V112" stroke="{AZUL}" stroke-opacity="0" />')
    # cuatro gemas = las cuatro llaves (N, E, S, O)
    for ang, col in [(-90, VERDE2), (0, "#2F7FD0"), (90, ORO_CLARO), (180, PAPEL)]:
        x = cx + 124 * math.cos(math.radians(ang)); y = cy + 124 * math.sin(math.radians(ang))
        b.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="12" fill="url(#{p}oro)" stroke="{ORO_OSCURO}" stroke-width="1.4"/>'
                 f'<circle cx="{f(x)}" cy="{f(y)}" r="7" fill="{col}" stroke="{AZUL}" stroke-width="1.2"/><circle cx="{f(x-2)}" cy="{f(y-2.4)}" r="2" fill="#fff" fill-opacity=".9"/>')
    # estrellitas
    for ang in (-45, 45, 135, 225):
        x = cx + 98 * math.cos(math.radians(ang)); y = cy + 98 * math.sin(math.radians(ang))
        b.append(f'<path d="M{f(x)} {f(y-8)}L{f(x+2.4)} {f(y-2.4)}L{f(x+8)} {f(y)}L{f(x+2.4)} {f(y+2.4)}L{f(x)} {f(y+8)}L{f(x-2.4)} {f(y+2.4)}L{f(x-8)} {f(y)}L{f(x-2.4)} {f(y-2.4)}Z" fill="{ORO_CLARO}" fill-opacity=".9"/>')
    if con_cinta:
        # cinta frontal (espacio para el nombre [POR DEFINIR], sin texto)
        b.append(f'<g stroke="{ORO_OSCURO}" stroke-width="1.6" stroke-linejoin="round"><path d="M70 344Q200 372 330 344V398Q200 426 70 398Z" fill="{AZUL}"/></g>'
                 f'<path d="M78 351Q200 377 322 351M78 391Q200 417 322 391" fill="none" stroke="{ORO2}" stroke-width="2" stroke-opacity=".9"/>'
                 f'<path d="M70 344L44 371L70 398M330 344L356 371L330 398" fill="{VERDE}" stroke="{ORO_OSCURO}" stroke-width="1.6" stroke-linejoin="round"/>')
    return svg(W, H, "".join(b), defs, "Insignia (nombre [POR DEFINIR])")

if __name__ == "__main__":
    guardar("fondo_mar.svg", fondo_mar())
    for est in ("vacio", "activo", "lleno"):
        guardar(f"tanque_{est}.svg", tanque(1000, 591, est, True))
        guardar(f"tanque_compartimento_{est}.svg", tanque(488, 136, est, False))
    guardar("tanque_agua.svg", tanque_agua())
    guardar("nodo_inactivo.svg", nodo(False))
    guardar("nodo_activo.svg", nodo(True))
    guardar("nodo_burbujas.svg", nodo_burbujas())
    nombres = {1: "pertinencia", 2: "estructura", 3: "validacion", 4: "definitiva"}
    for n, nom in nombres.items():
        guardar(f"llave_{n}_{nom}.svg", llave(n))
        guardar(f"llave_{n}_{nom}_bloqueada.svg", llave(n, True))
    guardar("insignia.svg", insignia(True))
    guardar("insignia_sello.svg", insignia(False))

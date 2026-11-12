#!/usr/bin/env python3
"""Mock del Mar de ideas.
1) git archive de la rama imagen-institucional -> /tmp/jmock2 (no cambia de rama ni toca el repo)
2) aplica la sección 10 (imagen institucional) en el mock, porque la rama aún no la trae
3) guarda esa base en /tmp/jmock2_base y aplica el prototipo del mar de ideas
4) escribe integracion_mar_ideas.patch (diff base -> mock). Uso: python3 montar_mock_mar.py"""
import subprocess, shutil, re, difflib
from pathlib import Path
AQUI = Path(__file__).resolve().parent; A = AQUI.parents[1]; REPO = A.parents[1]
M = Path("/tmp/jmock2"); B = Path("/tmp/jmock2_base")
shutil.rmtree(M, ignore_errors=True); M.mkdir()
subprocess.run(f"git -C {REPO} archive imagen-institucional | tar -x -C {M}", shell=True, check=True)
shutil.copytree(A / "logos", M / "assets" / "logos", dirs_exist_ok=True)
def sust(path, viejo, nuevo, regex=False):
    t = path.read_text()
    if regex:
        t2, n = re.subn(viejo, nuevo, t, flags=re.S); assert n, (path, viejo[:50]); t = t2
    else:
        assert viejo in t, (path, viejo[:70]); t = t.replace(viejo, nuevo)
    path.write_text(t)
J, X, S = M / "js/juego.js", M / "index.html", M / "css/juego.css"
# ---- sección 10 (imagen institucional)
if 'logo_banner_blanco.png" width="2890"' in X.read_text():
    sust(X, '        <img src="assets/logos/logo_banner_blanco.png" width="2890" height="590" alt="Universidad Autónoma de San Luis Potosí y Agenda Ambiental">\n',
     '''        <img class="logo-uaslp" src="assets/logos/logo_uaslp_blanco.svg" width="192" height="74" alt="Universidad Autónoma de San Luis Potosí">
        <img class="logo-aa" src="assets/logos/logo_aa_blanco.svg" width="300" height="127" alt="Agenda Ambiental UASLP">
''')
    sust(S, '''.barra img {
  height: 110px;
  width: auto;
  max-width: 980px;
}''', '''.barra { justify-content: space-between; padding: 0 40px; }
.barra img {
  height: 100px;
  width: auto;
  max-width: none;
}''')
    sust(J, '  const logo = new Image();\n  logo.src = "assets/logos/logo_banner_blanco.png";\n',
     '  const logoU = new Image();\n  logoU.src = "assets/logos/hd/logo_uaslp_blanco.png";\n  const logoA = new Image();\n  logoA.src = "assets/logos/hd/logo_aa_blanco.png";\n')
    sust(J, '    new Promise((res, rej) => { logo.onload = res; logo.onerror = rej; }),\n',
     '    new Promise((res, rej) => { logoU.onload = res; logoU.onerror = rej; }),\n    new Promise((res, rej) => { logoA.onload = res; logoA.onerror = rej; }),\n')
    sust(J, '''  const logoH = 130;
  const logoW = logoH * (2890 / 590);
  ctx.drawImage(logo, (W - logoW) / 2, 40, logoW, logoH);
''', '''  const logoH = 112;
  const wU = logoH * (logoU.width / logoU.height);
  const wA = logoH * (logoA.width / logoA.height);
  ctx.drawImage(logoU, 56, (210 - logoH) / 2, wU, logoH);
  ctx.drawImage(logoA, W - 56 - wA, (210 - logoH) / 2, wA, logoH);
''')
shutil.rmtree(B, ignore_errors=True); shutil.copytree(M, B)

# ---- prototipo mar de ideas
shutil.copy(AQUI / "mar_ideas.js", M / "js/mar_ideas.js"); shutil.copy(AQUI / "mar_ideas.css", M / "css/mar_ideas.css")
sust(X, r'(  <link rel="stylesheet" href="css/juego\.css[^"]*">\n)', r'\1  <link rel="stylesheet" href="css/mar_ideas.css">\n', regex=True)
sust(X, r'(  <script src="js/juego\.js[^"]*"></script>\n)', r'  <script src="js/mar_ideas.js"></script>\n\1', regex=True)
sust(J, "let arrastre = null;\n", "")
sust(J, "let raf = 0;\n", "")
sust(J, "  cancelAnimationFrame(raf);\n  nodosVivos.length = 0;\n  estado.elegido = null;\n  arrastre = null;\n", "  MarIdeas.detener();\n  nodosVivos.length = 0;\n  estado.elegido = null;\n")
sust(J, r"  const layout = distribuirNodos\(nodos, mar\);.*?  acomodarNodos\(foto\);\n", '''  nodos.forEach((n) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "nodo";
    el.id = n.id;
    el.textContent = n.texto;
    el.style.width = "max-content";
    mar.appendChild(el);
    nodosVivos.push({ data: n, el });
  });
  MarIdeas.montar({
    mar, vivos: nodosVivos, lienzo, ANCHO, foto, puntoLocal,
    resaltar: resaltarTanques,
    destinoEn: tanqueBajoPunto,
    soltar: intentarSoltar,
    alAgarrar: () => {
      estado.elegido = null;
      document.querySelectorAll(".nodo.elegido").forEach((x) => x.classList.remove("elegido"));
    },
    alSeleccionar: (vivo) => {
      document.querySelectorAll(".nodo.elegido").forEach((x) => x.classList.remove("elegido"));
      vivo.el.classList.add("elegido");
      estado.elegido = vivo;
      mostrarToast("Toca el tanque para colocar esta idea.");
    }
  });
''', regex=True)
sust(J, "      if (estado.elegido && !arrastre) {", "      if (estado.elegido && !MarIdeas.arrastrando()) {")
sust(J, "  revisarMeta();\n  if (!foto) raf = requestAnimationFrame(animar);\n  else congelarFoto();\n}", "  revisarMeta();\n}")
sust(J, r"function columnasPara\(.*?(?=function resaltarTanques)", "", regex=True)
sust(J, '''    mostrarToast(n.error || "Esa idea no corresponde a este compartimento.", true);
    return;
  }''', '''    mostrarToast(n.error || "Esa idea no corresponde a este compartimento.", true);
    return false;
  }''')
sust(J, '''    mostrarToast("Ese compartimento ya está ocupado.", true);
    return;''', '''    mostrarToast("Ese compartimento ya está ocupado.", true);
    return false;''')
sust(J, '  vivo.el.classList.add("colocado");\n  const idx = nodosVivos.indexOf(vivo);', '  MarIdeas.absorber(vivo, tanqueId);\n  const idx = nodosVivos.indexOf(vivo);')
sust(J, '''  mostrarToast(n.ok || "Bien. La pieza encaja.");
  revisarMeta();
}''', '''  mostrarToast(n.ok || "Bien. La pieza encaja.");
  revisarMeta();
  return true;
}''')
# demo (solo mock): ?ideas=N agrega ideas señuelo a la sala 1
(M / "js/demo_ideas.js").write_text('''(() => {
  const n = Number(new URLSearchParams(location.search).get("ideas"));
  if (!n) return;
  const base = SALAS[0], orig = base.nodos.slice();
  while (base.nodos.length < n) {
    const o = orig[base.nodos.length % orig.length];
    base.nodos.push({ ...o, id: "x" + base.nodos.length, valido: false, error: "Idea de demostración." });
  }
})();
''')
# parche
out = []
for rel in ["index.html", "css/juego.css", "js/juego.js"]:
    a = (B / rel).read_text().splitlines(True); b = (M / rel).read_text().splitlines(True)
    out += list(difflib.unified_diff(a, b, f"a/{rel}", f"b/{rel}"))
(AQUI / "integracion_mar_ideas.patch").write_text("".join(out))
print("mock en", M, "| parche:", len(out), "líneas")
# el script de demostración se agrega DESPUÉS del parche (no forma parte de la integración)
t = (M / "index.html").read_text()
(M / "index.html").write_text(re.sub(r'(  <script src="js/juego\.js[^"]*"></script>\n)', r'\1  <script src="js/demo_ideas.js"></script>\n', t))

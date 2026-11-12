/* Peces del tanque (Sala 1). Cada concepto es un pez pequeño que nada despacio, con su palabra sobre el cuerpo.
   Se arrastran con el dedo hacia la barra del título (sobre #capa-arrastre, con estela de burbujas como en el
   Mar de Ideas). Un toque lo añade al final de la barra; una pulsación larga lo parte en palabras.
   Coordenadas internas: px del lienzo (1080 de ancho) con origen en la esquina superior izquierda del tanque.
   Un solo bucle requestAnimationFrame; solo se mueven transform y opacity. Script clásico: window.Peces. */
const Peces = (() => {
  "use strict";
  const COLOR = {
    que: { b: "#2F9C84", g: "pg-q" }, quien: { b: "#C59B27", g: "pg-qu" },
    donde: { b: "#3E8FD0", g: "pg-d" }, cuando: { b: "#D36B71", g: "pg-c" }, n: { b: "#7FA494", g: "pg-n" }
  };
  const FONT_MIN = 34;        // 34 px de lienzo ≈ 12,3 px en pantalla con el lienzo a 390 px de ancho
  const SUPERFICIE = 70;      // los peces no suben por encima de esta altura (etiquetas, ondas)
  const ARENA = 60;           // franja de arena en el fondo
  let C = null, lista = [], ocultos = [], raf = 0, ultimo = 0, reloj = 0, arr = null, capa = null, rndSeed = 7;
  const pool = [];
  const reducido = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function rnd() { rndSeed |= 0; rndSeed = (rndSeed + 0x6D2B79F5) | 0; let t = Math.imul(rndSeed ^ (rndSeed >>> 15), 1 | rndSeed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
  const norm = (s) => String(s || "").normalize("NFD").replace(/\p{M}/gu, "").trim().replace(/\s+/g, " ").toLowerCase();

  // ------------------------------------------------------------------ definiciones SVG compartidas (degradados)
  function asegurarDefs() {
    if (document.getElementById("peces-defs")) return;
    const def = (id, a) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="#ffffff" stop-opacity=".94"/></linearGradient>`;
    const s = document.createElement("div");
    s.id = "peces-defs";
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    s.innerHTML = `<svg width="0" height="0"><defs>${def("pg-q", "#BDE8DC")}${def("pg-qu", "#F6DE98")}${def("pg-d", "#B8DAF6")}${def("pg-c", "#F4C4C1")}${def("pg-n", "#D8E8DF")}</defs></svg>`;
    document.body.appendChild(s);
  }

  // ------------------------------------------------------------------ medidas
  let ctxMedida = null;
  function anchoTexto(t, f) {
    if (!ctxMedida) ctxMedida = document.createElement("canvas").getContext("2d");
    ctxMedida.font = "650 " + f + 'px Montserrat, "Segoe UI", system-ui, sans-serif';
    return ctxMedida.measureText(t).width;
  }
  function medir(texto, personas, compacto) {
    const font = personas >= 5 ? 36 : personas >= 3 ? 35 : FONT_MIN;
    let lineas = [texto], tw = Math.ceil(anchoTexto(texto, font));
    if (texto.includes(" ") && tw > (compacto ? 190 : 250)) {
      const w = texto.split(" ");
      let mejor = null;
      for (let i = 1; i < w.length; i++) {
        const l1 = w.slice(0, i).join(" "), l2 = w.slice(i).join(" ");
        const m = Math.max(anchoTexto(l1, font), anchoTexto(l2, font));
        if (!mejor || m < mejor.m) mejor = { l: [l1, l2], m };
      }
      lineas = mejor.l; tw = Math.ceil(mejor.m);
    }
    const k = compacto ? 0.86 : 1;
    const H = Math.round(font * (lineas.length > 1 ? 3.05 : 2.05) * (compacto && lineas.length === 1 ? 0.94 : 1));
    const t = Math.round(H * 0.46 * k);
    const W = t + Math.round(H * 0.14) + tw + Math.round(H * 0.46 * k);
    return { font, lineas, tw, H, t, W, B: W - t };
  }

  function dibujoPez(f, dir) {
    const m = f.m, H = m.H, W = m.W, t = m.t, B = m.B;
    const c = COLOR[f.elemento] || COLOR.n;
    const cuerpo = `M ${t} ${H / 2} C ${t + B * 0.06} ${H * 0.02}, ${t + B * 0.5} ${-H * 0.03}, ${t + B * 0.84} ${H * 0.2} Q ${W} ${H * 0.36} ${W} ${H / 2} Q ${W} ${H * 0.64} ${t + B * 0.84} ${H * 0.8} C ${t + B * 0.5} ${H * 1.03}, ${t + B * 0.06} ${H * 0.98}, ${t} ${H / 2} Z`;
    const cola = `M ${t + 8} ${H / 2} L 0 ${H * 0.06} Q ${t * 0.45} ${H / 2} 0 ${H * 0.94} Z`;
    const dorsal = `M ${t + B * 0.28} ${H * 0.04} Q ${t + B * 0.46} ${-H * 0.18} ${t + B * 0.66} ${H * 0.08} Z`;
    const ventral = `M ${t + B * 0.4} ${H * 0.94} Q ${t + B * 0.52} ${H * 1.12} ${t + B * 0.62} ${H * 0.92} Z`;
    const ojo = { x: W - H * 0.2, y: H * 0.36 };
    return `<svg class="pez-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true" style="transform:scaleX(${dir})">` +
      `<path d="${cola}" fill="${c.b}" fill-opacity=".85"/><path d="${dorsal}" fill="${c.b}" fill-opacity=".8"/><path d="${ventral}" fill="${c.b}" fill-opacity=".7"/>` +
      `<path d="${cuerpo}" fill="url(#${c.g})" stroke="${c.b}" stroke-width="3.5"/>` +
      `<path d="M ${t + B * 0.2} ${H * 0.17} Q ${t + B * 0.5} ${H * 0.05} ${t + B * 0.76} ${H * 0.15}" stroke="#fff" stroke-opacity=".75" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<circle cx="${ojo.x}" cy="${ojo.y}" r="${Math.max(6, H * 0.065)}" fill="#102438"/><circle cx="${ojo.x + H * 0.02}" cy="${ojo.y - H * 0.025}" r="${Math.max(2, H * 0.022)}" fill="#fff"/>` +
      `<path d="M ${W - H * 0.5} ${H * 0.3} q ${H * 0.07} ${H * 0.2} 0 ${H * 0.4}" stroke="${c.b}" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  }
  function izqTexto(f) { const m = f.m; return f.dir >= 0 ? m.t + Math.round(m.H * 0.14) : (m.W - m.t - Math.round(m.H * 0.14) - m.tw); }

  function construirEl(f) {
    const el = document.createElement("div");
    el.className = "pez";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Pez: " + f.texto + (f.personas >= 2 ? ", " + f.personas + " personas" : "") + ". Toca para añadirlo al título.");
    el.dataset.clave = f.clave;
    el.style.width = f.m.W + "px";
    el.style.height = f.m.H + "px";
    el.innerHTML = dibujoPez(f, f.dir) +
      `<span class="pal" style="left:${izqTexto(f)}px;width:${f.m.tw}px;height:${f.m.H}px;font-size:${f.m.font}px">${f.m.lineas.map(esc).join("<br>")}</span>` +
      (f.personas >= 2 ? `<span class="n">×${f.personas}</span>` : "");
    f.el = el;
    enganchar(f);
    return el;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function refrescar(f) {
    // vuelve a dibujar cuerpo/texto (cambio de elemento, de personas o de tamaño)
    const el = f.el;
    el.style.width = f.m.W + "px"; el.style.height = f.m.H + "px";
    const svg = el.querySelector(".pez-svg");
    if (svg) svg.outerHTML = dibujoPez(f, f.dir);
    const pal = el.querySelector(".pal");
    pal.style.left = izqTexto(f) + "px"; pal.style.width = f.m.tw + "px"; pal.style.height = f.m.H + "px"; pal.style.fontSize = f.m.font + "px";
    pal.innerHTML = f.m.lineas.map(esc).join("<br>");
    let n = el.querySelector(".n");
    if (f.personas >= 2) {
      if (!n) { n = document.createElement("span"); n.className = "n"; el.appendChild(n); }
      n.textContent = "×" + f.personas;
    } else if (n) n.remove();
    el.setAttribute("aria-label", "Pez: " + f.texto + (f.personas >= 2 ? ", " + f.personas + " personas" : "") + ". Toca para añadirlo al título.");
  }

  // ------------------------------------------------------------------ montaje
  function montar(op) {
    desmontar();
    asegurarDefs();
    const caja = op.tanque.querySelector("#peces-caja") || op.tanque;
    C = Object.assign({}, op, { caja, W: op.tanque.clientWidth, H: op.tanque.clientHeight, estatico: !!op.foto || reducido() });
    capa = op.lienzo.querySelector("#capa-arrastre");
    if (!capa) { capa = document.createElement("div"); capa.id = "capa-arrastre"; op.lienzo.appendChild(capa); }
    capa.innerHTML = "";
    pool.length = 0;
    lista = []; ocultos = [];
    medirOrigen();
  }
  function desmontar() {
    cancelAnimationFrame(raf); raf = 0; ultimo = 0; reloj = 0; arr = null;
    if (C && C.lienzo) C.lienzo.classList.remove("arrastrando");
    lista = []; ocultos = []; C = null;
  }
  function medirOrigen() {
    if (!C) return;
    const r = C.tanque.getBoundingClientRect(), lr = C.lienzo.getBoundingClientRect(), s = lr.width / C.ANCHO;
    C.ox = (r.left - lr.left) / s; C.oy = (r.top - lr.top) / s;
    C.W = C.tanque.clientWidth; C.H = C.tanque.clientHeight;
  }

  function compacto() { return lista.length + ocultos.length > 90; }
  // Presupuesto de espacio: si no caben más peces sin amontonarse, los menos populares quedan «fuera de vista»
  // (siguen contados y se sacan en la próxima visita). Los peces nuevos de la persona siempre se ven.
  const areaDe = (m) => (m.W + 10) * (m.H + 8);
  function capacidad() { return 1.15 * Math.max(0, C.W - 24) * Math.max(0, C.H - SUPERFICIE - ARENA * 0.6); }
  function usado() { let a = 0; for (const f of lista) a += areaDe(f.m); return a; }
  function avisarOcultos() { if (C && C.alOcultos) C.alOcultos(ocultos.length); }
  function ocultarMenosPopular() {
    let idx = -1;
    for (let i = lista.length - 1; i >= 0; i--) {
      const f = lista[i];
      if (f.nuevo || f.estado === "agarrado" || f.estado === "cae") continue;
      if (idx < 0 || f.personas < lista[idx].personas) idx = i;
    }
    if (idx < 0) return false;
    const [f] = lista.splice(idx, 1);
    if (f.el && f.el.parentNode) f.el.remove();
    ocultos.push({ clave: f.clave, texto: f.texto, elemento: f.elemento, personas: f.personas });
    return true;
  }
  function limites(f) {
    return { x0: f.m.W / 2 + 6, x1: C.W - f.m.W / 2 - 6, y0: SUPERFICIE + f.m.H / 2, y1: Math.max(SUPERFICIE + f.m.H / 2 + 10, C.H - ARENA * 0.5 - f.m.H / 2) };
  }

  function agregar(d, op = {}) {
    if (!C) return null;
    const clave = d.clave || norm(d.texto);
    const previo = lista.find((p) => p.clave === clave);
    if (previo) { actualizar(clave, d); return previo; }
    const prioridad = !!(op.caer || op.forzar);
    const io = ocultos.findIndex((o) => o.clave === clave);
    if (io >= 0) { const o = ocultos.splice(io, 1)[0]; d = Object.assign({}, o, d, { personas: Math.max(o.personas || 1, d.personas || 1) }); }
    const mAprox = medir(d.texto, Math.max(1, d.personas || 1), compacto());
    if (!prioridad && usado() + areaDe(mAprox) > capacidad()) {
      ocultos.push({ clave, texto: d.texto, elemento: d.elemento || null, personas: Math.max(1, d.personas || 1) });
      avisarOcultos();
      return null;
    }
    const f = {
      clave, texto: d.texto, elemento: d.elemento || null, personas: Math.max(1, d.personas || 1),
      dir: rnd() < 0.5 ? -1 : 1, estado: "nada", x: 0, y: 0, vx: 0, vy: 0, ang: 0, fase: rnd() * 6.28, om: 0.6 + rnd() * 0.8,
      v: 16 + rnd() * 26, tx: 0, ty: 0, tNext: 0, paso: 0, nuevo: !!op.caer
    };
    f.m = mAprox;
    construirEl(f);
    if (prioridad) { let g = 40; while (g-- > 0 && usado() + areaDe(f.m) > capacidad() && ocultarMenosPopular()); }
    C.caja.appendChild(f.el);
    const l = limites(f);
    if (op.caer) {
      f.estado = "cae";
      f.x = clamp(C.W * (0.12 + rnd() * 0.76), l.x0, l.x1);
      f.y = -f.m.H;
      f.vy = 240 + rnd() * 80; f.vx = 0;
      f.ty = clamp(SUPERFICIE + 80 + rnd() * (C.H - 2 * SUPERFICIE - 260), l.y0, l.y1);
      f.retardo = (op.retardo || 0);
      f.ang = f.dir * 52;
      f.el.style.opacity = "0";
      f.el.classList.add("nuevo");
    } else {
      colocarLibre(f, l);
      f.ty = f.y; f.tx = f.x;
    }
    lista.push(f);
    avisarOcultos();
    dibujar(f);
    if (!C.estatico) arrancar(); else if (op.caer) { f.estado = "nada"; f.y = f.ty; f.el.style.opacity = ""; dibujar(f); }
    return f;
  }
  // posición libre (mejor candidato) para peces ya existentes
  function colocarLibre(f, l) {
    let mejor = null;
    const cand = lista.length > 120 ? 6 : 40;
    for (let k = 0; k < cand; k++) {
      const x = l.x0 + rnd() * Math.max(1, l.x1 - l.x0), y = l.y0 + rnd() * Math.max(1, l.y1 - l.y0);
      let d = 1e9;
      const n = lista.length > 150 ? lista.slice(-60) : lista;
      for (const o of n) { const dx = Math.abs(o.x - x) - (o.m.W + f.m.W) / 2, dy = Math.abs(o.y - y) - (o.m.H + f.m.H) / 2; d = Math.min(d, Math.max(dx, dy)); }
      if (!mejor || d > mejor.d) mejor = { x, y, d };
    }
    f.x = mejor.x; f.y = mejor.y;
  }
  function quitar(clave) {
    const i = lista.findIndex((p) => p.clave === clave);
    if (i < 0) { const io = ocultos.findIndex((o) => o.clave === clave); if (io >= 0) { const o = ocultos.splice(io, 1)[0]; avisarOcultos(); return o; } return null; }
    const f = lista[i];
    lista.splice(i, 1);
    if (f.el && f.el.parentNode) f.el.remove();
    return f;
  }
  function actualizar(clave, d) {
    const f = lista.find((p) => p.clave === clave);
    if (!f) return null;
    if (d.personas && d.personas !== f.personas) { f.personas = d.personas; f.m = medir(f.texto, f.personas, compacto()); refrescar(f); }
    if (d.elemento && !f.elemento) { f.elemento = d.elemento; refrescar(f); }
    eco(f);
    return f;
  }
  function eco(f) {
    if (!f.el) return;
    f.el.classList.remove("eco"); void f.el.offsetWidth; f.el.classList.add("eco");
    setTimeout(() => f.el && f.el.classList.remove("eco"), 1100);
  }
  function recalcular() {
    if (!C) return;
    medirOrigen();
    const comp = compacto();
    lista.forEach((f) => {
      const m = medir(f.texto, f.personas, comp);
      if (m.W !== f.m.W || m.H !== f.m.H) { f.m = m; refrescar(f); }
      const l = limites(f);
      f.x = clamp(f.x, l.x0, l.x1); f.y = clamp(f.y, l.y0, l.y1); f.tx = f.x; f.ty = f.y;
      dibujar(f);
    });
  }

  // ------------------------------------------------------------------ física: nadar despacio
  function arrancar() { if (!raf && C && !C.estatico) { ultimo = 0; raf = requestAnimationFrame(paso); } }
  function nuevoRumbo(f) {
    const l = limites(f);
    f.tx = l.x0 + rnd() * Math.max(1, l.x1 - l.x0);
    f.ty = clamp(f.y + (rnd() - 0.5) * 360, l.y0, l.y1);
    f.tNext = reloj + 3.5 + rnd() * 6;
    f.v = 16 + rnd() * 26;
  }
  function paso(ts) {
    raf = 0;
    if (!C) return;
    const dt = ultimo ? Math.min(0.05, (ts - ultimo) / 1000) : 0.016;
    ultimo = ts; reloj += dt;
    const n = lista.length;
    // rejilla para separar peces que se solapan (barata incluso con 200)
    const cel = 260, mapa = new Map();
    for (const f of lista) {
      if (f.estado !== "nada") continue;
      const k = Math.floor(f.x / cel) + "," + Math.floor(f.y / 110);
      (mapa.get(k) || mapa.set(k, []).get(k)).push(f);
    }
    for (const f of lista) {
      if (f.estado === "agarrado") continue;
      const l = limites(f);
      if (f.estado === "cae") {
        if (f.retardo > 0) { f.retardo -= dt; continue; }
        if (f.el.style.opacity === "0") { f.el.style.opacity = ""; onda(f.x); }
        f.y += f.vy * dt;
        f.x += Math.sin(reloj * 2 + f.fase) * 14 * dt;
        f.x = clamp(f.x, l.x0, l.x1);
        const resta = f.ty - f.y;
        if (resta < 260) f.vy = Math.max(26, f.vy - 420 * dt);
        if (f.y > 20 && (!f._ultB || f.y - f._ultB > 70)) { f._ultB = f.y; burbujaTanque(f.x - f.dir * f.m.W * 0.3, f.y - 20); }
        const objetivoAng = 0;
        if (f.y >= f.ty - 4 || f.vy <= 30) { f.estado = "nada"; f.nuevoT = reloj; nuevoRumbo(f); }
        f.ang += ((resta < 160 ? objetivoAng : f.dir * 52) - f.ang) * Math.min(1, 3 * dt);
        dibujar(f);
        continue;
      }
      // nadar
      if (reloj > f.tNext) nuevoRumbo(f);
      const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy) || 1;
      const objVx = d > 12 ? (dx / d) * f.v : 0, objVy = d > 12 ? (dy / d) * f.v * 0.5 : 0;
      f.vx += (objVx - f.vx) * Math.min(1, 0.9 * dt);
      f.vy += (objVy - f.vy) * Math.min(1, 0.9 * dt);
      // separación suave con los vecinos de la rejilla
      const cx = Math.floor(f.x / cel), cy = Math.floor(f.y / 110);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
        const g = mapa.get((cx + i) + "," + (cy + j));
        if (!g) continue;
        for (const o of g) {
          if (o === f) continue;
          const px = (f.m.W + o.m.W) * 0.4 - Math.abs(f.x - o.x), py = (f.m.H + o.m.H) * 0.5 - Math.abs(f.y - o.y);
          if (px > 0 && py > 0) {
            if (py < px * 0.9) f.vy += Math.sign(f.y - o.y || (f.fase - o.fase)) * 26 * dt * 10;
            else f.vx += Math.sign(f.x - o.x || (f.fase - o.fase)) * 14 * dt * 10;
          }
        }
      }
      f.x += f.vx * dt; f.y += (f.vy + Math.sin(reloj * f.om + f.fase) * 7) * dt;
      if (f.x < l.x0) { f.x = l.x0; f.vx = Math.abs(f.vx); }
      if (f.x > l.x1) { f.x = l.x1; f.vx = -Math.abs(f.vx); }
      f.y = clamp(f.y, l.y0, l.y1);
      const dirNueva = f.vx > 3 ? 1 : f.vx < -3 ? -1 : f.dir;
      if (dirNueva !== f.dir) { f.dir = dirNueva; giro(f); }
      const objAng = clamp((f.vy / (Math.abs(f.vx) + 14)) * 9, -9, 9) * f.dir;
      f.ang += (objAng - f.ang) * Math.min(1, 2.5 * dt);
      dibujar(f);
    }
    if (n) raf = requestAnimationFrame(paso);
  }
  function giro(f) {
    const svg = f.el.querySelector(".pez-svg"); if (svg) svg.style.transform = "scaleX(" + f.dir + ")";
    const pal = f.el.querySelector(".pal"); if (pal) pal.style.left = izqTexto(f) + "px";
  }
  function dibujar(f) {
    const x = f.x - f.m.W / 2 + (f.padre === "capa" ? C.ox : 0), y = f.y - f.m.H / 2 + (f.padre === "capa" ? C.oy : 0);
    f.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${f.ang.toFixed(1)}deg)${f.escala ? " scale(" + f.escala + ")" : ""}`;
  }

  // ------------------------------------------------------------------ burbujas y ondas
  function tomarBurbuja(host) {
    let b = pool.find((x) => !x.ocupada && x.host === host);
    if (!b) {
      if (pool.length >= 60) return null;
      const el = document.createElement("i");
      el.className = "est-burbuja";
      host.appendChild(el);
      b = { el, ocupada: false, host };
      pool.push(b);
    }
    return b;
  }
  function burbuja(host, x, y) {
    const b = tomarBurbuja(host); if (!b || !b.el.animate || reducido()) return;
    const d = 14 + rnd() * 18, dx = (rnd() - 0.5) * 36;
    b.ocupada = true;
    Object.assign(b.el.style, { width: d + "px", height: d + "px", left: (x - d / 2) + "px", top: (y - d / 2) + "px", display: "block" });
    const an = b.el.animate([{ transform: "translate(0,0) scale(.5)", opacity: 0.95 }, { transform: `translate(${dx}px,-70px) scale(1.05)`, opacity: 0 }], { duration: 800 + rnd() * 500, easing: "ease-out" });
    an.onfinish = () => { b.ocupada = false; b.el.style.display = "none"; };
  }
  const burbujaTanque = (x, y) => C && burbuja(C.caja, x, y);
  const burbujaCapa = (x, y) => C && burbuja(capa, x, y);
  function onda(x) {
    if (!C || reducido()) return;
    const el = document.createElement("i");
    el.className = "onda-agua";
    el.style.left = (x - 60) + "px"; el.style.top = (SUPERFICIE - 30) + "px";
    C.caja.appendChild(el);
    if (el.animate) el.animate([{ transform: "scale(.3)", opacity: 0.9 }, { transform: "scale(1.6)", opacity: 0 }], { duration: 800, easing: "ease-out" }).onfinish = () => el.remove();
    else setTimeout(() => el.remove(), 800);
  }

  // ------------------------------------------------------------------ arrastre y toques
  function enganchar(f) {
    const el = f.el;
    el.addEventListener("pointerdown", (e) => {
      if (e.button != null && e.button > 0) return;
      if (!C || C.bloqueado || arr) return;
      e.preventDefault();
      const p = C.puntoLocal(e);
      arr = { f, id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, tipo: e.pointerType, larga: false, ultB: p };
      arr.timer = setTimeout(() => {
        if (arr && arr.f === f && !arr.moved) { arr.larga = true; C.alPartir && C.alPartir(f); }
      }, 520);
      // escucha en window: el pez cambia de contenedor al agarrarlo y no se debe perder el gesto
      const mueve = (ev) => {
        if (!arr || arr.f !== f || ev.pointerId !== arr.id) return;
        const d = Math.hypot(ev.clientX - arr.x0, ev.clientY - arr.y0);
        if (!arr.moved && d > 8) { arr.moved = true; clearTimeout(arr.timer); arriba(f); }
        if (arr.moved) mover(ev);
      };
      const fin = (ev, cancel) => {
        if (!arr || arr.f !== f || ev.pointerId !== arr.id) return;
        window.removeEventListener("pointermove", mueve);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", can);
        clearTimeout(arr.timer);
        const a = arr; arr = null;
        if (a.moved) {
          const q = puntoArrastre(ev, a);
          C.lienzo.classList.remove("arrastrando");
          if (C.barra) C.barra.classList.remove("recibiendo");
          if (!cancel && C.sobreBarra && C.sobreBarra(q)) { C.alPescar(f, q); return; }
          volver(f, !cancel && C.sobreTanque && C.sobreTanque(q) ? q : null);
        } else if (!cancel && !a.larga) {
          C.alToque && C.alToque(f);
        }
      };
      const up = (ev) => fin(ev, false), can = (ev) => fin(ev, true);
      window.addEventListener("pointermove", mueve);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", can);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); C && C.alToque && C.alToque(f); }
    });
  }
  function puntoArrastre(e, a) {
    const p = C.puntoLocal(e);
    return { x: p.x, y: p.y - (a.tipo === "touch" || a.tipo === "pen" ? 56 : 0) };
  }
  function arriba(f) {
    // pasa a la capa libre (sin recorte) para poder salir del tanque
    medirOrigen();
    f.estado = "agarrado"; f.padre = "capa"; f.escala = 1.1; f.ang = 0;
    f.el.classList.add("arrastre");
    capa.appendChild(f.el);
    C.lienzo.classList.add("arrastrando");
    if (C.barra) C.barra.classList.add("recibiendo");
  }
  function mover(e) {
    const f = arr.f, p = puntoArrastre(e, arr);
    f.x = p.x - C.ox; f.y = p.y - C.oy;
    dibujar(f);
    if (Math.hypot(p.x - arr.ultB.x, p.y - arr.ultB.y) > 22) { arr.ultB = p; burbujaCapa(p.x - f.dir * f.m.W * 0.35, p.y + 6); }
  }
  function volver(f, p) {
    f.padre = "mar"; f.escala = 0; f.estado = "nada";
    f.el.classList.remove("arrastre");
    C.caja.appendChild(f.el);
    const l = limites(f);
    if (p) { f.x = clamp(p.x - C.ox, l.x0, l.x1); f.y = clamp(p.y - C.oy, l.y0, l.y1); }
    else { f.x = clamp(f.x, l.x0, l.x1); f.y = clamp(f.y, l.y0, l.y1); }
    f.vx = 0; f.vy = 0; nuevoRumbo(f);
    dibujar(f);
    arrancar();
  }

  /* Devuelve un pez retirado (p. ej. un chip que sale de la barra) cerca de la superficie. */
  function devolver(d) {
    const f = agregar(d, { caer: false, forzar: true });
    if (f && f.y !== undefined) { f.y = SUPERFICIE + f.m.H; dibujar(f); onda(f.x); eco(f); }
    return f;
  }

  return {
    bloquear: (b) => { if (C) C.bloqueado = !!b; },
    montar, desmontar, agregar, quitar, actualizar, recalcular, devolver, eco,
    tiene: (c) => lista.some((p) => p.clave === c) || ocultos.some((p) => p.clave === c),
    obtener: (c) => lista.find((p) => p.clave === c) || ocultos.find((p) => p.clave === c) || null,
    claves: () => lista.map((p) => p.clave).concat(ocultos.map((p) => p.clave)),
    total: () => lista.length + ocultos.length,
    visible: (c) => lista.some((p) => p.clave === c),
    visibles: () => lista.length,
    fueraDeVista: () => ocultos.length,
    textos: () => lista.map((p) => p.texto),
    arrastrando: () => !!arr && arr.moved,
    medirOrigen
  };
})();
window.Peces = Peces;

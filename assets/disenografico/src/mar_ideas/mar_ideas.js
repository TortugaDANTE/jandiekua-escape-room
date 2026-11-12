/* Mar de ideas: hundimiento, tamaño por cantidad y arrastre hacia los tanques.
   Sin librerías. Un solo bucle requestAnimationFrame que se detiene cuando todo está quieto.
   API:  MarIdeas.montar({...})  MarIdeas.detener()  MarIdeas.absorber(vivo, tanqueId)
         MarIdeas.arrastrando()  MarIdeas.despertar()
   Coordenadas internas: px del lienzo (1080×2022), origen en la esquina superior izquierda de #mar. */
const MarIdeas = (() => {
  // ---------------------------------------------------------------- parámetros
  const P = {
    llenado: 0.34,        // fracción del área del mar que ocupan las ideas (define la escala)
    sMin: 0.42,           // escala mínima (con muchísimas ideas)
    holgura: 1.15,        // área extra por idea al calcular la escala (huecos del montón)
    vCaida: [110, 175],   // velocidad terminal de hundimiento, px/s (rango por idea)
    arrastreAgua: 2.2,    // 1/s: qué tan rápido alcanza la velocidad terminal
    oscilacion: [14, 34], // amplitud del vaivén horizontal, px
    omega: [0.9, 1.6],    // frecuencia del vaivén, rad/s
    angVaiven: 7,         // grados de balanceo mientras cae
    inclinacion: 12,      // inclinación base aleatoria (±grados)
    descanso: 9,          // inclinación al asentarse (±grados)
    jitterTam: [0.9, 1.1],// variación de tamaño por idea
    entradaMs: [90, 380], // separación entre apariciones (se ajusta a la cantidad)
    rueda: 170,           // px/s²: empuje lateral al apoyarse en otra idea (las hace rodar y abrir el montón)
    sueno: 0.7,           // s quieta antes de dormir
    levantar: 1.12,       // escala mínima al agarrar
    elevarDedo: 56,       // px que la idea se eleva sobre el dedo (solo táctil)
    estelaPx: 14,         // distancia entre burbujas de la estela
    umbralMov: 8          // px para distinguir toque de arrastre
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;

  let C = null;           // contexto de la sala actual
  let raf = 0, ultimo = 0, reloj = 0;
  let arr = null;         // arrastre en curso
  let capa = null;        // #capa-arrastre (sin recorte, sobre los tanques)
  const pool = [];        // burbujas reutilizables

  const reducido = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function mulberry32(a) {
    return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const rango = (r) => lerp(r[0], r[1], C.rnd());

  // ---------------------------------------------------------------- montaje
  function asegurarCapa(lienzo) {
    capa = lienzo.querySelector("#capa-arrastre");
    if (!capa) {
      capa = document.createElement("div");
      capa.id = "capa-arrastre";
      capa.setAttribute("aria-hidden", "true");
      lienzo.appendChild(capa);
    }
    capa.innerHTML = "";
    pool.length = 0;
  }

  function montar(op) {
    detener();
    const q = new URLSearchParams(location.search);
    const semilla = q.get("semilla");
    C = Object.assign({}, op, {
      rnd: mulberry32(semilla ? Number(semilla) : (op.foto ? 20261112 : (Math.random() * 1e9) | 0)),
      estatico: !!op.foto || reducido(),
      W: op.mar.clientWidth, H: op.mar.clientHeight
    });
    asegurarCapa(op.lienzo);
    midOrigen();
    const vivos = C.vivos;
    vivos.forEach((v, i) => {
      v.w = v.el.offsetWidth; v.h = v.el.offsetHeight;
      v.s = 1; v.jit = rango(P.jitterTam);
      v.tilt = (C.rnd() < 0.15 ? 1.5 : 1) * (C.rnd() * 2 - 1) * P.inclinacion;
      v.rest = (C.rnd() * 2 - 1) * P.descanso;
      v.a = v.tilt;
      v.vt = rango(P.vCaida); v.A = rango(P.oscilacion); v.om = rango(P.omega);
      v.fase = C.rnd() * Math.PI * 2; v.sway = 1;
      v.vx = 0; v.vy = 20 + C.rnd() * 40;
      v.estado = "cae"; v.contacto = false; v.quietoT = 0; v.dormido = false; v.padre = "mar";
      v.aparecio = false; v.ox = 0; v.oy = 0;
      v.el.style.visibility = "hidden";
      v.el.tabIndex = 0;
      enganchar(v);
    });
    // orden de aparición aleatorio, separación según cantidad
    const orden = vivos.map((_, i) => i).sort(() => C.rnd() - 0.5);
    const sep = clamp(2400 / Math.max(vivos.length, 1), P.entradaMs[0], P.entradaMs[1]);
    orden.forEach((idx, k) => {
      const v = vivos[idx];
      v.delay = k * sep * (0.7 + C.rnd() * 0.6);
      const hw = v.w * 0.5;
      // posición orgánica: dos tiradas promediadas agrupan un poco y dejan calvas
      const r = (C.rnd() + C.rnd()) / 2;
      v.x = clamp(hw + r * (C.W - 2 * hw), hw, C.W - hw);
      v.y = -v.h * 0.6;
    });
    objetivoEscala(true);
    vivos.forEach(dibujar);
    if (C.estatico) {
      for (let i = 0; i < 60 * 16; i++) paso(1 / 60);
      vivos.forEach((v) => { v.aparecio = true; v.el.style.visibility = ""; dibujar(v); });
    } else {
      arrancar();
    }
  }

  function detener() {
    cancelAnimationFrame(raf); raf = 0; ultimo = 0; reloj = 0; arr = null;
    if (C && C.lienzo) C.lienzo.classList.remove("arrastrando");
    C = null;
  }

  function midOrigen() {
    const mr = C.mar.getBoundingClientRect(), lr = C.lienzo.getBoundingClientRect();
    const s = lr.width / C.ANCHO;
    C.ox = (mr.left - lr.left) / s; C.oy = (mr.top - lr.top) / s;
  }

  // ---------------------------------------------------------------- tamaño por cantidad
  function objetivoEscala(inmediato) {
    const act = C.vivos.filter((v) => v.estado !== "fuera");
    if (!act.length) return;
    const suma = act.reduce((a, v) => a + v.w * v.h * P.holgura, 0);
    const s = clamp(Math.sqrt((P.llenado * C.W * C.H) / suma), P.sMin, 1);
    C.sObj = s;
    act.forEach((v) => { v.sObj = s * v.jit; if (inmediato) v.s = v.sObj; });
  }

  // ---------------------------------------------------------------- física
  const hw = (v) => v.w * v.s * 0.46;
  const hh = (v) => v.h * v.s * 0.42;

  function paso(dt) {
    reloj += dt;
    const vivos = C.vivos, W = C.W, H = C.H;
    let despiertos = 0;
    for (const v of vivos) {
      if (v.estado === "fuera") continue;
      if (!v.aparecio) {
        if (reloj * 1000 < v.delay) { despiertos++; continue; }
        v.aparecio = true; v.el.style.visibility = "";
      }
      if (v.estado === "agarrado") { despiertos++; continue; }
      v.s = lerp(v.s, v.sObj, Math.min(1, 3 * dt));
      if (v.dormido) continue;
      despiertos++;
      v.contacto = false;
      v.vy += (v.vt - v.vy) * P.arrastreAgua * dt;
      v.fase += v.om * dt;
      const vaiven = v.A * v.om * Math.cos(v.fase) * v.sway;
      v.x += (vaiven + v.vx) * dt;
      v.y += v.vy * dt;
      v.vx *= Math.max(0, 1 - 1.5 * dt);
      // paredes y fondo
      const w = hw(v), h = hh(v);
      if (v.x < w) { v.x = w; v.vx = Math.abs(v.vx); v.fase = Math.PI - v.fase; }
      if (v.x > W - w) { v.x = W - w; v.vx = -Math.abs(v.vx); v.fase = Math.PI - v.fase; }
      if (v.y > H - h - 2) { v.y = H - h - 2; v.contacto = true; }
    }
    // pares: se prefiere resolver en vertical para que se apilen
    for (let it = 0; it < 3; it++) {
      for (let i = 0; i < vivos.length; i++) {
        const a = vivos[i];
        if (a.estado !== "cae" || !a.aparecio) continue;
        for (let j = i + 1; j < vivos.length; j++) {
          const b = vivos[j];
          if (b.estado !== "cae" || !b.aparecio) continue;
          if (a.dormido && b.dormido) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const px = hw(a) + hw(b) - Math.abs(dx), py = hh(a) + hh(b) - Math.abs(dy);
          if (px <= 0 || py <= 0) continue;
          if (py <= px * 1.4) {
            const arriba = dy < 0 ? a : b, abajo = dy < 0 ? b : a;
            if (abajo.dormido) arriba.y -= py;
            else if (arriba.dormido) abajo.y += py;
            else { arriba.y -= py * 0.5; abajo.y += py * 0.5; }
            if (!arriba.dormido && (abajo.dormido || abajo.contacto)) {
              arriba.contacto = true;
              arriba.vx += (arriba.x >= abajo.x ? 1 : -1) * P.rueda * dt;
            }
          } else {
            const dir = dx === 0 ? (C.rnd() < 0.5 ? -1 : 1) : Math.sign(dx);
            if (a.dormido) b.x -= dir * px; else if (b.dormido) a.x += dir * px;
            else { a.x += dir * px * 0.5; b.x -= dir * px * 0.5; }
          }
        }
      }
    }
    for (const v of vivos) {
      if (v.estado !== "cae" || v.dormido || !v.aparecio) continue;
      const w = hw(v);
      v.x = clamp(v.x, w, W - w);
      const c = v.contacto;
      if (c) {
        v.vy = 0;
        v.sway = Math.max(0, v.sway - 1.8 * dt);
        v.quietoT += dt;
        if (v.quietoT > P.sueno && v.sway === 0 && Math.abs(v.vx) < 6) v.dormido = true;
      } else {
        v.quietoT = 0;
        v.sway = Math.min(1, v.sway + 0.4 * dt);
      }
      const asent = 1 - v.sway;
      const objetivo = lerp(v.tilt, v.rest, asent) + Math.sin(v.fase * 0.9 + 1) * P.angVaiven * v.sway;
      v.a = lerp(v.a, objetivo, Math.min(1, 5 * dt));
    }
    return despiertos;
  }

  function dibujar(v) {
    const x = v.x + (v.padre === "capa" ? C.ox : 0) - v.w / 2;
    const y = v.y + (v.padre === "capa" ? C.oy : 0) - v.h / 2;
    v.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${v.a.toFixed(2)}deg) scale(${v.s.toFixed(3)})`;
    if (!v.aparecio) return;
    // aparece suavemente al entrar por arriba del mar
    if (v.padre === "mar" && v.y < v.h) v.el.style.opacity = clamp((v.y + v.h * 0.6) / (v.h * 1.4), 0, 1).toFixed(2);
    else if (v.el.style.opacity) v.el.style.opacity = "";
  }

  function bucle(ahora) {
    if (!C) return;
    const dt = Math.min((ahora - (ultimo || ahora)) / 1000, 1 / 30);
    ultimo = ahora;
    const n = paso(dt);
    for (const v of C.vivos) {
      if (v.estado === "fuera") continue;
      if (v.padre === "capa" && v.estado === "cae" && v.y > v.h * 0.6) volverAlMar(v);
      if (!v.dormido || Math.abs(v.s - v.sObj) > 0.002 || v.estado === "agarrado") dibujar(v);
    }
    if (n > 0 || arr) raf = requestAnimationFrame(bucle); else { raf = 0; ultimo = 0; }
  }
  // modo estático (foto / reduced-motion): se asienta de golpe, sin animación
  function reanudar() {
    if (!C) return;
    if (C.estatico) { for (let i = 0; i < 60 * 8; i++) paso(1 / 60); C.vivos.forEach(dibujar); } else arrancar();
  }
  function arrancar() { if (!raf && C && !C.estatico) { ultimo = 0; raf = requestAnimationFrame(bucle); } }

  function despertar(excepto) {
    if (!C) return;
    C.vivos.forEach((v) => {
      if (v === excepto || v.estado === "fuera" || v.estado === "agarrado") return;
      if (v.dormido) { v.dormido = false; v.quietoT = 0; v.vy = 0; }
    });
    if (C.estatico) { for (let i = 0; i < 60 * 6; i++) paso(1 / 60); C.vivos.forEach(dibujar); }
    else arrancar();
  }

  // ---------------------------------------------------------------- capas (recorte del mar vs. capa libre)
  function aCapa(v) {
    if (v.padre === "capa") return;
    capa.appendChild(v.el); v.padre = "capa";
  }
  function volverAlMar(v) {
    C.mar.appendChild(v.el); v.padre = "mar"; dibujar(v);
  }

  // ---------------------------------------------------------------- arrastre
  function enganchar(v) {
    const el = v.el;
    el.addEventListener("pointerdown", (e) => {
      if (arr || !C) return;
      e.preventDefault();
      midOrigen();
      const p = C.puntoLocal(e);
      aCapa(v);
      v.estado = "agarrado"; v.dormido = false;
      arr = {
        v, id: e.pointerId, tactil: e.pointerType === "touch",
        // el punto de agarre se conserva respecto al centro de la idea
        dx: p.x - (C.ox + v.x), dy: p.y - (C.oy + v.y),
        x0: p.x, y0: p.y, moved: false, bx: p.x, by: p.y, elev: 0
      };
      el.classList.add("arrastre");
      el.setPointerCapture(e.pointerId);
      C.alAgarrar && C.alAgarrar(v);
      v.sObj = Math.max(P.levantar, v.sObj);
      onda(p.x, p.y);
      despertar(v);
      objetivoEscala(false); v.sObj = Math.max(P.levantar, v.sObj);
      arrancar(); levantarAnim();
    });
    el.addEventListener("pointermove", (e) => {
      if (!arr || arr.v !== v || e.pointerId !== arr.id) return;
      const p = C.puntoLocal(e);
      if (!arr.moved && Math.hypot(p.x - arr.x0, p.y - arr.y0) > P.umbralMov) {
        arr.moved = true; C.lienzo.classList.add("arrastrando");
      }
      const elev = arr.tactil ? arr.elev : 0;
      v.x = p.x - arr.dx - C.ox; v.y = p.y - arr.dy - C.oy - elev;
      dibujar(v);
      C.resaltar(p);
      if (arr.moved && !reducido() && Math.hypot(p.x - arr.bx, p.y - arr.by) > P.estelaPx) {
        for (let k = 0; k < 2; k++) burbuja(C.ox + v.x + (C.rnd() - 0.5) * v.w * v.s * 0.8, C.oy + v.y + v.h * v.s * (0.35 + C.rnd() * 0.3));
        arr.bx = p.x; arr.by = p.y;
      }
    });
    const soltar = (e, cancel) => {
      if (!arr || arr.v !== v || e.pointerId !== arr.id) return;
      try { el.releasePointerCapture(e.pointerId); } catch (_) {}
      const a = arr; arr = null;
      C.lienzo.classList.remove("arrastrando");
      el.classList.remove("arrastre");
      const p = C.puntoLocal(e);
      document.querySelectorAll(".tanque.aceptando").forEach((t) => t.classList.remove("aceptando"));
      let aceptada = false;
      const destino = !cancel && a.moved ? C.destinoEn(p) : null;
      if (destino) aceptada = C.soltar(v, destino);
      if (aceptada) return;
      // no soltada en un destino válido: la idea vuelve a hundirse
      v.estado = "cae"; v.vy = 30; v.sway = 1; v.fase = C.rnd() * 6.28; v.vx = 0; v.quietoT = 0; v.dormido = false;
      v.tilt = (C.rnd() * 2 - 1) * P.inclinacion;
      objetivoEscala(false);
      if (!a.moved && !cancel) C.alSeleccionar && C.alSeleccionar(v);
      reanudar();
    };
    el.addEventListener("pointerup", (e) => soltar(e, false));
    el.addEventListener("pointercancel", (e) => soltar(e, true));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); C.alSeleccionar && C.alSeleccionar(v); }
    });
  }

  // la idea se endereza y se eleva mientras está agarrada
  function levantarAnim() {
    const f = () => {
      if (!arr || !C) return;
      const v = arr.v;
      v.a = lerp(v.a, 0, 0.25);
      v.s = lerp(v.s, Math.max(P.levantar, v.sObj), 0.25);
      arr.elev = lerp(arr.elev, P.elevarDedo, 0.2);
      dibujar(v);
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }

  // ---------------------------------------------------------------- efectos: burbujas y ondas
  function tomar() {
    let b = pool.find((x) => !x.ocupada);
    if (!b) {
      if (pool.length >= 40) return null;
      const el = document.createElement("i");
      el.className = "est-burbuja";
      capa.appendChild(el);
      b = { el, ocupada: false };
      pool.push(b);
    }
    return b;
  }
  function burbuja(x, y) {
    const b = tomar(); if (!b || !b.el.animate) return;
    const d = 14 + C.rnd() * 20, dx = (C.rnd() - 0.5) * 36;
    b.ocupada = true;
    Object.assign(b.el.style, { width: d + "px", height: d + "px", left: (x - d / 2) + "px", top: (y - d / 2) + "px", display: "block" });
    b.el.classList.remove("onda");
    const an = b.el.animate([
      { transform: "translate(0,0) scale(.5)", opacity: 0.95 },
      { transform: `translate(${dx}px,-70px) scale(1.05)`, opacity: 0 }
    ], { duration: 800 + C.rnd() * 500, easing: "ease-out" });
    an.onfinish = () => { b.ocupada = false; b.el.style.display = "none"; };
  }
  function onda(x, y) {
    if (reducido()) return;
    const b = tomar(); if (!b || !b.el.animate) return;
    const d = 70;
    b.ocupada = true;
    Object.assign(b.el.style, { width: d + "px", height: d + "px", left: (x - d / 2) + "px", top: (y - d / 2) + "px", display: "block" });
    b.el.classList.add("onda");
    const an = b.el.animate([{ transform: "scale(.4)", opacity: 0.9 }, { transform: "scale(2.2)", opacity: 0 }], { duration: 550, easing: "ease-out" });
    an.onfinish = () => { b.ocupada = false; b.el.style.display = "none"; b.el.classList.remove("onda"); };
  }

  // ---------------------------------------------------------------- aceptada: vuela al tanque y se disuelve
  function absorber(v, tanqueId) {
    const caja = document.getElementById(tanqueId);
    v.estado = "fuera";
    const cx = C ? C.ox + v.x : 0, cy = C ? C.oy + v.y : 0;
    if (C && caja && !reducido() && v.el.animate) {
      const lr = C.lienzo.getBoundingClientRect(), s = lr.width / C.ANCHO, r = caja.getBoundingClientRect();
      const tx = (r.left - lr.left) / s + r.width / s / 2, ty = (r.top - lr.top) / s + r.height / s * 0.55;
      const fantasma = v.el.cloneNode(true);
      fantasma.classList.remove("arrastre", "elegido");
      fantasma.removeAttribute("id"); fantasma.style.visibility = ""; fantasma.style.opacity = "1";
      fantasma.style.pointerEvents = "none";
      capa.appendChild(fantasma);
      const t0 = `translate3d(${cx - v.w / 2}px,${cy - v.h / 2}px,0) rotate(0deg) scale(${v.s})`;
      const t1 = `translate3d(${tx - v.w / 2}px,${ty - v.h / 2}px,0) rotate(0deg) scale(.25)`;
      fantasma.animate([{ transform: t0, opacity: 1 }, { transform: t1, opacity: 0 }], { duration: 380, easing: "cubic-bezier(.3,.1,.2,1)" })
        .onfinish = () => fantasma.remove();
      onda(tx, ty);
    }
    v.el.classList.add("colocado");
    if (C) { objetivoEscala(false); despertar(v); }
  }

  return { montar, detener, absorber, despertar, arrastrando: () => !!arr, parametros: P };
})();

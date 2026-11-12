/* Escape room virtual Mar de las Ideas — Revista Jandiekua
   Agenda Ambiental UASLP. Sin dependencias externas. */

const ANCHO = 1080;
const ALTO = 2022;
const VERSION = "20261112b";

const NOM_LLAVE = ["pertinencia", "estructura", "validacion", "definitiva"];

const GLOSARIO = [
  {
    termino: "Revisión por pares (doble ciego)",
    texto: "Proceso en el que personas expertas evalúan un manuscrito sin conocer la identidad de quien escribe, y quien escribe no conoce la de quienes dictaminan, para cuidar la imparcialidad."
  },
  {
    termino: "Estructura IMRyD",
    texto: "Organización habitual de un artículo científico en Introducción, Metodología, Resultados y Discusión. Suele ir precedida por el título, el resumen y las palabras clave, y se cierra con las referencias."
  },
  {
    termino: "Plagio y autoplagio",
    texto: "El plagio consiste en presentar como propias las ideas o las palabras de otra persona sin citarlas. El autoplagio consiste en republicar un trabajo propio previo, o una parte sustancial de él, sin declararlo."
  },
  {
    termino: "Conflicto de intereses",
    texto: "Situación en la que un interés personal, institucional o financiero podría influir, o parecer que influye, en el juicio de autoría, de dictamen o editorial."
  },
  {
    termino: "Índice de impacto, ISSN y DOI",
    texto: "El ISSN identifica una publicación periódica y el DOI identifica de forma permanente un documento digital. El índice de impacto es una métrica bibliométrica de revistas; no sustituye la evaluación cualitativa de un manuscrito."
  },
  {
    termino: "Consentimiento informado y ética en investigación ambiental",
    texto: "Acuerdo voluntario, informado y documentado de las personas o comunidades participantes, junto con el cuidado de los efectos ambientales y sociales de la investigación."
  },
  {
    termino: "Manuscrito inédito y carta de originalidad",
    texto: "Un manuscrito inédito no ha sido publicado ni está en evaluación simultánea en otra revista. La carta de originalidad declara esa condición y la autoría responsable."
  },
  {
    termino: "Palabras clave y resumen estructurado",
    texto: "Las palabras clave describen el contenido del artículo y facilitan su indización; conviene alinearlas con tesauros del campo cuando existan. Un resumen estructurado expone, de forma breve y ordenada, el objetivo, la metodología, los resultados y las conclusiones."
  }
];

const SALAS = [
  {
    id: "originalidad",
    nombre: "Túnel de la Originalidad",
    kicker: "Sala 1 de 4",
    llave: "Llave de Pertinencia",
    modo: "filtro",
    instruccion: "Arrastra al tanque las ideas que sostienen un trabajo original, o tócalas y luego toca el tanque.",
    reto: "Jandiekua publica investigación en educación ambiental. Para cruzar el túnel hay que distinguir un aporte inédito y bien citado de las prácticas que constituyen plagio, autoplagio o un tema ajeno a la revista.",
    etiqueta: "Reto editorial",
    tema: true,
    tanques: [{ id: "tanque-originalidad", etiqueta: "Tanque de originalidad" }],
    nodos: [
      { id: "s1-a", texto: "Identificar un vacío de conocimiento", valido: true, tanque: "tanque-originalidad", ok: "Sí: un vacío claramente planteado sostiene la pertinencia del trabajo." },
      { id: "s1-b", texto: "Citar las fuentes que se consultan", valido: true, tanque: "tanque-originalidad", ok: "Sí: citar con precisión es la base de la originalidad." },
      { id: "s1-c", texto: "Aportar un enfoque inédito al campo", valido: true, tanque: "tanque-originalidad", ok: "Sí: el aporte inédito es el corazón de un manuscrito original." },
      { id: "s1-d", texto: "Alinear el tema con la educación ambiental", valido: true, tanque: "tanque-originalidad", ok: "Sí: la pertinencia temática con la línea de la revista es indispensable." },
      { id: "s1-e", texto: "Copiar un párrafo sin comillas ni cita", valido: false, error: "Eso es plagio. Aunque el dato sea correcto, el texto ajeno debe citarse y, si se reproduce de forma literal, ir entre comillas." },
      { id: "s1-f", texto: "Republicar un artículo propio sin declararlo", valido: false, error: "Eso es autoplagio. Un trabajo previo puede retomarse solo si se declara y se aporta algo nuevo." },
      { id: "s1-g", texto: "Traducir un artículo ajeno y firmarlo como propio", valido: false, error: "Traducir no transfiere la autoría. Ese uso requiere autorización y atribución explícita." },
      { id: "s1-h", texto: "Proponer un tema ajeno a la educación ambiental", valido: false, error: "Un manuscrito puede ser original y, aun así, quedar fuera de la línea editorial de la revista." }
    ]
  },
  {
    id: "formato",
    nombre: "Laberinto del Formato",
    kicker: "Sala 2 de 4",
    llave: "Llave de Estructura",
    modo: "orden",
    instruccion: "Coloca cada parte del manuscrito en su compartimento, en el orden habitual de un artículo.",
    reto: "Un artículo científico suele abrirse con título, resumen y palabras clave; desarrollar el cuerpo en la secuencia IMRyD (Introducción, Metodología, Resultados y Discusión); y cerrar con las referencias. Encaja cada pieza en su lugar.",
    etiqueta: "Norma de estructura",
    tanques: [
      { id: "t-titulo", etiqueta: "1. Título", acepta: "n-titulo" },
      { id: "t-resumen", etiqueta: "2. Resumen", acepta: "n-resumen" },
      { id: "t-palabras", etiqueta: "3. Palabras clave", acepta: "n-palabras" },
      { id: "t-intro", etiqueta: "4. Introducción", acepta: "n-intro" },
      { id: "t-metodo", etiqueta: "5. Metodología", acepta: "n-metodo" },
      { id: "t-resultados", etiqueta: "6. Resultados", acepta: "n-resultados" },
      { id: "t-discusion", etiqueta: "7. Discusión", acepta: "n-discusion" },
      { id: "t-referencias", etiqueta: "8. Referencias", acepta: "n-referencias" }
    ],
    nodos: [
      { id: "n-titulo", texto: "Título", valido: true, tanque: "t-titulo" },
      { id: "n-resumen", texto: "Resumen", valido: true, tanque: "t-resumen" },
      { id: "n-palabras", texto: "Palabras clave", valido: true, tanque: "t-palabras" },
      { id: "n-intro", texto: "Introducción", valido: true, tanque: "t-intro" },
      { id: "n-metodo", texto: "Metodología", valido: true, tanque: "t-metodo" },
      { id: "n-resultados", texto: "Resultados", valido: true, tanque: "t-resultados" },
      { id: "n-discusion", texto: "Discusión", valido: true, tanque: "t-discusion" },
      { id: "n-referencias", texto: "Referencias", valido: true, tanque: "t-referencias" },
      { id: "n-dedicatoria", texto: "Dedicatoria informal", valido: false, error: "La dedicatoria informal no forma parte de la estructura formal del artículo." },
      { id: "n-anuncio", texto: "Anuncio publicitario", valido: false, error: "Un anuncio no pertenece al manuscrito científico." }
    ]
  },
  {
    id: "pares",
    nombre: "Cámara de Pares",
    kicker: "Sala 3 de 4",
    llave: "Llave de Validación Científica",
    modo: "pasos",
    instruccion: "Elige en el Mar de Ideas la respuesta que atiende la observación del revisor.",
    etiqueta: "Observación del revisor",
    pasos: [
      {
        reto: "«El apartado metodológico no describe con claridad cómo se seleccionó la muestra ni qué instrumentos se utilizaron.»",
        tanques: [{ id: "t-pares-1", etiqueta: "Respuesta al dictamen" }],
        nodos: [
          { id: "p1-a", texto: "Detallar los criterios de selección y describir los instrumentos", valido: true, tanque: "t-pares-1", ok: "Sí: responder con precisión metodológica atiende la observación." },
          { id: "p1-b", texto: "Pedir que el revisor ignore esa observación", valido: false, error: "La revisión por pares busca mejorar el manuscrito; conviene argumentar o corregir, no eludir." },
          { id: "p1-c", texto: "Eliminar la metodología para acortar el texto", valido: false, error: "Sin metodología el trabajo no es reproducible. Acortar no resuelve la observación." }
        ]
      },
      {
        reto: "«La discusión reitera los resultados y no los contrasta con estudios previos.»",
        tanques: [{ id: "t-pares-2", etiqueta: "Respuesta al dictamen" }],
        nodos: [
          { id: "p2-a", texto: "Contrastar los hallazgos con la literatura y explicar sus implicaciones", valido: true, tanque: "t-pares-2", ok: "Sí: discutir es interpretar y contextualizar, no repetir los resultados." },
          { id: "p2-b", texto: "Añadir adjetivos elogiosos a los resultados", valido: false, error: "El énfasis retórico no sustituye el contraste con otras investigaciones." },
          { id: "p2-c", texto: "Mover los resultados al anexo y dejar la discusión vacía", valido: false, error: "Los resultados y la discusión cumplen funciones distintas; ambas deben quedar en el cuerpo del artículo." }
        ]
      }
    ]
  },
  {
    id: "etica",
    nombre: "Portal de Ética",
    kicker: "Sala 4 de 4",
    llave: "Llave Definitiva de Publicación",
    modo: "pasos",
    instruccion: "Relaciona el dilema con el principio ético que permite resolverlo.",
    etiqueta: "Dilema ético",
    pasos: [
      {
        reto: "Una persona que solo revisó la ortografía del manuscrito pide figurar como autora.",
        tanques: [{ id: "t-et-1", etiqueta: "Principio ético" }],
        nodos: [
          { id: "e1-a", texto: "La autoría se reserva a quien hizo una contribución intelectual sustancial", valido: true, tanque: "t-et-1", ok: "Sí: la revisión formal no equivale a autoría. Puede reconocerse en los agradecimientos." },
          { id: "e1-b", texto: "Incluirla para evitar un conflicto personal", valido: false, error: "La autoría honoraria o por cortesía no es una práctica ética." },
          { id: "e1-c", texto: "Dejar la decisión en manos de la persona que más insiste", valido: false, error: "Los criterios de autoría no se negocian por presión; se documentan según la contribución real." }
        ]
      },
      {
        reto: "El estudio se realizó con una comunidad y el manuscrito no indica si se obtuvo consentimiento informado.",
        tanques: [{ id: "t-et-2", etiqueta: "Principio ético" }],
        nodos: [
          { id: "e2-a", texto: "Documentar el consentimiento informado de quienes participaron", valido: true, tanque: "t-et-2", ok: "Sí: el consentimiento informado es un requisito ético, no un trámite opcional." },
          { id: "e2-b", texto: "Omitirlo si los datos ya están recabados", valido: false, error: "Que los datos existan no elimina la obligación de haber informado y recabado el consentimiento." },
          { id: "e2-c", texto: "Sustituir el consentimiento por el anonimato de los nombres", valido: false, error: "El anonimato protege la identidad, pero no reemplaza el consentimiento informado." }
        ]
      },
      {
        reto: "A una investigadora le piden dictaminar un manuscrito de un proyecto que financia su propio laboratorio.",
        tanques: [{ id: "t-et-3", etiqueta: "Principio ético" }],
        nodos: [
          { id: "e3-a", texto: "Declarar el conflicto de interés y abstenerse de dictaminar", valido: true, tanque: "t-et-3", ok: "Sí: un conflicto de interés se declara y, en este caso, impide aceptar el dictamen." },
          { id: "e3-b", texto: "Aceptar el dictamen y no mencionarlo", valido: false, error: "Ocultar un conflicto de interés compromete la imparcialidad de la revisión." },
          { id: "e3-c", texto: "Aceptarlo y pedir que firmen también sus estudiantes", valido: false, error: "Ampliar la autoría del dictamen no corrige el conflicto de interés." }
        ]
      }
    ]
  }
];

const estado = {
  vista: "portada",
  sala: 0,
  paso: 0,
  llaves: [false, false, false, false],
  tema: "",
  registro: { nombre: "", institucion: "", correo: "", telefono: "", aviso: false },
  colocados: {},
  elegido: null
};

const nodosVivos = [];
let arrastre = null;
let raf = 0;
let foto = false;
let toastTimer = 0;
let certificadoUrl = "";

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const lienzo = $("#lienzo");
const escena = $("#escena");

function escalaLienzo() {
  const s = Math.min(window.innerWidth / ANCHO, window.innerHeight / ALTO);
  lienzo.style.transform = `translate(-50%, -50%) scale(${s})`;
}
function puntoLocal(e) {
  const r = lienzo.getBoundingClientRect();
  const s = r.width / ANCHO;
  return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
}

function guardar() {
  try {
    localStorage.setItem("jandiekua-mar-" + VERSION, JSON.stringify({
      vista: estado.vista,
      sala: estado.sala,
      paso: estado.paso,
      llaves: estado.llaves,
      tema: estado.tema,
      registro: estado.registro
    }));
  } catch (err) { /* almacenamiento no disponible */ }
}
function cargar() {
  try {
    const raw = localStorage.getItem("jandiekua-mar-" + VERSION);
    if (!raw) return;
    const d = JSON.parse(raw);
    Object.assign(estado, d, { colocado: {}, elegido: null, colocados: {} });
  } catch (err) { /* ignorar */ }
}

function svgLlaves() {
  const ol = $("#llaves");
  ol.innerHTML = SALAS.map((s, i) =>
    `<li class="llave${estado.llaves[i] ? " obtenida" : ""}" title="${s.llave}" aria-label="${s.llave}: ${estado.llaves[i] ? "obtenida" : "bloqueada"}">` +
    `<img src="assets/disenografico/llave_${i + 1}_${NOM_LLAVE[i]}${estado.llaves[i] ? "" : "_bloqueada"}.svg" alt=""></li>`
  ).join("");
}

function mostrarToast(texto, error = false) {
  const t = $("#toast");
  t.hidden = false;
  t.className = "toast" + (error ? " error" : "");
  t.textContent = texto;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 4200);
}

function salaActual() {
  return SALAS[estado.sala];
}
function pasoActual() {
  const s = salaActual();
  if (s.modo === "pasos") return s.pasos[estado.paso];
  return s;
}

function render() {
  cancelAnimationFrame(raf);
  nodosVivos.length = 0;
  estado.elegido = null;
  arrastre = null;
  const franja = $("#franja-llaves");
  if (estado.vista === "portada") {
    franja.hidden = true;
    renderPortada();
    return;
  }
  franja.hidden = false;
  svgLlaves();
  if (estado.vista === "sala") renderSala();
  else if (estado.vista === "cierre-form") renderFormulario();
  else if (estado.vista === "cierre-diploma") renderDiploma();
}

function renderPortada() {
  escena.innerHTML = `
    <section class="portada">
      <p class="kicker">Escape room virtual</p>
      <h1>Mar de las <span>Ideas</span></h1>
      <p class="revista">Revista Jandiekua</p>
      <p class="subtitulo">Revista Mexicana de Educación Ambiental<br>Agenda Ambiental · UASLP</p>
      <div class="logo-pendiente">[LOGO JANDIEKUA]<br>[POR DEFINIR]</div>
      <p class="entradilla">Cuatro salas para comprender la originalidad, el formato, la revisión por pares y la ética científica antes de postular un manuscrito.</p>
      <button type="button" class="btn-entrar" id="btn-entrar">Entrar al consorcio</button>
    </section>`;
  $("#btn-entrar").addEventListener("click", () => {
    estado.vista = "sala";
    estado.sala = 0;
    estado.paso = 0;
    estado.colocados = {};
    guardar();
    render();
  });
}

function renderSala() {
  const s = salaActual();
  const p = pasoActual();
  const tanques = p.tanques;
  const claseTanque = s.modo === "orden" ? "tanque orden" : "tanque";
  escena.innerHTML = `
    <section class="sala" data-sala="${s.id}">
      <div class="zona zona-reto">
        <p class="kicker">${s.kicker}${s.modo === "pasos" ? ` · Paso ${estado.paso + 1} de ${s.pasos.length}` : ""}</p>
        <h2>${s.nombre}</h2>
        <div class="carta-reto">
          <p class="etiqueta">${s.etiqueta}</p>
          <p>${p.reto}</p>
          ${s.tema ? `<div class="campo-tema"><label for="tema">Tema tentativo de tu investigación (opcional)</label>
            <input id="tema" type="text" maxlength="180" value="${escapeAttr(estado.tema)}" placeholder="Escríbelo aquí. Se usará en el reconocimiento."></div>` : ""}
        </div>
      </div>
      <div class="zona zona-tanques" id="zona-tanques">
        ${tanques.map((t) => `
          <div class="${claseTanque}" data-tanque="${t.id}" id="${t.id}">
            ${s.modo !== "orden" ? `<div class="agua"><img src="assets/disenografico/tanque_agua.svg" alt=""></div>` : ""}
            <h3>${t.etiqueta}</h3>
            <div class="tanque-cuerpo"><span class="pista-tanque">Suelta aquí</span></div>
          </div>`).join("")}
      </div>
      <div class="zona zona-mar">
        <p class="instruccion">${s.instruccion}</p>
        <div id="mar"></div>
        <div class="acciones-sala" id="acciones-sala" hidden>
          <button type="button" class="btn-seguir" id="btn-seguir">Continuar</button>
        </div>
      </div>
    </section>`;

  if (s.tema) {
    $("#tema").addEventListener("input", (e) => {
      estado.tema = e.target.value;
      guardar();
    });
  }

  const mar = $("#mar");
  const nodos = p.nodos.filter((n) => !estado.colocados[n.id]);
  const colocados = p.nodos.filter((n) => estado.colocados[n.id]);
  colocados.forEach((n) => ponerFicha(n, estado.colocados[n.id]));
  tanques.forEach((tk) => actualizarTanque(tk.id));

  const layout = distribuirNodos(nodos, mar);
  nodos.forEach((n, i) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "nodo";
    el.id = n.id;
    el.textContent = n.texto;
    const pos = layout[i];
    el.style.width = "max-content";
    mar.appendChild(el);
    // measure after insert
    const w = Math.min(el.offsetWidth, 320);
    const h = el.offsetHeight;
    const vivo = {
      data: n,
      el,
      x: pos.x,
      y: pos.y,
      w, h,
      vx: (Math.random() * 0.4 - 0.2),
      vy: (Math.random() * 0.3 - 0.15),
      fase: Math.random() * Math.PI * 2,
      t0: performance.now()
    };
    el.style.transform = `translate(${vivo.x}px, ${vivo.y}px)`;
    habilitarArrastre(vivo);
    nodosVivos.push(vivo);
  });
  acomodarNodos(foto);

  tanques.forEach((t) => {
    const caja = document.getElementById(t.id);
    caja.addEventListener("pointerup", (e) => {
      if (estado.elegido && !arrastre) {
        e.stopPropagation();
        intentarSoltar(estado.elegido, t.id);
      }
    });
  });

  revisarMeta();
  if (!foto) raf = requestAnimationFrame(animar);
  else congelarFoto();
}

function escapeAttr(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function columnasPara(n, maxCols) {
  let cols;
  if (n <= 3) cols = n || 1;
  else if (n === 4) cols = 2;
  else if (n <= 6) cols = 3;
  else if (n <= 8) cols = 4;
  else cols = 5;
  return Math.max(1, Math.min(cols, maxCols || cols));
}

function distribuirNodos(nodos, mar) {
  const W = mar.clientWidth || 1000;
  const H = mar.clientHeight || 500;
  const cols = columnasPara(nodos.length, 3);
  const filas = Math.ceil(nodos.length / cols);
  const layout = [];
  nodos.forEach((_, i) => {
    const c = i % cols;
    const f = Math.floor(i / cols);
    const enFila = (f === filas - 1) ? (nodos.length - f * cols) : cols;
    const cellW = (W - 24) / enFila;
    const cellH = (H - 20) / filas;
    const jitterX = foto ? 0 : (Math.random() * 24 - 12);
    const jitterY = foto ? 0 : (Math.random() * 18 - 9);
    layout.push({
      x: 12 + c * cellW + jitterX,
      y: 10 + f * cellH + jitterY
    });
  });
  return layout;
}

function acomodarNodos(congelar) {
  const mar = $("#mar");
  if (!mar || !nodosVivos.length) return;
  const W = mar.clientWidth, H = mar.clientHeight;
  const n = nodosVivos.length;
  const gapX = 20;
  const maxW = Math.max(...nodosVivos.map((nodo) => nodo.w));
  const maxCols = Math.max(1, Math.floor((W + gapX) / (maxW + gapX)));
  const cols = columnasPara(n, maxCols);
  const filas = Math.ceil(n / cols);
  const rows = [];
  for (let f = 0; f < filas; f++) rows.push(nodosVivos.slice(f * cols, f * cols + cols));
  const rowH = rows.map((row) => Math.max(...row.map((nodo) => nodo.h)));
  const gapY = 22;
  const totalH = rowH.reduce((a, b) => a + b, 0) + (filas - 1) * gapY;
  let y0 = Math.max(8, (H - totalH) / 2);
  rows.forEach((row, fi) => {
    const rowW = row.reduce((a, nodo) => a + nodo.w, 0) + (row.length - 1) * gapX;
    let x = Math.max(8, (W - rowW) / 2);
    row.forEach((nodo) => {
      const jx = congelar ? 0 : (Math.random() * 16 - 8);
      const jy = congelar ? 0 : (Math.random() * 12 - 6);
      nodo.x = Math.min(W - nodo.w, Math.max(0, x + jx));
      nodo.y = Math.min(H - nodo.h, Math.max(0, y0 + jy));
      nodo.el.style.transform = `translate(${nodo.x}px, ${nodo.y}px)`;
      x += nodo.w + gapX;
    });
    y0 += rowH[fi] + gapY;
  });
}

function congelarFoto() {
  acomodarNodos(true);
}

function animar(now) {
  const mar = $("#mar");
  if (!mar || foto) return;
  const W = mar.clientWidth, H = mar.clientHeight;
  nodosVivos.forEach((n) => {
    if (arrastre && arrastre.vivo === n) return;
    n.fase += 0.012;
    n.x += n.vx + Math.sin(n.fase) * 0.15;
    n.y += n.vy + Math.cos(n.fase * 0.8) * 0.12;
    if (n.x < 0) { n.x = 0; n.vx *= -1; }
    if (n.y < 0) { n.y = 0; n.vy *= -1; }
    if (n.x > W - n.w) { n.x = W - n.w; n.vx *= -1; }
    if (n.y > H - n.h) { n.y = H - n.h; n.vy *= -1; }
    n.el.style.transform = `translate(${n.x}px, ${n.y}px)`;
  });
  raf = requestAnimationFrame(animar);
}

function habilitarArrastre(vivo) {
  const el = vivo.el;
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const p = puntoLocal(e);
    const marR = $("#mar").getBoundingClientRect();
    const lienzoR = lienzo.getBoundingClientRect();
    const s = lienzoR.width / ANCHO;
    const origenMar = { x: (marR.left - lienzoR.left) / s, y: (marR.top - lienzoR.top) / s };
    arrastre = {
      vivo,
      dx: p.x - origenMar.x - vivo.x,
      dy: p.y - origenMar.y - vivo.y,
      x0: p.x,
      y0: p.y,
      moved: false
    };
    el.classList.add("arrastre");
    estado.elegido = null;
    document.querySelectorAll(".nodo.elegido").forEach((n) => n.classList.remove("elegido"));
  });
  el.addEventListener("pointermove", (e) => {
    if (!arrastre || arrastre.vivo !== vivo) return;
    const p = puntoLocal(e);
    if (Math.hypot(p.x - arrastre.x0, p.y - arrastre.y0) > 8) arrastre.moved = true;
    const marR = $("#mar").getBoundingClientRect();
    const lienzoR = lienzo.getBoundingClientRect();
    const s = lienzoR.width / ANCHO;
    const origenMar = { x: (marR.left - lienzoR.left) / s, y: (marR.top - lienzoR.top) / s };
    vivo.x = p.x - origenMar.x - arrastre.dx;
    vivo.y = p.y - origenMar.y - arrastre.dy;
    el.style.transform = `translate(${vivo.x}px, ${vivo.y}px)`;
    resaltarTanques(p);
  });
  el.addEventListener("pointerup", (e) => {
    if (!arrastre || arrastre.vivo !== vivo) return;
    el.releasePointerCapture(e.pointerId);
    el.classList.remove("arrastre");
    const p = puntoLocal(e);
    const tanque = tanqueBajoPunto(p);
    const moved = arrastre.moved;
    arrastre = null;
    document.querySelectorAll(".tanque.aceptando").forEach((t) => t.classList.remove("aceptando"));
    if (moved && tanque) {
      intentarSoltar(vivo, tanque);
    } else if (!moved) {
      document.querySelectorAll(".nodo.elegido").forEach((n) => n.classList.remove("elegido"));
      el.classList.add("elegido");
      estado.elegido = vivo;
      mostrarToast("Toca el tanque para colocar esta idea.");
    }
  });
  el.addEventListener("pointercancel", () => {
    if (arrastre && arrastre.vivo === vivo) {
      arrastre = null;
      el.classList.remove("arrastre");
    }
  });
}

function resaltarTanques(p) {
  document.querySelectorAll(".tanque").forEach((t) => {
    t.classList.toggle("aceptando", elementoContiene(t, p));
  });
}
function tanqueBajoPunto(p) {
  const cajas = [...document.querySelectorAll(".tanque")];
  const hit = cajas.find((t) => elementoContiene(t, p));
  return hit ? hit.dataset.tanque : null;
}
function elementoContiene(el, p) {
  const r = el.getBoundingClientRect();
  const lr = lienzo.getBoundingClientRect();
  const s = lr.width / ANCHO;
  const x = (r.left - lr.left) / s;
  const y = (r.top - lr.top) / s;
  const w = r.width / s, h = r.height / s;
  return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;
}

function intentarSoltar(vivo, tanqueId) {
  const n = vivo.data;
  const s = salaActual();
  const p = pasoActual();
  const tanque = p.tanques.find((t) => t.id === tanqueId);
  const caja = document.getElementById(tanqueId);
  const valido = n.valido && (!tanque.acepta || tanque.acepta === n.id) && (!n.tanque || n.tanque === tanqueId);
  if (!valido) {
    caja.classList.add("rechazando");
    setTimeout(() => caja.classList.remove("rechazando"), 450);
    mostrarToast(n.error || "Esa idea no corresponde a este compartimento.", true);
    return;
  }
  if (s.modo === "orden" && estado.colocados && Object.values(estado.colocados).includes(tanqueId)) {
    mostrarToast("Ese compartimento ya está ocupado.", true);
    return;
  }
  estado.colocados[n.id] = tanqueId;
  vivo.el.classList.add("colocado");
  const idx = nodosVivos.indexOf(vivo);
  if (idx >= 0) nodosVivos.splice(idx, 1);
  ponerFicha(n, tanqueId);
  estado.elegido = null;
  mostrarToast(n.ok || "Bien. La pieza encaja.");
  revisarMeta();
}

function ponerFicha(n, tanqueId) {
  const cuerpo = document.querySelector(`#${tanqueId} .tanque-cuerpo`);
  if (!cuerpo) return;
  const f = document.createElement("div");
  f.className = "ficha";
  f.textContent = n.texto;
  cuerpo.appendChild(f);
  actualizarTanque(tanqueId);
}

function actualizarTanque(tanqueId) {
  const caja = document.getElementById(tanqueId);
  if (!caja) return;
  const s = salaActual();
  const p = pasoActual();
  const validosNecesarios = s.modo === "orden"
    ? 1
    : p.nodos.filter((n) => n.valido && (!n.tanque || n.tanque === tanqueId)).length;
  const validosColocados = p.nodos.filter((n) => n.valido && estado.colocados[n.id] === tanqueId).length;
  if (s.modo !== "orden") {
    caja.style.setProperty("--nivel", String(validosNecesarios ? validosColocados / validosNecesarios : 0));
  }
  if (validosNecesarios > 0 && validosColocados >= validosNecesarios) {
    caja.classList.add("lleno");
  } else {
    caja.classList.remove("lleno");
  }
}

function revisarMeta() {
  const s = salaActual();
  const p = pasoActual();
  let completo = false;
  if (s.modo === "filtro") {
    const necesarios = p.nodos.filter((n) => n.valido);
    completo = necesarios.every((n) => estado.colocados[n.id]);
  } else if (s.modo === "orden") {
    completo = p.tanques.every((t) => Object.values(estado.colocados).includes(t.id));
  } else if (s.modo === "pasos") {
    const necesarios = p.nodos.filter((n) => n.valido);
    completo = necesarios.every((n) => estado.colocados[n.id]);
    if (completo && estado.paso < s.pasos.length - 1) {
      setTimeout(() => {
        estado.paso += 1;
        estado.colocados = {};
        guardar();
        render();
        mostrarToast("Observación atendida. Sigue con la siguiente.");
      }, 900);
      return;
    }
  }
  if (completo && !estado.llaves[estado.sala]) {
    estado.llaves[estado.sala] = true;
    guardar();
    svgLlaves();
    mostrarToast(`Has obtenido la ${s.llave}.`);
    const acc = $("#acciones-sala");
    if (acc) {
      acc.hidden = false;
      $("#btn-seguir").addEventListener("click", avanzar);
    }
  } else if (estado.llaves[estado.sala]) {
    const acc = $("#acciones-sala");
    if (acc) {
      acc.hidden = false;
      $("#btn-seguir").addEventListener("click", avanzar);
    }
  }
}

function avanzar() {
  if (estado.sala < SALAS.length - 1) {
    estado.sala += 1;
    estado.paso = 0;
    estado.colocados = {};
    estado.vista = "sala";
  } else {
    estado.vista = "cierre-form";
  }
  guardar();
  render();
}

function renderFormulario() {
  escena.innerHTML = `
    <section class="cierre">
      <h2>Registro de interés</h2>
      <p class="lead">Completaste las cuatro salas. Para emitir el reconocimiento, registra tus datos en este dispositivo. El envío al equipo editorial está [POR DEFINIR].</p>
      <form class="registro" id="form-registro">
        <label>Nombre completo
          <input name="nombre" type="text" required maxlength="120" value="${escapeAttr(estado.registro.nombre)}">
        </label>
        <label>Institución o facultad de adscripción
          <input name="institucion" type="text" required maxlength="160" value="${escapeAttr(estado.registro.institucion)}">
        </label>
        <label>Correo electrónico
          <input name="correo" type="email" required maxlength="120" value="${escapeAttr(estado.registro.correo)}">
        </label>
        <label>Teléfono o WhatsApp
          <input name="telefono" type="tel" required maxlength="40" value="${escapeAttr(estado.registro.telefono)}">
        </label>
        <label>Tema de investigación
          <input name="tema" type="text" maxlength="180" value="${escapeAttr(estado.tema)}" placeholder="El que registraste en la primera sala, si lo escribiste">
        </label>
        <label class="aviso">
          <input name="aviso" type="checkbox" ${estado.registro.aviso ? "checked" : ""} required>
          <span>Aviso de privacidad: tus datos personales (nombre, correo electrónico, teléfono y tema de investigación) serían recabados por la Revista Jandiekua (Agenda Ambiental – UASLP) con la única finalidad de brindar seguimiento editorial y enviarte convocatorias académicas. El aviso integral está [POR DEFINIR]. En esta versión del juego los datos solo se guardan en este dispositivo y no se envían a ningún servidor.</span>
        </label>
        <button type="submit" class="btn-principal">Generar reconocimiento</button>
        <p class="nota-local">El envío real está [POR DEFINIR].</p>
      </form>
    </section>`;
  $("#form-registro").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    estado.registro = {
      nombre: fd.get("nombre").trim(),
      institucion: fd.get("institucion").trim(),
      correo: fd.get("correo").trim(),
      telefono: fd.get("telefono").trim(),
      aviso: true
    };
    estado.tema = (fd.get("tema") || "").trim();
    estado.vista = "cierre-diploma";
    guardar();
    render();
  });
}

function fechaEmision() {
  const fmt = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "numeric", month: "long", year: "numeric"
  });
  return fmt.format(new Date());
}

async function renderDiploma() {
  escena.innerHTML = `
    <section class="cierre diploma-vista">
      <img class="insignia" src="assets/disenografico/insignia.svg" alt="" aria-hidden="true">
      <p class="leyenda-insignia">[POR DEFINIR]</p>
      <h2>Reconocimiento</h2>
      <p class="lead">Revista Jandiekua · Revista Mexicana de Educación Ambiental<br>Agenda Ambiental · UASLP</p>
      <div id="certificado-marco"><p style="padding:24px;color:#102438;text-align:center">Preparando el certificado…</p></div>
      <p class="rigor">Este recorrido no garantiza la aceptación del manuscrito, que sigue sujeto a la dictaminación por pares. El nombre de la insignia está [POR DEFINIR].</p>
      <div class="acciones-cierre">
        <button type="button" class="btn-descarga" id="btn-descarga">Descargar certificado en PNG</button>
        <a class="btn-envio" id="cta-manuscrito" href="#por-definir">Enviar manuscrito · [POR DEFINIR]</a>
      </div>
    </section>`;
  $("#cta-manuscrito").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarToast("El enlace de envío de manuscritos está [POR DEFINIR].");
  });
  const url = await dibujarCertificado();
  certificadoUrl = url;
  const marco = $("#certificado-marco");
  marco.innerHTML = "";
  const img = new Image();
  img.src = url;
  img.alt = "Certificado de recorrido del escape room Mar de las Ideas";
  marco.appendChild(img);
  $("#btn-descarga").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = certificadoUrl;
    a.download = "Certificado_Mar_de_las_Ideas_Jandiekua.png";
    a.click();
  });
}

async function dibujarCertificado() {
  await Promise.all([
    document.fonts.load("600 64px Fraunces"),
    document.fonts.load("italic 64px Fraunces"),
    document.fonts.load("600 32px Montserrat"),
    document.fonts.ready
  ]);
  const logo = new Image();
  logo.src = "assets/logos/logo_banner_blanco.png";
  const sello = new Image();
  sello.src = "assets/disenografico/insignia_sello.svg";
  await Promise.all([
    new Promise((res, rej) => { logo.onload = res; logo.onerror = rej; }),
    new Promise((res, rej) => { sello.onload = res; sello.onerror = rej; })
  ]);

  const W = 1080, H = 1350;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#F5F7F9";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#003B71";
  ctx.fillRect(0, 0, W, 210);
  const oro = ctx.createLinearGradient(0, 210, W, 214);
  oro.addColorStop(0, "#2E6B4E");
  oro.addColorStop(0.5, "#C59B27");
  oro.addColorStop(1, "#4A8B68");
  ctx.fillStyle = oro;
  ctx.fillRect(0, 210, W, 6);

  const logoH = 130;
  const logoW = logoH * (2890 / 590);
  ctx.drawImage(logo, (W - logoW) / 2, 40, logoW, logoH);

  // marco ornamental
  ctx.strokeStyle = "#C59B27";
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 240, W - 96, H - 320);
  ctx.strokeStyle = "#003B71";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(56, 248, W - 112, H - 336);

  ctx.fillStyle = "#003B71";
  ctx.font = "italic 56px Fraunces";
  ctx.textAlign = "center";
  ctx.fillText("Mar de las Ideas", W / 2, 330);
  ctx.font = "600 22px Montserrat";
  ctx.fillStyle = "#2E6B4E";
  ctx.fillText("ESCAPE ROOM VIRTUAL", W / 2, 372);
  ctx.font = "italic 34px Fraunces";
  ctx.fillStyle = "#003B71";
  ctx.fillText("Revista Jandiekua", W / 2, 430);
  ctx.font = "500 20px Montserrat";
  ctx.fillStyle = "#102438";
  ctx.fillText("Revista Mexicana de Educación Ambiental", W / 2, 464);
  ctx.fillText("Agenda Ambiental · Universidad Autónoma de San Luis Potosí", W / 2, 492);

  // logo revista pendiente
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "#4A8B68";
  ctx.strokeRect(W / 2 - 150, 516, 300, 90);
  ctx.setLineDash([]);
  ctx.font = "650 16px Montserrat";
  ctx.fillStyle = "#4A8B68";
  ctx.fillText("[LOGO JANDIEKUA]  [POR DEFINIR]", W / 2, 568);

  ctx.font = "500 22px Montserrat";
  ctx.fillStyle = "#102438";
  ctx.fillText("Otorga el presente reconocimiento a", W / 2, 650);

  const nombre = estado.registro.nombre || "Nombre de la persona participante";
  ctx.font = "italic 48px Fraunces";
  ctx.fillStyle = "#003B71";
  wrapText(ctx, nombre, W / 2, 710, W - 180, 54);

  ctx.font = "500 22px Montserrat";
  ctx.fillStyle = "#102438";
  ctx.fillText("por completar el recorrido formativo del escape room virtual.", W / 2, 800);

  ctx.drawImage(sello, W / 2 - 62, 806, 124, 124);
  ctx.font = "700 16px Montserrat";
  ctx.fillStyle = "#4A8B68";
  ctx.fillText("[POR DEFINIR]", W / 2, 948);

  if (estado.tema) {
    ctx.font = "500 20px Montserrat";
    ctx.fillStyle = "#2E6B4E";
    wrapText(ctx, "Tema de investigación: " + estado.tema, W / 2, 970, W - 200, 28);
  }

  ctx.font = "400 18px Montserrat";
  ctx.fillStyle = "#102438";
  wrapText(ctx,
    "Este reconocimiento acredita que quien participa comprendió las directrices clave del proceso editorial y puede iniciar una postulación. No garantiza la aceptación del manuscrito, sujeta a la dictaminación por pares.",
    W / 2, 1050, W - 200, 26);

  ctx.font = "500 18px Montserrat";
  ctx.fillStyle = "#003B71";
  ctx.fillText("Fecha de emisión: " + fechaEmision(), W / 2, 1140);

  ctx.fillStyle = "#003B71";
  ctx.fillRect(0, H - 70, W, 70);
  ctx.fillStyle = oro;
  ctx.fillRect(0, H - 74, W, 4);
  ctx.font = "600 18px Montserrat";
  ctx.fillStyle = "#D8E8DF";
  ctx.fillText("ext. 7200 y 7210", W / 2, H - 30);

  return c.toDataURL("image/png");
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW) {
      if (line) lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  const start = y - ((lines.length - 1) * lineH) / 2;
  lines.forEach((ln, i) => ctx.fillText(ln, x, start + i * lineH));
}

function abrirGlosario() {
  const cuerpo = $("#glosario-cuerpo");
  cuerpo.innerHTML = GLOSARIO.map((g) =>
    `<article class="entrada-glosario"><h3>${g.termino}</h3><p>${g.texto}</p></article>`
  ).join("");
  const nota = document.createElement("p");
  nota.style.marginTop = "12px";
  nota.style.fontSize = "16px";
  nota.style.color = "#003B71";
  nota.textContent = "El nombre de este recurso aparece en las fuentes como «Diccionario de la Revista» o «Códice Editorial». Queda [POR DEFINIR].";
  cuerpo.appendChild(nota);
  $("#modal-glosario").hidden = false;
}
function cerrarGlosario() {
  $("#modal-glosario").hidden = true;
}

function aplicarVistaDesdeURL() {
  const q = new URLSearchParams(location.search);
  foto = q.get("foto") === "1";
  if (foto) document.body.classList.add("foto");
  const v = q.get("vista");
  if (!v) return false;
  if (v === "portada") { estado.vista = "portada"; return true; }
  if (/^sala[1-4]$/.test(v)) {
    estado.vista = "sala";
    estado.sala = Number(v.slice(4)) - 1;
    estado.paso = 0;
    estado.colocados = {};
    estado.llaves = estado.llaves.map((_, i) => i < estado.sala);
    return true;
  }
  if (v === "cierre") {
    estado.vista = "cierre-diploma";
    estado.llaves = [true, true, true, true];
    if (!estado.registro.nombre) {
      estado.registro = {
        nombre: "Nombre de la persona participante",
        institucion: "Institución [POR DEFINIR]",
        correo: "",
        telefono: "",
        aviso: true
      };
    }
    return true;
  }
  return false;
}

function cargarFondoIlustrado() {
  const caja = $("#fondo");
  if (!caja || foto) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  fetch("assets/disenografico/fondo_mar.svg")
    .then((r) => r.text())
    .then((txt) => {
      caja.innerHTML = txt;
      const svg = caja.querySelector("svg");
      if (svg) {
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("preserveAspectRatio", "none");
      }
    })
    .catch(() => { /* se conserva la imagen estática */ });
}

function iniciar() {
  escalaLienzo();
  window.addEventListener("resize", escalaLienzo);
  cargarFondoIlustrado();
  if (!aplicarVistaDesdeURL()) cargar();
  if (!["portada", "sala", "cierre-form", "cierre-diploma"].includes(estado.vista)) {
    estado.vista = "portada";
  }
  $("#btn-glosario").addEventListener("click", abrirGlosario);
  $("#cerrar-glosario").addEventListener("click", cerrarGlosario);
  $("#modal-glosario").addEventListener("click", (e) => {
    if (e.target.id === "modal-glosario") cerrarGlosario();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarGlosario();
  });
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}

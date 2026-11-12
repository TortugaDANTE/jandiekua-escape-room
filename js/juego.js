/* Escape room virtual Mar de las Ideas — Revista Jandiekua
   Agenda Ambiental UASLP. Sin dependencias externas. */

const ANCHO = 1080;
const ALTO = 2022;
const VERSION = "20261112f";

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
  elegido: null,
  ideasJugador: [],
  predefIds: [],
  ideaSeq: 0
};

const nodosVivos = [];
let arrastre = null;
let raf = 0;
let foto = false;
let toastTimer = 0;
let certificadoUrl = "";
let relojMar = 0;
let ultimoFrame = 0;
let semillaRnd = 20261112;
let ideasPreview = 0;

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const lienzo = $("#lienzo");
const escena = $("#escena");
const escenario = $("#escenario");

function esPortraitEstrecho() {
  const w = window.innerWidth, h = window.innerHeight;
  return w < h && w <= 900;
}
function escalaLienzo() {
  const w = window.innerWidth, h = window.innerHeight;
  // En retrato estrecho se llena el ancho y, si el lienzo queda más alto, se desplaza #escenario.
  // En escritorio se mantiene el encuadre completo.
  const s = esPortraitEstrecho() ? (w / ANCHO) : Math.min(w / ANCHO, h / ALTO);
  lienzo.style.transform = `translate(-50%, 0) scale(${s})`;
  escenario.style.setProperty("--escala", String(s));
  return s;
}
function puntoLocal(e) {
  const r = lienzo.getBoundingClientRect();
  const s = r.width / ANCHO;
  return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
}
function origenMar() {
  const mar = $("#mar");
  if (!mar) return { x: 0, y: 0 };
  const mr = mar.getBoundingClientRect();
  const lr = lienzo.getBoundingClientRect();
  const s = lr.width / ANCHO;
  return { x: (mr.left - lr.left) / s, y: (mr.top - lr.top) / s };
}
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rnd = mulberry32(semillaRnd);
function movimientoReducido() {
  return foto || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function guardar() {
  try {
    localStorage.setItem("jandiekua-mar-" + VERSION, JSON.stringify({
      vista: estado.vista,
      sala: estado.sala,
      paso: estado.paso,
      llaves: estado.llaves,
      tema: estado.tema,
      registro: estado.registro,
      ideasJugador: estado.ideasJugador,
      predefIds: estado.predefIds,
      ideaSeq: estado.ideaSeq
    }));
  } catch (err) { /* almacenamiento no disponible */ }
}
function cargar() {
  try {
    const raw = localStorage.getItem("jandiekua-mar-" + VERSION);
    if (!raw) return;
    const d = JSON.parse(raw);
    Object.assign(estado, d, { colocado: {}, elegido: null, colocados: estado.colocados || {} });
    if (!Array.isArray(estado.ideasJugador)) estado.ideasJugador = [];
    if (!Array.isArray(estado.predefIds)) estado.predefIds = [];
    if (!estado.ideaSeq) estado.ideaSeq = estado.ideasJugador.length;
    estado.colocados = {};
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
  raf = 0;
  nodosVivos.length = 0;
  estado.elegido = null;
  arrastre = null;
  relojMar = 0;
  ultimoFrame = 0;
  const capa = $("#capa-arrastre");
  if (capa) capa.innerHTML = "";
  lienzo.classList.remove("arrastrando");
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
    estado.ideasJugador = [];
    estado.predefIds = [];
    estado.ideaSeq = 0;
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
        <form class="form-idea" id="form-idea">
          <label class="visually-hidden" for="nueva-idea">Escribe una idea</label>
          <input id="nueva-idea" name="idea" type="text" maxlength="180" autocomplete="off" placeholder="Escribe una idea y suéltala al mar">
          <button type="submit" class="btn-idea">Enviar al mar</button>
        </form>
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

  $("#form-idea").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#nueva-idea");
    const texto = (input.value || "").trim();
    if (!texto) return;
    input.value = "";
    agregarIdea(texto, { hundir: true });
  });

  const pNodos = p.nodos.filter((n) => !estado.colocados[n.id]);
  const colocados = p.nodos.filter((n) => estado.colocados[n.id]);
  colocados.forEach((n) => ponerFicha(n, estado.colocados[n.id]));
  tanques.forEach((tk) => actualizarTanque(tk.id));

  p.nodos.forEach((n) => {
    if (!estado.predefIds.includes(n.id)) estado.predefIds.push(n.id);
  });

  aplicarEscalaIdeas(true);
  pNodos.forEach((n) => nacerIdea(n, { predef: true, hundir: true }));
  estado.ideasJugador.filter((idea) => !idea.usada).forEach((idea) => {
    nacerIdea({ id: idea.id, texto: idea.texto, libre: true, valido: false }, { hundir: true });
  });
  aplicarEscalaIdeas(true);
  prepararHundimiento();

  tanques.forEach((t) => {
    const caja = document.getElementById(t.id);
    const soltarElegido = (e) => {
      if (estado.elegido && !arrastre) {
        e.stopPropagation();
        intentarSoltar(estado.elegido, t.id);
      }
    };
    caja.addEventListener("pointerup", soltarElegido);
    caja.addEventListener("click", soltarElegido);
  });

  revisarMeta();
  if (movimientoReducido()) asentarMar();
  else arrancarMar();
}

function escapeAttr(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function normalizarTexto(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function totalIdeasSesion() {
  return (estado.ideasJugador ? estado.ideasJugador.length : 0) + (estado.predefIds ? estado.predefIds.length : 0);
}

function medidaIdeas(n) {
  const t = Math.max(0, Math.min(1, (n - 6) / (200 - 6)));
  const e = t * t * (3 - 2 * t);
  return {
    font: Math.round(64 - e * 53),
    lado: Math.round(220 - e * 168),
    max: Math.round(280 - e * 200),
    min: Math.round(120 - e * 68),
    pad: Math.round(18 - e * 12)
  };
}

function aplicarEscalaIdeas(inmediato) {
  const mar = $("#mar");
  if (!mar) return;
  const m = medidaIdeas(totalIdeasSesion());
  mar.style.setProperty("--idea-fonte", m.font + "px");
  mar.style.setProperty("--idea-lado", m.lado + "px");
  mar.style.setProperty("--idea-max", m.max + "px");
  mar.style.setProperty("--idea-min", m.min + "px");
  mar.style.setProperty("--idea-pad", m.pad + "px");
  const capa = $("#capa-arrastre");
  if (capa) {
    capa.style.setProperty("--idea-fonte", m.font + "px");
    capa.style.setProperty("--idea-lado", m.lado + "px");
    capa.style.setProperty("--idea-max", m.max + "px");
    capa.style.setProperty("--idea-min", m.min + "px");
    capa.style.setProperty("--idea-pad", m.pad + "px");
  }
  nodosVivos.forEach((v) => {
    if (v.estado === "fuera") return;
    medirIdea(v);
    if (!inmediato) {
      v.dormido = false;
      v.contacto = false;
      v.quietoT = 0;
    }
  });
}

function medirIdea(v) {
  const el = v.el;
  v.w = Math.max(8, el.offsetWidth);
  v.h = Math.max(8, el.offsetHeight);
}

function nacerIdea(data, op = {}) {
  const mar = $("#mar");
  if (!mar) return null;
  const el = document.createElement("button");
  el.type = "button";
  el.className = "nodo";
  el.id = data.id;
  el.textContent = data.texto;
  el.setAttribute("aria-label", "Idea: " + data.texto);
  mar.appendChild(el);
  const vivo = {
    data,
    el,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    vx: 0,
    vy: 40 + rnd() * 50,
    a: (rnd() * 2 - 1) * 12,
    rest: (rnd() * 2 - 1) * 9,
    tilt: (rnd() * 2 - 1) * 12,
    fase: rnd() * Math.PI * 2,
    omega: 0.9 + rnd() * 0.7,
    amp: 14 + rnd() * 20,
    vt: 120 + rnd() * 60,
    sway: 1,
    estado: "cae",
    contacto: false,
    dormido: false,
    quietoT: 0,
    padre: "mar",
    delay: op.delay != null ? op.delay : 0
  };
  medirIdea(vivo);
  const W = mar.clientWidth || 1000;
  const hw = vivo.w;
  vivo.x = Math.max(0, Math.min(W - hw, (rnd() + rnd()) / 2 * (W - hw)));
  vivo.y = op.hundir && !movimientoReducido() ? -vivo.h - 8 - rnd() * 40 : 0;
  habilitarArrastre(vivo);
  nodosVivos.push(vivo);
  dibujarIdea(vivo);
  return vivo;
}

function agregarIdea(texto, op = {}) {
  const t = String(texto || "").trim();
  if (!t) return null;
  const dup = estado.ideasJugador.some((i) => !i.usada && normalizarTexto(i.texto) === normalizarTexto(t));
  if (dup) {
    mostrarToast("Esa idea ya está en el mar.", true);
    return null;
  }
  estado.ideaSeq += 1;
  const idea = { id: "idea-j-" + estado.ideaSeq, texto: t, usada: false };
  estado.ideasJugador.push(idea);
  guardar();
  const vivo = nacerIdea({ id: idea.id, texto: t, libre: true, valido: false }, { hundir: op.hundir !== false, delay: 0 });
  aplicarEscalaIdeas(false);
  if (movimientoReducido()) asentarMar();
  else arrancarMar();
  return vivo;
}

function agregarIdeasLote(textos) {
  const lista = Array.isArray(textos) ? textos : [];
  lista.forEach((texto, i) => {
    const t = String(texto || "").trim() || ("Idea " + (estado.ideaSeq + 1));
    estado.ideaSeq += 1;
    const idea = { id: "idea-j-" + estado.ideaSeq, texto: t, usada: false };
    estado.ideasJugador.push(idea);
    nacerIdea({ id: idea.id, texto: t, libre: true, valido: false }, { hundir: true, delay: 0 });
  });
  aplicarEscalaIdeas(false);
  if (movimientoReducido()) asentarMar();
  else arrancarMar();
  guardar();
}

function prepararHundimiento() {
  const n = nodosVivos.length;
  const paso = Math.max(40, Math.min(280, 2200 / Math.max(n, 1)));
  const orden = nodosVivos.map((_, i) => i).sort(() => rnd() - 0.5);
  orden.forEach((idx, k) => {
    nodosVivos[idx].delay = k * paso * (0.6 + rnd() * 0.6);
    // Permanecen visibles y se pueden tocar desde el primer instante (caen desde arriba).
  });
}

function dibujarIdea(v) {
  const o = v.padre === "capa" ? origenMar() : { x: 0, y: 0 };
  v.el.style.transform = `translate(${(v.x + o.x).toFixed(1)}px, ${(v.y + o.y).toFixed(1)}px) rotate(${v.a.toFixed(2)}deg)`;
}

function hw(v) { return v.w * 0.48; }
function hh(v) { return v.h * 0.46; }

function pasoFisica(dt) {
  const mar = $("#mar");
  if (!mar) return 0;
  const W = mar.clientWidth, H = mar.clientHeight;
  relojMar += dt;
  let despiertos = 0;
  for (const v of nodosVivos) {
    if (v.estado === "fuera") continue;
    if (relojMar * 1000 < v.delay) { despiertos++; continue; }
    if (v.estado === "agarrado") { despiertos++; continue; }
    if (v.dormido) continue;
    despiertos++;
    v.contacto = false;
    v.vy += (v.vt - v.vy) * 2.2 * dt;
    v.fase += v.omega * dt;
    const vaiven = v.amp * v.omega * Math.cos(v.fase) * v.sway;
    v.x += (vaiven + v.vx) * dt;
    v.y += v.vy * dt;
    v.vx *= Math.max(0, 1 - 1.6 * dt);
    const w = hw(v), h = hh(v);
    if (v.x + v.w / 2 < w) { v.x = w - v.w / 2; v.vx = Math.abs(v.vx); }
    if (v.x + v.w / 2 > W - w) { v.x = W - w - v.w / 2; v.vx = -Math.abs(v.vx); }
    if (v.x < 0) v.x = 0;
    if (v.x > W - v.w) v.x = W - v.w;
    if (v.y + v.h > H - 2) { v.y = H - v.h - 2; v.contacto = true; }
    if (v.y < -v.h) { /* todavía entrando */ }
  }
  for (let it = 0; it < 3; it++) {
    for (let i = 0; i < nodosVivos.length; i++) {
      const a = nodosVivos[i];
      if (a.estado !== "cae" || relojMar * 1000 < a.delay) continue;
      for (let j = i + 1; j < nodosVivos.length; j++) {
        const b = nodosVivos[j];
        if (b.estado !== "cae" || relojMar * 1000 < b.delay) continue;
        if (a.dormido && b.dormido) continue;
        const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
        const bx = b.x + b.w / 2, by = b.y + b.h / 2;
        const dx = ax - bx, dy = ay - by;
        const px = hw(a) + hw(b) - Math.abs(dx);
        const py = hh(a) + hh(b) - Math.abs(dy);
        if (px <= 0 || py <= 0) continue;
        if (py <= px * 1.35) {
          const arriba = dy < 0 ? a : b, abajo = dy < 0 ? b : a;
          if (abajo.dormido) arriba.y -= py;
          else if (arriba.dormido) abajo.y += py;
          else { arriba.y -= py * 0.55; abajo.y += py * 0.45; }
          if (!arriba.dormido) arriba.contacto = true;
        } else {
          const dir = dx === 0 ? (rnd() < 0.5 ? -1 : 1) : Math.sign(dx);
          if (a.dormido) b.x -= dir * px;
          else if (b.dormido) a.x += dir * px;
          else { a.x += dir * px * 0.5; b.x -= dir * px * 0.5; }
        }
      }
    }
  }
  for (const v of nodosVivos) {
    if (v.estado !== "cae" || v.dormido || relojMar * 1000 < v.delay) continue;
    if (v.x < 0) v.x = 0;
    if (v.x > W - v.w) v.x = Math.max(0, W - v.w);
    if (v.y + v.h > H) v.y = H - v.h;
    if (v.contacto) {
      v.vy = 0;
      v.sway = Math.max(0, v.sway - 1.8 * dt);
      v.quietoT += dt;
      if (v.quietoT > 0.55 && v.sway === 0) v.dormido = true;
    } else {
      v.quietoT = 0;
      v.sway = Math.min(1, v.sway + 0.4 * dt);
    }
    const asent = 1 - v.sway;
    const objetivo = (v.tilt * (1 - asent) + v.rest * asent) + Math.sin(v.fase * 0.9 + 1) * 7 * v.sway;
    v.a += (objetivo - v.a) * Math.min(1, 5 * dt);
  }
  return despiertos;
}

function bucleMar(ahora) {
  if (movimientoReducido()) return;
  const dt = Math.min((ahora - (ultimoFrame || ahora)) / 1000, 1 / 30);
  ultimoFrame = ahora;
  const n = pasoFisica(dt);
  nodosVivos.forEach((v) => {
    if (v.estado === "fuera") return;
    if (v.padre === "capa" && v.estado === "cae") {
      const o = origenMar();
      if (v.y > 8) {
        $("#mar").appendChild(v.el);
        v.padre = "mar";
      }
    }
    if (!v.dormido || v.estado === "agarrado") dibujarIdea(v);
  });
  if (n > 0 || arrastre) raf = requestAnimationFrame(bucleMar);
  else { raf = 0; ultimoFrame = 0; }
}

function arrancarMar() {
  if (!raf && !movimientoReducido()) {
    ultimoFrame = 0;
    raf = requestAnimationFrame(bucleMar);
  }
}

function despertarMar(excepto) {
  nodosVivos.forEach((v) => {
    if (v === excepto || v.estado === "fuera" || v.estado === "agarrado") return;
    v.dormido = false;
    v.quietoT = 0;
  });
  arrancarMar();
}

function asentarMar() {
  cancelAnimationFrame(raf);
  raf = 0;
  relojMar = 10;
  nodosVivos.forEach((v) => { v.delay = 0; v.el.style.visibility = ""; });
  const pasos = nodosVivos.length > 80 ? 60 * 8 : 60 * 16;
  for (let i = 0; i < pasos; i++) pasoFisica(1 / 60);
  nodosVivos.forEach((v) => {
    if (v.estado === "fuera") return;
    v.dormido = true;
    v.sway = 0;
    v.vy = 0;
    v.a = v.rest;
    if (v.padre === "capa") {
      $("#mar").appendChild(v.el);
      v.padre = "mar";
    }
    dibujarIdea(v);
  });
}

function aCapa(v) {
  const capa = $("#capa-arrastre");
  if (!capa || v.padre === "capa") return;
  capa.appendChild(v.el);
  v.padre = "capa";
  dibujarIdea(v);
}

function volverAlMar(v) {
  const mar = $("#mar");
  if (!mar || v.padre !== "capa") return;
  mar.appendChild(v.el);
  v.padre = "mar";
  dibujarIdea(v);
}

function habilitarArrastre(vivo) {
  const el = vivo.el;
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const p = puntoLocal(e);
    const o = origenMar();
    vivo.estado = "agarrado";
    vivo.dormido = false;
    arrastre = {
      vivo,
      id: e.pointerId,
      dx: p.x - (o.x + vivo.x),
      dy: p.y - (o.y + vivo.y),
      x0: p.x,
      y0: p.y,
      moved: false
    };
    el.classList.add("arrastre");
    estado.elegido = null;
    document.querySelectorAll(".nodo.elegido").forEach((n) => n.classList.remove("elegido"));
    escenario.style.overflowY = "hidden";
  });
  el.addEventListener("pointermove", (e) => {
    if (!arrastre || arrastre.vivo !== vivo || e.pointerId !== arrastre.id) return;
    const p = puntoLocal(e);
    if (!arrastre.moved && Math.hypot(p.x - arrastre.x0, p.y - arrastre.y0) > 8) {
      arrastre.moved = true;
      aCapa(vivo);
      lienzo.classList.add("arrastrando");
      despertarMar(vivo);
    }
    if (!arrastre.moved) return;
    const o = origenMar();
    vivo.x = p.x - arrastre.dx - o.x;
    vivo.y = p.y - arrastre.dy - o.y;
    vivo.a += (0 - vivo.a) * 0.25;
    dibujarIdea(vivo);
    resaltarTanques(p);
  });
  const soltar = (e, cancel) => {
    if (!arrastre || arrastre.vivo !== vivo || (e.pointerId != null && e.pointerId !== arrastre.id)) return;
    try { el.releasePointerCapture(e.pointerId); } catch (err) { /* ya liberado */ }
    el.classList.remove("arrastre");
    const p = puntoLocal(e);
    const moved = arrastre.moved;
    arrastre = null;
    escenario.style.overflowY = "";
    lienzo.classList.remove("arrastrando");
    document.querySelectorAll(".tanque.aceptando").forEach((tk) => tk.classList.remove("aceptando"));
    const tanque = !cancel && moved ? tanqueBajoPunto(p) : null;
    if (tanque) {
      const ok = intentarSoltar(vivo, tanque);
      if (ok) return;
    }
    volverAlMar(vivo);
    vivo.estado = "cae";
    vivo.vy = moved ? 40 : 0;
    vivo.sway = moved ? 1 : 0;
    vivo.dormido = !moved;
    vivo.quietoT = 0;
    if (!moved && !cancel) {
      document.querySelectorAll(".nodo.elegido").forEach((n) => n.classList.remove("elegido"));
      el.classList.add("elegido");
      estado.elegido = vivo;
      mostrarToast("Toca el tanque para colocar esta idea.");
    }
    arrancarMar();
  };
  el.addEventListener("pointerup", (e) => soltar(e, false));
  el.addEventListener("pointercancel", (e) => soltar(e, true));
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

function resolverDatosIdea(vivo) {
  const n = vivo.data;
  if (!n.libre) return n;
  const clave = normalizarTexto(n.texto);
  const p = pasoActual();
  const match = p.nodos.find((x) => normalizarTexto(x.texto) === clave);
  if (!match) {
    return { ...n, valido: false, error: "Esa idea no corresponde a este compartimento." };
  }
  if (estado.colocados[match.id]) {
    return { ...n, valido: false, error: "Esa idea ya está en el tanque." };
  }
  return match;
}

function intentarSoltar(vivo, tanqueId) {
  const n = resolverDatosIdea(vivo);
  const s = salaActual();
  const p = pasoActual();
  const tanque = p.tanques.find((t) => t.id === tanqueId);
  const caja = document.getElementById(tanqueId);
  const valido = n.valido && (!tanque.acepta || tanque.acepta === n.id) && (!n.tanque || n.tanque === tanqueId);
  if (!valido) {
    caja.classList.add("rechazando");
    setTimeout(() => caja.classList.remove("rechazando"), 450);
    mostrarToast(n.error || "Esa idea no corresponde a este compartimento.", true);
    return false;
  }
  if (s.modo === "orden" && estado.colocados && Object.values(estado.colocados).includes(tanqueId)) {
    mostrarToast("Ese compartimento ya está ocupado.", true);
    return false;
  }
  estado.colocados[n.id] = tanqueId;
  const propia = estado.ideasJugador.find((i) => i.id === vivo.data.id);
  if (propia) propia.usada = true;
  // si se usó el texto de una idea predefinida que aún flota, retirarla
  nodosVivos.forEach((otro) => {
    if (otro === vivo || otro.estado === "fuera") return;
    if (otro.data && otro.data.id === n.id) {
      otro.estado = "fuera";
      otro.el.classList.add("colocado");
    }
  });
  vivo.estado = "fuera";
  vivo.el.classList.add("colocado");
  const idx = nodosVivos.indexOf(vivo);
  if (idx >= 0) nodosVivos.splice(idx, 1);
  if (vivo.el.parentNode) vivo.el.remove();
  ponerFicha(n, tanqueId);
  estado.elegido = null;
  mostrarToast(n.ok || "Bien. La pieza encaja.");
  aplicarEscalaIdeas(false);
  despertarMar();
  revisarMeta();
  guardar();
  return true;
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
  const logoU = new Image();
  logoU.src = "assets/logos/hd/logo_uaslp_blanco.png";
  const logoA = new Image();
  logoA.src = "assets/logos/hd/logo_aa_blanco.png";
  const sello = new Image();
  sello.src = "assets/disenografico/insignia_sello.svg";
  await Promise.all([
    new Promise((res, rej) => { logoU.onload = res; logoU.onerror = rej; }),
    new Promise((res, rej) => { logoA.onload = res; logoA.onerror = rej; }),
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

  const logoH = 112;
  const wU = logoH * (logoU.width / logoU.height);
  const wA = logoH * (logoA.width / logoA.height);
  ctx.drawImage(logoU, 56, (210 - logoH) / 2, wU, logoH);
  ctx.drawImage(logoA, W - 56 - wA, (210 - logoH) / 2, wA, logoH);

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
  const semilla = q.get("semilla");
  semillaRnd = semilla ? Number(semilla) : (foto ? 20261112 : ((Math.random() * 1e9) | 0));
  rnd = mulberry32(semillaRnd);
  ideasPreview = Number(q.get("ideas") || 0) || 0;
  const v = q.get("vista");
  if (!v) return false;
  if (v === "portada") { estado.vista = "portada"; return true; }
  if (/^sala[1-4]$/.test(v)) {
    estado.vista = "sala";
    estado.sala = Number(v.slice(4)) - 1;
    estado.paso = 0;
    estado.colocados = {};
    estado.llaves = estado.llaves.map((_, i) => i < estado.sala);
    estado.ideasJugador = [];
    estado.predefIds = [];
    estado.ideaSeq = 0;
    if (ideasPreview > 0) {
      for (let i = 0; i < ideasPreview; i++) {
        estado.ideaSeq += 1;
        estado.ideasJugador.push({
          id: "idea-j-" + estado.ideaSeq,
          texto: "Idea " + (i + 1) + " del consorcio",
          usada: false
        });
      }
    }
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
  if (window.visualViewport) {
    visualViewport.addEventListener("resize", escalaLienzo);
  }
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

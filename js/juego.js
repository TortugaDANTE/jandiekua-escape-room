import * as DatosMod from './datos.js?v=20261112i';
const Datos = Object.assign({}, DatosMod.default || {}, DatosMod, { normalizar: DatosMod.claveDe });
window.Datos = Datos;

/* Escape room virtual Mar de las Ideas — Revista Jandiekua
   Agenda Ambiental UASLP. Sin dependencias externas. */

const ANCHO = 1080;
const ALTO = 2022;
const ACUARIO_SVG = '<svg class="acuario-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 605" preserveAspectRatio="none" aria-hidden="true">\n  <defs>\n    <linearGradient id="arena" x1="0" y1="0" x2="0" y2="1">\n      <stop offset="0" stop-color="#C59B27" stop-opacity=".0"/>\n      <stop offset=".45" stop-color="#8A6A12" stop-opacity=".18"/>\n      <stop offset="1" stop-color="#5C4A18" stop-opacity=".45"/>\n    </linearGradient>\n    <linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1">\n      <stop offset="0" stop-color="#D8E8DF" stop-opacity=".16"/>\n      <stop offset="1" stop-color="#D8E8DF" stop-opacity="0"/>\n    </linearGradient>\n    <linearGradient id="alga" x1="0" y1="1" x2="0" y2="0">\n      <stop offset="0" stop-color="#2E6B4E"/>\n      <stop offset="1" stop-color="#4A8B68" stop-opacity=".85"/>\n    </linearGradient>\n  </defs>\n  <!-- caustics / refraction bands -->\n  <g opacity=".22" fill="none" stroke="#D8E8DF" stroke-width="1.2">\n    <path d="M0 90 Q180 70 360 100 T720 90 T1080 110" opacity=".7"/>\n    <path d="M0 130 Q200 150 400 120 T800 140 T1080 125" opacity=".45"/>\n    <path d="M0 170 Q160 155 320 180 T640 165 T1080 185" opacity=".35"/>\n  </g>\n  <!-- light rays -->\n  <g fill="url(#rayo)">\n    <polygon points="220,-10 310,-10 260,400 170,400" opacity=".8"/>\n    <polygon points="520,-10 590,-10 560,360 490,360" opacity=".55"/>\n    <polygon points="820,-10 900,-10 870,420 790,420" opacity=".65"/>\n  </g>\n  <!-- sand bottom -->\n  <path fill="url(#arena)" d="M0 500 C80 488 160 520 260 505 C360 488 470 525 580 508 C700 490 820 528 930 510 C1000 500 1040 518 1080 508 L1080 605 L0 605 Z"/>\n  <g fill="#C59B27" opacity=".2">\n    <circle cx="90" cy="560" r="4"/><circle cx="140" cy="575" r="3"/><circle cx="320" cy="568" r="3.5"/>\n    <circle cx="510" cy="580" r="4"/><circle cx="700" cy="565" r="3"/><circle cx="880" cy="578" r="4"/>\n    <circle cx="990" cy="555" r="2.5"/>\n  </g>\n  <!-- seaweed / coral, left -->\n  <g fill="url(#alga)" opacity=".85">\n    <path d="M70 605 C60 540 90 520 70 460 C50 400 95 390 80 330 C88 400 55 420 85 480 C100 530 55 550 70 605Z"/>\n    <path d="M110 605 C125 530 95 510 120 440 C140 380 100 370 115 320 C108 380 145 400 108 470 C90 530 130 560 110 605Z"/>\n    <path d="M40 605 C30 550 55 530 38 480 C22 430 58 425 48 390 C52 440 20 455 50 510 C62 545 28 565 40 605Z"/>\n  </g>\n  <!-- right -->\n  <g fill="url(#alga)" opacity=".8">\n    <path d="M1010 605 C1022 540 990 520 1015 455 C1038 400 990 390 1008 335 C1000 400 1040 420 1000 485 C985 535 1028 555 1010 605Z"/>\n    <path d="M1050 605 C1062 550 1038 535 1055 485 C1072 435 1038 428 1050 390 C1045 440 1078 455 1048 510 C1036 545 1068 565 1050 605Z"/>\n    <path d="M970 605 C955 545 990 525 968 470 C948 415 990 410 975 360 C980 420 945 435 985 500 C1000 545 958 560 970 605Z"/>\n  </g>\n  <!-- small coral clusters -->\n  <g fill="#C59B27" opacity=".35">\n    <path d="M200 600 l8-28 8 14 7-22 7 22 8-14 8 28z"/>\n    <path d="M860 600 l6-22 7 11 6-18 6 18 7-11 6 22z"/>\n  </g>\n  <!-- two slow fish silhouettes (animated via CSS on groups) -->\n  <g class="pez pez-a" fill="#102438" opacity=".28">\n    <ellipse cx="0" cy="0" rx="22" ry="10"/>\n    <polygon points="18,0 34,-9 34,9"/>\n    <circle cx="-8" cy="-2" r="1.4" fill="#D8E8DF" opacity=".8"/>\n  </g>\n  <g class="pez pez-b" fill="#102438" opacity=".2">\n    <ellipse cx="0" cy="0" rx="16" ry="7"/>\n    <polygon points="-14,0 -26,-7 -26,7"/>\n    <circle cx="6" cy="-1.5" r="1.1" fill="#D8E8DF" opacity=".8"/>\n  </g>\n</svg>\n';
const VERSION = "20261112i";

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
  ideaSeq: 0,
  sesion: "",
  aportados: [],
  tituloListo: false,
  conceptosUnicos: 0
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

function salaApi() {
  return (Number(estado.sala) || 0) + 1;
}
function asegurarSesion() {
  if (estado.sesion && /^[A-Za-z0-9_-]{8,128}$/.test(estado.sesion)) return estado.sesion;
  estado.sesion = (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : ("ses-" + Date.now() + "-jandiekua");
  return estado.sesion;
}
function debePersistir() {
  try { return new URLSearchParams(location.search).get("sinred") !== "1"; }
  catch (_) { return true; }
}
async function cargarConceptosLista() {
  if (!window.Datos || !Datos.cargarConceptos) return [];
  try {
    const r = await Datos.cargarConceptos();
    if (Array.isArray(r)) return r;
    return (r && r.conceptos) || [];
  } catch (err) {
    console.warn("cargarConceptos", err);
    return [];
  }
}

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
      ideaSeq: estado.ideaSeq,
      sesion: estado.sesion,
      aportados: estado.aportados,
      tituloListo: estado.tituloListo
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
    if (!Array.isArray(estado.aportados)) estado.aportados = [];
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
  if (window.MarIdeas) MarIdeas.detener();
  cancelAnimationFrame(raf);
  raf = 0;
  nodosVivos.length = 0;
  estado.elegido = null;
  arrastre = null;
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
  if (estado.vista === "sala") return renderSala();
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
      <p class="aviso-juego">Mar de las Ideas es un juego formativo. No sustituye el proceso formal de envío y dictaminación de la Revista Jandiekua.</p>
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
    estado.sesion = "";
    asegurarSesion();
    estado.aportados = [];
    estado.tituloListo = false;
    estado.tema = "";
    estado.conceptosUnicos = 0;
    guardar();
    render();
  });
}

async function renderSala() {
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
          ${s.tema ? `<div class="campo-tema">
            <label for="tema">Título de tu investigación</label>
            <input id="tema" type="text" required maxlength="180" value="${escapeAttr(estado.tema)}" placeholder="Escríbelo para habilitar el tanque y el Mar de Ideas.">
            <p class="ayuda-titulo">Es el primer paso del juego y aparecerá en tu reconocimiento con la etiqueta «Título».</p>
            ${estado.tituloListo ? "" : `<button type="button" class="btn-principal" id="btn-registrar-titulo">Registrar título</button>`}
          </div>` : ""}
        </div>
      </div>
      <div class="zona zona-tanques${s.tema && !estado.tituloListo ? " bloqueado" : ""}" id="zona-tanques">
        ${tanques.map((t) => `
          <div class="${claseTanque}" data-tanque="${t.id}" id="${t.id}">
            ${s.modo !== "orden" ? `<div class="agua"><img src="assets/disenografico/tanque_agua.svg" alt=""></div>` : ""}
            <h3>${t.etiqueta}</h3>
            <div class="tanque-cuerpo"><span class="pista-tanque">Suelta aquí</span></div>
          </div>`).join("")}
      </div>
      <div class="zona zona-mar${s.tema && !estado.tituloListo ? " bloqueado" : ""}">
        <div class="acuario" aria-hidden="true">${ACUARIO_SVG}
          <div class="acuario-burbujas"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        </div>
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
    $("#tema").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); registrarTitulo(); }
    });
    const btnT = $("#btn-registrar-titulo");
    if (btnT) btnT.addEventListener("click", registrarTitulo);
    if (!estado.tituloListo) setTimeout(() => $("#tema") && $("#tema").focus(), 200);
  }

  $("#form-idea").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#nueva-idea");
    const texto = (input.value || "").trim();
    if (!texto) return;
    input.value = "";
    agregarIdea(texto);
  });

  const colocados = p.nodos.filter((n) => estado.colocados[n.id]);
  colocados.forEach((n) => ponerFicha(n, estado.colocados[n.id]));
  tanques.forEach((tk) => actualizarTanque(tk.id));

  tanques.forEach((t) => {
    const caja = document.getElementById(t.id);
    const soltarElegido = (e) => {
      if (estado.elegido && !MarIdeas.arrastrando()) {
        e.stopPropagation();
        intentarSoltar(estado.elegido, t.id);
      }
    };
    caja.addEventListener("pointerup", soltarElegido);
    caja.addEventListener("click", soltarElegido);
  });

  await poblarMar(s, p);
  revisarMeta();
}

function tituloListoAhora() {
  return !salaActual().tema || !!estado.tituloListo;
}
function registrarTitulo() {
  const input = $("#tema");
  const v = ((input && input.value) || estado.tema || "").trim();
  if (v.length < 3) {
    mostrarToast("Escribe el título de tu investigación (al menos 3 caracteres).", true);
    if (input) input.focus();
    return false;
  }
  estado.tema = v;
  estado.tituloListo = true;
  guardar();
  if (debePersistir() && window.Datos && Datos.aportarConcepto) {
    Datos.aportarConcepto({
      texto: v,
      sala: 1,
      salaNombre: (salaActual() && salaActual().nombre) || "Túnel de la Originalidad",
      tipo: "titulo",
      sesion: asegurarSesion(),
      tituloInvestigacion: v
    }).catch((err) => console.warn("titulo", err));
  }
  const zt = document.querySelector(".zona-tanques");
  const zm = document.querySelector(".zona-mar");
  if (zt) zt.classList.remove("bloqueado");
  if (zm) zm.classList.remove("bloqueado");
  const btn = $("#btn-registrar-titulo");
  if (btn) btn.remove();
  mostrarToast("Título registrado. Ya puedes usar el tanque y el Mar de Ideas.");
  return true;
}

function escapeAttr(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function normalizarTexto(s) {
  return (window.Datos && Datos.normalizar) ? Datos.normalizar(s) : String(s || "").trim();
}

function totalIdeasSesion() {
  const vivos = nodosVivos.filter((v) => v.estado !== "fuera").length;
  return Math.max(vivos, estado.conceptosUnicos || 0);
}

function medidaIdeas(n) {
  const r = lienzo.getBoundingClientRect();
  const sL = (r.width / ANCHO) || 1;
  const minFont = Math.ceil(12 / Math.max(sL, 0.15));
  const t = Math.max(0, Math.min(1, (n - 6) / (200 - 6)));
  const e = t * t * (3 - 2 * t);
  return {
    font: Math.max(minFont, Math.round(64 - e * (64 - minFont))),
    lado: Math.round(240 - e * 140),
    max: Math.round(300 - e * 160),
    min: Math.round(140 - e * 70),
    pad: Math.round(18 - e * 10)
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
  const marEl = $("#mar");
  if (marEl) marEl.style.overflowY = totalIdeasSesion() > 40 ? "auto" : "visible";
  if (!inmediato && window.MarIdeas && MarIdeas.recalcular) MarIdeas.recalcular();
}

function medirIdea(v) {
  const el = v.el;
  v.w = Math.max(8, el.offsetWidth);
  v.h = Math.max(8, el.offsetHeight);
}

function insigniaPersonas(el, n) {
  let badge = el.querySelector(".insignia-personas");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "insignia-personas";
    el.appendChild(badge);
  }
  badge.textContent = "×" + n + " personas";
  badge.hidden = !(n >= 2);
}

function crearNodoMar(data, concepto) {
  const mar = $("#mar");
  const el = document.createElement("button");
  el.type = "button";
  el.className = "nodo";
  el.id = data.id;
  el.appendChild(document.createTextNode(data.texto));
  el.setAttribute("aria-label", "Idea: " + data.texto);
  const personas = concepto && concepto.personas ? concepto.personas : 1;
  insigniaPersonas(el, personas);
  mar.appendChild(el);
  return {
    data,
    el,
    clave: (concepto && concepto.clave) || normalizarTexto(data.texto),
    personas
  };
}

async function poblarMar(s, p) {
  const mar = $("#mar");
  if (!mar) return;
  const conceptos = await cargarConceptosLista();
  estado.conceptosUnicos = conceptos.length;
  const usados = new Set();
  p.nodos.filter((n) => !estado.colocados[n.id]).forEach((n) => {
    const clave = normalizarTexto(n.texto);
    usados.add(clave);
    const c = conceptos.find((x) => x.clave === clave);
    nodosVivos.push(crearNodoMar(n, c));
  });
  conceptos.forEach((c) => {
    if (!c || !c.clave || usados.has(c.clave)) return;
    usados.add(c.clave);
    nodosVivos.push(crearNodoMar({
      id: "concepto-" + String(c.clave).replace(/\s+/g, "-").slice(0, 48),
      texto: c.texto || c.clave,
      libre: true,
      valido: false
    }, c));
  });
  if (ideasPreview > 0) {
    for (let i = 0; i < ideasPreview; i++) {
      nodosVivos.push(crearNodoMar({
        id: "senuelo-" + (i + 1),
        texto: "Idea " + (i + 1) + " del consorcio",
        libre: true,
        valido: false
      }, { clave: "senuelo-" + (i + 1), personas: 1 }));
    }
    ideasPreview = 0;
  }
  aplicarEscalaIdeas(true);
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
  mar.dataset.listo = '1';
}

async function agregarIdea(texto, op = {}) {
  const t = String(texto || "").trim();
  if (!t) return null;
  if (!tituloListoAhora()) {
    mostrarToast("Primero registra el título de tu investigación.", true);
    return null;
  }
  const s = salaActual();
  const claveLocal = normalizarTexto(t);
  let res = { ok: false, clave: claveLocal, personas: 1, nuevo: true };
  if (!op.local && debePersistir() && window.Datos && Datos.aportarConcepto) {
    res = await Datos.aportarConcepto({
      texto: t,
      sala: salaApi(),
      salaNombre: s.nombre,
      tipo: op.tipo || "jugador",
      sesion: asegurarSesion(),
      tituloInvestigacion: estado.tema
    });
    if (res && res.ok === false) {
      console.warn("aportarConcepto", res.error);
      res = { ok: false, clave: claveLocal, personas: 1, nuevo: true };
    }
  } else if (op.local) {
    res = { ok: true, clave: claveLocal, personas: 1, nuevo: true };
  }
  if (res && res.clave && estado.aportados && !estado.aportados.includes(res.clave)) {
    estado.aportados.push(res.clave);
  }
  const vivo = nodosVivos.find((v) => v.clave === (res.clave || claveLocal) && v.estado !== "fuera");
  if (vivo && res.nuevo === false) {
    vivo.personas = res.personas || (vivo.personas || 1);
    insigniaPersonas(vivo.el, vivo.personas);
    estado.conceptosUnicos = Math.max(estado.conceptosUnicos || 0, 1);
    aplicarEscalaIdeas(false);
    if (window.MarIdeas) MarIdeas.resaltar(vivo);
    mostrarToast("Esa idea ya estaba en el mar. ×" + vivo.personas + " personas.");
    return vivo;
  }
  if (vivo && res.nuevo !== false) {
    // ya visible (p. ej. pieza de la sala): solo actualizar insignia si creció
    if (res.personas) {
      vivo.personas = res.personas;
      insigniaPersonas(vivo.el, vivo.personas);
      if (window.MarIdeas) MarIdeas.resaltar(vivo);
    }
    return vivo;
  }
  const paso = pasoActual();
  const clave = res.clave || claveLocal;
  const match = paso.nodos.find((x) => normalizarTexto(x.texto) === clave);
  const data = match || { id: "concepto-" + String(clave).replace(/\s+/g, "-").slice(0, 48), texto: t, libre: true, valido: false };
  const v = crearNodoMar(data, { clave, personas: res.personas || 1, texto: t });
  nodosVivos.push(v);
  estado.conceptosUnicos = Math.max(estado.conceptosUnicos || 0, nodosVivos.filter((n) => n.estado !== "fuera").length);
  aplicarEscalaIdeas(false);
  if (window.MarIdeas) MarIdeas.agregar(v);
  return v;
}

async function agregarIdeasLote(textos, op = {}) {
  const lista = Array.isArray(textos) ? textos : [];
  for (const texto of lista) {
    await agregarIdea(texto, { local: op.local !== false });
  }
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
  const clave = vivo.clave || normalizarTexto(n.texto);
  if (debePersistir() && window.Datos) {
    Datos.guardarColocacion({ clave, sesion: asegurarSesion(), sala: salaApi(), tanque: tanqueId });
  }
  if (window.MarIdeas) MarIdeas.absorber(vivo, tanqueId);
  else vivo.el.classList.add("colocado");
  vivo.estado = "fuera";
  const idx = nodosVivos.indexOf(vivo);
  if (idx >= 0) nodosVivos.splice(idx, 1);
  ponerFicha(n, tanqueId);
  estado.elegido = null;
  mostrarToast(n.ok || "Bien. La pieza encaja.");
  aplicarEscalaIdeas(false);
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
  if (completo && s.tema && !estado.tituloListo) {
    mostrarToast("Registra el título de tu investigación para obtener la Llave de Pertinencia.", true);
    return;
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
      <p class="aviso-termino">¡Terminaste el juego!</p>
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
        <label>Título
          <input name="titulo" type="text" required maxlength="180" value="${escapeAttr(estado.tema)}" placeholder="El título que registraste en la primera sala">
        </label>
        <label class="aviso">
          <input name="aviso" type="checkbox" ${estado.registro.aviso ? "checked" : ""} required>
          <span>Aviso de privacidad: tus datos personales (nombre, correo electrónico, teléfono y título de investigación) serían recabados por la Revista Jandiekua (Agenda Ambiental – UASLP) con la única finalidad de brindar seguimiento editorial y enviarte convocatorias académicas. El aviso integral está [POR DEFINIR]. En esta versión del juego los datos solo se guardan en este dispositivo y no se envían a ningún servidor.</span>
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
    estado.tema = (fd.get("titulo") || fd.get("tema") || "").trim();
    estado.vista = "cierre-diploma";
    guardar();
    if (debePersistir() && window.Datos && Datos.registrarParticipante) {
      Datos.registrarParticipante({
        sesion: asegurarSesion(),
        nombre: estado.registro.nombre,
        procedencia: estado.registro.institucion,
        tituloInvestigacion: estado.tema,
        claves: estado.aportados
      }).catch((err) => console.warn("registrarParticipante", err));
    }
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
  ctx.font = "700 20px Montserrat";
  ctx.fillStyle = "#2E6B4E";
  ctx.fillText("Juego formativo", W / 2, 462);
  ctx.font = "500 20px Montserrat";
  ctx.fillStyle = "#102438";
  ctx.fillText("Revista Mexicana de Educación Ambiental", W / 2, 492);
  ctx.fillText("Agenda Ambiental · Universidad Autónoma de San Luis Potosí", W / 2, 520);

  // logo revista pendiente
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "#4A8B68";
  ctx.strokeRect(W / 2 - 150, 540, 300, 80);
  ctx.setLineDash([]);
  ctx.font = "650 16px Montserrat";
  ctx.fillStyle = "#4A8B68";
  ctx.fillText("[LOGO JANDIEKUA]  [POR DEFINIR]", W / 2, 586);

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
    wrapText(ctx, "Título: " + estado.tema, W / 2, 970, W - 200, 28);
  }

  ctx.font = "400 17px Montserrat";
  ctx.fillStyle = "#102438";
  wrapText(ctx,
    "Mar de las Ideas es un juego; este reconocimiento es un aliento formativo; no constituye aceptación ni autorización de publicación, que depende de la dictaminación académica por pares.",
    W / 2, 1050, W - 200, 24);

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
    estado.aportados = [];
    estado.tituloListo = true;
    estado.sesion = "preview-jandiekua";
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


Object.assign(window, {
  estado, agregarIdea, agregarIdeasLote, totalIdeasSesion, render, aplicarVistaDesdeURL,
  ANCHO, ALTO, VERSION, Datos
});
if (typeof dibujarCertificado === "function") window.dibujarCertificado = dibujarCertificado;

function iniciar() {
  escalaLienzo();
  window.addEventListener("resize", escalaLienzo);
  if (window.visualViewport) {
    visualViewport.addEventListener("resize", escalaLienzo);
  }
  cargarFondoIlustrado();
  if (!aplicarVistaDesdeURL()) cargar();
  asegurarSesion();
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

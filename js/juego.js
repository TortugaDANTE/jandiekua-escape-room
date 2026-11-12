import * as DatosMod from './datos.js?v=20261113a';
import * as Titulo from './titulo.js?v=20261113a';
const Datos = Object.assign({}, DatosMod.default || {}, DatosMod, { normalizar: DatosMod.claveDe });
window.Datos = Datos;

/* Escape room virtual Mar de las Ideas — Revista Jandiekua
   Agenda Ambiental UASLP. Sin dependencias externas. */

const ANCHO = 1080;
const ALTO = 2022;
const ACUARIO_SVG = '<svg class="acuario-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 605" preserveAspectRatio="none" aria-hidden="true">\n  <defs>\n    <linearGradient id="arena" x1="0" y1="0" x2="0" y2="1">\n      <stop offset="0" stop-color="#C59B27" stop-opacity=".0"/>\n      <stop offset=".45" stop-color="#8A6A12" stop-opacity=".18"/>\n      <stop offset="1" stop-color="#5C4A18" stop-opacity=".45"/>\n    </linearGradient>\n    <linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1">\n      <stop offset="0" stop-color="#D8E8DF" stop-opacity=".16"/>\n      <stop offset="1" stop-color="#D8E8DF" stop-opacity="0"/>\n    </linearGradient>\n    <linearGradient id="alga" x1="0" y1="1" x2="0" y2="0">\n      <stop offset="0" stop-color="#2E6B4E"/>\n      <stop offset="1" stop-color="#4A8B68" stop-opacity=".85"/>\n    </linearGradient>\n  </defs>\n  <!-- caustics / refraction bands -->\n  <g opacity=".22" fill="none" stroke="#D8E8DF" stroke-width="1.2">\n    <path d="M0 90 Q180 70 360 100 T720 90 T1080 110" opacity=".7"/>\n    <path d="M0 130 Q200 150 400 120 T800 140 T1080 125" opacity=".45"/>\n    <path d="M0 170 Q160 155 320 180 T640 165 T1080 185" opacity=".35"/>\n  </g>\n  <!-- light rays -->\n  <g fill="url(#rayo)">\n    <polygon points="220,-10 310,-10 260,400 170,400" opacity=".8"/>\n    <polygon points="520,-10 590,-10 560,360 490,360" opacity=".55"/>\n    <polygon points="820,-10 900,-10 870,420 790,420" opacity=".65"/>\n  </g>\n  <!-- sand bottom -->\n  <path fill="url(#arena)" d="M0 500 C80 488 160 520 260 505 C360 488 470 525 580 508 C700 490 820 528 930 510 C1000 500 1040 518 1080 508 L1080 605 L0 605 Z"/>\n  <g fill="#C59B27" opacity=".2">\n    <circle cx="90" cy="560" r="4"/><circle cx="140" cy="575" r="3"/><circle cx="320" cy="568" r="3.5"/>\n    <circle cx="510" cy="580" r="4"/><circle cx="700" cy="565" r="3"/><circle cx="880" cy="578" r="4"/>\n    <circle cx="990" cy="555" r="2.5"/>\n  </g>\n  <!-- seaweed / coral, left -->\n  <g fill="url(#alga)" opacity=".85">\n    <path d="M70 605 C60 540 90 520 70 460 C50 400 95 390 80 330 C88 400 55 420 85 480 C100 530 55 550 70 605Z"/>\n    <path d="M110 605 C125 530 95 510 120 440 C140 380 100 370 115 320 C108 380 145 400 108 470 C90 530 130 560 110 605Z"/>\n    <path d="M40 605 C30 550 55 530 38 480 C22 430 58 425 48 390 C52 440 20 455 50 510 C62 545 28 565 40 605Z"/>\n  </g>\n  <!-- right -->\n  <g fill="url(#alga)" opacity=".8">\n    <path d="M1010 605 C1022 540 990 520 1015 455 C1038 400 990 390 1008 335 C1000 400 1040 420 1000 485 C985 535 1028 555 1010 605Z"/>\n    <path d="M1050 605 C1062 550 1038 535 1055 485 C1072 435 1038 428 1050 390 C1045 440 1078 455 1048 510 C1036 545 1068 565 1050 605Z"/>\n    <path d="M970 605 C955 545 990 525 968 470 C948 415 990 410 975 360 C980 420 945 435 985 500 C1000 545 958 560 970 605Z"/>\n  </g>\n  <!-- small coral clusters -->\n  <g fill="#C59B27" opacity=".35">\n    <path d="M200 600 l8-28 8 14 7-22 7 22 8-14 8 28z"/>\n    <path d="M860 600 l6-22 7 11 6-18 6 18 7-11 6 22z"/>\n  </g>\n  <!-- two slow fish silhouettes (animated via CSS on groups) -->\n  <g class="pez pez-a" fill="#102438" opacity=".28">\n    <ellipse cx="0" cy="0" rx="22" ry="10"/>\n    <polygon points="18,0 34,-9 34,9"/>\n    <circle cx="-8" cy="-2" r="1.4" fill="#D8E8DF" opacity=".8"/>\n  </g>\n  <g class="pez pez-b" fill="#102438" opacity=".2">\n    <ellipse cx="0" cy="0" rx="16" ry="7"/>\n    <polygon points="-14,0 -26,-7 -26,7"/>\n    <circle cx="6" cy="-1.5" r="1.1" fill="#D8E8DF" opacity=".8"/>\n  </g>\n</svg>\n';
const VERSION = "20261113a";
// Versión de los textos legales que la persona acepta (Términos y Aviso de privacidad).
const VERSION_LEGAL = "v1-borrador-20261112";

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
    modo: "peces",
    instruccion: "Escribe el título de tu investigación o arrastra peces del tanque a la barra.",
    reto: "",
    etiqueta: "Título",
    tanques: [],
    nodos: []
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
  tituloPartes: [],
  parteSeq: 0,
  pecesSoltados: 0,
  consentimiento: null,
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
let datosBorrados = false;

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
  if (!debePersistir()) return []; // ?sinred=1: ni lee ni escribe en la red
  if (!window.Datos || !Datos.cargarConceptos) return [];
  try {
    const r = await Promise.race([
      Datos.cargarConceptos(),
      new Promise((resolve) => setTimeout(() => resolve({ ok: false, conceptos: [] }), 4000))
    ]);
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
  // Sala 1 (peces): el tanque ocupa toda la pantalla hasta el borde inferior
  const completa = lienzo.classList.contains("sala-completa");
  const alto = completa && esPortraitEstrecho() ? Math.max(1500, Math.round(h / s)) : ALTO;
  escenario.style.setProperty("--alto", alto + "px");
  if (completa && window.Peces) { clearTimeout(escalaLienzo._t); escalaLienzo._t = setTimeout(() => Peces.recalcular(), 120); }
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
  if (datosBorrados) return;
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
      tituloListo: estado.tituloListo,
      tituloPartes: estado.tituloPartes,
      parteSeq: estado.parteSeq,
      pecesSoltados: estado.pecesSoltados,
      consentimiento: estado.consentimiento
    }));
  } catch (err) { /* almacenamiento no disponible */ }
}
function cargar() {
  try {
    const raw = localStorage.getItem("jandiekua-mar-" + VERSION);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d && d.consentimiento && d.consentimiento.version && d.sesion && window.Datos && Datos.declararConsentimiento) {
      Datos.declararConsentimiento({ sesion: d.sesion, version: d.consentimiento.version });
    }
    Object.assign(estado, d, { colocado: {}, elegido: null, colocados: estado.colocados || {} });
    if (!Array.isArray(estado.ideasJugador)) estado.ideasJugador = [];
    if (!Array.isArray(estado.predefIds)) estado.predefIds = [];
    if (!Array.isArray(estado.aportados)) estado.aportados = [];
    if (!Array.isArray(estado.tituloPartes)) estado.tituloPartes = [];
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
  if (window.Peces) Peces.desmontar();
  document.removeEventListener("pointerdown", cerrarPopFuera, true);
  const completa = esSalaPeces();
  lienzo.classList.toggle("sala-completa", completa);
  lienzo.dataset.vista = estado.vista === "sala" ? "sala" : estado.vista;
  escalaLienzo();
  if (estado.vista === "portada" || estado.vista === "cierre-form" || estado.vista === "cierre-diploma") {
    franja.hidden = true;
    if (estado.vista === "portada") { renderPortada(); return; }
  } else {
    franja.hidden = completa;
  }
  svgLlaves();
  if (estado.vista === "sala") return esSalaPeces() ? renderSalaPeces() : renderSala();
  else if (estado.vista === "cierre-form") renderFormulario();
  else if (estado.vista === "cierre-diploma") renderDiploma();
}

const CLAVE_AVISO_ALMACENAMIENTO = "jandiekua_aviso_almacenamiento_v1";
function avisoAlmacenamientoVisto() {
  try { const v = JSON.parse(localStorage.getItem(CLAVE_AVISO_ALMACENAMIENTO) || "null"); return !!(v && v.v === "1"); } catch (_) { return false; }
}
function recordarAvisoAlmacenamiento(valor) {
  try { localStorage.setItem(CLAVE_AVISO_ALMACENAMIENTO, JSON.stringify({ v: "1", valor, fecha: new Date().toISOString() })); } catch (_) { /* sin almacenamiento */ }
}
function renderPortada() {
  escena.innerHTML = `
    <section class="portada">
      <p class="kicker">Escape room virtual</p>
      <h1>Mar de las <span>Ideas</span></h1>
      <p class="revista">Revista Jandiekua</p>
      <p class="subtitulo">Revista Mexicana de Educación Ambiental<br>Agenda Ambiental · UASLP</p>
      <div class="logo-jandiekua"><img src="assets/logos/jandiekua_homepageImage_en_US.png" width="500" height="150" alt="Jandiekua, Revista Mexicana de Educación Ambiental"></div>
      <p class="entradilla">Cuatro salas para comprender la originalidad, el formato, la revisión por pares y la ética científica antes de postular un manuscrito.</p>
      <p class="aviso-juego">Mar de las Ideas es un juego formativo. No sustituye el proceso formal de envío y dictaminación de la Revista Jandiekua.</p>
      <div class="consent-card" id="consent-card">${bloqueConsentimiento("acepto-terminos", false)}</div>
      <button type="button" class="btn-entrar bloqueado" id="btn-entrar" aria-disabled="true" aria-describedby="ayuda-consentimiento">Entrar al juego</button>
      <p class="pista-entrar" id="pista-entrar">Marca la casilla para poder entrar.</p>
    </section>
    <aside class="cookies" id="aviso-cookies" role="region" aria-label="Aviso de almacenamiento local"${avisoAlmacenamientoVisto() ? " hidden" : ""}>
      <p><strong>Usamos almacenamiento local</strong> de tu navegador solo para guardar tu avance. Sin cookies de publicidad ni rastreo. <a href="aviso-privacidad.html#almacenamiento" target="_blank" rel="noopener">Más información</a></p>
      <button type="button" id="cookies-ok">Entendido</button>
    </aside>`;
  const caja = $("#acepto-terminos"), btn = $("#btn-entrar");
  const sync = () => {
    const ok = caja.checked;
    btn.classList.toggle("bloqueado", !ok);
    btn.setAttribute("aria-disabled", ok ? "false" : "true");
    $("#pista-entrar").hidden = ok;
  };
  caja.checked = false; sync();
  caja.addEventListener("change", sync);
  $("#cookies-ok").addEventListener("click", () => { recordarAvisoAlmacenamiento("entendido"); $("#aviso-cookies").hidden = true; });
  btn.addEventListener("click", () => {
    if (!caja.checked) { mostrarToast("Marca la casilla de Términos y Aviso de privacidad para entrar.", true); caja.focus(); return; }
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
    estado.tituloPartes = [];
    estado.parteSeq = 0;
    estado.pecesSoltados = 0;
    estado.llaves = [false, false, false, false];
    estado.tema = "";
    estado.consentimiento = null;
    datosBorrados = false;
    estado.conceptosUnicos = 0;
    registrarConsentimiento();
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
    <section class="sala${s.tema && !estado.tituloListo ? " pretitulo" : ""}" data-sala="${s.id}">
      <div class="zona zona-reto">
        <p class="kicker">${s.kicker}${s.modo === "pasos" ? ` · Paso ${estado.paso + 1} de ${s.pasos.length}` : ""}</p>
        <h2>${s.nombre}</h2>
        <div class="carta-reto">
          <p class="etiqueta">${s.etiqueta}</p>
          <p>${p.reto}</p>
          ${s.tema && !estado.tituloListo ? `<div class="campo-tema">
            <label for="tema">Título de tu investigación</label>
            <div class="fila-titulo">
              <input id="tema" type="text" required maxlength="180" value="${escapeAttr(estado.tema)}" placeholder="Escríbelo para habilitar el tanque y el Mar de Ideas.">
              <button type="button" class="btn-principal" id="btn-registrar-titulo" aria-disabled="true" aria-describedby="ayuda-consentimiento">Registrar título</button>
            </div>
            <p class="ayuda-titulo">Es el primer paso del juego y aparecerá en tu reconocimiento con la etiqueta «Título».</p>
            ${bloqueConsentimiento("acepto-terminos", false)}
          </div>` : ""}
          ${s.tema && estado.tituloListo ? `<p class="titulo-registrado">Título: ${escapeAttr(estado.tema)}</p>` : ""}
        </div>
        ${!(s.tema && !estado.tituloListo) ? `<form class="form-idea" id="form-idea">
          <label class="visually-hidden" for="nueva-idea">Escribe una idea</label>
          <input id="nueva-idea" name="idea" type="text" maxlength="180" autocomplete="off" placeholder="Escribe una idea y suéltala al mar">
          <button type="submit" class="btn-idea">Enviar al mar</button>
        </form>` : ""}
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
        <div id="mar"><div id="mar-caja"></div></div>
        <div class="acciones-sala" id="acciones-sala" hidden>
          <button type="button" class="btn-seguir" id="btn-seguir">Continuar</button>
        </div>
      </div>
    </section>`;

  if (s.tema) {
    const tema = $("#tema");
    if (tema) {
      tema.addEventListener("input", (e) => {
        estado.tema = e.target.value;
        guardar();
      });
      tema.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); registrarTitulo(); }
      });
    }
    const btnT = $("#btn-registrar-titulo");
    if (btnT) btnT.addEventListener("click", registrarTitulo);
    const chk = $("#acepto-terminos");
    if (chk && btnT) {
      const sync = () => btnT.setAttribute("aria-disabled", chk.checked ? "false" : "true");
      chk.addEventListener("change", sync);
      sync();
    }
    if (!estado.tituloListo && tema) setTimeout(() => $("#tema") && $("#tema").focus(), 200);
  }

  const formIdea = $("#form-idea");
  if (formIdea) formIdea.addEventListener("submit", (e) => {
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

const ENLACE_TERMINOS = '<a href="terminos.html" target="_blank" rel="noopener">Términos y condiciones</a>';
const ENLACE_AVISO = '<a href="aviso-privacidad.html" target="_blank" rel="noopener">Aviso de privacidad</a>';

// Casilla de consentimiento: siempre sin marcar al mostrarse. Sin ella no se envía ningún dato.
function bloqueConsentimiento(id, requerida) {
  return `<div class="consentimiento">
    <label class="consent-etiqueta" for="${id}">
      <input type="checkbox" id="${id}" name="${id}"${requerida ? " required" : ""}>
      <span>He leído y acepto los ${ENLACE_TERMINOS} y el ${ENLACE_AVISO}</span>
    </label>
    <p class="consent-ayuda" id="ayuda-consentimiento">Mar de las Ideas es un juego y una herramienta de recolección de datos: tus aportes se guardan en la base de datos de la Revista Jandiekua. Sin marcar la casilla no se envía nada.</p>
  </div>`;
}

function registrarConsentimiento() {
  estado.consentimiento = { version: VERSION_LEGAL, aceptado: new Date().toISOString() };
  guardar();
  if (debePersistir() && window.Datos && Datos.aceptarConsentimiento) {
    return Datos.aceptarConsentimiento({ sesion: asegurarSesion(), version: VERSION_LEGAL })
      .then((r) => {
        if (r && r.ok === false) {
          console.warn("consentimiento", r.error);
          mostrarToast("No pude guardar tu aceptación en este momento. Puedes seguir jugando; se reintentará.", true);
        }
        return r;
      });
  }
  return Promise.resolve({ ok: true, local: true });
}


/* =====================================================================================
   Sala 1 · Túnel de la Originalidad (v5): título por etiquetas y tanque de peces
   Barra de título (palabras escritas + peces arrastrados) → 4 elementos de Sampieri →
   llave → «Soltar mi título al mar»: sus conceptos se vuelven peces que caen al tanque.
   ===================================================================================== */
const PISTA_VACIO = "Aún no hay peces: ¡tu título será el primero!";
const ICONO_PEZ = '<svg class="ico-pez" viewBox="0 0 56 34" aria-hidden="true"><path d="M10 17 L1 4 Q5 17 1 30Z" fill="currentColor"/><path d="M10 17 C16 1 40 1 55 17 C40 33 16 33 10 17Z" fill="#fff" stroke="currentColor" stroke-width="3"/><circle cx="44" cy="14" r="2.6" fill="#102438"/></svg>';
const s1 = { chips: null, entrada: null, pop: null, popId: null, enviando: false, llaveAvisada: false, pescados: {}, seq: 0 };

function esSalaPeces() {
  return estado.vista === "sala" && SALAS[estado.sala] && SALAS[estado.sala].modo === "peces";
}
function nuevaParte(texto, tipo, elemento, auto, extra) {
  estado.parteSeq = (estado.parteSeq || 0) + 1;
  return Object.assign({ id: "p" + estado.parteSeq, texto, tipo, elemento, auto: auto !== false }, extra || {});
}
function claseElemento(el) { return el && Titulo.ELEMENTO_INFO[el] ? Titulo.ELEMENTO_INFO[el].clase : "sin"; }

async function renderSalaPeces() {
  const s = salaActual();
  const listo = !!estado.tituloListo;
  if (!Array.isArray(estado.tituloPartes)) estado.tituloPartes = [];
  s1.enviando = false; s1.llaveAvisada = listo; s1.pescados = {}; s1.popId = null;
  const pills = Titulo.ELEMENTOS.map((k) => {
    const i = Titulo.ELEMENTO_INFO[k];
    return `<div class="ind ${i.clase}" data-el="${k}"><span class="t"><i></i>${i.nombre}</span><small>${i.pista}</small></div>`;
  }).join("");
  escena.innerHTML = `
    <section class="sala sala-peces" data-sala="${s.id}">
      <div class="arriba">
        <p class="mini">Sala 1 · <span>${s.nombre}</span></p>
        <div class="barra-titulo" id="barra-titulo">
          <div class="llavefila" id="llavefila" hidden></div>
          <div class="chips" id="chips" aria-live="polite"></div>
          <button type="button" class="btn-m on" id="btn-soltar" hidden>Soltar mi título al mar</button>
        </div>
        <p class="guia">Un buen título según Sampieri dice qué, quién, dónde y cuándo</p>
        <div class="indic" id="indic" role="list" aria-label="Elementos de un buen título">${pills}</div>
      </div>
      <div class="tanque-peces" id="tanque-peces">
        <div class="acuario" aria-hidden="true">${ACUARIO_SVG}
          <div class="acuario-burbujas"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        </div>
        <div id="peces-caja"></div>
        <div class="hint-vacio" id="hint-vacio" hidden>
          <svg viewBox="0 0 190 80" fill="none" stroke="#D8E8DF" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" aria-hidden="true"><path d="M36 40 L8 12 Q20 40 8 68 Z"/><path d="M36 40 C54 6 130 6 176 40 C130 74 54 74 36 40Z"/><circle cx="150" cy="33" r="5" fill="#D8E8DF" stroke="none"/></svg>
          <p>${PISTA_VACIO}</p>
          <small>Cuando alguien registre un título, sus palabras nadarán aquí.</small>
        </div>
        <div class="mas-peces" id="mas-peces" hidden></div>
        <button type="button" class="btn-m on flota-continuar" id="btn-continuar" hidden>Continuar</button>
      </div>
      <div class="pop" id="pop-elemento" hidden role="dialog" aria-modal="false" aria-labelledby="pop-titulo"></div>
    </section>`;
  s1.chips = $("#chips");
  const entrada = document.createElement("input");
  entrada.id = "entrada-titulo"; entrada.type = "text"; entrada.maxLength = 120;
  entrada.autocomplete = "off"; entrada.setAttribute("autocapitalize", "none"); entrada.setAttribute("autocorrect", "off");
  entrada.spellcheck = false; entrada.enterKeyHint = "done";
  entrada.setAttribute("aria-label", "Escribe tu título o añade peces del tanque");
  s1.entrada = entrada; s1.pop = $("#pop-elemento");
  entrada.addEventListener("input", () => { if (/[\s,;]$/.test(entrada.value)) confirmarEntrada(); });
  entrada.addEventListener("paste", () => setTimeout(confirmarEntrada, 0));
  entrada.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); confirmarEntrada(); }
    else if (e.key === "Backspace" && !entrada.value && estado.tituloPartes.length) {
      e.preventDefault(); quitarParte(estado.tituloPartes[estado.tituloPartes.length - 1].id);
    }
  });
  entrada.addEventListener("blur", () => { if (entrada.value.trim()) confirmarEntrada(); });
  $("#btn-soltar").addEventListener("click", soltarTitulo);
  $("#btn-continuar").addEventListener("click", avanzar);
  s1.chips.addEventListener("pointerdown", chipPointerDown);
  s1.chips.addEventListener("dblclick", (e) => {
    const c = e.target.closest(".chip"); if (!c || estado.tituloListo) return;
    const p = estado.tituloPartes.find((x) => x.id === c.dataset.id);
    if (p && /\s/.test(p.texto.trim())) separarParte(p.id);
  });
  document.addEventListener("pointerdown", cerrarPopFuera, true);

  await (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve());
  const tanque = $("#tanque-peces");
  Peces.montar({
    tanque, lienzo, ANCHO, foto, puntoLocal, barra: $("#barra-titulo"),
    sobreBarra: (p) => dentroDe($("#barra-titulo"), p, 36),
    sobreTanque: (p) => dentroDe(tanque, p, 0),
    alPescar: (f, p) => pescar(f, indiceInsercion(p)),
    alToque: (f) => pescar(f, estado.tituloPartes.length),
    alPartir: (f) => partirPez(f),
    alOcultos: (n) => { const m = $("#mas-peces"); if (!m) return; m.hidden = n <= 0; m.textContent = n > 0 ? `+${n} peces más nadan fuera de vista` : ""; }
  });
  Peces.bloquear(listo);
  renderChips();
  if (listo) { mostrarRegistrado(); }
  await cargarPeces();
  if (listo) { /* los peces propios ya están cargados del servidor o se agregaron al soltar */ }
  quitarPecesEnBarra();
  $("#hint-vacio").hidden = Peces.total() > 0;
  if (!listo && !estado.tituloPartes.length) setTimeout(() => s1.entrada && s1.entrada.focus({ preventScroll: true }), 150);
}

function dentroDe(el, p, margen) {
  if (!el) return false;
  const r = el.getBoundingClientRect(), lr = lienzo.getBoundingClientRect(), sc = lr.width / ANCHO;
  const x = (r.left - lr.left) / sc, y = (r.top - lr.top) / sc, w = r.width / sc, h = r.height / sc;
  return p.x >= x - margen && p.x <= x + w + margen && p.y >= y - margen && p.y <= y + h + margen;
}

// ------------------------------------------------------------------ carga de peces
function pecesDemo(spec) {
  const base = [
    ["Educación ambiental", "que", 7], ["Estudiantes", "quien", 5], ["San Luis Potosí", "donde", 4], ["Cambio climático", "que", 4],
    ["espacios urbanos", "que", 3], ["Huertos escolares", "que", 3], ["2026", "cuando", 3], ["Docentes", "quien", 2], ["Agricultura urbana", "que", 2],
    ["producción agrourbana", "que", 2], ["Huasteca", "donde", 2], ["Jóvenes", "quien", 2], ["2020–2025", "cuando", 2], ["Diagnóstico", "que", 1],
    ["Residuos sólidos", "que", 1], ["Zona metropolitana", "donde", 1], ["Comunidades rurales", "quien", 1], ["Compostaje", "que", 1], ["México", "donde", 1],
    ["Percepción", "que", 1], ["Biodiversidad", "que", 1], ["Pandemia", "cuando", 1], ["Impacto", "que", 1], ["Agua", "que", 1]
  ];
  const n = Number(spec);
  if (!Number.isFinite(n) || n <= 0) return base.map(([texto, elemento, personas]) => ({ texto, elemento, personas }));
  const pal = ["Agua", "Suelo", "Aire", "Huerto", "Bosque", "Río", "Semilla", "Energía", "Residuos", "Clima", "Escuela", "Barrio", "Cuenca", "Sequía", "Reciclaje",
    "Compost", "Fauna", "Flora", "Océano", "Ciudad", "Campo", "Cultivo", "Riego", "Humedal", "Sierra", "Mercado", "Transporte", "Vivienda", "Paisaje", "Saberes"];
  const adj = ["urbano", "rural", "local", "ambiental", "social", "comunitario", "sostenible", "regional"];
  const out = [];
  for (let i = 0; i < n; i++) {
    const w = pal[i % pal.length], a = adj[Math.floor(i / pal.length) % adj.length];
    const texto = i < pal.length ? w : (i % 3 === 0 ? w + " " + a : w + " " + (Math.floor(i / pal.length) + 1));
    out.push({ texto, elemento: Titulo.ELEMENTOS[i % 4], personas: i % 9 === 0 ? 3 : (i % 5 === 0 ? 2 : 1) });
  }
  return out;
}
async function cargarPeces() {
  let lista = [];
  if (debePersistir()) {
    const cs = await cargarConceptosLista();
    lista = cs.filter((c) => c && c.clave && c.elemento && Titulo.ELEMENTOS.includes(c.elemento))
      .map((c) => ({ clave: c.clave, texto: c.texto || c.clave, elemento: c.elemento, personas: c.personas || 1 }));
  } else {
    const demo = new URLSearchParams(location.search).get("peces");
    if (demo) lista = pecesDemo(demo === "demo" ? "" : demo);
  }
  estado.conceptosUnicos = lista.length;
  lista.forEach((d) => Peces.agregar(d, { caer: false }));
  if (window.Peces && Peces.recalcular) Peces.recalcular();
}
// al volver a una partida con chips-pez en la barra, esos peces no deben nadar también en el tanque
function quitarPecesEnBarra() {
  (estado.tituloPartes || []).forEach((p) => {
    if (p.tipo !== "pez" || !p.clave || estado.tituloListo) return;
    const f = Peces.quitar(p.clave);
    if (f) s1.pescados[p.clave] = { texto: f.texto, elemento: f.elemento, personas: f.personas };
  });
}

// ------------------------------------------------------------------ chips de la barra
function renderChips() {
  const cont = s1.chips; if (!cont) return;
  const listo = !!estado.tituloListo;
  const nodos = estado.tituloPartes.map((p) => {
    const c = document.createElement("span");
    c.className = "chip " + (p.tipo === "enlace" ? "con" : claseElemento(p.elemento)) + (p.tipo === "pez" ? " fish" : "") + (s1.popId === p.id ? " sel" : "");
    c.dataset.id = p.id;
    if (p.tipo === "pez") c.insertAdjacentHTML("afterbegin", ICONO_PEZ);
    c.appendChild(document.createTextNode(p.texto));
    if (p.tipo !== "enlace" && !listo) {
      c.tabIndex = 0; c.setAttribute("role", "button");
      c.setAttribute("aria-label", `${p.texto}: ${p.elemento ? Titulo.ELEMENTO_INFO[p.elemento].nombre : "sin elemento"}. Toca para elegir su elemento.`);
      c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrirPop(p.id); } });
    }
    return c;
  });
  if (listo) cont.replaceChildren(...nodos);
  else cont.replaceChildren(...nodos, s1.entrada);
  if (s1.entrada) s1.entrada.placeholder = estado.tituloPartes.length ? "" : "Escribe tu título o arrastra peces hasta aquí";
  actualizarIndicadores();
}
function confirmarEntrada() {
  const v = s1.entrada.value;
  if (!v.trim()) { s1.entrada.value = ""; return; }
  s1.entrada.value = "";
  const prev = estado.tituloPartes.length ? estado.tituloPartes[estado.tituloPartes.length - 1] : null;
  Titulo.partesDeTexto(v, prev).forEach((p) => { estado.tituloPartes.push(nuevaParte(p.texto, p.tipo, p.elemento, true)); });
  guardar(); renderChips();
  s1.entrada.focus({ preventScroll: true });
}
function quitarParte(id) {
  const i = estado.tituloPartes.findIndex((x) => x.id === id);
  if (i < 0) return;
  const [p] = estado.tituloPartes.splice(i, 1);
  if (p.tipo === "pez" && p.clave && s1.pescados[p.clave]) {
    const d = s1.pescados[p.clave]; delete s1.pescados[p.clave];
    Peces.devolver({ clave: p.clave, texto: d.texto, elemento: d.elemento, personas: d.personas });
    $("#hint-vacio").hidden = true;
  }
  if (s1.popId === id) cerrarPop();
  guardar(); renderChips();
}
function pescar(f, indice) {
  if (estado.tituloListo) return;
  const q = Peces.quitar(f.clave);
  if (!q) return;
  s1.pescados[q.clave] = { texto: q.texto, elemento: q.elemento, personas: q.personas };
  const parte = nuevaParte(q.texto, "pez", q.elemento || Titulo.sugerirElemento(q.texto), true, { clave: q.clave });
  estado.tituloPartes.splice(Math.min(Math.max(indice, 0), estado.tituloPartes.length), 0, parte);
  guardar(); renderChips();
  $("#hint-vacio").hidden = Peces.total() > 0 || false;
  if (Peces.total() === 0) $("#hint-vacio").hidden = false;
}
function partirPez(f) {
  if (estado.tituloListo) return;
  const palabras = Titulo.tokenizar(f.texto);
  if (palabras.length < 2) { pescar(f, estado.tituloPartes.length); return; }
  Titulo.partesDeTexto(f.texto, null).forEach((p) => {
    estado.tituloPartes.push(nuevaParte(p.texto, p.tipo, p.tipo === "enlace" ? null : (p.elemento === "que" ? (f.elemento || p.elemento) : p.elemento), true));
  });
  guardar(); renderChips();
  mostrarToast("Palabras añadidas por separado. El pez sigue en el tanque.");
}
function separarParte(id) {
  const i = estado.tituloPartes.findIndex((x) => x.id === id);
  if (i < 0) return;
  const p = estado.tituloPartes[i];
  const nuevas = Titulo.partesDeTexto(p.texto, null).map((x) => nuevaParte(x.texto, x.tipo, x.tipo === "enlace" ? null : (p.auto ? x.elemento : p.elemento), p.auto));
  if (p.tipo === "pez" && p.clave && s1.pescados[p.clave]) {
    const d = s1.pescados[p.clave]; delete s1.pescados[p.clave];
    Peces.devolver({ clave: p.clave, texto: d.texto, elemento: d.elemento, personas: d.personas });
  }
  estado.tituloPartes.splice(i, 1, ...nuevas);
  cerrarPop(); guardar(); renderChips();
}
function unirConSiguiente(id) {
  const i = estado.tituloPartes.findIndex((x) => x.id === id);
  const a = estado.tituloPartes[i], b = estado.tituloPartes[i + 1];
  if (!a || !b || a.tipo === "enlace" || b.tipo === "enlace") return;
  [a, b].forEach((x) => {
    if (x.tipo === "pez" && x.clave && s1.pescados[x.clave]) {
      const d = s1.pescados[x.clave]; delete s1.pescados[x.clave];
      Peces.devolver({ clave: x.clave, texto: d.texto, elemento: d.elemento, personas: d.personas });
    }
  });
  const elemento = a.auto === false ? a.elemento : (b.auto === false ? b.elemento : Titulo.sugerirElemento(a.texto + " " + b.texto));
  const fusion = nuevaParte(a.texto + " " + b.texto, "palabra", elemento, a.auto !== false && b.auto !== false);
  estado.tituloPartes.splice(i, 2, fusion);
  cerrarPop(); guardar(); renderChips();
}

// índice de inserción según el punto (filas y columnas de chips)
function indiceInsercion(p, excluirId) {
  const lr = lienzo.getBoundingClientRect(), sc = lr.width / ANCHO;
  const chips = [...s1.chips.querySelectorAll(".chip")].filter((c) => c.dataset.id !== excluirId);
  for (let k = 0; k < chips.length; k++) {
    const r = chips[k].getBoundingClientRect();
    const top = (r.top - lr.top) / sc, bottom = (r.bottom - lr.top) / sc, cx = ((r.left + r.right) / 2 - lr.left) / sc;
    if (p.y < top || (p.y <= bottom && p.x < cx)) {
      const id = chips[k].dataset.id;
      return estado.tituloPartes.findIndex((x) => x.id === id);
    }
  }
  return estado.tituloPartes.length;
}

// arrastre para reordenar chips (o sacarlos de la barra hacia el tanque)
function chipPointerDown(e) {
  if (estado.tituloListo) return;
  const c = e.target.closest(".chip"); if (!c) return;
  const id = c.dataset.id;
  const x0 = e.clientX, y0 = e.clientY;
  let fantasma = null, movido = false, pid = e.pointerId;
  const lr0 = () => lienzo.getBoundingClientRect();
  const mover = (ev) => {
    if (ev.pointerId !== pid) return;
    if (!movido && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) {
      movido = true; cerrarPop();
      fantasma = c.cloneNode(true);
      fantasma.classList.add("chip-fantasma");
      fantasma.removeAttribute("id");
      $("#capa-arrastre").appendChild(fantasma);
      c.classList.add("levantado");
      lienzo.classList.add("arrastrando");
    }
    if (movido) {
      const p = puntoLocal(ev);
      fantasma.style.left = p.x + "px"; fantasma.style.top = (p.y - 70) + "px";
      s1.chips.querySelectorAll(".antes").forEach((n) => n.classList.remove("antes"));
      const tk = $("#tanque-peces");
      tk.classList.toggle("recibiendo-chip", dentroDe(tk, p, 0));
      if (!dentroDe(tk, p, 0)) {
        const idx = indiceInsercion(p, id);
        const resto = estado.tituloPartes.filter((x) => x.id !== id);
        const objetivo = resto[idx > estado.tituloPartes.findIndex((x) => x.id === id) ? idx - 1 : idx];
        const nodo = objetivo && s1.chips.querySelector(`.chip[data-id="${objetivo.id}"]`);
        if (nodo) nodo.classList.add("antes"); else s1.entrada.classList.add("antes");
      }
    }
  };
  const fin = (ev, cancel) => {
    if (ev.pointerId !== pid) return;
    window.removeEventListener("pointermove", mover); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", can);
    s1.chips.querySelectorAll(".antes").forEach((n) => n.classList.remove("antes"));
    s1.entrada.classList.remove("antes");
    lienzo.classList.remove("arrastrando"); $("#tanque-peces").classList.remove("recibiendo-chip");
    if (!movido) { if (!cancel) abrirPop(id); return; }
    const p = puntoLocal(ev);
    if (fantasma) fantasma.remove();
    c.classList.remove("levantado");
    if (cancel) return;
    if (dentroDe($("#tanque-peces"), p, 0)) { quitarParte(id); mostrarToast("Palabra devuelta al tanque."); return; }
    if (dentroDe($("#barra-titulo"), p, 36)) {
      const desde = estado.tituloPartes.findIndex((x) => x.id === id);
      let hasta = indiceInsercion(p, id);
      const [parte] = estado.tituloPartes.splice(desde, 1);
      if (hasta > desde) hasta -= 1;
      estado.tituloPartes.splice(Math.max(0, Math.min(hasta, estado.tituloPartes.length)), 0, parte);
      guardar(); renderChips();
    }
  };
  const up = (ev) => fin(ev, false), can = (ev) => fin(ev, true);
  window.addEventListener("pointermove", mover); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", can);
}

// ------------------------------------------------------------------ indicadores, llave y botón
function actualizarIndicadores() {
  const cub = Titulo.cubiertos(estado.tituloPartes);
  document.querySelectorAll("#indic .ind").forEach((n) => n.classList.toggle("on", cub.has(n.dataset.el)));
  const completo = cub.size === 4;
  const barra = $("#barra-titulo"), fila = $("#llavefila"), btn = $("#btn-soltar");
  if (!barra) return;
  const listo = !!estado.tituloListo;
  barra.classList.toggle("ok", completo || listo);
  if (listo) return;
  if (completo) {
    fila.hidden = false;
    fila.innerHTML = `<img src="assets/disenografico/llave_1_pertinencia.svg" alt="">¡Llave de Pertinencia obtenida!`;
    btn.hidden = false;
    if (!s1.llaveAvisada) { s1.llaveAvisada = true; mostrarToast("Tu título expresa los 4 elementos. Ya puedes soltarlo al mar."); }
  } else {
    fila.hidden = true; btn.hidden = true;
    s1.llaveAvisada = false;
  }
}
function mostrarRegistrado() {
  const fila = $("#llavefila"), btn = $("#btn-soltar");
  const n = Number(estado.pecesSoltados) || 0;
  fila.hidden = false; fila.classList.add("reg");
  fila.innerHTML = `<span class="tick">✓</span>Título registrado${n ? " · " + n + (n === 1 ? " pez" : " peces") + " al mar" : ""}`;
  btn.hidden = true;
  $("#btn-continuar").hidden = false;
  $("#barra-titulo").classList.add("ok", "bloqueada");
  document.querySelectorAll("#indic .ind").forEach((x) => x.classList.remove("on"));
  actualizarIndicadores();
  Peces.bloquear(true);
}

// ------------------------------------------------------------------ popover de elemento
function abrirPop(id) {
  if (estado.tituloListo) return;
  const p = estado.tituloPartes.find((x) => x.id === id);
  if (!p || p.tipo === "enlace") return;
  s1.popId = id;
  const sug = p.tipo === "pez" && p.elemento && p.auto ? p.elemento : Titulo.sugerirElemento(p.texto);
  const i = estado.tituloPartes.findIndex((x) => x.id === id);
  const sig = estado.tituloPartes[i + 1];
  const puedeUnir = sig && sig.tipo !== "enlace";
  const multi = /\s/.test(p.texto.trim());
  const botones = Titulo.ELEMENTOS.map((k) => {
    const inf = Titulo.ELEMENTO_INFO[k];
    return `<button type="button" class="b-${inf.clase}${k === sug ? " sug" : ""}${k === p.elemento ? " actual" : ""}" data-el="${k}">${k === p.elemento ? "✓ " : ""}${inf.nombre}${k === sug ? " <small>(sugerido)</small>" : ""}</button>`;
  }).join("");
  s1.pop.innerHTML = `<h4 id="pop-titulo">¿Qué es «${escapeAttr(p.texto)}»? <span>Tú decides.</span></h4>
    <div class="op">${botones}</div>
    <div class="op2">
      <button type="button" class="sec" data-acc="quitar">Quitar</button>
      ${multi ? `<button type="button" class="sec" data-acc="separar">Separar palabras</button>` : (puedeUnir ? `<button type="button" class="sec" data-acc="unir">Unir con «${escapeAttr(sig.texto)}»</button>` : "")}
    </div>`;
  s1.pop.querySelectorAll("button[data-el]").forEach((b) => b.addEventListener("click", () => {
    p.elemento = b.dataset.el; p.auto = false; cerrarPop(); guardar(); renderChips();
  }));
  s1.pop.querySelector('[data-acc="quitar"]').addEventListener("click", () => { cerrarPop(); quitarParte(id); });
  const sepB = s1.pop.querySelector('[data-acc="separar"]'); if (sepB) sepB.addEventListener("click", () => separarParte(id));
  const uniB = s1.pop.querySelector('[data-acc="unir"]'); if (uniB) uniB.addEventListener("click", () => unirConSiguiente(id));
  // posición: bajo los indicadores
  const sala = $(".sala-peces"), ind = $("#indic");
  const lr = lienzo.getBoundingClientRect(), sc = lr.width / ANCHO;
  const top = (ind.getBoundingClientRect().bottom - lr.top) / sc - (sala.getBoundingClientRect().top - lr.top) / sc + 24;
  s1.pop.style.top = Math.round(top) + "px";
  s1.pop.hidden = false;
  renderChips();
}
function cerrarPop() {
  if (!s1.pop) return;
  s1.pop.hidden = true; s1.popId = null;
  document.querySelectorAll("#chips .chip.sel").forEach((n) => n.classList.remove("sel"));
}
function cerrarPopFuera(e) {
  if (!s1.pop || s1.pop.hidden) return;
  if (e.target.closest && (e.target.closest("#pop-elemento") || e.target.closest("#chips .chip"))) return;
  cerrarPop();
}

// ------------------------------------------------------------------ soltar el título: sus conceptos se vuelven peces
async function persistirTermino(t) {
  if (!(debePersistir() && window.Datos && Datos.aportarConcepto)) return { ok: true, local: true };
  try {
    return await Datos.aportarConcepto({
      texto: t.texto, sala: 1, salaNombre: SALAS[0].nombre, tipo: "jugador", sesion: asegurarSesion(),
      tituloInvestigacion: estado.tema, elemento: t.elemento
    });
  } catch (err) { console.warn("pez", err); return { ok: false }; }
}
async function soltarTitulo() {
  if (s1.enviando || estado.tituloListo) return;
  const cub = Titulo.cubiertos(estado.tituloPartes);
  if (cub.size < 4) { mostrarToast("Falta cubrir los 4 elementos del título.", true); return; }
  if (!estado.consentimiento) { mostrarToast("Para continuar regresa a la portada y acepta los Términos y el Aviso de privacidad.", true); return; }
  s1.enviando = true;
  cerrarPop();
  if (s1.entrada && s1.entrada.value.trim()) confirmarEntrada();
  const conocidos = new Set([...Peces.claves(), ...Object.keys(s1.pescados)].filter((c) => c.includes(" ")));
  const terminos = Titulo.unirTerminos(estado.tituloPartes, conocidos).map((t) => Object.assign(t, { clave: Datos.claveDe(t.texto) || t.clave }));
  estado.tema = estado.tituloPartes.map((p) => p.texto).join(" ").replace(/\s+/g, " ").trim().slice(0, 180);
  estado.tituloListo = true;
  estado.pecesSoltados = terminos.length;
  estado.llaves[estado.sala] = true;
  guardar();
  // el título completo (privado) y los conceptos (públicos) se guardan en segundo plano
  const hecho = (async () => {
    if (debePersistir() && window.Datos && Datos.aportarConcepto) {
      try {
        await Datos.aportarConcepto({ texto: estado.tema, sala: 1, salaNombre: SALAS[0].nombre, tipo: "titulo", sesion: asegurarSesion(), tituloInvestigacion: estado.tema });
      } catch (err) { console.warn("titulo", err); }
    }
  })();
  renderChips();
  mostrarRegistrado();
  mostrarToast(`Has obtenido la ${SALAS[0].llave}.`);
  terminos.forEach((t, i) => {
    const previo = Peces.obtener(t.clave) || s1.pescados[t.clave];
    const personas = previo ? (previo.personas || 1) + 1 : 1;
    const dato = { clave: t.clave, texto: previo ? previo.texto : t.texto, elemento: (previo && previo.elemento) || t.elemento, personas };
    if (Peces.visible(t.clave)) Peces.actualizar(t.clave, { personas, elemento: dato.elemento });
    else Peces.agregar(dato, { caer: true, retardo: i * 0.28 });
  });
  s1.pescados = {};
  $("#hint-vacio").hidden = true;
  await hecho;
  for (const t of terminos) {
    const res = await persistirTermino(t);
    if (res && res.ok && res.personas && Peces.visible(t.clave)) {
      const f = Peces.obtener(t.clave);
      if (f && f.personas !== res.personas) Peces.actualizar(t.clave, { personas: res.personas });
    }
  }
}

function tituloListoAhora() {
  return !salaActual().tema || !!estado.tituloListo;
}
function registrarTitulo() {
  const input = $("#tema");
  const v = ((input && input.value) || estado.tema || "").trim();
  const chk = $("#acepto-terminos");
  if (!estado.consentimiento && !(chk && chk.checked)) {
    mostrarToast("Para continuar marca la casilla: acepto los Términos y el Aviso de privacidad.", true);
    if (chk) chk.focus();
    return false;
  }
  if (v.length < 3) {
    mostrarToast("Escribe el título de tu investigación (al menos 3 caracteres).", true);
    if (input) input.focus();
    return false;
  }
  estado.tema = v;
  estado.tituloListo = true;
  guardar();
  // Primero el consentimiento (version y fecha); el título solo se envía cuando quedó registrado.
  const consentido = estado.consentimiento ? Promise.resolve({ ok: true }) : registrarConsentimiento();
  consentido.then(() => {
    if (debePersistir() && window.Datos && Datos.aportarConcepto) {
      return Datos.aportarConcepto({
        texto: v,
        sala: 1,
        salaNombre: (salaActual() && salaActual().nombre) || "Túnel de la Originalidad",
        tipo: "titulo",
        sesion: asegurarSesion(),
        tituloInvestigacion: v
      });
    }
  }).catch((err) => console.warn("titulo", err));
  const zs = document.querySelector(".sala");
  if (zs) zs.classList.remove("pretitulo");
  const zt = document.querySelector(".zona-tanques");
  const zm = document.querySelector(".zona-mar");
  if (zt) zt.classList.remove("bloqueado");
  if (zm) zm.classList.remove("bloqueado");
  const campo = document.querySelector(".campo-tema");
  if (campo) {
    const p = document.createElement("p");
    p.className = "titulo-registrado";
    p.textContent = "Título: " + v;
    campo.replaceWith(p);
  }
  if (!$("#form-idea")) {
    const zona = document.querySelector(".zona-reto");
    if (zona) {
      zona.insertAdjacentHTML("beforeend", `<form class="form-idea" id="form-idea">
          <label class="visually-hidden" for="nueva-idea">Escribe una idea</label>
          <input id="nueva-idea" name="idea" type="text" maxlength="180" autocomplete="off" placeholder="Escribe una idea y suéltala al mar">
          <button type="submit" class="btn-idea">Enviar al mar</button>
        </form>`);
      $("#form-idea").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("#nueva-idea");
        const texto = (input.value || "").trim();
        if (!texto) return;
        input.value = "";
        agregarIdea(texto);
      });
    }
  }
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

function anchoMarIdeas() {
  const caja = $("#mar-caja") || $("#mar");
  return (caja && caja.clientWidth) || (($("#mar") && $("#mar").clientWidth) || 1000);
}
function medidaIdeas(n) {
  const r = lienzo.getBoundingClientRect();
  const sL = (r.width / ANCHO) || 1;
  const minFont = Math.ceil(12 / Math.max(sL, 0.15));
  const t = Math.max(0, Math.min(1, ((n || 0) - 6) / (80 - 6)));
  const e = t * t * (3 - 2 * t);
  let font = Math.max(minFont, Math.round(64 - e * (64 - minFont)));
  // Tope para que una idea típica quepa en 3 líneas al 45 % del mar.
  const maxW = Math.max(80, Math.floor(anchoMarIdeas() * 0.45));
  const padGuess = Math.max(10, Math.round(font * 0.35));
  const cap = Math.floor((maxW - 2 * padGuess) / (0.72 * 16));
  font = Math.max(minFont, Math.min(font, cap || font, 42));
  return { font, pad: Math.max(10, Math.round(font * 0.38)), minFont, sL };
}

let _medidaCtx = null;
function medidaAnchoTexto(texto, fontPx) {
  if (!_medidaCtx) _medidaCtx = document.createElement("canvas").getContext("2d");
  _medidaCtx.font = "650 " + fontPx + 'px Montserrat, "Segoe UI", system-ui, sans-serif';
  return _medidaCtx.measureText(texto).width;
}
function partirLineas(texto, fontPx, ancho) {
  const words = String(texto || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (line && medidaAnchoTexto(test, fontPx) > ancho) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}
function dimensionarTarjeta(el, texto, m) {
  const maxW = Math.max(80, Math.floor(anchoMarIdeas() * 0.45));
  const font = m.font, pad = m.pad, lineH = font * 1.25;
  const innerMax = Math.max(32, maxW - pad * 2);
  const raw = String(texto || "").trim();
  const full = medidaAnchoTexto(raw, font);
  let width;
  if (full + pad * 2 + 8 <= maxW) {
    width = Math.ceil(full + pad * 2 + 8);
  } else {
    width = Math.min(maxW, Math.ceil(full / 2 + pad * 2 + 8));
    if (partirLineas(raw, font, Math.max(32, width - pad * 2)).length > 3) width = maxW;
  }
  let lines = partirLineas(raw, font, Math.max(32, width - pad * 2));
  if (lines.length > 3) {
    width = maxW;
    lines = partirLineas(raw, font, innerMax);
  }
  let height = Math.ceil(pad * 2 + Math.max(1, lines.length) * lineH);
  if (width < 2.2 * height) {
    width = Math.min(maxW, Math.ceil(2.2 * height));
    lines = partirLineas(raw, font, Math.max(32, width - pad * 2));
    height = Math.ceil(pad * 2 + Math.max(1, lines.length) * lineH);
  }
  el.style.fontSize = font + "px";
  el.style.padding = pad + "px";
  el.style.width = width + "px";
  el.style.height = height + "px";
  el.style.maxWidth = maxW + "px";
  return { width, height, lines: lines.length };
}
function actualizarSueloMar() {
  const mar = $("#mar");
  const caja = $("#mar-caja");
  if (!mar || !caja) return;
  const vivos = nodosVivos.filter((v) => v.estado !== "fuera");
  let maxW = 80, maxH = 40;
  vivos.forEach((v) => {
    maxW = Math.max(maxW, v.w || 0);
    maxH = Math.max(maxH, v.h || 0);
  });
  const marW = Math.max(mar.clientWidth, 1);
  const perRow = Math.max(1, Math.floor(marW / Math.max(maxW * 0.42, 70)));
  const rows = Math.ceil(Math.max(vivos.length, 1) / perRow);
  // Apilado compacto (se solapan) y scroll si no caben; no inflar un pozo vacío.
  const packH = Math.ceil(rows * maxH * 0.36 + 48);
  caja.style.minHeight = Math.max(mar.clientHeight, packH) + "px";
  mar.scrollTop = Math.max(0, mar.scrollHeight - mar.clientHeight);
}

function fuenteQueCabe(textos, minFont, fontIni) {
  const maxW = Math.max(80, Math.floor(anchoMarIdeas() * 0.45));
  let font = fontIni;
  while (font > minFont) {
    const pad = Math.max(10, Math.round(font * 0.38));
    const inner = Math.max(32, maxW - pad * 2);
    const cabe = textos.every((t) => partirLineas(String(t || "").trim(), font, inner).length <= 3);
    if (cabe) break;
    font -= 1;
  }
  return font;
}
function aplicarEscalaIdeas(inmediato) {
  const mar = $("#mar");
  if (!mar) return;
  let m = medidaIdeas(totalIdeasSesion());
  const textos = nodosVivos.filter((v) => v.estado !== "fuera").map((v) =>
    (v.data && v.data.texto) || (v.el.querySelector(".nodo-texto") && v.el.querySelector(".nodo-texto").textContent) || ""
  );
  const font = fuenteQueCabe(textos, m.minFont, m.font);
  m = Object.assign({}, m, { font, pad: Math.max(10, Math.round(font * 0.38)) });
  mar.style.setProperty("--idea-fonte", m.font + "px");
  mar.style.setProperty("--idea-pad", m.pad + "px");
  const capa = $("#capa-arrastre");
  if (capa) {
    capa.style.setProperty("--idea-fonte", m.font + "px");
    capa.style.setProperty("--idea-pad", m.pad + "px");
  }
  nodosVivos.forEach((v) => {
    if (v.estado === "fuera") return;
    const texto = (v.data && v.data.texto) || (v.el.querySelector(".nodo-texto") && v.el.querySelector(".nodo-texto").textContent) || "";
    dimensionarTarjeta(v.el, texto, m);
    medirIdea(v);
    const badge = v.el.querySelector(".insignia-personas");
    if (badge) badge.style.fontSize = m.minFont + "px";
    if (!inmediato) {
      v.dormido = false;
      v.contacto = false;
      v.quietoT = 0;
    }
  });
  actualizarSueloMar();
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
  const caja = $("#mar-caja") || $("#mar");
  const el = document.createElement("button");
  el.type = "button";
  el.className = "nodo";
  el.id = data.id;
  const txt = document.createElement("span");
  txt.className = "nodo-texto";
  txt.textContent = data.texto;
  el.appendChild(txt);
  el.setAttribute("aria-label", "Idea: " + data.texto);
  const personas = concepto && concepto.personas ? concepto.personas : 1;
  insigniaPersonas(el, personas);
  caja.appendChild(el);
  dimensionarTarjeta(el, data.texto, medidaIdeas(totalIdeasSesion() + 1));
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
  const usados = new Set();
  p.nodos.filter((n) => !estado.colocados[n.id]).forEach((n) => {
    const clave = normalizarTexto(n.texto);
    usados.add(clave);
    nodosVivos.push(crearNodoMar(n, { clave, personas: 1, texto: n.texto }));
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
  mar.dataset.listo = "1";
  const conceptos = await cargarConceptosLista();
  estado.conceptosUnicos = conceptos.length;
  conceptos.forEach((c) => {
    if (!c || !c.clave) return;
    const vivo = nodosVivos.find((v) => v.clave === c.clave && v.estado !== "fuera");
    if (vivo) {
      vivo.personas = c.personas || vivo.personas || 1;
      insigniaPersonas(vivo.el, vivo.personas);
      usados.add(c.clave);
      return;
    }
    if (usados.has(c.clave)) return;
    usados.add(c.clave);
    const v = crearNodoMar({
      id: "concepto-" + String(c.clave).replace(/\s+/g, "-").slice(0, 48),
      texto: c.texto || c.clave,
      libre: true,
      valido: false
    }, c);
    nodosVivos.push(v);
    if (window.MarIdeas && MarIdeas.agregar) MarIdeas.agregar(v);
  });
  aplicarEscalaIdeas(false);
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
  let res = { ok: true, clave: claveLocal, personas: 1, nuevo: true };
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
  }
  if (op.local || !debePersistir() || (res && res.ok === false)) {
    const vivoPrev = nodosVivos.find((v) => v.clave === claveLocal && v.estado !== "fuera");
    if (vivoPrev) {
      res = { ok: true, clave: claveLocal, personas: (vivoPrev.personas || 1) + 1, nuevo: false };
    } else {
      res = { ok: true, clave: claveLocal, personas: 1, nuevo: true };
    }
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
  if (window.MarIdeas && MarIdeas.agregar) MarIdeas.agregar(v);
  if (!op.sinEscala) aplicarEscalaIdeas(false);
  return v;
}

async function agregarIdeasLote(textos, op = {}) {
  const lista = Array.isArray(textos) ? textos : [];
  for (const texto of lista) {
    await agregarIdea(texto, { local: op.local !== false, sinEscala: true });
  }
  aplicarEscalaIdeas(false);
  if (window.MarIdeas && MarIdeas.sentar) MarIdeas.sentar(45);
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
  const conConsent = !estado.consentimiento;
  escena.innerHTML = `
    <section class="cierre">
      <p class="aviso-termino">¡Terminaste el juego!</p>
      <form class="registro" id="form-registro">
        <label>¿Cómo te llamas, amigo? Es para darte tu reconocimiento.
          <input name="nombre" type="text" required maxlength="120" value="${escapeAttr(estado.registro.nombre)}" autocomplete="name">
        </label>
        <label>Procedencia
          <input name="institucion" type="text" required maxlength="160" value="${escapeAttr(estado.registro.institucion)}" placeholder="Institución o facultad de adscripción" autocomplete="organization">
        </label>
        <p class="nota-datos">Tu nombre, tu procedencia, tu título de investigación y tus ideas se guardan en la base de datos de la Revista Jandiekua. Consulta el ${ENLACE_AVISO}. Al terminar podrás descargar o borrar tus datos.</p>
        ${conConsent ? bloqueConsentimiento("acepto-terminos-cierre", true) : ""}
        <label class="consent-etiqueta consent-opcional" for="quiero-boletin">
          <input type="checkbox" id="quiero-boletin" name="boletin">
          <span>Quiero recibir noticias de la Revista Jandiekua <em>(opcional)</em></span>
        </label>
        <label class="campo-correo" id="campo-correo" hidden>Correo para las noticias
          <input name="correo" id="correo-boletin" type="email" maxlength="254" autocomplete="email" placeholder="correo@ejemplo.org">
          <small>Cada mensaje de la revista incluirá un enlace para darte de baja. Puedes borrar tu correo con «Borrar mis datos».</small>
        </label>
        <button type="submit" class="btn-principal">Generar reconocimiento</button>
      </form>
    </section>`;
  const chkB = $("#quiero-boletin");
  const campoC = $("#campo-correo");
  chkB.addEventListener("change", () => {
    campoC.hidden = !chkB.checked;
    $("#correo-boletin").required = chkB.checked;
    if (chkB.checked) $("#correo-boletin").focus();
  });
  $("#form-registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const boletin = fd.get("boletin") === "on";
    const correo = boletin ? String(fd.get("correo") || "").trim() : "";
    if (conConsent) {
      const c = $("#acepto-terminos-cierre");
      if (!c || !c.checked) {
        mostrarToast("Para continuar marca la casilla: acepto los Términos y el Aviso de privacidad.", true);
        return;
      }
      registrarConsentimiento();
    }
    estado.registro = {
      nombre: fd.get("nombre").trim(),
      institucion: fd.get("institucion").trim(),
      correo: boletin ? correo : "",
      telefono: estado.registro.telefono || "",
      boletin,
      aviso: true
    };
    estado.tema = estado.tema || "";
    estado.vista = "cierre-diploma";
    guardar();
    if (debePersistir() && window.Datos && Datos.registrarParticipante) {
      Datos.registrarParticipante({
        sesion: asegurarSesion(),
        nombre: estado.registro.nombre,
        procedencia: estado.registro.institucion,
        tituloInvestigacion: estado.tema,
        claves: estado.aportados,
        boletin,
        correo
      }).then((r) => {
        if (r && r.ok === false) console.warn("registrarParticipante", r.error);
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

// ---------- Tus datos: descargar y borrar ----------
function datosLocales() {
  return {
    descripcion: "Copia local de lo que se capturó en este navegador (no se pudo consultar el servidor o es modo de prueba).",
    generado: new Date().toISOString(),
    participaciones: [{
      sesion: estado.sesion,
      nombre: estado.registro.nombre || "",
      procedencia: estado.registro.institucion || "",
      tituloInvestigacion: estado.tema || "",
      boletin: !!estado.registro.boletin,
      correo: estado.registro.correo || "",
      consentimiento: estado.consentimiento || null
    }],
    titulos: estado.tema ? [{ texto: estado.tema, sala: 1 }] : [],
    aportes: (estado.aportados || []).map((c) => ({ concepto: c, clave: c })),
    colocaciones: []
  };
}

function bajarArchivo(nombre, tipo, contenido) {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function estadoDatos(texto, error = false) {
  const el = $("#estado-datos");
  if (!el) return;
  el.textContent = texto;
  el.classList.toggle("error", !!error);
}

async function reunirMisDatos() {
  if (debePersistir() && window.Datos && Datos.descargarMisDatos) {
    const r = await Datos.descargarMisDatos();
    if (r && r.ok) return { datos: r.datos, origen: "servidor" };
  }
  return { datos: datosLocales(), origen: debePersistir() ? "local-sin-red" : "local-prueba" };
}

function conectarMisDatos() {
  const descargar = async (formato) => {
    estadoDatos("Reuniendo tus datos…");
    const { datos, origen } = await reunirMisDatos();
    const base = "Mis_datos_Mar_de_las_Ideas_Jandiekua";
    if (formato === "json") bajarArchivo(base + ".json", "application/json", JSON.stringify(datos, null, 2));
    else bajarArchivo(base + ".csv", "text/csv;charset=utf-8", Datos.datosACsv(datos));
    estadoDatos(
      origen === "servidor"
        ? "Listo: descargaste los datos que están guardados."
        : origen === "local-prueba"
          ? "Modo de prueba: no se envió nada; descargaste la copia local."
          : "No pude consultar el servidor; descargaste la copia local de este navegador.",
      origen === "local-sin-red"
    );
  };
  $("#btn-datos-json").addEventListener("click", () => descargar("json"));
  $("#btn-datos-csv").addEventListener("click", () => descargar("csv"));
  $("#btn-datos-borrar").addEventListener("click", abrirConfirmarBorrado);
}

let enfoqueAntesModal = null;
function abrirConfirmarBorrado() {
  const m = $("#modal-borrar");
  enfoqueAntesModal = document.activeElement;
  $("#borrar-mensaje").textContent = "";
  $("#borrar-confirmar").disabled = false;
  $("#borrar-cancelar").disabled = false;
  m.hidden = false;
  $("#borrar-cancelar").focus();
}
function cerrarConfirmarBorrado() {
  const m = $("#modal-borrar");
  if (m.hidden) return;
  m.hidden = true;
  if (enfoqueAntesModal && enfoqueAntesModal.focus) enfoqueAntesModal.focus();
}
async function confirmarBorrado() {
  const msg = $("#borrar-mensaje");
  $("#borrar-confirmar").disabled = true;
  $("#borrar-cancelar").disabled = true;
  msg.textContent = "Borrando tus datos…";
  let ok = true;
  let detalle = "";
  if (debePersistir() && window.Datos && Datos.borrarMisDatos) {
    const r = await Datos.borrarMisDatos();
    ok = !!(r && r.ok);
    if (!ok) detalle = (r && r.error) || "";
  }
  if (!ok) {
    msg.textContent = "No se pudo completar el borrado (" + detalle + "). No se perdió nada; inténtalo de nuevo.";
    $("#borrar-confirmar").disabled = false;
    $("#borrar-cancelar").disabled = false;
    return;
  }
  datosBorrados = true;
  try { localStorage.removeItem("jandiekua-mar-" + VERSION); } catch (err) { /* sin almacenamiento */ }
  cerrarConfirmarBorrado();
  ["btn-datos-json", "btn-datos-csv", "btn-datos-borrar"].forEach((id) => {
    const b = $("#" + id);
    if (b) b.disabled = true;
  });
  estadoDatos(debePersistir()
    ? "Listo: borramos de la base de datos tu nombre, procedencia, título, ideas y colocaciones, y descontamos tus aportes de los conteos. Tu certificado ya generado no se afecta."
    : "Modo de prueba: no había nada enviado. Se borró la copia local.");
  mostrarToast("Tus datos se borraron.");
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
      <section class="mis-datos" aria-labelledby="md-titulo">
        <h3 id="md-titulo">Tus datos</h3>
        <p>Tus aportes se guardaron para la base de datos de la Revista Jandiekua. Puedes llevártelos o borrarlos ahora. Aplica a lo que jugaste en este navegador.</p>
        <div class="acciones-datos">
          <button type="button" class="btn-datos" id="btn-datos-json">Descargar mis datos (JSON)</button>
          <button type="button" class="btn-datos" id="btn-datos-csv">Descargar mis datos (CSV)</button>
          <button type="button" class="btn-datos peligro" id="btn-datos-borrar">Borrar mis datos</button>
        </div>
        <p class="estado-datos" id="estado-datos" role="status" aria-live="polite"></p>
        <p class="enlaces-legales">
          <a href="aviso-privacidad.html" target="_blank" rel="noopener">Aviso de privacidad</a>
          <span aria-hidden="true">·</span>
          <a href="terminos.html" target="_blank" rel="noopener">Términos y condiciones</a>
        </p>
      </section>
    </section>`;
  conectarMisDatos();
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
  ctx.textAlign = "center";
  ctx.font = "700 22px Montserrat";
  ctx.fillText("Reconocimiento", W / 2, 318);
  ctx.font = "italic 44px Fraunces";
  ctx.fillText("Mar de las Ideas · Revista Jandiekua", W / 2, 372);
  ctx.font = "700 22px Montserrat";
  ctx.fillStyle = "#2E6B4E";
  ctx.fillText("Juego formativo", W / 2, 418);

  // logo revista pendiente
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "#4A8B68";
  ctx.strokeRect(W / 2 - 150, 448, 300, 80);
  ctx.setLineDash([]);
  ctx.font = "650 16px Montserrat";
  ctx.fillStyle = "#4A8B68";
  ctx.fillText("[LOGO JANDIEKUA]  [POR DEFINIR]", W / 2, 494);

  const nombre = estado.registro.nombre || "Nombre de la persona participante";
  const procedencia = (estado.registro && estado.registro.institucion) ? String(estado.registro.institucion).trim() : "";
  const titulo = (estado.tema || "").trim();
  let y = 560;
  ctx.fillStyle = "#102438";
  ctx.font = "500 24px Montserrat";
  y = wrapTextTop(
    ctx,
    "Se reconoce a " + nombre + " por recorrer las cuatro salas del Mar de las Ideas y mostrar un perfil y competencias metodológicas iniciales para la investigación en educación ambiental.",
    W / 2, y, W - 180, 32
  ) + 28;
  if (procedencia) {
    ctx.font = "500 20px Montserrat";
    ctx.fillStyle = "#2E6B4E";
    y = wrapTextTop(ctx, "Procedencia: " + procedencia, W / 2, y, W - 200, 28) + 24;
  }
  if (titulo) {
    ctx.font = "500 22px Montserrat";
    ctx.fillStyle = "#003B71";
    y = wrapTextTop(
      ctx,
      "Te animamos a preparar tu trabajo «" + titulo + "» y a compartirlo con la Revista Jandiekua.",
      W / 2, y, W - 200, 30
    ) + 24;
  }

  ctx.drawImage(sello, W / 2 - 62, y, 124, 124);
  ctx.font = "700 16px Montserrat";
  ctx.fillStyle = "#4A8B68";
  ctx.fillText("[POR DEFINIR]", W / 2, y + 142);
  y += 170;

  ctx.font = "400 16px Montserrat";
  ctx.fillStyle = "#102438";
  y = wrapTextTop(
    ctx,
    "Mar de las Ideas es un juego; este reconocimiento es un aliento formativo; no constituye aceptación ni autorización de publicación, que depende de la dictaminación académica por pares.",
    W / 2, y, W - 200, 22
  ) + 32;

  ctx.font = "500 18px Montserrat";
  ctx.fillStyle = "#003B71";
  ctx.fillText("Fecha de emisión: " + fechaEmision(), W / 2, Math.min(y, H - 110));

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
  const words = String(text || "").split(" ");
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
  return start + Math.max(0, lines.length - 1) * lineH;
}
function wrapTextTop(ctx, text, x, y, maxW, lineH) {
  const words = String(text || "").split(" ");
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
  lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineH));
  return y + Math.max(0, lines.length - 1) * lineH;
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
    estado.tituloListo = estado.sala !== 0;
    estado.tituloPartes = [];
    estado.pecesSoltados = 0;
    if (estado.sala === 0) estado.consentimiento = estado.consentimiento || { version: VERSION_LEGAL, aceptado: new Date().toISOString() };
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
  ANCHO, ALTO, VERSION, VERSION_LEGAL, Datos, Titulo
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
  $("#borrar-cancelar").addEventListener("click", cerrarConfirmarBorrado);
  $("#borrar-confirmar").addEventListener("click", confirmarBorrado);
  $("#modal-borrar").addEventListener("click", (e) => {
    if (e.target.id === "modal-borrar" && !$("#borrar-confirmar").disabled) cerrarConfirmarBorrado();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { cerrarGlosario(); if (!$("#borrar-confirmar").disabled) cerrarConfirmarBorrado(); }
  });
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}

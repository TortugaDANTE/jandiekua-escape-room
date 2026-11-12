/* Sala 1 · Túnel de la Originalidad: lógica pura del título por etiquetas (sin DOM).
   - palabras de enlace (stopwords) que no se vuelven peces;
   - sugerencia heurística de los 4 elementos de un buen título según Sampieri
     (qué, quién, dónde, cuándo): solo es una sugerencia, la persona decide;
   - unión de palabras en términos (bigramas sensatos) para crear los peces.
   Módulo ES sin dependencias; se puede probar con Node. */

export const ELEMENTOS = ["que", "quien", "donde", "cuando"];
export const ELEMENTO_INFO = {
  que: { nombre: "Qué", pista: "el fenómeno", clase: "q" },
  quien: { nombre: "Quién", pista: "la población", clase: "qu" },
  donde: { nombre: "Dónde", pista: "el lugar", clase: "d" },
  cuando: { nombre: "Cuándo", pista: "el periodo", clase: "c" }
};

export function norm(s) {
  return String(s == null ? "" : s).normalize("NFD").replace(/\p{M}/gu, "").trim().replace(/\s+/g, " ").toLowerCase();
}
// Quita signos en los bordes de una palabra (comas, puntos, paréntesis…) sin tocar números como 2020–2025.
export function limpiarPalabra(s) {
  return String(s || "").trim().replace(/^[\s"'«»“”‘’()\[\]¿¡,.;:!?]+|[\s"'«»“”‘’()\[\]¿?!,.;:¡]+$/gu, "");
}
export function tokenizar(texto) {
  return String(texto || "").split(/[\s,;]+/u).map(limpiarPalabra).filter(Boolean);
}

const PARADAS = new Set((
  "a al ante bajo cabe con contra de del desde durante e el ella ello en entre es esa ese eso esta este esto esas esos estas estos " +
  "hacia hasta la las le les lo los mas mediante mi mis muy ni no nos nuestra nuestro nuestras nuestros o otra otro otras otros para pero por " +
  "porque que se segun ser si sin sobre son su sus tambien tras tu tus u un una uno unas unos y ya cual cuales cuyo cuya como donde cuando " +
  "quien quienes cuanto es fue han hay"
).split(" "));
export function esEnlace(palabra) {
  const n = norm(palabra);
  return n.length === 0 || PARADAS.has(n);
}

const MESES = "enero febrero marzo abril mayo junio julio agosto septiembre setiembre octubre noviembre diciembre".split(" ");
const CUANDO = new Set(("actualidad pandemia invierno verano primavera otono semestre ciclo bienio trienio decada decadas siglo periodo periodos epoca anio anios ano anos " +
  "trimestre temporada estacion historico longitudinal").split(" "));
const DONDE = new Set((
  "slp mx cdmx mexico potosi huasteca altiplano zona region regiones ciudad ciudades municipio municipios campus uaslp pais paises " +
  "latinoamerica america iberoamerica rural urbano urbana periurbana periurbano localidad barrio colonia cuenca sierra costa desierto valle " +
  "aguascalientes campeche chiapas chihuahua coahuila colima durango guanajuato guerrero hidalgo jalisco michoacan morelos nayarit " +
  "oaxaca puebla queretaro sinaloa sonora tabasco tamaulipas tlaxcala veracruz yucatan zacatecas monterrey guadalajara " +
  "slp-mx rioverde matehuala ciudad-valles"
).split(" "));
const QUIEN = new Set((
  "estudiante estudiantes alumno alumnos alumna alumnas docente docentes maestro maestros maestra maestras profesor profesores profesora profesoras " +
  "joven jovenes nino ninos nina ninas adolescente adolescentes mujer mujeres hombre hombres familia familias comunidad comunidades poblacion " +
  "habitante habitantes ciudadano ciudadanos ciudadania campesino campesinos agricultor agricultores productor productores persona personas adulto " +
  "adultos adultas universitario universitarios universitaria egresado egresados usuario usuarios participante participantes pueblos indigenas " +
  "indigena infancia infancias sujetos muestra consumidores investigadores investigadoras empresarios turistas visitantes pobladores vecinos"
).split(" "));

export function esAnio(p) {
  return /^(1[5-9]\d\d|20\d\d)([–—-](1[5-9]\d\d|20\d\d|\d\d))?$/u.test(String(p).trim());
}

/* Devuelve "que" | "quien" | "donde" | "cuando". Los términos de varias palabras se evalúan por sus partes. */
export function sugerirElemento(texto, opciones = {}) {
  const partes = tokenizar(texto).filter((p) => !esEnlace(p));
  if (!partes.length) return "que";
  const pts = { quien: 0, donde: 0, cuando: 0 };
  for (const p of partes) {
    const n = norm(p);
    if (esAnio(p) || /^siglo (xx|xxi|xix)$/.test(n) || /^\d{4}s$/.test(n) || MESES.includes(n) || CUANDO.has(n)) pts.cuando += 2;
    else if (QUIEN.has(n)) pts.quien += 2;
    else if (DONDE.has(n)) pts.donde += 2;
    else if (opciones.siglas !== false && /^[A-ZÁÉÍÓÚÑ]{2,4}$/u.test(p) && !/\d/.test(p)) pts.donde += 1; // siglas (SLP, MX)
    else if (opciones.capital && /^\p{Lu}\p{Ll}+/u.test(p)) pts.donde += 0.5; // nombre propio tras «en»
  }
  const mejor = Object.entries(pts).sort((a, b) => b[1] - a[1])[0];
  return mejor[1] > 0 ? mejor[0] : "que";
}

const SUF_ADJ = /(al|ales|ar|ares|ico|ica|icos|icas|ivo|iva|ivos|ivas|ano|ana|anos|anas|ble|bles|oso|osa|osos|osas|ario|aria|arios|arias|rial|riales|ista|istas|urbana|urbano)$/;
const NO_ADJ = new Set(["metodologia", "animal", "capital", "material", "materiales", "sal", "canal", "hospital", "mineral", "cereal", "papel", "ciudadano", "ciudadanos", "ciudadania", "campesino", "campesinos", "agricultores", "productores"]);
export function esAdjetivo(palabra) {
  const n = norm(palabra);
  if (n.length < 6 || NO_ADJ.has(n) || /\d/.test(n) || QUIEN.has(n)) return false;
  return SUF_ADJ.test(n);
}

const BIGRAMAS = new Set((
  "educacion ambiental|cambio climatico|desarrollo sostenible|desarrollo sustentable|calidad de vida|medio ambiente|agricultura urbana|huertos escolares|huerto escolar|" +
  "espacios urbanos|espacios verdes|areas verdes|residuos solidos|energia solar|energias renovables|huella de carbono|huella ecologica|sustentabilidad ambiental|" +
  "pensamiento critico|politica publica|politicas publicas|recursos naturales|conciencia ambiental|cultura ambiental|participacion ciudadana|" +
  "estudio de caso|investigacion accion|aprendizaje basado|zona metropolitana|educacion superior|educacion basica|ciencia ciudadana|justicia ambiental"
).split("|"));

/* ¿Se unen dos chips contiguos en un solo pez? */
export function seUnen(a, b, conocidos = new Set()) {
  if (a.unir) return true;
  if (a.tipo === "enlace" || b.tipo === "enlace") return false;
  const k = norm(a.texto) + " " + norm(b.texto);
  if (BIGRAMAS.has(k) || conocidos.has(k)) return true;
  const unaA = !/\s/.test(a.texto.trim()), unaB = !/\s/.test(b.texto.trim());
  if (!unaA || !unaB) return false;
  if (/^[A-ZÁÉÍÓÚÑ]{2,5}$/u.test(a.texto) || /^[A-ZÁÉÍÓÚÑ]{2,5}$/u.test(b.texto)) return false; // siglas
  if (esAnio(a.texto) || esAnio(b.texto)) return false;
  return esAdjetivo(b.texto) && !esAdjetivo(a.texto) && norm(a.texto).length > 3;
}

/* partes: [{texto, tipo:"palabra"|"enlace"|"pez", elemento, auto, unir?}] -> términos únicos para los peces */
export function unirTerminos(partes, conocidos = new Set(), max = 20) {
  const grupos = [];
  let actual = null, prev = null;
  for (const p of partes) {
    if (p.tipo === "enlace") { actual = null; prev = null; continue; }
    if (actual && prev && seUnen(prev, p, conocidos)) actual.push(p);
    else { actual = [p]; grupos.push(actual); }
    prev = p;
  }
  const vistos = new Set(), out = [];
  for (const g of grupos) {
    const texto = g.map((x) => x.texto.trim()).join(" ").replace(/\s+/g, " ").slice(0, 80);
    const clave = norm(texto);
    if (!clave || vistos.has(clave)) continue;
    vistos.add(clave);
    const manual = g.find((x) => x.auto === false && x.elemento);
    const elemento = manual ? manual.elemento : (g.length === 1 ? g[0].elemento : sugerirElemento(texto)) || "que";
    out.push({ texto, clave, elemento: ELEMENTOS.includes(elemento) ? elemento : "que", chips: g.length });
    if (out.length >= max) break;
  }
  return out;
}

export function cubiertos(partes) {
  const s = new Set();
  for (const p of partes) if (p.tipo !== "enlace" && ELEMENTOS.includes(p.elemento)) s.add(p.elemento);
  return s;
}

/* Crea los chips a partir de texto escrito (palabra por palabra). */
export function partesDeTexto(texto, previa = null) {
  const out = [];
  const toks = tokenizar(texto);
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (esEnlace(t)) { out.push({ texto: t, tipo: "enlace", elemento: null, auto: true }); continue; }
    const prevEnlaceEn = (out.length ? out[out.length - 1] : previa);
    const tras_en = prevEnlaceEn && prevEnlaceEn.tipo === "enlace" && norm(prevEnlaceEn.texto) === "en";
    out.push({ texto: t, tipo: "palabra", elemento: sugerirElemento(t, { capital: tras_en }), auto: true });
  }
  return out;
}

/* Lógica pura de la Sala 2 («Laberinto del Formato»): analiza un fragmento y decide si un signo o una mayúscula
   que se suelta en un hueco es correcto. No toca el DOM (se puede probar con Node). */
const SIGNOS = ",.;:«»“”\"¿?¡!()—'‘’…";
const esSigno = (c) => SIGNOS.includes(c);

/* Palabra = signos de apertura + núcleo + signos de cierre. */
export function palabra(token) {
  const c = Array.from(token);
  let i = 0, j = c.length;
  while (i < j && esSigno(c[i])) i++;
  while (j > i && esSigno(c[j - 1])) j--;
  return { pre: c.slice(0, i), nucleo: c.slice(i, j).join(""), suf: c.slice(j) };
}

const esMayuscula = (ch) => !!ch && ch !== ch.toLowerCase() && ch === ch.toUpperCase();

/* Modelo de un fragmento: palabras, huecos (antes de cada palabra y uno final), lo esperado y lo actual. */
export function modelo(frag) {
  const ow = frag.original.split(" ").map(palabra);
  const ew = frag.erroneo.split(" ").map(palabra);
  if (ow.length !== ew.length) throw new Error("fragmento " + frag.id + ": distinto número de palabras");
  const n = ow.length;
  const esperado = [], actual = [], lado = [];
  for (let k = 0; k <= n; k++) {
    const sa = k > 0 ? ow[k - 1].suf : [], pa = k < n ? ow[k].pre : [];
    esperado.push(sa.concat(pa));
    lado.push(sa.length); // índices < lado[k] van pegados a la palabra anterior; el resto, a la siguiente
    actual.push((k > 0 ? ew[k - 1].suf : []).concat(k < n ? ew[k].pre : []));
  }
  const mayus = ow.map((w, i) => esMayuscula(w.nucleo[0]) && !esMayuscula(ew[i].nucleo[0])); // palabras que faltan por capitalizar
  return { ow, ew, n, esperado, actual, lado, mayus, nucleoOrig: ow.map((w) => w.nucleo), nucleoErr: ew.map((w) => w.nucleo) };
}

function subsecuencia(a, b) { // ¿a es subsecuencia de b?
  let i = 0;
  for (const x of b) if (i < a.length && a[i] === x) i++;
  return i === a.length;
}

/* Intenta insertar el signo s en el hueco k (actual[k] es un arreglo de signos). Devuelve {lista, pos} o null. */
export function insertar(esp, act, s) {
  for (let p = 0; p <= act.length; p++) {
    const cand = act.slice(0, p).concat([s], act.slice(p));
    if (subsecuencia(cand, esp)) return { lista: cand, pos: p };
  }
  return null;
}

/* Para pintar: cada signo del hueco con su lado (pegado antes o después del espacio) y si es de la persona. */
export function disponer(esp, act, ladoK, propios) {
  // alinea act con esp de forma voraz para saber la posición esperada de cada signo
  const res = [];
  let j = 0;
  for (let i = 0; i < act.length; i++) {
    while (j < esp.length && esp[j] !== act[i]) j++;
    const pos = j < esp.length ? j : esp.length - 1;
    res.push({ s: act[i], antes: pos < ladoK, propio: !!propios[i] });
    j++;
  }
  return res;
}

export const completo = (m, act, mayusPuestas) =>
  m.esperado.every((e, k) => e.length === act[k].length && e.every((x, i) => x === act[k][i])) && m.mayus.every((f, i) => !f || mayusPuestas[i]);

/* Signos y mayúsculas que faltan por colocar (para saber qué peces hacen falta). */
export function faltan(m) {
  const cuenta = {};
  m.esperado.forEach((e, k) => {
    const a = m.actual[k].slice();
    e.forEach((x) => { const i = a.indexOf(x); if (i >= 0) a.splice(i, 1); else cuenta[x] = (cuenta[x] || 0) + 1; });
  });
  return { signos: cuenta, mayus: m.mayus.filter(Boolean).length };
}

/* Elige k fragmentos distintos al azar (rnd devuelve un número en [0,1)). */
export function elegir(total, k, rnd) {
  const ids = Array.from({ length: total }, (_, i) => i);
  for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  return ids.slice(0, k);
}
export { SIGNOS };

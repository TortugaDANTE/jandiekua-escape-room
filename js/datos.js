/**
 * Cliente ligero (REST, sin SDK) para persistir ideas del escape room
 * Jandiekua · Mar de las Ideas. No bloquea el juego si falla la red.
 *
 * Uso (módulo ES):
 *   import { aportarConcepto, cargarConceptos, guardarColocacion, registrarParticipante, claveDe } from './datos.js';
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyA0-3_DGoXMO18Wv3zOlST-yHjI7UQHpJ8',
  authDomain: 'jandiekua-escape-room.firebaseapp.com',
  projectId: 'jandiekua-escape-room',
  storageBucket: 'jandiekua-escape-room.firebasestorage.app',
  messagingSenderId: '761635974450',
  appId: '1:761635974450:web:c030141e91045184b73b2b',
};

const PROJECT = firebaseConfig.projectId;
const API_KEY = firebaseConfig.apiKey;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const COMMIT = `${BASE}:commit?key=${encodeURIComponent(API_KEY)}`;
const STORE = 'jandiekua_aportes_v3';
const VERSION = 'v3';

const memoria = Object.create(null);

function storageDisponible() {
  try {
    const k = '__jandiekua_t';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const tieneStorage = typeof localStorage !== 'undefined' && storageDisponible();

/** Normaliza un texto a la clave de concepto (sin acentos, minúsculas, etc.). */
export function claveDe(texto) {
  if (texto == null) return '';
  let s = String(texto).normalize('NFD').replace(/\p{M}/gu, '');
  s = s.trim().replace(/\s+/g, ' ').toLowerCase();
  s = s.replace(/[\p{P}\p{S}]+$/gu, '').trim();
  s = s.replace(/\//g, '');
  if (s === '.' || s === '..') return '';
  return s.slice(0, 180);
}

export function clavesDeSesion(sesion) {
  if (!sesion) return [];
  try {
    if (tieneStorage) {
      const all = JSON.parse(localStorage.getItem(STORE) || '{}');
      return Array.from(new Set(all[sesion] || []));
    }
    return Array.from(new Set(memoria[sesion] || []));
  } catch {
    return Array.from(new Set(memoria[sesion] || []));
  }
}

function recordarClave(sesion, clave) {
  if (!sesion || !clave) return;
  const actual = new Set(clavesDeSesion(sesion));
  actual.add(clave);
  const arr = Array.from(actual);
  memoria[sesion] = arr;
  if (!tieneStorage) return;
  try {
    const all = JSON.parse(localStorage.getItem(STORE) || '{}');
    all[sesion] = arr;
    localStorage.setItem(STORE, JSON.stringify(all));
  } catch {
    /* ignore quota / private mode */
  }
}

function recortar(valor, max) {
  if (valor == null) return '';
  return String(valor).trim().replace(/\s+/g, ' ').slice(0, max);
}

function pathDoc(segments) {
  return (
    `projects/${PROJECT}/databases/(default)/documents/` +
    segments.map((s) => encodeURIComponent(s)).join('/')
  );
}

function sv(s) {
  return { stringValue: String(s) };
}
function iv(n) {
  return { integerValue: String(Math.trunc(n)) };
}
function nv() {
  return { nullValue: 'NULL_VALUE' };
}
function arrInt(nums) {
  return { arrayValue: { values: nums.map(iv) } };
}

function fromValue(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return !!v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) {
    const out = {};
    const fields = (v.mapValue && v.mapValue.fields) || {};
    for (const [k, val] of Object.entries(fields)) out[k] = fromValue(val);
    return out;
  }
  return null;
}

function docFields(doc) {
  const out = {};
  const fields = (doc && doc.fields) || {};
  for (const [k, v] of Object.entries(fields)) out[k] = fromValue(v);
  if (doc && doc.name) {
    const parts = doc.name.split('/documents/')[1] || '';
    out.__name = decodeURIComponent(parts.split('/').pop() || '');
  }
  return out;
}

async function firestoreFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { res, body };
}

async function commit(writes) {
  const { res, body } = await firestoreFetch(COMMIT, {
    method: 'POST',
    body: JSON.stringify({ writes }),
  });
  if (!res.ok) {
    const err = new Error((body && (body.error && body.error.message)) || `commit ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

function writeCreate(name, fields, timestampFields) {
  return {
    update: { name, fields },
    currentDocument: { exists: false },
    updateTransforms: (timestampFields || ['creado']).map((fieldPath) => ({
      fieldPath,
      setToServerValue: 'REQUEST_TIME',
    })),
  };
}

function writeUpdate(name, fields, fieldPaths, timestampFields, exists = true) {
  return {
    update: { name, fields },
    updateMask: { fieldPaths },
    currentDocument: { exists },
    updateTransforms: (timestampFields || []).map((fieldPath) => ({
      fieldPath,
      setToServerValue: 'REQUEST_TIME',
    })),
  };
}

async function leerConcepto(clave) {
  const url = `${BASE}/conceptos/${encodeURIComponent(clave)}?key=${encodeURIComponent(API_KEY)}`;
  const { res, body } = await firestoreFetch(url, { method: 'GET' });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = new Error((body && body.error && body.error.message) || `get ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return docFields(body);
}

/**
 * Aporta un concepto (deduplicado por clave) o, si tipo === 'titulo',
 * guarda un título sin deduplicar.
 * @returns {Promise<{ok:boolean, clave?:string, personas?:number, nuevo?:boolean, titulo?:boolean, id?:string}>}
 */
export async function aportarConcepto({
  texto,
  sala,
  salaNombre,
  tipo,
  sesion,
  tituloInvestigacion,
} = {}) {
  try {
    const t = recortar(texto, 180);
    if (!t) return { ok: false, error: 'texto vacío' };
    if (!sesion || !/^[A-Za-z0-9_-]{8,128}$/.test(sesion)) {
      return { ok: false, error: 'sesion inválida' };
    }
    const salaN = Number(sala);
    if (!Number.isInteger(salaN) || salaN < 1 || salaN > 4) {
      return { ok: false, error: 'sala inválida' };
    }

    if (tipo === 'titulo') {
      const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      const tituloInv = recortar(tituloInvestigacion, 180) || null;
      const fields = {
        texto: sv(t),
        sala: iv(salaN),
        salaNombre: sv(recortar(salaNombre || 'Sala', 80) || 'Sala'),
        tipo: sv('titulo'),
        sesion: sv(sesion),
        tituloInvestigacion: tituloInv == null ? nv() : sv(tituloInv),
        version: sv(VERSION),
      };
      await commit([writeCreate(pathDoc(['titulos', id]), fields, ['creado'])]);
      return { ok: true, titulo: true, id, nuevo: true, clave: null, personas: null };
    }

    const clave = claveDe(t);
    if (!clave) return { ok: false, error: 'clave vacía' };

    if (clavesDeSesion(sesion).includes(clave)) {
      const actual = await leerConcepto(clave).catch(() => null);
      return {
        ok: true,
        clave,
        personas: actual ? actual.personas : 1,
        nuevo: false,
      };
    }

    const existente = await leerConcepto(clave);
    if (!existente) {
      const fieldsConcepto = {
        texto: sv(t),
        clave: sv(clave),
        salas: arrInt([salaN]),
        personas: iv(1),
        ultimoSesion: sv(sesion),
      };
      const fieldsAporte = {
        sesion: sv(sesion),
        sala: iv(salaN),
      };
      await commit([
        writeCreate(pathDoc(['conceptos', clave]), fieldsConcepto, ['creado', 'actualizado']),
        writeCreate(pathDoc(['conceptos', clave, 'aportes', sesion]), fieldsAporte, ['creado']),
      ]);
      recordarClave(sesion, clave);
      return { ok: true, clave, personas: 1, nuevo: true };
    }

    const salas = Array.isArray(existente.salas) ? existente.salas.slice() : [];
    if (!salas.includes(salaN)) salas.push(salaN);
    const personas = Number(existente.personas || 0) + 1;
    await commit([
      writeUpdate(
        pathDoc(['conceptos', clave]),
        {
          personas: iv(personas),
          ultimoSesion: sv(sesion),
          salas: arrInt(salas),
        },
        ['personas', 'ultimoSesion', 'salas'],
        ['actualizado'],
        true
      ),
      writeCreate(
        pathDoc(['conceptos', clave, 'aportes', sesion]),
        { sesion: sv(sesion), sala: iv(salaN) },
        ['creado']
      ),
    ]);
    recordarClave(sesion, clave);
    return { ok: true, clave, personas, nuevo: false };
  } catch (err) {
    // Re-aporte o carrera: si ya existía el aporte, no inflar el conteo.
    try {
      const clave = claveDe(recortar(texto, 180));
      if (clave && sesion) {
        const actual = await leerConcepto(clave).catch(() => null);
        if (actual) {
          recordarClave(sesion, clave);
          return { ok: true, clave, personas: actual.personas, nuevo: false, advertencia: String(err.message || err) };
        }
      }
    } catch {
      /* ignore */
    }
    console.warn('[jandiekua] aportarConcepto', err);
    return { ok: false, error: String(err.message || err) };
  }
}

/** Lista conceptos públicos (texto, clave, personas, salas) para el mar de ideas. */
export async function cargarConceptos() {
  try {
    const out = [];
    let pageToken = '';
    do {
      const params = new URLSearchParams({ key: API_KEY, pageSize: '300' });
      if (pageToken) params.set('pageToken', pageToken);
      const { res, body } = await firestoreFetch(`${BASE}/conceptos?${params}`, { method: 'GET' });
      if (!res.ok) throw new Error((body && body.error && body.error.message) || `list ${res.status}`);
      for (const doc of body.documents || []) {
        const d = docFields(doc);
        if (!d.clave && d.__name) d.clave = d.__name;
        out.push({
          clave: d.clave,
          texto: d.texto,
          personas: Number(d.personas || 0),
          salas: Array.isArray(d.salas) ? d.salas : [],
          creado: d.creado || null,
          actualizado: d.actualizado || null,
        });
      }
      pageToken = body.nextPageToken || '';
    } while (pageToken);
    return { ok: true, conceptos: out };
  } catch (err) {
    console.warn('[jandiekua] cargarConceptos', err);
    return { ok: false, conceptos: [], error: String(err.message || err) };
  }
}

/** Registro create-only de una colocación en un tanque. */
export async function guardarColocacion({ clave, sesion, sala, tanque } = {}) {
  try {
    const c = recortar(clave, 180) || claveDe(clave);
    if (!c) return { ok: false, error: 'clave vacía' };
    if (!sesion || !/^[A-Za-z0-9_-]{8,128}$/.test(sesion)) {
      return { ok: false, error: 'sesion inválida' };
    }
    const salaN = Number(sala);
    if (!Number.isInteger(salaN) || salaN < 1 || salaN > 4) {
      return { ok: false, error: 'sala inválida' };
    }
    const tq = recortar(tanque, 40);
    if (!tq) return { ok: false, error: 'tanque vacío' };
    const id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    await commit([
      writeCreate(
        pathDoc(['colocaciones', id]),
        { clave: sv(c), sesion: sv(sesion), sala: iv(salaN), tanque: sv(tq) },
        ['creado']
      ),
    ]);
    return { ok: true, id };
  } catch (err) {
    console.warn('[jandiekua] guardarColocacion', err);
    return { ok: false, error: String(err.message || err) };
  }
}

/**
 * Al final del juego: crea participantes/{sesion} y parchea los aportes
 * de esa sesión (claves rastreadas en el cliente) con nombre y procedencia.
 */
export async function registrarParticipante({
  sesion,
  nombre,
  procedencia,
  tituloInvestigacion,
  claves,
} = {}) {
  try {
    if (!sesion || !/^[A-Za-z0-9_-]{8,128}$/.test(sesion)) {
      return { ok: false, error: 'sesion inválida' };
    }
    const nom = recortar(nombre, 120);
    const proc = recortar(procedencia, 160);
    if (!nom) return { ok: false, error: 'nombre vacío' };
    if (!proc) return { ok: false, error: 'procedencia vacía' };
    const tituloInv = recortar(tituloInvestigacion, 180) || null;

    const lista = Array.from(
      new Set([...(Array.isArray(claves) ? claves : []), ...clavesDeSesion(sesion)])
    ).filter(Boolean);

    const writes = [
      writeCreate(
        pathDoc(['participantes', sesion]),
        {
          sesion: sv(sesion),
          nombre: sv(nom),
          procedencia: sv(proc),
          tituloInvestigacion: tituloInv == null ? nv() : sv(tituloInv),
        },
        ['creado']
      ),
    ];
    for (const clave of lista) {
      writes.push(
        writeUpdate(
          pathDoc(['conceptos', clave, 'aportes', sesion]),
          { nombre: sv(nom), procedencia: sv(proc) },
          ['nombre', 'procedencia'],
          [],
          true
        )
      );
    }
    // Firestore commit accepts at most 500 writes.
    for (let i = 0; i < writes.length; i += 450) {
      await commit(writes.slice(i, i + 450));
    }
    return { ok: true, aportes: lista.length };
  } catch (err) {
    console.warn('[jandiekua] registrarParticipante', err);
    return { ok: false, error: String(err.message || err) };
  }
}

export default {
  firebaseConfig,
  claveDe,
  clavesDeSesion,
  aportarConcepto,
  cargarConceptos,
  guardarColocacion,
  registrarParticipante,
};

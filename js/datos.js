/**
 * Cliente ligero (REST, sin SDK) para persistir ideas del escape room
 * Jandiekua · Mar de las Ideas. No bloquea el juego si falla la red.
 *
 * v4 (privacidad):
 *  - Nada se escribe hasta que la persona acepta los Términos y el Aviso de privacidad
 *    (aceptarConsentimiento crea participantes/{sesion} con versión y fecha del servidor).
 *  - Cada documento privado lleva el uid de Firebase Authentication (acceso anónimo,
 *    sin correo ni contraseña). Con él la persona puede descargar y borrar lo suyo.
 *
 * Uso (módulo ES):
 *   import { aceptarConsentimiento, aportarConcepto, cargarConceptos, guardarColocacion,
 *            registrarParticipante, descargarMisDatos, borrarMisDatos, claveDe } from './datos.js';
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
const STORE_ACCESO = 'jandiekua_acceso_v4';
const STORE_CONSENT = 'jandiekua_consentimiento_v4';
const VERSION = 'v4';
const AUTH_SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(API_KEY)}`;
const AUTH_DELETE = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${encodeURIComponent(API_KEY)}`;
const AUTH_REFRESH = `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(API_KEY)}`;

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
const memStore = Object.create(null);

function leerJSON(clave, defecto) {
  try {
    if (tieneStorage) {
      const raw = localStorage.getItem(clave);
      return raw ? JSON.parse(raw) : defecto;
    }
  } catch {
    /* ignorar */
  }
  return clave in memStore ? memStore[clave] : defecto;
}

function guardarJSON(clave, valor) {
  memStore[clave] = valor;
  if (!tieneStorage) return;
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* cuota o modo privado */
  }
}

function borrarJSON(clave) {
  delete memStore[clave];
  if (!tieneStorage) return;
  try {
    localStorage.removeItem(clave);
  } catch {
    /* ignorar */
  }
}

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
  // En el cuerpo de :commit el id va literal. encodeURIComponent convierte
  // espacios en %20 y entonces las reglas (clave == key) rechazan el alta.
  // En las URL (GET) sí se sigue escapando, ver leerConcepto.
  return (
    `projects/${PROJECT}/databases/(default)/documents/` +
    segments.map((s) => String(s).replace(/\//g, '')).join('/')
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

// ---------------------------------------------------------------- acceso anónimo (Firebase Auth)

let acceso = null; // { uid, refreshToken, idToken, exp }

function accesoGuardado() {
  const a = leerJSON(STORE_ACCESO, null);
  return a && a.uid && a.refreshToken ? a : null;
}

async function postJSON(url, cuerpo, esForm = false) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': esForm ? 'application/x-www-form-urlencoded' : 'application/json' },
    body: esForm ? new URLSearchParams(cuerpo).toString() : JSON.stringify(cuerpo),
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { res, body };
}

async function iniciarAcceso() {
  const { res, body } = await postJSON(AUTH_SIGNUP, { returnSecureToken: true });
  if (!res.ok || !body || !body.idToken) {
    throw new Error((body && body.error && body.error.message) || `auth ${res.status}`);
  }
  acceso = {
    uid: body.localId,
    refreshToken: body.refreshToken,
    idToken: body.idToken,
    exp: Date.now() + (Number(body.expiresIn) || 3600) * 1000,
  };
  guardarJSON(STORE_ACCESO, { uid: acceso.uid, refreshToken: acceso.refreshToken });
  return acceso;
}

/** Devuelve { uid, idToken }. Crea el acceso anónimo la primera vez y lo renueva cuando caduca. */
async function obtenerAcceso({ crear = true } = {}) {
  if (acceso && acceso.idToken && acceso.exp - 60000 > Date.now()) return acceso;
  const guardado = acceso || accesoGuardado();
  if (guardado && guardado.refreshToken) {
    try {
      const { res, body } = await postJSON(
        AUTH_REFRESH,
        { grant_type: 'refresh_token', refresh_token: guardado.refreshToken },
        true
      );
      if (res.ok && body && body.id_token) {
        acceso = {
          uid: body.user_id || guardado.uid,
          refreshToken: body.refresh_token || guardado.refreshToken,
          idToken: body.id_token,
          exp: Date.now() + (Number(body.expires_in) || 3600) * 1000,
        };
        guardarJSON(STORE_ACCESO, { uid: acceso.uid, refreshToken: acceso.refreshToken });
        return acceso;
      }
    } catch {
      /* se intenta un acceso nuevo */
    }
  }
  if (!crear) return null;
  return iniciarAcceso();
}

// ---------------------------------------------------------------- consentimiento

function consentimientoLocal(sesion) {
  const todo = leerJSON(STORE_CONSENT, {});
  return (sesion && todo[sesion]) || null;
}

function sesionValida(sesion) {
  return !!sesion && /^[A-Za-z0-9_-]{8,128}$/.test(sesion);
}

const intencion = Object.create(null); // sesion -> versión aceptada en pantalla
const enVuelo = Object.create(null); // sesion -> promesa del registro de consentimiento

/** Anota que la persona ya aceptó en pantalla (p. ej. tras recargar), para reintentar el registro si falló. */
export function declararConsentimiento({ sesion, version } = {}) {
  if (sesionValida(sesion) && recortar(version, 24)) intencion[sesion] = recortar(version, 24);
}

/**
 * Registra el consentimiento (Términos y Aviso de privacidad) y crea participantes/{sesion}
 * con la versión aceptada y el sello de tiempo del servidor. Hasta que esto sale bien,
 * ninguna otra escritura se envía.
 */
export function aceptarConsentimiento({ sesion, version } = {}) {
  if (!sesionValida(sesion)) return Promise.resolve({ ok: false, error: 'sesion inválida' });
  const v = recortar(version, 24);
  if (!v) return Promise.resolve({ ok: false, error: 'versión vacía' });
  intencion[sesion] = v;
  const p = registrarConsentimiento(sesion, v).finally(() => {
    if (enVuelo[sesion] === p) delete enVuelo[sesion];
  });
  enVuelo[sesion] = p;
  return p;
}

async function registrarConsentimiento(sesion, v) {
  try {
    const a = await obtenerAcceso();
    const local = consentimientoLocal(sesion);
    if (local && local.version === v && local.uid === a.uid) return { ok: true, nuevo: false };
    try {
      await commit(
        [
          writeCreate(
            pathDoc(['participantes', sesion]),
            {
              sesion: sv(sesion),
              uid: sv(a.uid),
              consentimiento: { mapValue: { fields: { version: sv(v) } } },
              boletin: { booleanValue: false },
            },
            ['creado', 'consentimiento.aceptado']
          ),
        ],
        a.idToken
      );
    } catch (err) {
      // 409: ya existía (p. ej. se recargó la página). Solo vale si es de este acceso.
      if (err.status !== 409) throw err;
      const { res } = await firestoreFetch(
        `${BASE}/participantes/${encodeURIComponent(sesion)}?key=${encodeURIComponent(API_KEY)}`,
        { method: 'GET', token: a.idToken }
      );
      if (!res.ok) throw err;
    }
    const todo = leerJSON(STORE_CONSENT, {});
    todo[sesion] = { version: v, uid: a.uid, aceptadoLocal: new Date().toISOString() };
    guardarJSON(STORE_CONSENT, todo);
    return { ok: true, nuevo: true };
  } catch (err) {
    console.warn('[jandiekua] aceptarConsentimiento', err);
    return { ok: false, error: String(err.message || err) };
  }
}

export function tieneConsentimiento(sesion) {
  return !!consentimientoLocal(sesion);
}

async function exigirConsentimiento(sesion) {
  if (enVuelo[sesion]) await enVuelo[sesion];
  if (!consentimientoLocal(sesion) && intencion[sesion]) {
    await aceptarConsentimiento({ sesion, version: intencion[sesion] });
  }
  if (!consentimientoLocal(sesion)) {
    const e = new Error('sin consentimiento');
    e.sinConsentimiento = true;
    throw e;
  }
  return obtenerAcceso();
}

// ---------------------------------------------------------------- red

async function firestoreFetch(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const { token: _t, ...resto } = options;
  const res = await fetch(url, { ...resto, headers });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { res, body };
}

function errorDe(res, body, etiqueta) {
  const err = new Error((body && body.error && body.error.message) || `${etiqueta} ${res.status}`);
  err.status = res.status;
  err.body = body;
  return err;
}

async function commit(writes, token) {
  const t = token || (acceso && acceso.idToken) || null;
  const { res, body } = await firestoreFetch(COMMIT, {
    method: 'POST',
    body: JSON.stringify({ writes }),
    token: t,
  });
  if (!res.ok) throw errorDe(res, body, 'commit');
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

function writeUpdate(name, fields, fieldPaths, timestampFields, exists = true, updateTime = null) {
  const w = {
    update: { name, fields },
    updateMask: { fieldPaths },
    currentDocument: updateTime ? { updateTime } : { exists },
  };
  if (timestampFields && timestampFields.length) {
    w.updateTransforms = timestampFields.map((fieldPath) => ({
      fieldPath,
      setToServerValue: 'REQUEST_TIME',
    }));
  }
  return w;
}

function writeDelete(name) {
  return { delete: name, currentDocument: { exists: true } };
}

async function leerConcepto(clave) {
  const url = `${BASE}/conceptos/${encodeURIComponent(clave)}?key=${encodeURIComponent(API_KEY)}`;
  const { res, body } = await firestoreFetch(url, { method: 'GET' });
  if (res.status === 404) return null;
  if (!res.ok) throw errorDe(res, body, 'get');
  const d = docFields(body);
  d.__updateTime = body.updateTime || null;
  return d;
}

// ---------------------------------------------------------------- escritura

/**
 * Aporta un concepto (deduplicado por clave) o, si tipo === 'titulo',
 * guarda un título sin deduplicar. Requiere consentimiento previo.
 * @returns {Promise<{ok:boolean, clave?:string, personas?:number, nuevo?:boolean, titulo?:boolean, id?:string}>}
 */
const ELEMENTOS_OK = ['que', 'quien', 'donde', 'cuando'];

export async function aportarConcepto(args = {}, _reintento = false) {
  const { texto, sala, salaNombre, tipo, sesion, tituloInvestigacion } = args;
  const elemento = ELEMENTOS_OK.includes(args.elemento) ? args.elemento : null;
  try {
    const t = recortar(texto, 180);
    if (!t) return { ok: false, error: 'texto vacío' };
    if (!sesionValida(sesion)) return { ok: false, error: 'sesion inválida' };
    const salaN = Number(sala);
    if (!Number.isInteger(salaN) || salaN < 1 || salaN > 4) {
      return { ok: false, error: 'sala inválida' };
    }
    const a = await exigirConsentimiento(sesion);

    if (tipo === 'titulo') {
      const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      const tituloInv = recortar(tituloInvestigacion, 180) || null;
      const fields = {
        texto: sv(t),
        sala: iv(salaN),
        salaNombre: sv(recortar(salaNombre || 'Sala', 80) || 'Sala'),
        tipo: sv('titulo'),
        sesion: sv(sesion),
        uid: sv(a.uid),
        tituloInvestigacion: tituloInv == null ? nv() : sv(tituloInv),
        version: sv(VERSION),
      };
      await commit([writeCreate(pathDoc(['titulos', id]), fields, ['creado'])], a.idToken);
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
      // Sala 1 (peces): qué | quién | dónde | cuándo. Solo se fija al crear el pez.
      if (elemento) fieldsConcepto.elemento = sv(elemento);
      const fieldsAporte = {
        sesion: sv(sesion),
        sala: iv(salaN),
        uid: sv(a.uid),
      };
      await commit(
        [
          writeCreate(pathDoc(['conceptos', clave]), fieldsConcepto, ['creado', 'actualizado']),
          writeCreate(pathDoc(['conceptos', clave, 'aportes', sesion]), fieldsAporte, ['creado']),
        ],
        a.idToken
      );
      recordarClave(sesion, clave);
      return { ok: true, clave, personas: 1, nuevo: true };
    }

    const salas = Array.isArray(existente.salas) ? existente.salas.slice() : [];
    if (!salas.includes(salaN)) salas.push(salaN);
    const personas = Number(existente.personas || 0) + 1;
    await commit(
      [
        writeUpdate(
          pathDoc(['conceptos', clave]),
          {
            personas: iv(personas),
            ultimoSesion: sv(sesion),
            salas: arrInt(salas),
          },
          ['personas', 'ultimoSesion', 'salas'],
          ['actualizado'],
          true,
          existente.__updateTime
        ),
        writeCreate(
          pathDoc(['conceptos', clave, 'aportes', sesion]),
          { sesion: sv(sesion), sala: iv(salaN), uid: sv(a.uid) },
          ['creado']
        ),
      ],
      a.idToken
    );
    recordarClave(sesion, clave);
    return { ok: true, clave, personas, nuevo: false };
  } catch (err) {
    if (err.sinConsentimiento) return { ok: false, error: err.message };
    // Carrera (otra persona creó o cambió el concepto a la vez): se reintenta una vez.
    if (!_reintento && (err.status === 409 || err.status === 400)) {
      return aportarConcepto(args, true);
    }
    // Re-aporte de la misma sesión: se muestra el conteo público, sin duplicar ni registrar.
    try {
      const clave = claveDe(recortar(texto, 180));
      if (clave && sesionValida(sesion) && tipo !== 'titulo') {
        const actual = await leerConcepto(clave).catch(() => null);
        if (actual) {
          return { ok: true, clave, personas: actual.personas, nuevo: false, sinRegistro: true, advertencia: String(err.message || err) };
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
        // Conceptos que quedaron sin personas tras un borrado no se muestran.
        if (Number(d.personas || 0) < 1) continue;
        out.push({
          clave: d.clave,
          texto: d.texto,
          personas: Number(d.personas || 0),
          salas: Array.isArray(d.salas) ? d.salas : [],
          elemento: ELEMENTOS_OK.includes(d.elemento) ? d.elemento : null,
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

/** Registro create-only de una colocación en un tanque (requiere consentimiento). */
export async function guardarColocacion({ clave, sesion, sala, tanque } = {}) {
  try {
    const c = recortar(clave, 180) || claveDe(clave);
    if (!c) return { ok: false, error: 'clave vacía' };
    if (!sesionValida(sesion)) return { ok: false, error: 'sesion inválida' };
    const salaN = Number(sala);
    if (!Number.isInteger(salaN) || salaN < 1 || salaN > 4) {
      return { ok: false, error: 'sala inválida' };
    }
    const tq = recortar(tanque, 40);
    if (!tq) return { ok: false, error: 'tanque vacío' };
    const a = await exigirConsentimiento(sesion);
    const id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    await commit(
      [
        writeCreate(
          pathDoc(['colocaciones', id]),
          { clave: sv(c), sesion: sv(sesion), uid: sv(a.uid), sala: iv(salaN), tanque: sv(tq) },
          ['creado']
        ),
      ],
      a.idToken
    );
    return { ok: true, id };
  } catch (err) {
    console.warn('[jandiekua] guardarColocacion', err);
    return { ok: false, error: String(err.message || err) };
  }
}

/**
 * Al final del juego: completa participantes/{sesion} (que se creó al aceptar los
 * términos) con nombre y procedencia, y parchea los aportes de esa sesión.
 * Si pidió el boletín, guarda su correo (opcional) junto a la casilla.
 */
export async function registrarParticipante({
  sesion,
  nombre,
  procedencia,
  tituloInvestigacion,
  claves,
  boletin,
  correo,
} = {}) {
  try {
    if (!sesionValida(sesion)) return { ok: false, error: 'sesion inválida' };
    const nom = recortar(nombre, 120);
    const proc = recortar(procedencia, 160);
    if (!nom) return { ok: false, error: 'nombre vacío' };
    if (!proc) return { ok: false, error: 'procedencia vacía' };
    const tituloInv = recortar(tituloInvestigacion, 180) || null;
    const quiereBoletin = boletin === true;
    const mail = quiereBoletin ? recortar(correo, 254) || null : null;
    if (mail && !/.+@.+/.test(mail)) return { ok: false, error: 'correo inválido' };
    const a = await exigirConsentimiento(sesion);

    const lista = Array.from(
      new Set([...(Array.isArray(claves) ? claves : []), ...clavesDeSesion(sesion)])
    ).filter(Boolean);

    const campos = {
      nombre: sv(nom),
      procedencia: sv(proc),
      tituloInvestigacion: tituloInv == null ? nv() : sv(tituloInv),
      boletin: { booleanValue: quiereBoletin },
    };
    const mascara = ['nombre', 'procedencia', 'tituloInvestigacion', 'boletin'];
    if (mail) {
      campos.correo = sv(mail);
      mascara.push('correo');
    }
    const writes = [
      writeUpdate(pathDoc(['participantes', sesion]), campos, mascara, ['completado'], true),
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
      await commit(writes.slice(i, i + 450), a.idToken);
    }
    return { ok: true, aportes: lista.length };
  } catch (err) {
    console.warn('[jandiekua] registrarParticipante', err);
    return { ok: false, error: String(err.message || err) };
  }
}

// ---------------------------------------------------------------- descarga y borrado

function sesionesLocales() {
  const all = leerJSON(STORE, {});
  const out = {};
  for (const [sid, claves] of Object.entries(all || {})) {
    if (Array.isArray(claves)) out[sid] = Array.from(new Set(claves));
  }
  return out;
}

async function consultarPorUid(coleccion, uid, token) {
  const out = [];
  const { res, body } = await firestoreFetch(`${BASE}:runQuery?key=${encodeURIComponent(API_KEY)}`, {
    method: 'POST',
    token,
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: coleccion }],
        where: {
          fieldFilter: { field: { fieldPath: 'uid' }, op: 'EQUAL', value: sv(uid) },
        },
      },
    }),
  });
  if (!res.ok) throw errorDe(res, body, `consulta ${coleccion}`);
  for (const fila of Array.isArray(body) ? body : []) {
    if (fila.document) out.push({ name: fila.document.name, ...docFields(fila.document) });
  }
  return out;
}

function sinCamposInternos(d, quitar = []) {
  const o = {};
  for (const [k, v] of Object.entries(d)) {
    if (k.startsWith('__') || k === 'name' || k === 'uid' || quitar.includes(k)) continue;
    o[k] = v;
  }
  return o;
}

/**
 * Reúne todo lo que este navegador aportó (participantes, títulos, aportes y colocaciones)
 * tal como está guardado. Devuelve un objeto listo para convertir a JSON o CSV.
 */
export async function descargarMisDatos() {
  try {
    const a = await obtenerAcceso({ crear: false });
    if (!a) return { ok: false, error: 'sin acceso' };
    const [participantes, titulos, colocaciones] = await Promise.all([
      consultarPorUid('participantes', a.uid, a.idToken),
      consultarPorUid('titulos', a.uid, a.idToken),
      consultarPorUid('colocaciones', a.uid, a.idToken),
    ]);
    const sesiones = new Set(participantes.map((p) => p.sesion || p.__name));
    const aportes = [];
    const locales = sesionesLocales();
    for (const [sid, claves] of Object.entries(locales)) {
      if (!sesiones.has(sid)) continue;
      // Textos de los conceptos (lectura pública), en lotes.
      const textos = {};
      for (let i = 0; i < claves.length; i += 80) {
        const lote = claves.slice(i, i + 80);
        const { res, body } = await firestoreFetch(`${BASE}:batchGet?key=${encodeURIComponent(API_KEY)}`, {
          method: 'POST',
          body: JSON.stringify({ documents: lote.map((c) => pathDoc(['conceptos', c])) }),
        });
        if (res.ok && Array.isArray(body)) {
          for (const fila of body) {
            if (fila.found) {
              const d = docFields(fila.found);
              textos[d.clave || d.__name] = d.texto;
            }
          }
        }
      }
      for (const clave of claves) {
        const url = `${BASE}/conceptos/${encodeURIComponent(clave)}/aportes/${encodeURIComponent(sid)}?key=${encodeURIComponent(API_KEY)}`;
        const { res, body } = await firestoreFetch(url, { method: 'GET', token: a.idToken });
        if (!res.ok) continue;
        const d = docFields(body);
        aportes.push({ concepto: textos[clave] || clave, clave, ...sinCamposInternos(d) });
      }
    }
    return {
      ok: true,
      datos: {
        descripcion:
          'Datos que esta persona aportó al juego Mar de las Ideas (Revista Jandiekua, Agenda Ambiental UASLP). ' +
          'El identificador de sesión es anónimo; solo se relaciona con tu nombre en tu registro de participante.',
        generado: new Date().toISOString(),
        participaciones: participantes.map((p) => sinCamposInternos(p)),
        titulos: titulos.map((t) => sinCamposInternos(t)),
        aportes,
        colocaciones: colocaciones.map((c) => sinCamposInternos(c)),
      },
    };
  } catch (err) {
    console.warn('[jandiekua] descargarMisDatos', err);
    return { ok: false, error: String(err.message || err) };
  }
}

function csvCelda(v) {
  const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Convierte el resultado de descargarMisDatos a CSV (una sección por tipo de dato). */
export function datosACsv(datos) {
  const bloques = [];
  const tabla = (titulo, filas) => {
    if (!filas || !filas.length) return;
    const cols = Array.from(new Set(filas.flatMap((f) => Object.keys(f))));
    bloques.push(
      [csvCelda(`# ${titulo}`), cols.map(csvCelda).join(',')]
        .concat(filas.map((f) => cols.map((c) => csvCelda(f[c])).join(',')))
        .join('\r\n')
    );
  };
  tabla('participaciones', datos.participaciones);
  tabla('titulos', datos.titulos);
  tabla('aportes', datos.aportes);
  tabla('colocaciones', datos.colocaciones);
  return '\ufeff' + bloques.join('\r\n\r\n') + '\r\n';
}

/**
 * Borra todo lo que este navegador aportó: aportes (bajando el conteo de cada concepto),
 * colocaciones, títulos y participantes (incluido el consentimiento, el nombre y el correo
 * del boletín), y elimina el acceso anónimo. Es idempotente: si algo falla se puede repetir.
 */
export async function borrarMisDatos() {
  const resumen = { aportes: 0, colocaciones: 0, titulos: 0, participantes: 0, conceptosLimpiados: 0, omitidos: 0 };
  try {
    const a = await obtenerAcceso({ crear: false });
    if (!a) return { ok: true, resumen, sinAcceso: true };

    // 1) Aportes: un lote por concepto (aporte + conteo −1), con control de concurrencia.
    const locales = sesionesLocales();
    for (const [sid, claves] of Object.entries(locales)) {
      for (const clave of claves) {
        let hecho = false;
        for (let intento = 0; intento < 4 && !hecho; intento++) {
          const c = await leerConcepto(clave);
          if (!c || Number(c.personas || 0) < 1) {
            resumen.omitidos++;
            hecho = true;
            break;
          }
          try {
            await commit(
              [
                writeUpdate(
                  pathDoc(['conceptos', clave]),
                  { personas: iv(Number(c.personas) - 1), ultimoSesion: sv(sid) },
                  ['personas', 'ultimoSesion'],
                  ['actualizado'],
                  true,
                  c.__updateTime
                ),
                writeDelete(pathDoc(['conceptos', clave, 'aportes', sid])),
              ],
              a.idToken
            );
            resumen.aportes++;
            hecho = true;
            if (Number(c.personas) - 1 === 0) {
              try {
                await commit([{ delete: pathDoc(['conceptos', clave]) }], a.idToken);
                resumen.conceptosLimpiados++;
              } catch {
                /* queda en 0 y no se muestra; cualquiera puede limpiarlo después */
              }
            }
          } catch (err) {
            if (err.status === 409 || err.status === 400) continue; // cambió a la vez: reintentar
            if (err.status === 403 || err.status === 404) {
              // Si el aporte existiera y fuera nuestro, esta lectura funcionaría: entonces
              // el rechazo es un fallo real y se avisa. Si no, no hay nada que borrar.
              const url = `${BASE}/conceptos/${encodeURIComponent(clave)}/aportes/${encodeURIComponent(sid)}?key=${encodeURIComponent(API_KEY)}`;
              const { res: r2 } = await firestoreFetch(url, { method: 'GET', token: a.idToken });
              if (r2.ok) throw err;
              resumen.omitidos++;
              hecho = true;
            } else {
              throw err;
            }
          }
        }
        if (!hecho) throw new Error(`no se pudo borrar el aporte «${clave}»`);
      }
    }

    // 2) Colocaciones y títulos por uid.
    for (const col of ['colocaciones', 'titulos']) {
      const docs = await consultarPorUid(col, a.uid, a.idToken);
      for (let i = 0; i < docs.length; i += 200) {
        await commit(docs.slice(i, i + 200).map((d) => ({ delete: d.name })), a.idToken);
      }
      resumen[col] = docs.length;
    }

    // 3) Participantes (consentimiento, nombre, procedencia, correo) al final.
    const ps = await consultarPorUid('participantes', a.uid, a.idToken);
    for (let i = 0; i < ps.length; i += 200) {
      await commit(ps.slice(i, i + 200).map((d) => ({ delete: d.name })), a.idToken);
    }
    resumen.participantes = ps.length;

    // 4) Limpieza local y baja del acceso anónimo (sin datos personales).
    try {
      await postJSON(AUTH_DELETE, { idToken: a.idToken });
    } catch {
      /* el usuario anónimo no contiene datos personales; se ignora */
    }
    acceso = null;
    borrarJSON(STORE_ACCESO);
    borrarJSON(STORE_CONSENT);
    borrarJSON(STORE);
    for (const k of Object.keys(memoria)) delete memoria[k];
    return { ok: true, resumen };
  } catch (err) {
    console.warn('[jandiekua] borrarMisDatos', err);
    return { ok: false, error: String(err.message || err), resumen };
  }
}

/** Olvida el acceso y los consentimientos locales (sin tocar el servidor). */
export function olvidarAccesoLocal() {
  acceso = null;
  borrarJSON(STORE_ACCESO);
  borrarJSON(STORE_CONSENT);
}

export default {
  firebaseConfig,
  claveDe,
  clavesDeSesion,
  aceptarConsentimiento,
  declararConsentimiento,
  tieneConsentimiento,
  aportarConcepto,
  cargarConceptos,
  guardarColocacion,
  registrarParticipante,
  descargarMisDatos,
  datosACsv,
  borrarMisDatos,
  olvidarAccesoLocal,
};

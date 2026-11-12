#!/usr/bin/env python3
"""Pruebas de firestore.rules (v4, privacidad) contra el EMULADOR de Firestore.

No toca producción: solo habla con 127.0.0.1:8080 y usa tokens sin firmar
(el emulador los acepta). Requiere Java y firebase-tools:

  export PATH=$HOME/jre/jdk-21.0.13+9-jre/bin:$PATH
  (cd /workspace/jk_emu && firebase emulators:start --only firestore --project jandiekua-escape-room)
  python3 test_reglas_emulador.py
"""
from __future__ import annotations

import base64
import json
import sys
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

PROJECT = "jandiekua-escape-room"
HOST = "http://127.0.0.1:8080"
BASE = f"{HOST}/v1/projects/{PROJECT}/databases/(default)/documents"
DOCS = f"projects/{PROJECT}/databases/(default)/documents"
RES = []


def jwt(uid: str | None):
    if uid is None:
        return None
    b = lambda d: base64.urlsafe_b64encode(json.dumps(d).encode()).decode().rstrip("=")
    return (
        b({"alg": "none", "typ": "JWT"})
        + "."
        + b({"user_id": uid, "sub": uid, "iss": f"https://securetoken.google.com/{PROJECT}",
             "aud": PROJECT, "firebase": {"sign_in_provider": "anonymous"}})
        + "."
    )


def call(method, url, payload=None, uid=None):
    headers = {"Content-Type": "application/json"}
    t = jwt(uid)
    if t:
        headers["Authorization"] = f"Bearer {t}"
    data = None if payload is None else json.dumps(payload).encode()
    req = Request(url, data=data, method=method, headers=headers)
    try:
        with urlopen(req, timeout=30) as r:
            raw = r.read().decode()
            return r.status, (json.loads(raw) if raw else {})
    except HTTPError as e:
        raw = e.read().decode() if e.fp else ""
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"raw": raw}


def ok(s):
    return 200 <= s < 300


def denegado(s, b):
    return s in (400, 403) or "PERMISSION_DENIED" in json.dumps(b)


def check(name, cond, detail=""):
    RES.append((name, bool(cond)))
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if (detail and not cond) else ""))


def sv(x): return {"stringValue": str(x)}
def iv(n): return {"integerValue": str(int(n))}
def bv(b): return {"booleanValue": bool(b)}
def nv(): return {"nullValue": "NULL_VALUE"}
def arr(ns): return {"arrayValue": {"values": [iv(n) for n in ns]}}
def mp(d): return {"mapValue": {"fields": d}}
def path(*seg): return f"{DOCS}/" + "/".join(seg)


def w_create(name, fields, ts=("creado",)):
    return {"update": {"name": name, "fields": fields}, "currentDocument": {"exists": False},
            "updateTransforms": [{"fieldPath": f, "setToServerValue": "REQUEST_TIME"} for f in ts]}


def w_update(name, fields, mask, ts=()):
    w = {"update": {"name": name, "fields": fields}, "updateMask": {"fieldPaths": mask},
         "currentDocument": {"exists": True}}
    if ts:
        w["updateTransforms"] = [{"fieldPath": f, "setToServerValue": "REQUEST_TIME"} for f in ts]
    return w


def w_delete(name):
    return {"delete": name, "currentDocument": {"exists": True}}


def commit(writes, uid):
    return call("POST", f"{BASE}:commit", {"writes": writes}, uid)


def get(p, uid=None):
    return call("GET", f"{HOST}/v1/{p}", None, uid)


def query(coleccion, uid_valor, uid):
    body = {"structuredQuery": {"from": [{"collectionId": coleccion}],
            "where": {"fieldFilter": {"field": {"fieldPath": "uid"}, "op": "EQUAL", "value": sv(uid_valor)}}}}
    return call("POST", f"{BASE}:runQuery", body, uid)


def participante(ses, uid, version="2026-11-12"):
    return w_create(path("participantes", ses), {
        "sesion": sv(ses), "uid": sv(uid),
        "consentimiento": mp({"version": sv(version)}), "boletin": bv(False)},
        ts=("creado", "consentimiento.aceptado"))


def aportar(clave, ses, uid, sala=1, personas_previas=None, salas=None, texto=None):
    ap = w_create(path("conceptos", clave, "aportes", ses),
                  {"sesion": sv(ses), "sala": iv(sala), "uid": sv(uid)})
    if personas_previas is None:
        c = w_create(path("conceptos", clave),
                     {"texto": sv(texto or clave), "clave": sv(clave), "salas": arr([sala]),
                      "personas": iv(1), "ultimoSesion": sv(ses)}, ts=("creado", "actualizado"))
    else:
        c = w_update(path("conceptos", clave),
                     {"personas": iv(personas_previas + 1), "ultimoSesion": sv(ses), "salas": arr(salas or [sala])},
                     ["personas", "ultimoSesion", "salas"], ts=("actualizado",))
    return [c, ap]


def borrar_aporte(clave, ses, personas_actual, salas):
    return [
        w_update(path("conceptos", clave),
                 {"personas": iv(personas_actual - 1), "ultimoSesion": sv(ses)},
                 ["personas", "ultimoSesion"], ts=("actualizado",)),
        w_delete(path("conceptos", clave, "aportes", ses)),
    ]


def personas(clave):
    s, b = get(path("conceptos", clave))
    return int(b["fields"]["personas"]["integerValue"]) if ok(s) else None


def main():
    s, _ = call("DELETE", f"{HOST}/emulator/v1/projects/{PROJECT}/databases/(default)/documents")
    A, B, C = "uidAAAAAAAA", "uidBBBBBBBB", "uidCCCCCCCC"
    SA, SB, SC = "sesionAAAA01", "sesionBBBB01", "sesionCCCC01"

    print("Consentimiento y creación")
    s, b = commit([participante(SA, A)], None)
    check("sin sesión no se crea participante", denegado(s, b), f"{s}")
    s, b = commit([participante(SA, B)], A)
    check("no se puede falsificar el uid", denegado(s, b), f"{s}")
    s, b = commit([w_create(path("participantes", SA), {"sesion": sv(SA), "uid": sv(A), "boletin": bv(False)},
                            ts=("creado",))], A)
    check("participante sin consentimiento se rechaza", denegado(s, b), f"{s}")
    s, b = commit(aportar("urbano", SA, A, texto="Urbano"), A)
    check("aporte sin participante/consentimiento se rechaza", denegado(s, b), f"{s}")
    s, b = commit([participante(SA, A)], A)
    check("A registra consentimiento (versión y fecha)", ok(s), f"{s} {b}")
    s, b = get(path("participantes", SA), A)
    f = b.get("fields", {}) if ok(s) else {}
    check("consentimiento guardado con versión y sello del servidor",
          f.get("consentimiento", {}).get("mapValue", {}).get("fields", {}).get("version", {}).get("stringValue") == "2026-11-12"
          and "timestampValue" in f.get("consentimiento", {}).get("mapValue", {}).get("fields", {}).get("aceptado", {}))
    s, b = commit(aportar("urbano", SA, A, texto="Urbano"), A)
    check("A aporta un concepto nuevo", ok(s), f"{s} {b}")
    s, b = commit(aportar("agua", SA, A, texto="Agua"), B)
    check("B no puede aportar usando la sesión de A", denegado(s, b), f"{s}")
    s, b = commit(aportar("urbano", SB, B, personas_previas=1), B)
    check("B sin consentimiento no aporta", denegado(s, b), f"{s}")
    s, b = commit([participante(SB, B)], B)
    check("B registra consentimiento", ok(s))
    s, b = commit(aportar("urbano", SB, B, personas_previas=1), B)
    check("B aporta el mismo concepto (personas=2)", ok(s) and personas("urbano") == 2, f"{s} {b}")
    s, b = commit([w_create(path("colocaciones", "c_1"), {"clave": sv("urbano"), "sesion": sv(SA), "uid": sv(A),
                   "sala": iv(1), "tanque": sv("t1")})], A)
    check("A crea una colocación", ok(s), f"{s} {b}")
    s, b = commit([w_create(path("colocaciones", "c_x"), {"clave": sv("urbano"), "sesion": sv(SA), "uid": sv(B),
                   "sala": iv(1), "tanque": sv("t1")})], B)
    check("B no coloca en la sesión de A", denegado(s, b), f"{s}")
    s, b = commit([w_create(path("titulos", "t_1"), {"texto": sv("Mi título"), "sala": iv(1), "salaNombre": sv("Túnel"),
                   "tipo": sv("titulo"), "sesion": sv(SA), "uid": sv(A), "tituloInvestigacion": sv("Mi título"),
                   "version": sv("v4")})], A)
    check("A guarda su título", ok(s), f"{s} {b}")

    print("Lectura (descarga)")
    check("lectura pública del concepto sigue abierta", ok(get(path("conceptos", "urbano"))[0]))
    check("el aporte no se lee sin sesión", denegado(*get(path("conceptos", "urbano", "aportes", SA))))
    check("el aporte de A no lo lee B", denegado(*get(path("conceptos", "urbano", "aportes", SA), B)))
    check("A lee su aporte", ok(get(path("conceptos", "urbano", "aportes", SA), A)[0]))
    s, b = call("GET", f"{BASE}/conceptos/urbano/aportes", None, A)
    check("nadie lista aportes", denegado(s, b), f"{s}")
    check("B no lee el participante de A", denegado(*get(path("participantes", SA), B)))
    check("sin sesión no se lee participante", denegado(*get(path("participantes", SA))))
    s, b = query("titulos", A, A)
    check("A consulta sus títulos", ok(s) and any("document" in x for x in b), f"{s} {b}")
    s, b = query("colocaciones", A, A)
    check("A consulta sus colocaciones", ok(s) and any("document" in x for x in b), f"{s}")
    s, b = query("titulos", A, B)
    check("B no consulta los títulos de A", denegado(s, b) or not any("document" in x for x in (b if isinstance(b, list) else [])), f"{s}")
    s, b = call("GET", f"{BASE}/titulos", None, B)
    check("B no lista títulos sin filtro", denegado(s, b), f"{s}")
    s, b = call("GET", f"{BASE}/participantes", None, None)
    check("nadie lista participantes", denegado(s, b), f"{s}")

    print("Perfil final y boletín")
    perfil = lambda ses, nombre, boletin=False, correo=None: [w_update(
        path("participantes", ses),
        {"nombre": sv(nombre), "procedencia": sv("UASLP"), "tituloInvestigacion": sv("Mi título"),
         "boletin": bv(boletin), **({"correo": sv(correo)} if correo else {})},
        ["nombre", "procedencia", "tituloInvestigacion", "boletin"] + (["correo"] if correo else []),
        ts=("completado",))]
    s, b = commit(perfil(SA, "Ana"), B)
    check("B no completa el perfil de A", denegado(s, b), f"{s}")
    s, b = commit(perfil(SA, "Ana", True, "correo-sin-arroba"), A)
    check("boletín con correo inválido se rechaza", denegado(s, b), f"{s}")
    w = perfil(SA, "Ana", True, "ana@example.org")
    w += [w_update(path("conceptos", "urbano", "aportes", SA), {"nombre": sv("Ana"), "procedencia": sv("UASLP")},
                   ["nombre", "procedencia"])]
    s, b = commit(w, A)
    check("A completa perfil (nombre, procedencia, boletín+correo) y parchea su aporte", ok(s), f"{s} {b}")
    s, b = commit(perfil(SA, "Otra"), A)
    check("el perfil solo se completa una vez", denegado(s, b), f"{s}")
    s, b = commit([w_update(path("conceptos", "urbano", "aportes", SB), {"nombre": sv("Hack"), "procedencia": sv("X")},
                            ["nombre", "procedencia"]),
                   w_update(path("participantes", SB), {"nombre": sv("Hack"), "procedencia": sv("X"), "boletin": bv(False)},
                            ["nombre", "procedencia", "boletin"], ts=("completado",))], A)
    check("A no parchea datos de B", denegado(s, b), f"{s}")

    print("Borrado")
    s, b = commit(borrar_aporte("urbano", SA, 2, [1]), B)
    check("B no borra el aporte de A", denegado(s, b), f"{s}")
    s, b = commit([w_delete(path("conceptos", "urbano", "aportes", SA))], A)
    check("borrar aporte sin bajar el conteo se rechaza", denegado(s, b), f"{s}")
    s, b = commit([w_update(path("conceptos", "urbano"), {"personas": iv(0), "ultimoSesion": sv(SA)},
                            ["personas", "ultimoSesion"], ts=("actualizado",)),
                   w_delete(path("conceptos", "urbano", "aportes", SA))], A)
    check("bajar el conteo en 2 se rechaza", denegado(s, b), f"{s}")
    s, b = commit([w_update(path("conceptos", "urbano"), {"personas": iv(1), "ultimoSesion": sv(SC)},
                            ["personas", "ultimoSesion"], ts=("actualizado",))], A)
    check("bajar el conteo sin borrar el aporte propio se rechaza", denegado(s, b), f"{s}")
    s, b = commit([participante(SC, C)], C)
    s, b = commit([w_update(path("conceptos", "urbano"), {"personas": iv(1), "ultimoSesion": sv(SA)},
                            ["personas", "ultimoSesion"], ts=("actualizado",))], C)
    check("C no baja el conteo apuntando al aporte de A", denegado(s, b), f"{s}")
    s, b = commit(borrar_aporte("urbano", SA, 2, [1]), A)
    check("A borra su aporte y el conteo baja a 1", ok(s) and personas("urbano") == 1, f"{s} {b}")
    s, b = call("DELETE", f"{HOST}/v1/{path('conceptos', 'urbano')}", None, A)
    check("un concepto con personas>0 no se borra", denegado(s, b), f"{s}")
    s, b = call("DELETE", f"{HOST}/v1/{path('colocaciones', 'c_1')}", None, B)
    check("B no borra colocaciones de A", denegado(s, b), f"{s}")
    s, b = call("DELETE", f"{HOST}/v1/{path('colocaciones', 'c_1')}", None, A)
    check("A borra su colocación", ok(s), f"{s}")
    s, b = call("DELETE", f"{HOST}/v1/{path('titulos', 't_1')}", None, A)
    check("A borra su título", ok(s), f"{s}")
    s, b = call("DELETE", f"{HOST}/v1/{path('participantes', SA)}", None, B)
    check("B no borra el participante de A", denegado(s, b), f"{s}")
    s, b = call("DELETE", f"{HOST}/v1/{path('participantes', SA)}", None, A)
    check("A borra su participante", ok(s), f"{s}")
    s, b = commit([w_create(path("colocaciones", "c_2"), {"clave": sv("urbano"), "sesion": sv(SA), "uid": sv(A),
                   "sala": iv(1), "tanque": sv("t1")})], A)
    check("sin participante ya no se puede escribir (consentimiento revocado)", denegado(s, b), f"{s}")
    s, b = commit(borrar_aporte("urbano", SB, 1, [1]), B)
    check("B borra el suyo (personas=0)", ok(s) and personas("urbano") == 0, f"{s} {b}")
    s, b = call("DELETE", f"{HOST}/v1/{path('conceptos', 'urbano')}", None, B)
    check("el concepto en 0 se limpia", ok(s), f"{s}")
    check("el concepto ya no existe", get(path("conceptos", "urbano"))[0] == 404)

    print("Lotes grandes y límite de llamadas de reglas")
    ses = "sesionBigLote1"
    commit([participante(ses, A)], A)
    ks = [f"idea{i:02d}" for i in range(40)]
    todo_ok = True
    for k in ks:
        s, b = commit(aportar(k, ses, A, texto=k), A)
        todo_ok &= ok(s)
    check("40 aportes (uno por lote)", todo_ok)
    w = [w_update(path("conceptos", k, "aportes", ses), {"nombre": sv("Ana"), "procedencia": sv("UASLP")},
                  ["nombre", "procedencia"]) for k in ks]
    w += [w_update(path("participantes", ses), {"nombre": sv("Ana"), "procedencia": sv("UASLP"), "boletin": bv(False)},
                   ["nombre", "procedencia", "boletin"], ts=("completado",))]
    s, b = commit(w, A)
    check("parche de 40 aportes en un solo lote", ok(s), f"{s} {str(b)[:200]}")
    bien = True
    for k in ks:
        s, b = commit(borrar_aporte(k, ses, 1, [1]), A)
        s2, _ = call("DELETE", f"{HOST}/v1/{path('conceptos', k)}", None, A)
        bien &= ok(s) and ok(s2)
    check("borrado de 40 conceptos propios (aporte+conteo, luego limpieza)", bien)

    fallos = [n for n, c in RES if not c]
    print(f"\n{len(RES) - len(fallos)}/{len(RES)} pruebas correctas")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())

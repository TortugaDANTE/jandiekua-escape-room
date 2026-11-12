# Firestore: reglas v4 (NO desplegadas en producción)

- `firestore.rules`: requieren Firebase Authentication anónima (`request.auth.uid`) y consentimiento registrado; cada documento privado lleva el `uid` de su dueño. Permiten a la persona leer y borrar solo lo suyo.
- `test_reglas_emulador.py`: 58 pruebas contra el emulador (no toca producción). Con el emulador activo en `127.0.0.1:8080` y el proyecto `jandiekua-escape-room`: `python3 firebase/test_reglas_emulador.py`.
- Antes de desplegar (`firebase deploy --only firestore:rules`) hay que **habilitar el proveedor «Anónimo»** en Firebase Authentication y, de preferencia, restringir la clave de API por dominio. No se requieren cambios de índices.

- **Sala 1 (peces):** `conceptos` admite el campo opcional `elemento` (`que`, `quien`, `donde` o `cuando`), que solo se fija al crear el concepto y no cambia al sumar o restar personas (`elementoOk` / `elementoIgual` en `firestore.rules`; 8 pruebas nuevas). **Esta versión de las reglas no está desplegada**: hasta desplegarla, en producción los conceptos no pueden guardarse con `elemento` y el tanque de la Sala 1 se mostraría vacío.

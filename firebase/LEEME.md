# Firestore: reglas v4 (NO desplegadas en producción)

- `firestore.rules`: requieren Firebase Authentication anónima (`request.auth.uid`) y consentimiento registrado; cada documento privado lleva el `uid` de su dueño. Permiten a la persona leer y borrar solo lo suyo.
- `test_reglas_emulador.py`: 50 pruebas contra el emulador (no toca producción). Con el emulador activo en `127.0.0.1:8080` y el proyecto `jandiekua-escape-room`: `python3 firebase/test_reglas_emulador.py`.
- Antes de desplegar (`firebase deploy --only firestore:rules`) hay que **habilitar el proveedor «Anónimo»** en Firebase Authentication y, de preferencia, restringir la clave de API por dominio. No se requieren cambios de índices.

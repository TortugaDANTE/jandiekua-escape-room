# Propuesta de licencia para el código propio (para decidir, no aplicada)

Hoy el repositorio **no tiene `LICENSE`**: por defecto todo queda con «todos los derechos reservados». Esto es solo una propuesta; la decisión es de la UASLP / Agenda Ambiental.

## Qué cubriría
Solo el **código propio**: `index.html`, `aviso-privacidad.html`, `terminos.html`, `css/`, `js/`, `scripts/` y los scripts de generación en `assets/disenografico/src/`. **No** cubriría los logotipos institucionales, las tipografías (ya son OFL) ni las ilustraciones, que siguen las reglas de `LICENCIAS.md`.

## Opciones
| Opción | Cuándo conviene | Lo que implica |
| --- | --- | --- |
| **MIT** (propuesta por defecto) | Se quiere que otras instituciones o revistas puedan reutilizar el juego con el mínimo trámite. | Permisiva: se puede reutilizar y modificar, incluso en software cerrado, conservando el aviso. |
| **Apache-2.0** | Igual que MIT pero se quiere una cláusula expresa de patentes. | Permisiva, con más texto. |
| **AGPL-3.0** | Se quiere que cualquier versión modificada que se publique en línea también comparta su código. | Copyleft fuerte; más fricción para reutilizar. |
| **Sin licencia abierta** (derechos reservados) | Se prefiere no permitir la reutilización. | Hay que decirlo expresamente en un aviso de derechos; nadie puede reutilizarlo sin permiso. |

## Recomendación técnica
**MIT** para el código, con una línea que excluya expresamente los logotipos y marcas de la UASLP y de la Agenda Ambiental UASLP, y **CC BY 4.0** (opcional) para las ilustraciones originales una vez que se confirme su titularidad.

Texto de encabezado propuesto para el archivo `LICENSE` (no incluido):

> Copyright (c) 2026 [POR DEFINIR: titular]. Licencia MIT para el código de este repositorio. Los nombres, logotipos y marcas de la Universidad Autónoma de San Luis Potosí y de la Agenda Ambiental UASLP no están cubiertos por esta licencia.

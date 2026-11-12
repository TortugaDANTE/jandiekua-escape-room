# Mar de las Ideas — Escape room virtual de la Revista Jandiekua

Experiencia de inducción a la publicación científica de la **Revista Jandiekua** (Revista Mexicana de Educación Ambiental, Agenda Ambiental de la UASLP). El jugador recorre cuatro salas —Túnel de la Originalidad, Laberinto del Formato, Cámara de Pares y Portal de Ética—, arrastra ideas desde el Mar de Ideas hacia tanques de validación y obtiene una llave en cada sala. Al final puede generar un reconocimiento en este dispositivo.

El lienzo está pensado para una pantalla vertical de **1080 × 2022 px** (proporción 102:191), la medida de exportación del Banner 4 del stand virtual. En un recuadro de 102 × 191 px probablemente solo quepa una imagen fija o un póster con un código QR que abra el juego; eso queda **[POR DEFINIR]** según la plataforma del stand.

Dirección de diseño y prototipo jugable en este repositorio. No se inventan datos institucionales: lo que aún no está definido se marca **[POR DEFINIR]** (entre ello el nombre de la insignia, la URL de envío de manuscritos y el envío real del formulario).

## Cómo abrir el prototipo

- En línea: [https://tortugadante.github.io/jandiekua-escape-room/](https://tortugadante.github.io/jandiekua-escape-room/?v=20261112m)
- En la computadora, desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Luego abre [http://localhost:8080/](http://localhost:8080/). También sirve abrir `index.html` o `prototipo/index.html` (esta última redirige a la raíz).

**Para probar sin escribir en producción usa siempre `?sinred=1`** (por ejemplo `index.html?sinred=1`). Sin ese parámetro el juego guarda en Firebase, y solo después de que la persona marca la casilla de términos.

Para revisar una sala concreta: `?vista=sala1`, `?vista=sala2`, `?vista=sala3`, `?vista=sala4` o `?vista=cierre`. Añade `&foto=1` para congelar el movimiento del Mar de Ideas.

## Estructura

```
index.html                         Juego (entrada de GitHub Pages)
aviso-privacidad.html              Aviso de privacidad (corto e integral) — borrador con [POR DEFINIR]
terminos.html                      Términos y condiciones y créditos — borrador con [POR DEFINIR]
LICENCIAS.md                       Inventario y auditoría de licencias (imágenes, fuentes, código)
docs/PROPUESTA_LICENCIA.md         Propuesta de LICENSE (aún sin elegir; no hay archivo LICENSE)
docs/pie_correo_baja.html          Pie con enlace de baja para correos de la revista
scripts/inventario_licencias.py    Regenera el apéndice de LICENCIAS.md
scripts/e2e_legal.py               Prueba de la capa legal contra el emulador de Firestore (sin producción)
js/legal.js, css/legal.css         Aviso de almacenamiento y estilo de las páginas legales
prototipo/index.html               Redirección al juego
css/juego.css
js/juego.js
assets/logos/logo_banner_blanco.png   Logos UASLP y Agenda Ambiental en blanco
assets/fonts/                      Montserrat y Fraunces (SIL OFL) con sus textos de licencia
docs/BRIEF_FASE_DISENO.md          Brief de la fase de diseño
docs/fuentes/                      Fuentes editoriales (copia de solo lectura)
  especificacion_completa.md
  informe_de_diseno.md
  informe_detallado.md
  banner4_stand_mockup.jpg
preview/                           Capturas de 1080 × 2022 px de cada sala y del cierre
```

El pie institucional es `ext. 7200 y 7210`. Los logos de la barra solo se escalan o se recorren a blanco, a partir de la fuente institucional `logo_banner_clean.png`.

## Privacidad y datos (versión v4)

Mar de las Ideas es una **herramienta de recolección de datos en formato lúdico**: lo que la persona escribe (título, ideas, colocaciones y, al final, nombre y procedencia) se guarda en la base de datos de la Revista Jandiekua.

- **Consentimiento:** casilla sin marcar en la **portada** (con enlaces a Términos y Aviso); el botón «Entrar al juego» queda bloqueado hasta marcarla y sin ella no se envía nada. Se guarda la versión del texto (`v1-borrador-20261112`) y la fecha.
- **Aviso de almacenamiento:** el sitio no usa cookies; solo `localStorage`. No hay analítica, CDN ni tipografías de terceros.
- **Boletín:** casilla opcional al final («Quiero recibir noticias de la Revista Jandiekua»); el correo se pide solo si se marca. Cada correo debe llevar el pie de `docs/pie_correo_baja.html`.
- **Descargar y borrar:** en la pantalla final, en JSON o CSV, y borrado con confirmación.
- **Reglas de Firestore (`firestore.rules` v4):** requieren Firebase Authentication anónima y consentimiento; se prueban en el emulador (`test_reglas_emulador.py`, 50 pruebas) y con `scripts/e2e_legal.py`. **No están desplegadas en producción.** La Sala 1 (peces) guarda además el campo `elemento` (`que|quien|donde|cuando`) en cada concepto: la regla correspondiente ya está en `firestore.rules` y en las pruebas, pero **tampoco está desplegada**.
- **Todo texto legal es borrador** y debe ser revisado por la Unidad de Transparencia / área jurídica de la UASLP.

## Portada y Sala 1 «Túnel de la Originalidad» (v5 · peces)

- **Portada:** logotipo de Jandiekua sobre tarjeta blanca (archivo oficial sin alterar; ver `LICENCIAS.md`), tarjeta de consentimiento con casilla, enlaces y nota de recolección de datos, tarjeta del aviso de almacenamiento local y botón «Entrar al juego» bloqueado hasta aceptar. Las salas ya no llevan casilla ni enlaces legales.
- **Sala 1:** el título se escribe palabra por palabra (o se arrastran peces del tanque) en una barra de chips. Cuatro indicadores (Qué, Quién, Dónde, Cuándo; criterio de Sampieri) se encienden según lo que el título expresa; tocar un chip abre una ventana para elegir su elemento (hay sugerencia, la persona decide). Con los cuatro elementos se obtiene la Llave de Pertinencia y aparece «Soltar mi título al mar»: los conceptos del título (sin conectores, con bigramas razonables) se vuelven peces que caen al tanque.
- **Tanque:** ocupa toda la altura restante. Empieza **vacío** («Aún no hay peces: ¡tu título será el primero!»); los peces vienen de la colección `conceptos` de Firestore (solo los que traen `elemento`). Con ?sinred=1 no se lee ni se escribe nada; `&peces=demo` (o `&peces=N`) siembra peces de ejemplo solo en ese modo.
- **Código:** `js/titulo.js` (lógica del título: conectores, elementos, bigramas), `js/peces.js` (peces nadando, arrastre, estela) y `js/juego.js` (pantallas). Pruebas: `scripts/e2e_sala1.py` (sin red), `scripts/e2e_recorrido.py` (cuatro salas, sin red) y `scripts/e2e_legal.py` (emulador).
- Con más de ~100 peces el tanque se llena: los menos populares quedan «fuera de vista» (se indica «+N peces más nadan fuera de vista») para que las palabras sigan legibles (≥ 12 px reales).
- Los scripts `scripts/render_ideas_y_viewports.py` y `scripts/render_jk_v3_previews.py` son anteriores y describen la Sala 1 antigua (tanque de originalidad con fichas): ya no aplican a la Sala 1.

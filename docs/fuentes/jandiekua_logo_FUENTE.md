# Fuente del logo oficial de Revista Jandiekua

Fecha de consulta: 12 de noviembre de 2026 (zona America/Mexico_City, UTC-6).

Sitio oficial de la revista (OJS / plataforma LEKA, UASLP):
https://leka.uaslp.mx/index.php/jandiekua/

## Entregable (archivo tal como está publicado)

- Ruta: `/workspace/jandiekua_logo/leka.uaslp.mx_public_journals_3_homepageImage_en_US.png`
- URL de origen (archivo publicado): https://leka.uaslp.mx/public/journals/3/homepageImage_en_US.png
- Dónde se ve en la página oficial: imagen de portada (`homepage_image`) de la interfaz en inglés de la revista, por ejemplo tras `https://leka.uaslp.mx/index.php/jandiekua/user/setLocale/en_US?source=/index.php/jandiekua/` o `https://leka.uaslp.mx/index.php/jandiekua/?lang=en_US`.
  HTML: `<img class="img-fluid homepage_image" src="https://leka.uaslp.mx/public/journals/3/homepageImage_en_US.png" alt="">`
- El mismo archivo (mismos bytes, MD5 `6519f1b092f6503ce7e3b8834a77c2e6`) también está publicado como:
  https://leka.uaslp.mx/public/journals/3/journalThumbnail_en_US.png
- Listado del directorio oficial de la revista: https://leka.uaslp.mx/public/journals/3/
- Formato: PNG, modo RGB, sin canal alfa.
- Dimensiones: 500 × 150 px (el arte útil ocupa aprox. 484 × 115 px).
- Peso: 11 468 bytes.
- SHA-256: `3336a9ac5af7bbfa9d7f6c86e0e81f475eb144ad095dd411dca6bd73775d4ede`
- Contenido: wordmark «Jandiekua» en serif, con un árbol creciendo desde la letra «k», una línea inferior y el subtítulo «Revista Mexicana de Educación Ambiental».
- Color principal de la tinta: RGB (14, 43, 84) = `#0E2B54`. El archivo incluye antialias gris-azulado típico de un ráster sobre fondo blanco.
- Fondo: blanco sólido (`#FFFFFF`). No es transparente.
- El archivo se copió sin recodificar ni alterar un solo byte.

No hay SVG ni PNG de 1000 px o más del logo suelto en el sitio oficial. No se escaló el archivo (el aumento por remuestreo dejaría un ráster blando y aquí se evitó cualquier truco de upscaling).

## Versión en blanco: no se generó

La instrucción permite una versión en blanco (recolorar el arte a `#FFFFFF` conservando el alfa) y prohíbe quitar el fondo.

Este PNG oficial no tiene transparencia: el fondo es blanco opaco. Recolorir el arte a blanco sobre ese mismo fondo dejaría un rectángulo blanco ilegible. Obtener un logo blanco usable para el fondo navy `#102438` exigiría quitar o sustituir el fondo, y eso no está permitido. Por eso no hay versión en blanco ni PNG de comprobación sobre `#102438`.

Para usarlo sobre la barra azul del escape room haría falta un archivo oficial con fondo transparente o ya en blanco, o una autorización explícita para tratar el fondo.

## Qué más hay en la página oficial (no son el logo suelto)

Estas URLs se documentan porque ahí aparece la marca, pero no se usaron como entregable (son piezas compuestas, portadas o el banner de la plataforma, no el archivo del logo):

1. Encabezado de todas las páginas de la revista (español e inglés; el alt dice «LEKA : UASLP»):
   https://leka.uaslp.mx/public/journals/3/pageHeaderLogoImage_es_ES.jpg
   https://leka.uaslp.mx/public/journals/3/pageHeaderLogoImage_en_US.jpg
   (archivos idénticos, JPEG 1280 × 223). No es el logo de Jandiekua: es el banner de la plataforma LEKA / Biblioteca Virtual Universitaria / Sistema de Bibliotecas UASLP.

2. Imagen de portada en la interfaz en español:
   https://leka.uaslp.mx/public/journals/3/homepageImage_es_ES.png
   PNG 862 × 390. Banner de anuncio (inclusión en el SNPCyH 2026) que incluye el mismo wordmark de Jandiekua en color, más los logos de ODS 4, «Ciencia y Tecnología» (SECIHTI) y un sello «Reconocida en el SNPCyH 2026». Recortarlo habría sido una variante, no el archivo publicado.

3. Miniatura / portada actual de la revista (español):
   https://leka.uaslp.mx/public/journals/3/journalThumbnail_es_ES.png
   PNG 4961 × 6378 px, 600 dpi. Es la portada completa de un número (wordmark en crema/oro sobre fondo café, con fotografía). No es un archivo de logo. Recortarlo tampoco está permitido.

4. Portadas de números (`cover_issue_*`) en el mismo directorio y en https://leka.uaslp.mx/index.php/jandiekua/issue/archive. Llevan el wordmark integrado a cada portada, no un logo suelto.

5. Miniatura antigua en inglés, muy pequeña:
   https://leka.uaslp.mx/public/journals/3/journalThumbnail_en_US.jpg
   JPEG 100 × 130, una portada (no el logo suelto).

No existe `pageHeaderLogoImage_es_ES.svg`, ni `.png` equivalente del encabezado, ni un `logo.svg` / `logo.png` en `/public/journals/3/` o `/public/site/`.

## Búsquedas de referencia (no se usaron como entregable)

- Google Drive (conectores user-Google-drive y user-Google Drive-xai): no apareció ningún archivo de imagen, SVG, AI o PDF del logo de Jandiekua. Solo documentos del escape room (especificaciones e informes de diseño).
- Box compartida: no hay un archivo suelto del logo de la revista. En `/workspace/jandiekua-escape-room` solo están los logos de UASLP y de la Agenda Ambiental (no se modificó ese repo).

El portal de Agenda Ambiental (https://ambiental.uaslp.mx/comunicación) menciona la revista y enlaza al sitio de LEKA; el logo que muestra esa página es el de Agenda Ambiental, no el de Jandiekua.

## Dudas de uso

- El logo oficial no incluye el escudo de la UASLP ni el de la Agenda Ambiental. Es solo el wordmark de la revista con el subtítulo. En la serie AR esos dos logos institucionales van aparte, en la barra azul, y no deben modificarse.
- Hay al menos dos presentaciones cromáticas en piezas oficiales: tinta `#0E2B54` sobre blanco (este archivo y la franja superior del banner en español) y wordmark claro sobre fondo café en las portadas. El entregable es la versión a color sobre blanco, que es el único archivo suelto publicado.
- Tamaño: 500 px de ancho es menor que los 1000 px ideales para web/impresos grandes. En un banner de stand o en la barra del escape room puede verse suave o pixelado. No hay versión vectorial pública en el sitio.
- Fondo blanco opaco: no sirve tal cual sobre la barra azul `#003B71` ni sobre `#102438` sin un tratamiento de fondo que aquí no se hizo.
- Licencia: los artículos de la revista se publican bajo Creative Commons Atribución-NoComercial-SinDerivadas 4.0. Eso cubre los contenidos, no necesariamente la identidad gráfica. El uso en el escape room debe confirmarlo Dante antes de publicar.
- El diseño y la diagramación de la revista, según el equipo editorial, corren a cargo del Departamento de educación y comunicación de la Agenda Ambiental. Si se necesita un SVG o una versión en blanco oficiales, habría que pedirlos ahí (contacto en https://leka.uaslp.mx/index.php/jandiekua/about/contact).

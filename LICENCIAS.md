# Licencias y créditos · Mar de las Ideas (Revista Jandiekua)

Auditoría de imágenes, tipografías, íconos, SVG, logotipos, sonidos y código/bibliotecas del repositorio.
Fecha de la auditoría: 12 de noviembre de 2026 (rama `imagen-institucional`). Lo desconocido se marca **[POR DEFINIR]**; no se inventó ningún dato.

> Esto es una auditoría técnica, no asesoría jurídica. Las decisiones de licencia y de uso de marcas corresponden a la UASLP.

## Resumen: qué está bien y qué hay que resolver

| # | Hallazgo | Gravedad | Qué hacer |
| --- | --- | --- | --- |
| 1 | **Logotipos de la UASLP y de la Agenda Ambiental UASLP** (barra, certificado, capturas): son signos institucionales, no tienen licencia abierta. El repositorio es **público** y los archivos están en él. | Alta | Obtener y archivar la constancia de autorización de uso **[POR DEFINIR]**. Mantener la nota «no se concede licencia para reutilizarlos». Valorar volver privado el repositorio o sacar los originales del repo público. |
| 2 | **`docs/fuentes/banner4_stand_mockup.jpg`** (4080×3060): fotografía de una pantalla de la plataforma del stand virtual. No hay autoría ni permiso documentados y no la usa el juego. | Media | Confirmar origen y permiso o **retirarla del repositorio público**. |
| 3 | **`docs/fuentes/*.md`**: copias de Google Docs internos de la Agenda Ambiental / Revista, hoy en un repositorio público. | Media | Confirmar que pueden ser públicos o moverlos a un repositorio privado. |
| 4 | **Sin licencia para el código propio** (no existe `LICENSE`): por defecto son «todos los derechos reservados» y nadie podría reutilizarlo legalmente. | Media | Decidir licencia (propuesta en `docs/PROPUESTA_LICENCIA.md`). **No se añadió ningún `LICENSE`.** |
| 5 | **Titularidad de las ilustraciones SVG/PNG** hechas por el equipo de diseño del proyecto: son propias (generadas con scripts del repositorio, sin imágenes de terceros), pero no hay constancia escrita de cesión de derechos. | Baja | Formalizar autoría y cesión **[POR DEFINIR]**. |
| 6 | **Logotipo de la Revista Jandiekua**: se usa el archivo **publicado por la revista** (`assets/logos/jandiekua_homepageImage_en_US.png`), tal cual, sobre una tarjeta blanca en la portada. Su fuente es pública, pero **no hay licencia de uso del logotipo declarada**. | Media | Confirmar con el equipo editorial de la Revista Jandiekua el permiso de uso de su identidad gráfica (los artículos son CC BY-NC-ND 4.0; eso no cubre necesariamente el logotipo) **[POR DEFINIR]**. Pedir un SVG o una versión en blanco oficial si se quiere usar sobre fondo oscuro. |
| 7 | **Tipografías**: Montserrat y Fraunces son SIL OFL 1.1 y se alojan en el sitio. Faltaban los textos de licencia; **ya se incluyeron** (`assets/fonts/OFL-*.txt`). La nota anterior decía «recortes»; en realidad son variables con subconjunto latino (permitido por la OFL). | Resuelto | — |
| 8 | **Clave de API de Firebase** visible en `js/datos.js`. Es una clave pública de cliente (no es un secreto), pero conviene limitarla. | Informativa | En Google Cloud Console → Credenciales, restringirla por referente HTTP al dominio del juego y a las API de Firestore, Identity Toolkit y Token Service. |
| 9 | **Fragmentos de la Revista Jandiekua en la Sala 2** (`js/textos_sala2.js`): citas breves y textuales de artículos publicados en leka.uaslp.mx. La propia revista (la Agenda Ambiental UASLP, que la edita y publica) los usa como **ejemplos lúdicos y educativos** en su juego, con atribución completa a las personas autoras y al número de origen (fuente visible en pantalla y en `terminos.html`). Los artículos declaran CC BY-NC-ND 4.0; al ser la editora quien los usa, no se requiere más trámite. | Resuelto | — |

Sin problemas de licencia: no hay bibliotecas JavaScript ni CDN, no hay Google Fonts, no hay sonidos, no hay íconos de terceros.

## 1. Código

| Elemento | Origen | Licencia | Notas |
| --- | --- | --- | --- |
| `index.html`, `aviso-privacidad.html`, `terminos.html`, `css/*`, `js/juego.js`, `js/datos.js`, `js/legal.js` | Proyecto | Sin licencia declarada **[POR DEFINIR]** | Código propio. |
| `js/mar_ideas.js` (simulación del agua: flotación, arrastre, oscilación, colisiones, estela, absorción) | Proyecto (equipo de diseño) | Sin licencia declarada **[POR DEFINIR]** | Código propio, «sin librerías»; no usa Matter.js ni otras. |
| Bibliotecas de terceros en producción | — | — | **Ninguna.** No hay npm, ni CDN, ni SDK de Firebase: `js/datos.js` habla por REST con `fetch`. |
| `scripts/*.py`, `assets/disenografico/src/**` | Proyecto | Sin licencia declarada **[POR DEFINIR]** | Solo desarrollo; usan Playwright (Apache-2.0) y Pillow (HPND), que **no** se incluyen en el repositorio. |
| Backend (fuera de este repo): `datos.js`, `firestore.rules`, `exportar_excel.py` | Proyecto | Sin licencia declarada **[POR DEFINIR]** | `exportar_excel.py` usa openpyxl (MIT). Incluye el identificador público de la aplicación OAuth de Firebase CLI, que es público por diseño. |

## 2. Tipografías

| Archivos | Autoría | Licencia | Fuente |
| --- | --- | --- | --- |
| `assets/fonts/Montserrat.woff`, `Montserrat-Italic.woff` | © The Montserrat Project Authors | SIL OFL 1.1 (`OFL-Montserrat.txt`) | https://github.com/JulietaUla/Montserrat |
| `assets/fonts/Fraunces.woff`, `Fraunces-Italic.woff` | © The Fraunces Project Authors (2018–2020) | SIL OFL 1.1 (`OFL-Fraunces.txt`) | https://github.com/undercasetype/Fraunces |

Condiciones de la OFL cumplidas: se conserva el aviso de copyright (también dentro de los archivos de fuente) y se incluye el texto de la licencia; las fuentes no se venden por separado. Ninguna declara «Reserved Font Name». Se alojan en el propio sitio; **no hay peticiones a Google Fonts ni a otro tercero** (verificado en navegador).

## 3. Logotipos y marcas

| Archivos | Qué son | Licencia | Estado |
| --- | --- | --- | --- |
| `assets/logos/**`, `assets/disenografico/logos/**`, `assets/disenografico/barra_institucional.svg` | Logotipos de la UASLP y de la Agenda Ambiental UASLP, en blanco; solo se escalan o se recolorean | Signos institucionales: **uso con autorización interna [POR DEFINIR]**, sin licencia abierta | **Pendiente de constancia** |
| `assets/logos/jandiekua_homepageImage_en_US.png` | Logotipo de la Revista Jandiekua (wordmark «Jandiekua» y subtítulo «Revista Mexicana de Educación Ambiental»). PNG 500 × 150 px, RGB, fondo blanco opaco, 11 468 bytes, SHA-256 `3336a9ac5af7bbfa9d7f6c86e0e81f475eb144ad095dd411dca6bd73775d4ede`. **Copiado sin alterar un solo byte**: sin redibujar, sin quitar el fondo, sin escalar por encima de su tamaño nativo. En el juego se muestra a 500 × 150 px del lienzo sobre una tarjeta blanca | Fuente: https://leka.uaslp.mx/public/journals/3/homepageImage_en_US.png (portal oficial de la revista; mismo archivo que `journalThumbnail_en_US.png`). Licencia del logotipo: **[POR DEFINIR]** (no declarada; ver hallazgo 6). Origen documentado en `docs/fuentes/jandiekua_logo_FUENTE.md` | **Pendiente de confirmar permiso** |

Los logotipos también aparecen dentro de las capturas (`preview/*`, `assets/disenografico/preview/*`) y del certificado PNG que descarga la persona participante.

## 4. Imágenes, SVG e íconos

| Grupo | Origen | Licencia |
| --- | --- | --- |
| `assets/disenografico/*.svg` (fondo del mar, acuario, tanques, nodos, llaves, insignia, sello) | Obra del equipo de diseño del proyecto, generada con `assets/disenografico/src/*.py`. Sin imágenes ni íconos de terceros (no hay `<image>` externos; solo los logotipos incrustados en la barra) | Derechos reservados del proyecto; titularidad y cesión **[POR DEFINIR]** |
| Capturas y renders: `preview/*.png`, `assets/disenografico/preview/*`, `hoja_contacto.png`, `mar_ideas_demo.webm` | Capturas del propio juego y del diseño | Igual; muestran logotipos institucionales |
| `docs/fuentes/banner4_stand_mockup.jpg` | **Origen desconocido** (foto de pantalla del stand) | **Desconocida → VERIFICAR** |
| Íconos / sprites / emojis de terceros | No hay | — |

## 4b. Fragmentos de texto de la Revista Jandiekua (Sala 2)

Cada partida muestra 4 de estos 10 fragmentos, **copiados sin cambios** de los resúmenes publicados en <https://leka.uaslp.mx/index.php/jandiekua/> (consultados el 2026-11-12). Los derechos de cada texto son de sus autores. La propia revista (Agenda Ambiental UASLP, su editora) los usa como ejemplos lúdicos y educativos, con atribución completa (autoría, número y año) y con la fuente visible en el juego («Fragmento de Jandiekua, vol. X, núm. Y (año)»). En pantalla se les quitan algunos signos de puntuación o una mayúscula para el ejercicio; ver el hallazgo 9. Verificación textual: `python3 scripts/verificar_textos_sala2.py`.

| Id | Artículo | Autoría | Número | URL |
| --- | --- | --- | --- | --- |
| `f272` | Integrando saberes en el proyecto Ambientarte: Educación Ambiental y Expresión Artística | María Herminia Ostoa Escudero | vol. 7, núm. 9 (2023) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/272> |
| `f616` | Resiliencia de las áreas naturales protegidas ante las especies invasoras: desafíos para la conservación de la biodiversidad | Jorge E. Ramírez-Albores, Marlín Pérez-Suárez | vol. 8, núm. 10 (2024) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/616> |
| `f406` | Mejorar la gestión de residuos a través de la educación ambiental estratégica | Emily Miner, Marcos Algara Siller, Johannes Hamhaber, Leonardo Ernesto Márquez Mireles | vol. 7, núm. 9 (2023) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/406> |
| `f840` | Introducción al Dossier "Claves para la formación de científicos ambientales" | Gerardo Morales Jasso, Mariana Buendía Oliva | vol. 9, núm. especial (2025) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/840> |
| `f794` | Concurso de fotografía "Ingenieros en el ambiente" | Marlene Retes Quistian, Jorge Puente, Karla Daniela García Silva | vol. 8, núm. 10 (2024) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/794> |
| `f834` | Afrontar la complejidad promoviendo comunidad en un posgrado en Ciencias Ambientales. Mi experiencia como coordinador. | Javier Fortanelli Martínez | vol. 9, núm. especial (2025) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/834> |
| `f833` | El lirio acuático en una presa: una oportunidad de experimentación educativa | Grupo Laboratorio Extramuros IPICYT | vol. 9, núm. especial (2025) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/833> |
| `f837` | Reflexiones sobre la formación de científicos ambientales desde la química | Luis Felipe Cházaro | vol. 9, núm. especial (2025) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/837> |
| `f184` | EVALUACIÓN DE LOS PROYECTOS AMBIENTALES ESCOLARES (PRAE) EN COLOMBIA | Diana Espinosa Rojas | vol. 5, núm. 7 (2020) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/184> |
| `f361` | La pedagogía culturalmente sostenible en la promoción de literacidades indígenas | Anuschka van t Hooft | vol. 6, núm. especial (2023) | <https://leka.uaslp.mx/index.php/jandiekua/article/view/361> |

## 5. Sonido

No hay archivos de audio ni efectos de sonido.

## 6. Servicios externos (sin código incluido)

| Servicio | Uso | Condiciones |
| --- | --- | --- |
| Google Firebase: Cloud Firestore y Firebase Authentication (acceso anónimo), por REST | Base de datos de la Revista y borrado/descarga de datos por la persona | Condiciones de Firebase / Google Cloud; formalización institucional **[POR DEFINIR]**. Centro de datos de EE. UU. (`nam5`) |
| GitHub Pages | Alojamiento de las páginas | Condiciones de GitHub; el alojamiento definitivo puede cambiar **[POR DEFINIR]** |

Cookies y terceros: la página no instala cookies; las únicas conexiones externas son `firestore.googleapis.com`, `identitytoolkit.googleapis.com` y `securetoken.googleapis.com`, y se limitan además con una política de seguridad de contenido (`Content-Security-Policy`) en cada página.

## 7. Licencia del repositorio

No existe `LICENSE`. **No se eligió ni se añadió ninguna**. La propuesta, con alternativas, está en `docs/PROPUESTA_LICENCIA.md`.

## Anexo: inventario por archivo

Generado con `python3 scripts/inventario_licencias.py`. «OK*» = propio del proyecto, pendiente solo de declarar licencia o titularidad.

<!-- INVENTARIO -->
Archivos versionados: 159 (OK: 8 · OK*: 135 · PENDIENTE: 11 · VERIFICAR: 5).

| Archivo | Tipo | Tamaño | Origen | Licencia | Estado | SHA-256 (10) |
| --- | --- | ---: | --- | --- | --- | --- |
| `.gitignore` | Configuración | 0 KB | Proyecto | Sin relevancia (configuración) | OK | `32dae3052f` |
| `LICENCIAS.md` | Documento | 44 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `83d0ea5ea0` |
| `README.md` | Documento | 9 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `90ddae7496` |
| `assets/disenografico/NOTA_DISENO.md` | Documento | 32 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `263b3ebf64` |
| `assets/disenografico/acuario_mar.svg` | Ilustración SVG | 3 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `e513bbaccb` |
| `assets/disenografico/barra_institucional.svg` | Barra con logotipos | 30 KB | Compuesta con los logotipos institucionales incrustados | Signo institucional: autorización interna [POR DEFINIR] | PENDIENTE | `a6bb08ad9e` |
| `assets/disenografico/fondo_mar.svg` | Ilustración SVG | 40 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `35253bd996` |
| `assets/disenografico/hoja_contacto.png` | Captura / render | 2,292 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `d2a3437c55` |
| `assets/disenografico/insignia.svg` | Ilustración SVG | 11 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `d890e7f08f` |
| `assets/disenografico/insignia_sello.svg` | Ilustración SVG | 10 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `2f47c7ffb9` |
| `assets/disenografico/llave_1_pertinencia.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `422e58908f` |
| `assets/disenografico/llave_1_pertinencia_bloqueada.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `f90287122c` |
| `assets/disenografico/llave_2_estructura.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `c7f67117b6` |
| `assets/disenografico/llave_2_estructura_bloqueada.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `8f4445ac48` |
| `assets/disenografico/llave_3_validacion.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `8141316f64` |
| `assets/disenografico/llave_3_validacion_bloqueada.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `112d62fb4a` |
| `assets/disenografico/llave_4_definitiva.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `4b97e811bc` |
| `assets/disenografico/llave_4_definitiva_bloqueada.svg` | Ilustración SVG | 2 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `8ceb58bd30` |
| `assets/disenografico/logos/hd/logo_aa_blanco.png` | Logotipo institucional | 169 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `a55769aa5c` |
| `assets/disenografico/logos/hd/logo_uaslp_blanco.png` | Logotipo institucional | 252 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `9c81fd8e6d` |
| `assets/disenografico/logos/logo_aa_blanco.svg` | Logotipo institucional | 18 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `1b94c10c6f` |
| `assets/disenografico/logos/logo_uaslp_blanco.svg` | Logotipo institucional | 12 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `4c9c6b6b27` |
| `assets/disenografico/nodo_activo.svg` | Ilustración SVG | 1 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `a2dc67424b` |
| `assets/disenografico/nodo_burbujas.svg` | Ilustración SVG | 1 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `dc27e8f4f0` |
| `assets/disenografico/nodo_inactivo.svg` | Ilustración SVG | 1 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `e86c8b18a6` |
| `assets/disenografico/preview/fondo_mar.png` | Captura / render | 847 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `357f0d0d79` |
| `assets/disenografico/preview/insignia.png` | Captura / render | 105 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `1a5e81e539` |
| `assets/disenografico/preview/insignia_sello.png` | Captura / render | 96 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `7aeb26f13d` |
| `assets/disenografico/preview/institucional_resumen.png` | Captura / render | 978 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `23af1ed3c3` |
| `assets/disenografico/preview/llave_1_pertinencia.png` | Captura / render | 26 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `30ce5d1014` |
| `assets/disenografico/preview/llave_1_pertinencia_bloqueada.png` | Captura / render | 22 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `cc7c3bd4b6` |
| `assets/disenografico/preview/llave_2_estructura.png` | Captura / render | 30 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `bd6652995e` |
| `assets/disenografico/preview/llave_2_estructura_bloqueada.png` | Captura / render | 23 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `4f1b92492c` |
| `assets/disenografico/preview/llave_3_validacion.png` | Captura / render | 25 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `8bf5b2e6d1` |
| `assets/disenografico/preview/llave_3_validacion_bloqueada.png` | Captura / render | 25 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `e4489c9eab` |
| `assets/disenografico/preview/llave_4_definitiva.png` | Captura / render | 30 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `7faf4284fc` |
| `assets/disenografico/preview/llave_4_definitiva_bloqueada.png` | Captura / render | 22 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `b20daabf64` |
| `assets/disenografico/preview/mar_ideas_arrastre_1.png` | Captura / render | 1,128 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `e6b7a938b7` |
| `assets/disenografico/preview/mar_ideas_arrastre_2.png` | Captura / render | 1,174 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `476b7b6493` |
| `assets/disenografico/preview/mar_ideas_arrastre_3.png` | Captura / render | 1,171 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `9f57f9cde3` |
| `assets/disenografico/preview/mar_ideas_demo.webm` | Captura / render | 1,388 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `9a2827c5eb` |
| `assets/disenografico/preview/mar_ideas_hundimiento_1.png` | Captura / render | 1,106 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `e06311b291` |
| `assets/disenografico/preview/mar_ideas_hundimiento_2.png` | Captura / render | 1,221 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `6e7d8a0a40` |
| `assets/disenografico/preview/mar_ideas_hundimiento_3.png` | Captura / render | 1,144 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `9db064f4d0` |
| `assets/disenografico/preview/mar_ideas_resumen.png` | Captura / render | 1,346 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `82b4bcd2ef` |
| `assets/disenografico/preview/mar_ideas_tamano_muchas.png` | Captura / render | 1,124 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `b85d395ead` |
| `assets/disenografico/preview/mar_ideas_tamano_pocas.png` | Captura / render | 1,088 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `416074e128` |
| `assets/disenografico/preview/nodo_activo.png` | Captura / render | 18 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `41d29d5600` |
| `assets/disenografico/preview/nodo_burbujas.png` | Captura / render | 3 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `87d62a821f` |
| `assets/disenografico/preview/nodo_inactivo.png` | Captura / render | 11 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `75e1a511e1` |
| `assets/disenografico/preview/propuesta_cierre.png` | Captura / render | 978 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `0e2d55b324` |
| `assets/disenografico/preview/propuesta_institucional_cierre.png` | Captura / render | 973 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `5d52b60bf3` |
| `assets/disenografico/preview/propuesta_institucional_portada.png` | Captura / render | 946 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `b607bb2f58` |
| `assets/disenografico/preview/propuesta_institucional_sala1.png` | Captura / render | 933 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `43445c3894` |
| `assets/disenografico/preview/propuesta_portada.png` | Captura / render | 942 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `e1189cd811` |
| `assets/disenografico/preview/propuesta_sala1.png` | Captura / render | 942 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `42e085893d` |
| `assets/disenografico/preview/propuesta_sala1_estados.png` | Captura / render | 906 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `10254e84aa` |
| `assets/disenografico/preview/propuesta_sala1_nivel50.png` | Captura / render | 942 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `46cb3e34a8` |
| `assets/disenografico/preview/propuesta_sala2.png` | Captura / render | 1,068 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `7ec2b5cd9e` |
| `assets/disenografico/preview/propuesta_sala3.png` | Captura / render | 930 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `4b61b2bb56` |
| `assets/disenografico/preview/propuesta_sala4.png` | Captura / render | 919 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `b95907ab74` |
| `assets/disenografico/preview/tanque_activo.png` | Captura / render | 62 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `1c56720d45` |
| `assets/disenografico/preview/tanque_agua.png` | Captura / render | 27 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `093df85769` |
| `assets/disenografico/preview/tanque_compartimento_activo.png` | Captura / render | 13 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `f8a5de3425` |
| `assets/disenografico/preview/tanque_compartimento_lleno.png` | Captura / render | 16 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `044fbf23c5` |
| `assets/disenografico/preview/tanque_compartimento_vacio.png` | Captura / render | 8 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `371ea84647` |
| `assets/disenografico/preview/tanque_lleno.png` | Captura / render | 57 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `57d717adb3` |
| `assets/disenografico/preview/tanque_vacio.png` | Captura / render | 39 KB | Del proyecto (capturas del propio diseño; algunas muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `b3e5da6797` |
| `assets/disenografico/src/generar_assets.py` | Script de generación | 34 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `8d527e58c1` |
| `assets/disenografico/src/generar_barra.py` | Script de generación | 2 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `ff6b250d30` |
| `assets/disenografico/src/hoja_contacto.py` | Script de generación | 8 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `5ebc15906b` |
| `assets/disenografico/src/mar_ideas/capturas_mar.py` | Script de generación | 3 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `d3bf9322a3` |
| `assets/disenografico/src/mar_ideas/demo_y_pruebas.py` | Script de generación | 4 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `bcebf9dbb8` |
| `assets/disenografico/src/mar_ideas/integracion_mar_ideas.patch` | Script de generación | 9 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `4f01acb0e0` |
| `assets/disenografico/src/mar_ideas/mar_ideas.css` | Script de generación | 2 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `909025c72d` |
| `assets/disenografico/src/mar_ideas/mar_ideas.js` | Script de generación | 17 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `39e447772f` |
| `assets/disenografico/src/mar_ideas/montar_mock_mar.py` | Script de generación | 7 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `db6f655019` |
| `assets/disenografico/src/mar_ideas/resumen_mar.py` | Script de generación | 2 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `93967f6c2b` |
| `assets/disenografico/src/montar_mock_institucional.py` | Script de generación | 4 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `9d3c97971e` |
| `assets/disenografico/src/render_previews.py` | Script de generación | 1 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `b90cbe8b4e` |
| `assets/disenografico/tanque_activo.svg` | Ilustración SVG | 4 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `9b4a0352d8` |
| `assets/disenografico/tanque_agua.svg` | Ilustración SVG | 6 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `9ca371bc42` |
| `assets/disenografico/tanque_compartimento_activo.svg` | Ilustración SVG | 3 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `9816122ac0` |
| `assets/disenografico/tanque_compartimento_lleno.svg` | Ilustración SVG | 6 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `8969b89c75` |
| `assets/disenografico/tanque_compartimento_vacio.svg` | Ilustración SVG | 3 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `a26f328473` |
| `assets/disenografico/tanque_lleno.svg` | Ilustración SVG | 11 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `549a5a73d9` |
| `assets/disenografico/tanque_vacio.svg` | Ilustración SVG | 4 KB | Equipo de diseño del proyecto, generada con scripts propios | Derechos reservados del proyecto [POR DEFINIR cesión] | OK* | `a090e30e84` |
| `assets/fonts/Fraunces-Italic.woff` | Tipografía | 273 KB | Montserrat / Fraunces (proyectos de código abierto) | SIL OFL 1.1 | OK | `537c9d5fe0` |
| `assets/fonts/Fraunces.woff` | Tipografía | 227 KB | Montserrat / Fraunces (proyectos de código abierto) | SIL OFL 1.1 | OK | `f4111c016c` |
| `assets/fonts/LICENCIAS.txt` | Texto de licencia | 1 KB | Copia de los textos oficiales de las fuentes | — | OK | `310b7e1559` |
| `assets/fonts/Montserrat-Italic.woff` | Tipografía | 87 KB | Montserrat / Fraunces (proyectos de código abierto) | SIL OFL 1.1 | OK | `43fc34ccca` |
| `assets/fonts/Montserrat.woff` | Tipografía | 82 KB | Montserrat / Fraunces (proyectos de código abierto) | SIL OFL 1.1 | OK | `3d21ecd17a` |
| `assets/fonts/OFL-Fraunces.txt` | Texto de licencia | 4 KB | Copia de los textos oficiales de las fuentes | — | OK | `bdf4c22802` |
| `assets/fonts/OFL-Montserrat.txt` | Texto de licencia | 4 KB | Copia de los textos oficiales de las fuentes | — | OK | `8b7141c03f` |
| `assets/logos/hd/logo_aa_blanco.png` | Logotipo institucional | 169 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `a55769aa5c` |
| `assets/logos/hd/logo_uaslp_blanco.png` | Logotipo institucional | 252 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `9c81fd8e6d` |
| `assets/logos/jandiekua_homepageImage_en_US.png` | Logotipo de la revista | 11 KB | Revista Jandiekua (leka.uaslp.mx/public/journals/3/homepageImage_en_US.png), copia sin alterar sobre fondo blanco | Licencia del logotipo no declarada [POR DEFINIR] | PENDIENTE | `3336a9ac5a` |
| `assets/logos/logo_aa_blanco.svg` | Logotipo institucional | 18 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `1b94c10c6f` |
| `assets/logos/logo_banner_blanco.png` | Logotipo institucional | 201 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `99444a4bee` |
| `assets/logos/logo_uaslp_blanco.svg` | Logotipo institucional | 12 KB | UASLP / Agenda Ambiental UASLP (versión en blanco de la fuente institucional) | Signo institucional, no abierto: autorización interna [POR DEFINIR] | PENDIENTE | `4c9c6b6b27` |
| `aviso-privacidad.html` | Código del juego | 21 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `3a8f68a37e` |
| `css/juego.css` | Código del juego | 47 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `4ef5d36c2a` |
| `css/legal.css` | Código del juego | 8 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `8afe62e45c` |
| `css/mar_ideas.css` | Código del juego | 3 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `1352c196e1` |
| `docs/BRIEF_FASE_DISENO.md` | Documento | 4 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `0104bcd776` |
| `docs/PROPUESTA_LICENCIA.md` | Documento | 2 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `594c675032` |
| `docs/fuentes/banner4_stand_mockup.jpg` | Fotografía de pantalla | 3,855 KB | Origen y autoría NO documentados (captura de la plataforma del stand virtual) | DESCONOCIDA | VERIFICAR | `b9692ab24f` |
| `docs/fuentes/especificacion_completa.md` | Documento fuente | 9 KB | Copia de Google Docs internos de la Agenda Ambiental / Revista | Interna: autoría y publicación pública [POR DEFINIR] | VERIFICAR | `5498d7e011` |
| `docs/fuentes/informe_de_diseno.md` | Documento fuente | 12 KB | Copia de Google Docs internos de la Agenda Ambiental / Revista | Interna: autoría y publicación pública [POR DEFINIR] | VERIFICAR | `d46b1f6859` |
| `docs/fuentes/informe_detallado.md` | Documento fuente | 6 KB | Copia de Google Docs internos de la Agenda Ambiental / Revista | Interna: autoría y publicación pública [POR DEFINIR] | VERIFICAR | `6f61856568` |
| `docs/fuentes/jandiekua_logo_FUENTE.md` | Documento fuente | 7 KB | Copia de Google Docs internos de la Agenda Ambiental / Revista | Interna: autoría y publicación pública [POR DEFINIR] | VERIFICAR | `a67b3223be` |
| `docs/pie_correo_baja.html` | Documento | 3 KB | Proyecto | Sin licencia declarada [POR DEFINIR] | OK* | `0811b92577` |
| `firebase/LEEME.md` | Reglas y pruebas de Firestore | 1 KB | Proyecto (reglas propias; sin código de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `a3a55c81bc` |
| `firebase/firebase.json` | Reglas y pruebas de Firestore | 0 KB | Proyecto (reglas propias; sin código de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `d4254eb65f` |
| `firebase/firestore.indexes.json` | Reglas y pruebas de Firestore | 0 KB | Proyecto (reglas propias; sin código de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `6742255415` |
| `firebase/firestore.rules` | Reglas y pruebas de Firestore | 13 KB | Proyecto (reglas propias; sin código de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `f8123d5e11` |
| `firebase/test_reglas_emulador.py` | Reglas y pruebas de Firestore | 17 KB | Proyecto (reglas propias; sin código de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `67b8028c87` |
| `index.html` | Código del juego | 4 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `7a0d43ae15` |
| `js/datos.js` | Código del juego | 32 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `fbcb6fecc5` |
| `js/juego.js` | Código del juego | 105 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `736f6d748b` |
| `js/legal.js` | Código del juego | 2 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `8ec015be2e` |
| `js/mar_ideas.js` | Código del juego | 21 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `2fa95df225` |
| `js/peces.js` | Código del juego | 24 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `5257e58628` |
| `js/signos.js` | Código del juego | 4 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `2c7ffe46d1` |
| `js/textos_sala2.js` | Datos: citas de la Revista Jandiekua | 9 KB | 10 fragmentos textuales de artículos de la Revista Jandiekua (leka.uaslp.mx), con su fuente | Derechos de sus autores; usados por la propia revista (editora) como ejemplos lúdicos y educativos, con atribución | OK* | `00ce9cd772` |
| `js/titulo.js` | Código del juego | 8 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `26cc829b20` |
| `preview/certificado_v3.png` | Captura | 266 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `57560b0a4d` |
| `preview/cierre.png` | Captura | 551 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `07fdf8d60e` |
| `preview/cierre_v2.png` | Captura | 973 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `e76279cdc5` |
| `preview/cierre_v3.png` | Captura | 974 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `3a88e3f6c5` |
| `preview/portada.png` | Captura | 521 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `9e6dc54a45` |
| `preview/portada_v2.png` | Captura | 944 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `bc5672694f` |
| `preview/portada_v3.png` | Captura | 946 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `2f6ab3e0d2` |
| `preview/sala1.png` | Captura | 601 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `1058963772` |
| `preview/sala1_v2.png` | Captura | 930 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `5d31b26d88` |
| `preview/sala1_v3.png` | Captura | 934 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `aff5f04ad4` |
| `preview/sala2.png` | Captura | 683 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `648717e694` |
| `preview/sala2_v2.png` | Captura | 1,086 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `875b1dd119` |
| `preview/sala2_v3.png` | Captura | 1,088 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `28ca92c0ea` |
| `preview/sala3.png` | Captura | 549 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `542870ab3d` |
| `preview/sala3_v2.png` | Captura | 929 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `2ce09e63fe` |
| `preview/sala3_v3.png` | Captura | 931 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `964c6e5179` |
| `preview/sala4.png` | Captura | 539 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `43fdcfd23a` |
| `preview/sala4_v2.png` | Captura | 912 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `d974332a9d` |
| `preview/sala4_v3.png` | Captura | 914 KB | Del proyecto (capturas del juego; muestran los logotipos) | Derechos reservados del proyecto; logotipos: ver arriba | OK* | `cf00254edf` |
| `prototipo/index.html` | Código del juego | 0 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `9fdcb13dc4` |
| `scripts/e2e_legal.py` | Script de pruebas / render | 26 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `8d94dc2016` |
| `scripts/e2e_recorrido.py` | Script de pruebas / render | 10 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `00316a08a0` |
| `scripts/e2e_sala1.py` | Script de pruebas / render | 19 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `6ae77acffa` |
| `scripts/e2e_sala2.py` | Script de pruebas / render | 14 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `c45dddbc3a` |
| `scripts/e2e_sala2_todos.py` | Script de pruebas / render | 2 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `75f0682bfb` |
| `scripts/inventario_licencias.py` | Script de pruebas / render | 5 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `d53e1c4de3` |
| `scripts/render_ideas_y_viewports.py` | Script de pruebas / render | 9 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `29fa5a1d8f` |
| `scripts/render_jk_v3_previews.py` | Script de pruebas / render | 19 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `1cbed1d925` |
| `scripts/render_preview.py` | Script de pruebas / render | 2 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `9c7ed4d585` |
| `scripts/render_v2.py` | Script de pruebas / render | 2 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `95b9c93542` |
| `scripts/render_v3.py` | Script de pruebas / render | 6 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `c6757c008e` |
| `scripts/verificar_textos_sala2.py` | Script de pruebas / render | 3 KB | Proyecto (usa Playwright y Pillow, no incluidos) | Sin licencia declarada [POR DEFINIR] | OK* | `7468e8e1e3` |
| `terminos.html` | Código del juego | 14 KB | Proyecto (propio; sin librerías de terceros) | Sin licencia declarada [POR DEFINIR] | OK* | `0b85b1926b` |
<!-- /INVENTARIO -->

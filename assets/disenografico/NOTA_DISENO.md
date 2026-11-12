# Nota de diseño gráfico — Mar de las Ideas (Revista Jandiekua)

Propuesta de mejora visual para el escape room, sobre la versión `?v=20261112a`.
Todo lo nuevo vive en `assets/disenografico/`. **No se modificó ningún otro archivo del repo, no hay commit ni push.** Académico integra.

Vista rápida para Dante: `hoja_contacto.png` (antes/después y todos los assets).
Capturas de la integración probada en una copia temporal del juego: `preview/propuesta_*.png`.

## 1. Qué se propone (en una frase por pieza)

| Pieza | Idea |
| --- | --- |
| Mar | Mar ilustrado en capas, con retícula de carta náutica muy sutil, isobatas, rayos de luz, plancton dorado, oleaje en 5 bandas y algas en los márgenes. Sustituye las bandas planas y los trapecios de luz. |
| Tanques | Probetas de vidrio con tapa y zócalo azul, filetes dorados, escala graduada y un blanco "suelta aquí" (flecha y anillo punteado). Tres estados: vacío, activo (oro) y lleno (agua y sello dorado con palomita). Más una capa de agua que sube con el progreso. |
| Nodos | Perlas de papel (píldoras) con brillo, línea dorada y borde interior. Dos estados: inactivo y activo (anillo dorado con halo). Más un adorno de burbujas. |
| Llaves | Cuatro llaves distintas, una por sala: forma del arco y gema propias, y versión bloqueada para saber cuál falta. |
| Insignia | Medalla de 24 festones, anillo con marcas de meridiano, libro abierto con brote sobre el mar y cuatro gemas (una por llave). Con cinta vacía para el nombre. **Sin texto.** |

Reglas respetadas: estilo ilustrado y de autor con retícula poco marcada, paleta de la especificación, SVG sin texto ni fuentes externas, `viewBox` en todos, nada inventado. Los logos UASLP y Agenda Ambiental no se tocaron (barra superior intacta). El logo de Jandiekua y el nombre de la insignia siguen en **[POR DEFINIR]**.

## 2. Archivos y qué reemplaza cada uno

| Asset | Medida | Reemplaza | Dónde |
| --- | --- | --- | --- |
| `fondo_mar.svg` | 1080×2022 | El `<svg id="fondo">` completo (gradientes, rayos, olas, burbujas y filtro de grano) | `index.html` líneas 17–50 |
| `tanque_vacio.svg` | 1000×591 | Fondo y borde de `.tanque` (salas 1, 3 y 4) | `css/juego.css` 368–395 |
| `tanque_activo.svg` | 1000×591 | `.tanque.aceptando` | `css/juego.css` 396 |
| `tanque_lleno.svg` | 1000×591 | `.tanque.lleno` | `css/juego.css` 433 |
| `tanque_agua.svg` | 1000×591 | Capa nueva: progreso del tanque (ver §4) | `ponerFicha()`, `js/juego.js` 585 |
| `tanque_compartimento_{vacio,activo,lleno}.svg` | 488×136 | `.tanque.orden` (sala 2, ocho compartimentos) | `css/juego.css` 424–433 |
| `nodo_inactivo.svg`, `nodo_activo.svg` | 220×76 (rebanado 9) | Fondo y borde de `.nodo`, y de `.nodo.arrastre` y `.nodo.elegido` | `css/juego.css` 487–515 |
| `nodo_burbujas.svg` | 52×38 | Adorno opcional bajo cada nodo (`::after`) | — |
| `llave_1_pertinencia.svg`, `llave_2_estructura.svg`, `llave_3_validacion.svg`, `llave_4_definitiva.svg` | 96×96 | `ICONO_LLAVE` (una sola llave dorada para las cuatro) | `js/juego.js` 8–20 y 234–239 |
| `llave_N_*_bloqueada.svg` | 96×96 | El `opacity: .5` de `.llave` para las llaves no obtenidas | `css/juego.css` 165–179 |
| `insignia.svg` | 400×480 | `<div class="insignia">[POR DEFINIR]</div>` | `js/juego.js` 707; `css/juego.css` 608–626 |
| `insignia_sello.svg` | 400×400 | La línea de texto `Insignia [POR DEFINIR]` del certificado PNG | `js/juego.js` 813–815 |

Los SVG pesan entre 0.5 y 39 KB (`fondo_mar.svg` 39 KB; la especificación pide WebP de menos de 250 KB por escena). En total unos 125 KB.

## 3. Cambios concretos (probados en una copia del juego)

### 3.1 Fondo
`index.html`: sustituir las líneas 17–50 por
```html
<img id="fondo" src="assets/disenografico/fondo_mar.svg" alt="" aria-hidden="true">
```
`#fondo` ya mide `100%×100%` (css 82–89), así que basta `#fondo { object-fit: fill; }`.
- Se elimina el filtro `feTurbulence` ("grano") a pantalla completa, que es costoso en celulares. La textura la da la retícula.
- Las animaciones `.ola-a` y `.ola-b` (css 91–96) dejan de aplicar. Si se quiere oleaje vivo, insertar el SVG **en línea** (`fetch` y `innerHTML`): los grupos `#ola-1` a `#ola-5`, `#capa-rayos`, `#capa-burbujas` y `#capa-algas` tienen id. Ejemplo: `#ola-2 { animation: oleaje 9s ease-in-out infinite; } #ola-4 { animation: oleaje 13s ease-in-out infinite reverse; }`. Respetar `prefers-reduced-motion` (ya está en css 743).
- Zonas: retícula menor de 54 px, mayor de 216 px, con un punto dorado en cada cruce mayor. Marcas de escala en los dos bordes, de 243 a 1968. La zona del Mar de Ideas (y > 1363) lleva las cinco bandas; arriba queda calmado para que se lean la tarjeta y los tanques.

### 3.2 Tanques
```css
.tanque { background: url("../assets/disenografico/tanque_vacio.svg") center / 100% 100% no-repeat; border: 0; box-shadow: none; border-radius: 0; }
.tanque::before { display: none; }                                   /* el brillo ya está en el SVG */
.tanque.aceptando { background-image: url("../assets/disenografico/tanque_activo.svg"); box-shadow: none; }
.tanque.lleno { background-image: url("../assets/disenografico/tanque_lleno.svg"); }
.tanque.orden { background-image: url("../assets/disenografico/tanque_compartimento_vacio.svg"); border-radius: 0; }
.tanque.orden.aceptando { background-image: url("../assets/disenografico/tanque_compartimento_activo.svg"); }
.tanque.orden.lleno { background-image: url("../assets/disenografico/tanque_compartimento_lleno.svg"); }
.tanque h3 { margin-top: 12px; }                                     /* deja libre la tapa de 18 px */
.pista-tanque { color: rgba(216, 232, 223, .8); }                    /* contraste, ver §6 */
```
Medidas medidas en pantalla: tanque grande 1000×591 en (40, 766); compartimento 488×136 (dos columnas, cuatro filas, hueco de 16 px). Los SVG se dibujaron a esas medidas exactas; con otras medidas se deforman.
- `.tanque.rechazando` (sacudida, css 397) se conserva tal cual.
- **Semántica de "lleno":** `ponerFicha()` (js 585–594) agrega `.lleno` con la primera ficha. En las salas 1, 3 y 4 el tanque se vería lleno con 1 de 4 ideas. Recomiendo que `.lleno` solo se ponga al completar el tanque, y usar la capa de agua para el progreso (§4). En la sala 2 (un compartimento, una pieza) `.lleno` sí es correcto.

### 3.3 Nodos
```css
.nodo { background: none; border: 0; box-shadow: none; }
.nodo::before { content: ""; position: absolute; inset: -10px; z-index: -1; pointer-events: none;
  border-style: solid; border-color: transparent; border-width: 36px 38px;
  border-image: url("../assets/disenografico/nodo_inactivo.svg") 36 38 fill / 36px 38px stretch; }
.nodo.arrastre, .nodo.elegido { box-shadow: none; }
.nodo.arrastre::before, .nodo.elegido::before { border-image-source: url("../assets/disenografico/nodo_activo.svg"); }
```
- `inset: -10px` compensa el margen de 10 px que lleva el SVG para la sombra y el halo. El rebanado es `36 38` (no 38 38) porque el nodo de una línea mide 57 px y la rebanada central no debe quedar en cero.
- Mantener `.nodo { z-index: 3 }` y `will-change: transform` (crean el contexto de apilamiento que deja el `::before` detrás del texto).
- Medidas reales de los nodos: 300×84, 300×110 y 300×137 (sala 1, 3 y 4); de 103 a 273 de ancho por 57 de alto en la sala 2.
- Adorno opcional: `.nodo::after { content:""; position:absolute; left:-14px; bottom:-14px; width:52px; height:38px; background:url("../assets/disenografico/nodo_burbujas.svg") no-repeat; pointer-events:none; }` (no se probó en pantalla).

### 3.4 Llaves
`js/juego.js` 234–239, `svgLlaves()`:
```js
const NOM_LLAVE = ["pertinencia", "estructura", "validacion", "definitiva"];
ol.innerHTML = SALAS.map((s, i) =>
  `<li class="llave${estado.llaves[i] ? " obtenida" : ""}" title="${s.llave}" aria-label="${s.llave}: ${estado.llaves[i] ? "obtenida" : "bloqueada"}">` +
  `<img src="assets/disenografico/llave_${i + 1}_${NOM_LLAVE[i]}${estado.llaves[i] ? "" : "_bloqueada"}.svg" alt=""></li>`).join("");
```
```css
.llaves { gap: 8px; }
.llave { width: 74px; height: 74px; opacity: 1; }
.llave img { width: 72px; height: 72px; }                /* antes 58 px; la franja de 92 px lo permite */
.llave.obtenida { transform: none; }
.llave.obtenida img { filter: drop-shadow(0 0 8px rgba(224, 180, 60, .65)); }
```
Se pueden borrar `ICONO_LLAVE` y `.llave svg`. La franja mide 92 px y cuatro llaves ocupan 4×74 + 3×8 = 320 px, a la izquierda del botón Glosario, que empieza en x≈880.
Motivos: 1 Pertinencia = arco circular con hoja verde. 2 Estructura = arco cuadrado con retícula 2×2 azul (IMRyD). 3 Validación Científica = dos aros entrelazados (pares) con palomita. 4 Definitiva = roseta de 8 puntas con perla. Se distinguen por forma y no solo por color. Los colores de gema (verde `#4A8B68`, azul `#2F7FD0`, espuma, oro claro) se repiten en las cuatro gemas de la insignia.
Efecto de obtención (opcional): al obtener la llave, `transform: scale(1.25)` con rebote de 400 ms sobre el `<img>`.

### 3.5 Insignia y certificado
- Cierre (js 707): `<img class="insignia" src="assets/disenografico/insignia.svg" alt="" aria-hidden="true">`, y `.insignia { width: 190px; height: 228px; border-radius: 0; background: none; box-shadow: none; padding: 0; object-fit: contain; }`. Empuja el contenido unos 30 px; el botón de envío sigue dentro del lienzo (termina en y≈1830 de 1968).
- La cinta queda vacía a propósito. Cuando se defina el nombre ("Elegible como Investigador" o "Candidato a Investigador"), escribirlo por código sobre la cinta (centro x=200, y≈384 en las coordenadas del SVG, ancho útil de unos 220), en Montserrat 700 de 22–24 px color `#F5F7F9`. Mientras tanto, dejar `[POR DEFINIR]` fuera de la insignia, como texto.
- Certificado PNG (js 813–815): cambiar el texto por la imagen. Precargar `insignia_sello.svg` (como ya se hace con el logo, js 744–746) y dibujar `ctx.drawImage(img, W/2 - 62, 806, 124, 124)`. Para dar espacio, desplazar el tema de y 910 a 970, el aviso legal de 1000 a 1050 y la fecha de 1110 a 1140. El marco llega a y 1270, así que cabe.
- Los SVG llevan `width` y `height` explícitos; Firefox lo exige para `drawImage`.

## 4. Capa de agua para el progreso (opcional, probada)
Hace que el tanque grande no se vea como una caja vacía de 591 px: el agua sube con cada idea correcta (sala 1: 4 de 4; salas 3 y 4: 1 de 1 por paso).
```css
.tanque:not(.orden) .agua { position: absolute; inset: 18px 4px 16px; overflow: hidden; border-radius: 28px 28px 38px 38px; pointer-events: none; z-index: 0; }
.tanque:not(.orden) .agua img { width: 100%; height: 100%; display: block; transform: translateY(calc((1 - var(--nivel, 0)) * 100%)); transition: transform .8s ease; }
.tanque:not(.orden) h3, .tanque:not(.orden) .tanque-cuerpo { position: relative; z-index: 1; }
```
En `renderSala()` (js 317) añadir `<div class="agua"><img src="assets/disenografico/tanque_agua.svg" alt=""></div>` dentro de cada `.tanque`, y en `ponerFicha()` actualizar `caja.style.setProperty("--nivel", validosColocados / validosNecesarios)`. Con `foto=1` y `prefers-reduced-motion` la transición ya se anula (css 738–745). Ver `preview/propuesta_sala1_nivel50.png`. Detalle menor: con el nivel > 0 el blanco "suelta aquí" del fondo queda parcialmente tapado; es aceptable, o usar `tanque_activo.svg` solo con nivel 0.

## 5. Tamaños, espaciados y tipografía

- **Lienzo:** no cambia (1080×2022, zonas 30/35/35: 518 / 605 / 605 px bajo la franja). Barra de 148 px, franja de 92 px y pie de 54 px quedan como están.
- **Espacios:** tapa del tanque de 18 px, zócalo de 16 px. El contenido del tanque conserva su padding de 16 px. Hueco entre compartimentos, 16 px. Nodos: 20–22 px entre sí (ya está en `acomodarNodos`).
- **Tipografía (sin cambios de familia):** Fraunces cursiva para títulos y Montserrat para interfaz, ambas ya cargadas localmente. Los SVG no usan texto.
- **Tamaño mínimo, el problema principal.** El lienzo de 1080 px se escala. En un celular de 390 px el factor es 0.36: un texto de 18 px queda en 6.5 px, ilegible. En el recuadro del Banner 4 (102 px de ancho) el factor es 0.094. Propongo, en px del lienzo: etiqueta de tanque (`.tanque h3`) 18 → 26, "Suelta aquí" 18 → 24, instrucción de la zona del mar 18 → 26 con peso 700, kicker de sala 18 → 24, `.etiqueta` de la tarjeta 16 → 22, `.ficha` 18 → 24, `.nodo` 22 → 26 (con `max-width` de 300 a 320), texto del pie legal y aviso 18 → 22. Hay espacio: la sala 1 usa 3 filas de nodos de unos 130 px más 2 huecos de 22 px = 434 px de 555 px disponibles.
- Kicker de sala (`.zona-reto .kicker`): usar `var(--oro-2)` (#E0B43C) en lugar de `--oro` (#C59B27); sube el contraste de 4.9 a 6.5.

## 6. Contrastes (WCAG, calculados sobre los píxeles del fondo nuevo)

| Texto | Fondo | Razón | Veredicto |
| --- | --- | --- | --- |
| Kicker `#C59B27` | fondo en y≈270 (`#153454`) | 4.9:1 | pasa AA con poco margen, con 18 px en negrita |
| Kicker `#E0B43C` | mismo | 6.5:1 | recomendado |
| Título h2 blanco | mismo | 12.7:1 | pasa |
| "Suelta aquí" `rgba(216,232,223,.55)` (hoy) | tanque vacío (`#233441`) | **4.2:1** | no pasa AA con 18 px |
| "Suelta aquí" con `.8` | tanque vacío | 7.1:1 | pasa |
| "Suelta aquí" con `.8` | compartimento (`#0E2331`) | 8.6:1 | pasa |
| Etiqueta del tanque `#D8E8DF` | tanque vacío o lleno (zona superior) | 8.7:1 | pasa |
| Instrucción `#D8E8DF` al 85 % | fondo del mar (`#102D37`) | 8.6:1 | pasa |
| Texto del nodo `#102438` | `#F5F7F9` / `#D8E8DF` | 14.7:1 / 12.4:1 | pasa |
| Pie `#D8E8DF` | `#003B71` | 8.9:1 | pasa |
| Oro `#C59B27` sobre `#003B71` (borde de llave en la barra) | | 4.3:1 | adorno, no texto |
| Llave bloqueada, contorno `#9FC0D0` | franja | 6.5:1 | se distingue |
| Llave bloqueada, relleno `#27597F` | franja | 1.7:1 | solo relleno; la silueta la da el contorno |

Las razones de las fichas (texto `#102438` sobre blanco y espuma) no cambian con la propuesta.

## 7. Problemas vistos en los previews originales

1. **Hueco muerto** entre la tarjeta del reto y el tanque: 149 px en la sala 1, 216 px en la 2 y 281 px en las 3 y 4 (la tarjeta mide 270, 203 y 138 px dentro de una zona de 518 px). En las salas 3 y 4 el tanque vacío de 591 px aloja una sola ficha. Opciones: (a) la capa de agua del §4; (b) `.zona-reto { justify-content: center }`; (c) `grid-template-rows: auto 1fr 35%` en `.sala` con el tanque centrado (probé la opción (c): sirve en las salas 1, 3 y 4, pero en la 2 hay que fijar la altura de los compartimentos, así que no la incluyo).
2. **El mar no se reconoce como mar.** Las líneas de olas (css/svg, y 1480–1810) tienen trazo de 2–3 px al 18–35 % de opacidad y casi no se ven. Los haces de luz son trapecios planos de bordes duros, con el aspecto genérico de una diapositiva.
3. **Cuatro llaves idénticas.** Obtenida y no obtenida se distinguen solo por opacidad (1 contra .5) y una escala de 1.06; las pendientes parecen apagadas, no bloqueadas. Con 58 px, el dibujo es demasiado simple.
4. **Insignia = disco dorado con `[POR DEFINIR]`**, y en el certificado una línea de texto `Insignia [POR DEFINIR]`.
5. **`.tanque.lleno` se activa con la primera ficha** (ver §3.2).
6. **Textos de 16–22 px** en un lienzo de 1080 px: ilegibles al escalar (ver §5).
7. **"Suelta aquí" al 55 %** no pasa contraste (4.2:1).
8. **Filtro de grano `feTurbulence` a 1080×2022** (index.html 32–36 y 49): carga innecesaria en celulares.
9. **La franja de llaves** solo usa `title`; falta `aria-label` con el estado (obtenida o bloqueada). Los íconos no son accesibles por lector de pantalla.
10. **Portada:** el recuadro de logo pendiente sigue en `[POR DEFINIR]` (correcto). No se inventó isotipo. Los rayos del fondo nuevo son más finos y no cruzan el título con tanta fuerza.
11. **Nodos de la sala 3 y 4** (3 nodos de hasta 137 px): la zona del mar queda casi vacía arriba; el fondo nuevo llena esa zona con las bandas de oleaje sin competir con los nodos, que son claros.
12. **Stand (Banner 4):** a 102×191 px el juego no es legible ni jugable. Se mantiene la nota del README: póster con QR o `iframe`, **[POR DEFINIR]** según la plataforma.

## 8. Pendientes y supuestos
- Nombre de la insignia, logo de la Revista Jandiekua, y si la cuarta llave lleva nombre propio en pantalla: **[POR DEFINIR]**.
- Los colores de gema azul (`#2F7FD0`) y los degradados de oro (`#F3E3A4`, `#8A6A12`) no están en la lista de seis colores. El azul se usa solo en una gema y el degradado de oro ya existe en `ICONO_LLAVE`. Si Dante prefiere solo los seis colores, cambiar la gema de la llave 2 a `#004A8F`, que la especificación sí cita.
- No se verificó en un celular real, solo en Chrome headless a 1080×2022. Safari: `border-image` con SVG y `mask` dentro del SVG funcionan, pero conviene una pasada en iOS.

## 9. Regenerar o ajustar
Los SVG salen de `src/generar_assets.py` (Python sin dependencias): `python3 src/generar_assets.py`. Los PNG de `preview/` salen de `src/render_previews.py` (Chrome headless con Playwright) y la hoja de contacto de `src/hoja_contacto.py`.
Las capas de `fondo_mar.svg` se pueden quitar borrando su grupo (`#capa-algas`, `#capa-plancton`, `#capa-isobatas`) si se quiere aún más calma.

## 10. Imagen institucional (logos UASLP y Agenda Ambiental)

**Qué había.** El juego ya mostraba logos: un solo PNG raster (`assets/logos/logo_banner_blanco.png`, 2890×590) centrado en la barra, con los dos logos y un filete vertical entre ellos, juntos en el centro y a 110 px de alto; el certificado PNG repetía ese mismo banner centrado (`js/juego.js`, `dibujarCertificado`). No es el patrón de la serie: la serie lleva **UASLP a la izquierda y Agenda Ambiental a la derecha, a la misma altura**, con los archivos SVG blancos oficiales (los de `ar-conexion-natural` y `ar-residuos-proserem`). La propuesta pone eso, a los dos extremos de la barra azul, y no modifica ningún logo (solo escala proporcional).

**Archivos (en `assets/disenografico/`)**
- `logos/logo_uaslp_blanco.svg` (192×74) y `logos/logo_aa_blanco.svg` (300×127): copias byte a byte de los de `/workspace/ar-conexion-natural/assets/logos/` (idénticas a las de `ar-residuos-proserem`; comprobado con md5). El escudo, "UASLP" y "Universidad Autónoma de San Luis Potosí" van juntos en el logo UASLP oficial.
- `logos/hd/logo_uaslp_blanco.png` (1557×600) y `logos/hd/logo_aa_blanco.png` (1417×600): el mismo arte en blanco, a mayor resolución (copias de `/workspace/uaslp/infografia_economia_circular/cartel/assets/`). Solo para el certificado PNG de 1080 px.
- `barra_institucional.svg` (1080×148, 30 KB): la barra completa como imagen autocontenida, con el `<image>` de cada logo incrustado tal cual (mismos píxeles). Útil para pósters, para el QR del stand o para un `drawImage`. Para la página usar mejor el HTML de abajo (dos `<img>` apuntando a los archivos).
- Previews: `preview/propuesta_institucional_portada.png`, `_sala1.png`, `_cierre.png` y `preview/institucional_resumen.png`.

**Aviso de calidad.** Los SVG "oficiales" son un PNG incrustado de 192×74 y 300×127 px (según la guía de identidad del paquete de videos, los vectores verdaderos siguen **[POR DEFINIR]**). A 100 px de alto en el lienzo de 1080 px, el logo UASLP se amplía 1.35× y se ve algo suave si se exporta a tamaño nativo (en celular se reduce y no se nota). Si se quiere nitidez total en la barra, cambiar las dos rutas por las de `logos/hd/` (`.png`, mismas proporciones y mismo CSS).

**Integración exacta (HTML).** En `index.html`, dentro de `<header class="barra">` (hoy línea 22), reemplazar la `<img>` única por:
```html
<header class="barra">
  <img class="logo-uaslp" src="assets/logos/logo_uaslp_blanco.svg" width="192" height="74" alt="Universidad Autónoma de San Luis Potosí">
  <img class="logo-aa" src="assets/logos/logo_aa_blanco.svg" width="300" height="127" alt="Agenda Ambiental UASLP">
</header>
```
Copiar `logos/logo_uaslp_blanco.svg` y `logos/logo_aa_blanco.svg` a `assets/logos/` del repo (y `logos/hd/` a `assets/logos/hd/` si se usa el certificado HD). El PNG `logo_banner_blanco.png` queda sin uso; se puede borrar.

**CSS.** En `css/juego.css`, regla `.barra img` (hoy líneas 123–127), dejar:
```css
.barra { justify-content: space-between; padding: 0 40px; }   /* UASLP a la izquierda, AA a la derecha */
.barra img {
  height: 100px;      /* misma altura para los dos; el ancho sale solo, proporcional */
  width: auto;
  max-width: none;    /* quita el tope de 980 px del banner */
}
```
(`.barra` ya tiene `height: var(--barra)` de 148 px, `align-items: center` y el filete tricolor de 4 px en `::after`; no cambian). Resultado: UASLP de 259×100 px a x = 40 y AA de 236×100 px que termina en x = 1040; 44 px de aire arriba y abajo; el centro de la barra queda libre. Zona de resguardo provisional (guía del paquete de videos: altura de la letra mayor del logo): se respeta con 40 px de margen lateral y 22 px verticales, y no hay otros elementos junto a los logos. La zona de resguardo oficial sigue **[POR DEFINIR]**.

**Certificado PNG.** En `js/juego.js`, `dibujarCertificado()`: cargar los dos logos HD en lugar del banner y dibujarlos a los extremos del encabezado azul de 210 px:
```js
const logoU = new Image(); logoU.src = "assets/logos/hd/logo_uaslp_blanco.png";
const logoA = new Image(); logoA.src = "assets/logos/hd/logo_aa_blanco.png";
// en el Promise.all existente, esperar también:
//   new Promise((res, rej) => { logoU.onload = res; logoU.onerror = rej; }),
//   new Promise((res, rej) => { logoA.onload = res; logoA.onerror = rej; }),
// y en lugar de las líneas de logoH / logoW / drawImage(logo, ...):
const logoH = 112;                                  // misma altura; solo escala proporcional
const wU = logoH * (logoU.width / logoU.height);
const wA = logoH * (logoA.width / logoA.height);
ctx.drawImage(logoU, 56, (210 - logoH) / 2, wU, logoH);
ctx.drawImage(logoA, W - 56 - wA, (210 - logoH) / 2, wA, logoH);
```
Mientras tanto, el `const logo` y su `onload` del banner se eliminan. La pantalla de cierre (insignia + certificado) hereda la barra azul superior, así que muestra los logos dos veces: en la barra y dentro del certificado, como en la serie.

**Pie `ext. 7200 y 7210`.** Ya existe en el juego (`.pie` en `index.html` y en el certificado). **No aparece en `docs/fuentes/`** (las tres fuentes editoriales solo piden "datos de contacto: correo editorial, teléfono y redes oficiales" de la revista, sin números). Sale de la regla de la serie AR que dio Dante y de la guía de identidad ("Extensiones 7200 y 7210, dato proporcionado por la usuaria/usuario"), y está en `docs/BRIEF_FASE_DISENO.md`. Lo dejé sin cambios. Son las extensiones de la **Agenda Ambiental**, no necesariamente de la Revista Jandiekua: si Dante prefiere que el pie no sugiera contacto editorial, conviene aclararlo o quitarlo del certificado.

**Pendientes.** Logo de la Revista Jandiekua (el recuadro `[LOGO JANDIEKUA]` de la portada y del certificado sigue como placeholder, no se inventó isotipo). Nota: el árbol de trabajo del repo ya tiene la v2 de Académico (fondo, tanques, llaves) sin commit; las líneas que cito de `index.html`, `css/juego.css` y `js/juego.js` son las de ese árbol al 11-nov 23:58 y pueden moverse. Las líneas de las secciones 2 a 4 de esta nota corresponden al código original.

**Regenerar.** `python3 src/generar_barra.py` (crea `barra_institucional.svg` a partir de `logos/`) y `python3 src/montar_mock_institucional.py --screens` (copia el árbol actual a `/tmp/jmock`, aplica solo estos cambios y renderiza las tres capturas).

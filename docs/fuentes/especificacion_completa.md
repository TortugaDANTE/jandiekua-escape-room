<!-- Fuente: Google Docs — Escape_Room_Virtual_Jandiekua_Especificacion_Completa.md (id: 1D3dHFZG4N2rbA5chWSs9IgU90hMMgSgErzIGeU-o4wo). Copia de solo lectura, 2026-11-11. -->

# Especificación Técnica y de Diseño: Escape Room Virtual – Revista Jandiekua

## 1. Visión General y Propósito de la Experiencia

* **Proyecto:** Escape Room Virtual de Inducción a la Publicación Científica – *Revista Jandiekua* (Revista Mexicana de Educación Ambiental, Agenda Ambiental – UASLP).  
* **Objetivo:** Transformar los requisitos editoriales, normas de formato y procesos de dictaminación en una experiencia interactiva gamificada dirigida a jóvenes estudiantes, tesistas e investigadores emergentes.  
* **Meta Editorial:** Reducir la barrera de entrada a la publicación científica, capacitar en integridad académica y captar prospectos con temas de investigación pertinentes.

---

## 2. Arquitectura de Interfaz y Proporciones Técnicas

* **Formato de Pantalla:** Vertical alargado (*mobile-first* / tótem interactivo), optimizado para navegación táctil y ratón en vista continua sin *scroll* excesivo.  
* **Resolución Base Recomendada:** `1080 × 1920 px` (relación de aspecto **9:16**). Soporte responsivo para resoluciones móviles (`360 × 800 px` a `430 × 932 px`) y pantallas verticales de exposición (`1080 × 1920 px` / `2160 × 3840 px`).  
* **Distribución Espacial (3 Zonas Funcionales):**  
  1. **Zona Superior (30% de altura – `~576 px` en base 1920):** Escenario narrativo, planteamiento del reto editorial, criterios de evaluación, observaciones de revisores pares o dilemas éticos. Incluye barra de progreso (llaves obtenidas) y botón de acceso al **Glosario Interactivo**.  
  2. **Zona Media (35% de altura – `~672 px` en base 1920):** **Contenedores / Tanques / Pecera de Validación**. Área de decantación interactiva donde el jugador deposita o clasifica elementos. Las respuestas válidas se estabilizan con retroalimentación visual positiva; los elementos erróneos son rechazados con pistas formativas.  
  3. **Zona Inferior (35% de altura – `~672 px` en base 1920):** **El "Mar de Ideas"**. Repositorio dinámico en la base de la pantalla con nodos flotantes (conceptos, reglas de formato, argumentos metodológicos, principios éticos). Soporta *drag-and-drop* y *tap-to-select* hacia los tanques superiores.

---

## 3. Identidad Institucional UASLP y Procesos Gráficos

* **Alineación Institucional (UASLP / Agenda Ambiental / Revista Jandiekua):**  
  * **Identidad Visual:** Incorporar logotipos oficiales de la **Universidad Autónoma de San Luis Potosí (UASLP)**, la **Agenda Ambiental** y la **Revista Jandiekua** en el encabezado superior y en el certificado final, respetando áreas de protección y manual de identidad institucional vigente.  
  * **Paleta Cromática:**  
    * Azul institucional UASLP (`#003B71` / `#004A8F`) como color estructural primario.  
    * Verde institucional y tonos orgánicos de educación ambiental (`#2E6B4E`, `#4A8B68`, `#D8E8DF`) asociados a la identidad editorial de *Jandiekua*.  
    * Acentos cálidos/dorados (`#C59B27` / `#E0B43C`) para llaves desbloqueadas, medallas e indicadores de validación.  
    * Fondos neutros de alto contraste (`#F5F7F9` y `#102438` en modo inmersivo) para legibilidad óptima.  
  * **Tipografía:** Sans-serif geométrica o humanista limpia para interfaz y mecánicas (ej. *Montserrat*, *Inter* o *Lato*) combinada con serif editorial para títulos de la revista y certificados.  
* **Procesos Gráficos y Activos Visuales:**  
  * **Estilo Gráfico:** Ilustración vectorial limpia con estética editorial científica y elementos orgánicos estilizados.  
  * **Formatos de Entrega de Assets:**  
    * Íconos, logotipos, llaves y elementos de UI en **SVG** escalable.  
    * Fondos de sala y texturas ambientales en **WebP** optimizado (`< 250 KB` por escena) a `1080 × 1920 px`.  
    * Animaciones del *Mar de Ideas* y *Pecera de Validación* mediante **HTML5 Canvas / SVG \+ CSS3** (60 fps, física suave de flotación y partículas).  
  * **Generación Dinámica de Constancia:** Renderizado en cliente mediante **HTML5 Canvas / jsPDF** para exportar la insignia y certificado en **PNG (`1080 × 1350 px`)** y **PDF tamaño carta**.

---

## 4. Arquitectura del Recorrido: Las 4 Salas Temáticas

| Sala | Nombre | Objetivo Pedagógico | Mecánica e Interfaz | Entregable / Recompensa |
| :---- | :---- | :---- | :---- | :---- |
| **Sala 1** | **Túnel de la Originalidad** | Comprender la innovación científica, pertinencia temática con *Jandiekua* y prevención del plagio/autoplagio. | Registro del tema tentativo del jugador \+ filtrado de nodos desde el *Mar de Ideas* hacia el tanque de originalidad. | Registro de temática propuesta \+ **1.ª Llave (Pertinencia)**. |
| **Sala 2** | **Laberinto del Formato** | Dominar normas editoriales, estructura IMRyD, extensión, resumen, palabras clave y estilo de citación. | Ordenamiento secuencial y validación de bloques estructurales de un manuscrito en los contenedores medios. | Validación estructural \+ **2.ª Llave (Estructura)**. |
| **Sala 3** | **Cámara de Pares** | Comprender la revisión por pares (*doble ciego*) como mejora constructiva y argumentar respuestas técnicas. | **Zona Superior:** Dictamen y observaciones de revisores. **Zona Inferior (Mar de Ideas):** Selección de argumentos metodológicos y correcciones. | Aprobación del dictamen simulado \+ **3.ª Llave (Validación Científica)**. |
| **Sala 4** | **Portal de Ética** | Garantizar integridad científica, autoría responsable, consentimiento informado y no conflicto de interés. | Reutiliza la interfaz dual de la Sala 3: **Zona Superior:** Dilemas éticos reales. **Zona Inferior (Mar de Ideas):** Principios éticos y protocolos de transparencia. | Validación de integridad \+ **Llave Definitiva de Publicación**. |

---

## 5. Herramienta de Apoyo: Glosario Interactivo ("Diccionario de la Revista")

* **Ubicación:** Botón flotante persistente en la esquina superior derecha de las 4 salas (`? Glosario`).  
* **Comportamiento:** Abre un panel modal superpuesto sin reiniciar ni interrumpir el progreso de la sala actual.  
* **Contenido Base:** Definiciones breves, claras y juveniles de términos editoriales clave:  
  * *Revisión por pares (Doble ciego)*  
  * *Estructura IMRyD (Introducción, Metodología, Resultados y Discusión)*  
  * *Plagio y Autoplagio*  
  * *Conflicto de intereses*  
  * *Índice de impacto / ISSN / DOI*  
  * *Consentimiento informado y ética en investigación ambiental*  
  * *Manuscrito inédito y carta de originalidad*

---

## 6. Etapa Final: Certificación "Elegible como Investigador" y Captura de Contacto

Al completar las cuatro salas y activar la Llave Definitiva, se despliega la pantalla de cierre diseñada para motivar a jóvenes prospectos y vincularlos formalmente con *Jandiekua*:

1. **Formulario de Registro de Interés y Aviso de Privacidad:**  
   * **Campos requeridos:** Nombre completo, institución/facultad de adscripción, correo electrónico, teléfono/WhatsApp y confirmación/ajuste del tema de investigación registrado en la Sala 1.  
   * **Aviso de Privacidad Breve (Obligatorio):** Casilla de aceptación visible antes del envío:  
       
     > *"Aviso de Privacidad: Tus datos personales (nombre, correo electrónico, teléfono y tema de investigación) serán recabados por la Revista Jandiekua (Agenda Ambiental – UASLP) con la única finalidad de brindar seguimiento editorial y enviarte convocatorias académicas. Consulta nuestro aviso integral en el portal oficial."*

     
2. **Insignia y Certificado Digital "Elegible como Investigador":**  
   * Al enviar el formulario, se genera automáticamente una medalla/insignia digital y un certificado descargable con el título **"Elegible como Investigador"**, destacando que el participante posee un perfil sólido y las competencias metodológicas iniciales para postular un trabajo científico.  
   * **Nota de Rigor Editorial:** Se especifica explícitamente que la insignia acredita la preparación y elegibilidad para iniciar el proceso de postulación ante la revista, sin garantizar la publicación automática (la cual permanece sujeta a la dictaminación académica oficial por pares).  
3. **Cierre, Enlace Directo y Seguimiento:**  
   * **Botón de Acción Inmediata (CTA):** Enlace directo al portal oficial de envío de manuscritos y descarga de plantilla editorial de *Jandiekua* para iniciar la postulación en ese momento.  
   * **Datos de Contacto Directo:** Correo editorial, teléfono y redes oficiales de la revista.  
   * **Automatización:** Envío de correo electrónico de bienvenida con el certificado adjunto, resumen de su temática propuesta y guía rápida de envío.

---

## 7. Especificaciones Técnicas para Desarrollo Web (HTML5)

* **Stack Recomendado:** HTML5 semántico, CSS3 (Grid/Flexbox con unidades relativas `vh`/`dvh` y `aspect-ratio: 9/16`), JavaScript Vanilla (ES6+) o librería ligera de interacción táctil (ej. *Interact.js* o *GSAP* para física del *Mar de Ideas*).  
* **Persistencia de Estado:** `localStorage` para evitar pérdida de avance ante recargas accidentales del navegador.  
* **Backend / Integración:** Webhook / API REST (ej. Google Apps Script, Formspree o endpoint institucional) para almacenar registros en base de datos/hoja de cálculo y disparar el correo automático de seguimiento.

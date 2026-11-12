<!-- Fuente: Google Docs — Informe de Diseño: Escape Room Virtual - Revista Jandiekua (id: 1T0lpfeFynuDqxoa6od_W841FlhmD14xLJsUJDdwt6ls). Copia de solo lectura, 2026-11-11. -->

# **Informe de Diseño y Arquitectura: Escape Room Virtual – Revista Jandiekua**

# **1. Visión General y Concepto de la Experiencia**

El proyecto del **Escape Room Virtual** para la revista científica *Jandiekua* responde a la necesidad de modernizar y democratizar el acceso a la información sobre el proceso de publicación académica. Mediante la ludificación (*gamification*), esta herramienta convierte una guía formal de autores en una experiencia interactiva y memorable.

* **Objetivo:** Transformar el proceso de postulación y los requisitos editoriales de la revista científica *Jandiekua* en una experiencia lúdica, inmersiva y formativa que oriente y motive a nuevos investigadores a publicar sus trabajos con rigor.  
* **Narrativa Central:** El jugador asume el rol de un aspirante a autor que ingresa al "Consorcio Virtual de Publicación". Para lograr la aceptación de su artículo, debe superar cuatro cámaras de validación académica correlativas, recolectando las acreditaciones correspondientes antes de obtener la llave definitiva de publicación y su certificación oficial de elegibilidad.

---

# **2. Arquitectura de Interfaz y Composición Gráfica**

## **Formato de Pantalla**

La experiencia está concebida bajo un enfoque *mobile-first* con una **interfaz vertical alargada** (proporción 9:16 o similar). Este formato optimiza el uso en dispositivos móviles, tótem interactivos en congresos y modalidades de pantalla dividida verticalmente. Permite una lectura fluida, minimiza la necesidad de desplazamiento (*scroll*) continuo y optimiza la interacción táctil o mediante cursor en un único plano continuo.

## **División Espacial de la Pantalla**

El canvas interactivo se organiza en tres regiones funcionales superpuestas:

* **Zona Superior (Escenario / Planteamiento del Reto):**  
  * Ocupa la fracción superior del viewport.  
  * Muestra la ambientación temática de la sala actual, la formulación del problema, fragmentos de documentos a evaluar, observaciones puntuales de evaluadores o dilemas éticos.  
* **Zona Media (Contenedores / Tanques / Pecera de Validación):**  
  * Área interactiva central de decantación y prueba.  
  * Funciona como un sistema visual de tanques o recipientes de prueba donde los elementos seleccionados se depositan, filtran y clasifican.  
  * Los conceptos válidos se estabilizan con una animación afirmativa, mientras que los errores se descartan o generan retroalimentación correctiva inmediata.  
* **Zona Inferior (El "Mar de Ideas"):**  
  * Repositorio dinámico de interacción situado en la base de la pantalla.  
  * Presenta una interfaz fluida por la que flotan nodos interactivos (conceptos, fragmentos de texto, reglas de formato, argumentos metodológicos y principios de integridad).  
  * El usuario selecciona o arrastra (*drag-and-drop* / *tap-to-select*) elementos desde el "mar de ideas" hacia los tanques superiores para construir la respuesta requerida.

---

# **3. Estructura Detallada de las Cuatro Salas Temáticas**

## **Matriz Comparativa de Salas**

| Sala | Nombre | Enfoque Editorial | Mecánica Principal | Llave / Recompensa |
| :---- | :---- | :---- | :---- | :---- |
| **Sala 1** | Túnel de la Originalidad | Pertinencia temática, innovación y rigor frente al plagio. | Filtrado de propuestas y aportes inéditos desde el mar de ideas hacia el tanque de originalidad. | Llave de Pertinencia |
| **Sala 2** | Laberinto del Formato | Normas editoriales, estructura IMRyD, citación y estilo de Jandiekua. | Ordenamiento secuencial y ajuste de parámetros técnicos en los contenedores de estructura. | Llave de Estructura |
| **Sala 3** | Cámara de Pares | Revisión por pares (*peer review*) y respuesta a dictámenes. | Selección de argumentos metodológicos en el mar de ideas para responder a las observaciones de los árbitros presentadas arriba. | Llave de Validación Científica |
| **Sala 4** | Portal de Ética | Integridad académica, declaración de conflictos de interés y transparencia. | Reutiliza la interfaz de la Sala 3: arriba se presentan dilemas éticos reales y abajo el jugador selecciona en el mar de ideas los principios éticos y acciones correctas que justifican su decisión. | Llave Definitiva de Publicación |

## **Desglose Operativo por Sala**

### **Sala 1: Túnel de la Originalidad**

El jugador ingresa la temática preliminar de su investigación. La zona superior expone los límites disciplinarios y la línea editorial de *Jandiekua*. En la zona media (pecera de validación), el usuario debe filtrar los elementos provenientes del mar de ideas, separando las aportaciones inéditas y con enfoque novedoso de aquellas con riesgo de autoplagio, falta de profundidad teórica o temáticas fuera de alcance. La superación del reto otorga la **Llave de Pertinencia**.

### **Sala 2: Laberinto del Formato**

Se evalúa la precisión técnica. En la zona superior se presentan bloques incompletos de la estructura estándar de un artículo (IMRyD). El jugador debe arrastrar desde el mar de ideas y encajar en la zona media los componentes estructurales correctos (título conciso, resumen estructurado, palabras clave estandarizadas en tesauros, metodología replicable y referencias en formato normalizado). Al completar la secuencia lógica, obtiene la **Llave de Estructura**.

### **Sala 3: Cámara de Pares**

Simula la fase de dictamen editorial. La zona superior despliega fragmentos de evaluaciones anónimas dictaminadas por pares académicos con observaciones metodológicas o teóricas. Desde el mar de ideas en la base, el jugador debe seleccionar las respuestas técnicas, datos suplementarios y justificaciones fundamentadas que respondan con precisión a las observaciones del arbitraje. El éxito desbloquea la **Llave de Validación Científica**.

### **Sala 4: Portal de Ética**

Para minimizar la carga cognitiva e incremental de la curva de aprendizaje, esta sala reutiliza el marco visual e interactivo de la Sala 3. La zona superior exhibe casos y dilemas éticos de la práctica científica (autorías fantasma o regalas, omisión de fuentes de financiamiento, manipulación de datos o conflictos de interés no declarados). En el mar de ideas, el jugador identifica y aplica los principios éticos del código de conducta de la revista para resolver adecuadamente cada escenario. La resolución completa libera la **Llave Definitiva de Publicación**.

---

# **4. Etapa Final: Certificación "Elegible como Investigador" y Captura de Contacto**

## **Propósito**

Concluir la experiencia formativa mediante la recolección estructurada de datos de contacto de autores potenciales, entregando en reciprocidad un reconocimiento digital de valor formativo y trazando la ruta directa hacia la postulación real.

## **Flujo de la Pantalla Final**

1. **Formulario de Registro de Interés:**  
   Una vez obtenida la cuarta llave, la interfaz despliega el módulo final de registro. Se solicita al participante ingresar:  
   * Nombre completo (para la emisión del certificado).  
   * Correo electrónico institucional o principal.  
   * Teléfono de contacto / WhatsApp.  
   * El sistema vincula automáticamente estos datos con la línea de investigación registrada al inicio de la partida.  
   * Inclusión de un **Aviso de Privacidad breve** y consentimiento informado visible justo junto al envío del formulario, especificando que los datos personales (nombre, correo y teléfono/WhatsApp) serán utilizados exclusivamente para seguimiento editorial y envío de convocatorias de la revista *Jandiekua*, conforme a la normativa de protección de datos vigente.  
2. **Entrega de Insignia y Certificado Digital:**  
   Procesado el formulario, se genera una vista de felicitación que exhibe:  
   * La **Insignia Digital de "Elegible como Investigador"**.  
   * Un certificado personalizado en formato descargable (PDF) e imágen compartible para redes profesionales (LinkedIn, ResearchGate).  
3. **Mensaje de Rigor Científico y Acompañamiento:**  
   La pantalla incluye una nota institucional clara: superar el Escape Room acredita que el participante comprende las directrices clave de *Jandiekua* y posee el perfil formativo necesario para iniciar el proceso de sometimiento. Se enfatiza que el logro no constituye una promesa implícita de aceptación del manuscrito, manteniendo el rigor y la independencia del comité editorial.  
4. **Datos de Contacto y Seguimiento Automático:**  
   Se muestran los canales oficiales de soporte al autor (correo de la redacción, plataforma OJS, redes institucionales). Además, se incluye de forma prominente un **botón o enlace directo de envío de manuscrito** que dirija inmediatamente al portal oficial de recepción de artículos o formulario de postulación de la revista *Jandiekua*. Simultáneamente, el sistema dispara un correo electrónico transaccional de bienvenida que incluye la guía de autores completa y el enlace directo al portal de envíos.

---

# **5. Requisitos de Formato y Especificaciones de Desarrollo**

```
+-------------------------------------------------------+
| ZONA SUPERIOR: Planteamiento / Reto / Evaluaciones    |
| (1080 x 640 px aprox.)                                |
+-------------------------------------------------------+
| ZONA MEDIA: Tanques / Pecera de Validación            |
| (1080 x 500 px aprox.)                                |
+-------------------------------------------------------+
| ZONA INFERIOR: El "Mar de Ideas" (Nodos flotantes)    |
| (1080 x 780 px aprox.)                                |
+-------------------------------------------------------+
```

## **Especificaciones Técnicas**

* **Diseño Responsivo Vertical:**  
  * Canvas base proyectado a **1080 x 1920 px (relación 9:16)**.  
  * Adaptación fluida por CSS Media Queries para resoluciones móviles estándar y pantallas verticales tipo tótem interactivo.  
* **Motor de Interacción (Mar de Ideas y Pecera):**  
  * Despliegue gráfico sobre **HTML5 Canvas** o elementos **SVG** manipulados mediante JavaScript liviano.  
  * Simulación de física de flotación suave para los nodos del "Mar de Ideas".  
  * Compatibilidad total con eventos táctiles (*touch*) y de cursor (*mouse*), integrando *drag-and-drop* y selección por toque (*tap-to-select*).  
  * Retroalimentación visual y sonora inmediata mediante estados CSS y efectos de audio atenuados.  
* **Persistencia y Base de Datos:**  
  * Captura y almacenamiento estructurado de datos: tema de interés, métricas de desempeño por sala, tiempo de resolución, y datos de contacto.  
  * Conexión vía API REST / Webhooks hacia el gestor de correo transaccional y sincronización en tiempo real con hoja de cálculo o CRM de la revista.  
* **Generación Dinámica de Activos:**  
  * Renderizado *en cliente* mediante librerías de Canvas a PDF/Image para la maquetación instantánea del certificado y la insignia con el nombre del usuario y fecha de emisión.

---

# **6. Recurso de Apoyo Inmersivo: Glosario Interactivo y Ayuda Rápida ('Códice Editorial')**

## **Propósito**

Resolver dudas conceptuales o técnicas de los jóvenes investigadores durante el recorrido sin romper la narrativa ni obligarlos a abandonar la pantalla del juego.

## **Integración en la Interfaz Vertical**

Un botón discreto y accesible en la esquina superior de la pantalla (diseñado diegéticamente como un "Códice Editorial" o "Manual de Campo de Jandiekua") que despliega una ventana modal superpuesta con buscador rápido y pestañas por sala.

## **Componentes del Recurso**

5. **Glosario Interactivo de Términos Académicos:**  
   Definiciones claras, breves y amigables de conceptos editoriales clave (ej. *revisión por pares doble ciego, estructura IMRyD, conflicto de interés, autoplagio, ISSN, DOI, palabras clave, resumen estructurado*).  
6. **Pistas Contextuales / Ayuda Rápida por Sala:**  
   Tarjetas de orientación progresiva que ofrecen ejemplos prácticos cuando el jugador duda al seleccionar elementos en el "Mar de Ideas", evitando la frustración sin revelar directamente la respuesta.

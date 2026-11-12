/* Aviso de almacenamiento (localStorage) y cookies, de lectura mínima y honesta.
   El juego no usa cookies propias, ni de seguimiento, ni de publicidad. Guarda en el navegador
   (localStorage) solo lo estrictamente necesario para funcionar: el avance, un identificador
   anónimo de sesión y el registro de que aceptaste los términos. Este banner solo informa;
   recuerda que lo cerraste con una clave más en localStorage. Se carga como script clásico. */
(function () {
  "use strict";
  var CLAVE = "jandiekua_aviso_almacenamiento_v1";
  var VERSION_AVISO = "1";

  function yaVisto() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE) || "null");
      return !!(v && v.v === VERSION_AVISO);
    } catch (e) {
      return false;
    }
  }
  function recordar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ v: VERSION_AVISO, t: new Date().toISOString() }));
    } catch (e) { /* sin almacenamiento: el banner volverá a aparecer, sin daño */ }
  }
  function montar() {
    if (yaVisto() || document.getElementById("aviso-almacenamiento")) return;
    var ap = document.createElement("div");
    ap.id = "aviso-almacenamiento";
    ap.innerHTML =
      '<div class="caja" role="region" aria-label="Aviso de almacenamiento y cookies">' +
      '<p><strong>Sin cookies de seguimiento ni publicidad.</strong> Este sitio guarda en tu navegador ' +
      "(localStorage) solo lo necesario para funcionar: tu avance en el juego, un identificador anónimo " +
      "de sesión y el registro de que aceptaste los términos. No usamos analítica ni tipografías de terceros.</p>" +
      '<div class="acciones">' +
      '<button type="button" id="aviso-almacenamiento-ok">Entendido</button>' +
      '<a href="aviso-privacidad.html#almacenamiento">Más información</a>' +
      "</div></div>";
    document.body.appendChild(ap);
    document.getElementById("aviso-almacenamiento-ok").addEventListener("click", function () {
      recordar();
      ap.parentNode && ap.parentNode.removeChild(ap);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();

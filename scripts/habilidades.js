// Devuelve los IDs de candidatos que cumplen al menos el 70% de las habilidades requeridas.
// - Ignora mayúsculas/minúsculas
// - No repite candidatos
// - Ordena alfabéticamente los IDs
function candidatosCompatibles(oferta, candidatos) {
  // normalizamos la oferta a minúsculas
  var requeridas = oferta.map(function (s) { return s.trim().toLowerCase(); });
  // 70% redondeado hacia abajo (ej: 5 -> 3, 6 -> 4)
  var minimo = Math.floor(requeridas.length * 0.7);

  var compatibles = [];

  for (var i = 0; i < candidatos.length; i++) {
    var cand = candidatos[i];
    var id = cand.id;
    var skills = cand.skills.map(function (s) { return s.trim().toLowerCase(); });

    // contar coincidencias
    var coincide = 0;
    for (var j = 0; j < requeridas.length; j++) {
      if (skills.indexOf(requeridas[j]) !== -1) {
        coincide++;
      }
    }

    if (coincide >= minimo) {
      if (compatibles.indexOf(id) === -1) {
        compatibles.push(id);
      }
    }
  }

  // ordenar alfabéticamente por ID
  compatibles.sort();
  return compatibles;
}

/* ============================
   Entrada con prompt (navegador)
   Formato sugerido:

   Oferta (separa por comas):
   JavaScript, React, Node, CSS, Git

   Candidatos (cada línea un candidato):
   juan: JavaScript, React, Node, Git
   ana: JavaScript, CSS, React, Node, Git
   leo: HTML, CSS
   lu: JavaScript, Node
   ============================ */

var ofertaStr = prompt("Ingresa las habilidades de la OFERTA separadas por comas:\nEj: JavaScript, React, Node, CSS, Git");
var candidatosStr = prompt(
  "Ingresa CANDIDATOS, uno por línea, con el formato:\n" +
  "id: skill1, skill2, ...\n\n" +
  "Ej:\n" +
  "juan: JavaScript, React, Node, Git\n" +
  "ana: JavaScript, CSS, React, Node, Git\n" +
  "leo: HTML, CSS\n" +
  "lu: JavaScript, Node"
);

if (ofertaStr && candidatosStr) {
  // parsear oferta
  var oferta = ofertaStr.split(",").map(function (s) { return s.trim(); });

  // parsear candidatos (por líneas)
  var lineas = candidatosStr.split("\n");
  var candidatos = [];

  for (var i = 0; i < lineas.length; i++) {
    var linea = lineas[i].trim();
    if (linea.length === 0) continue;

    // separar "id: skills"
    var partes = linea.split(":");
    if (partes.length < 2) {
      // línea mal formada, la ignoramos
      console.warn("Línea ignorada (formato inválido):", linea);
      continue;
    }
    var id = partes[0].trim();
    var skillsStr = partes.slice(1).join(":"); // por si había ":" en skills
    var skills = skillsStr.split(",").map(function (s) { return s.trim(); });

    candidatos.push({ id: id, skills: skills });
  }

  // calcular compatibles
  var resultado = candidatosCompatibles(oferta, candidatos);

  // mostrar
  alert("Candidatos compatibles: " + (resultado.length ? resultado.join(", ") : "Ninguno"));
  console.log("Oferta:", oferta);
  console.log("Candidatos:", candidatos);
  console.log("Candidatos compatibles:", resultado);
} else {
  alert("No ingresaste datos.");
}

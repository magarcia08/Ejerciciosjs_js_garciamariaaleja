// === Regla: normalizar para comparar (sin alterar el original) ===
// - quita espacios al inicio/final
// - pasa a minúsculas
// - elimina ".", "!" o "?" finales (uno o varios)
function normalizar(frase) {
  var t = frase.trim().toLowerCase();
  while (t.endsWith(".") || t.endsWith("!") || t.endsWith("?")) {
    t = t.slice(0, -1).trimEnd();
  }
  return t;
}

// === Regla: devolver las frases ORIGINALES del estudiante, en su mismo orden ===
function detectarPlagio(base, frasesEstudiante) {
  // Normalizamos la base una sola vez
  var baseNorm = [];
  for (var i = 0; i < base.length; i++) {
    baseNorm.push(normalizar(base[i]));
  }

  var resultado = [];
  for (var j = 0; j < frasesEstudiante.length; j++) {
    var original = frasesEstudiante[j];      // preserva la frase tal cual
    var norm = normalizar(original);         // se compara solo con versión normalizada
    if (baseNorm.indexOf(norm) !== -1) {     // match sin distinguir mayúsculas/espacios/punt final
      resultado.push(original);              // agregamos la ORIGINAL (no modificada)
    }
  }
  return resultado;
}

// === Utilidad: convierte texto en array (admite líneas o ';') ===
function parseLista(raw) {
  if (!raw) return [];
  var partes = raw.split(/\n|;/);
  var out = [];
  for (var i = 0; i < partes.length; i++) {
    var s = partes[i].trim();
    if (s.length > 0) out.push(s);
  }
  return out;
}

// === Prompts al usuario ===
var baseRaw = prompt(
  "Pega las frases de la BASE (una por línea o separadas por ';'):\n" +
  "Ej:\nEl conocimiento es poder.\nAprender nunca es una pérdida de tiempo!\nProgramar es divertido"
);

if (baseRaw === null) {
  alert("Operación cancelada.");
} else {
  var estudianteRaw = prompt(
    "Pega las frases del ESTUDIANTE (una por línea o separadas por ';'):\n" +
    "Ej:\nel conocimiento es poder\n Aprender nunca es una pérdida de tiempo \nprogramar es divertido.\nLa práctica hace al maestro"
  );

  if (estudianteRaw === null) {
    alert("Operación cancelada.");
  } else {
    var baseArr = parseLista(baseRaw);
    var estArr = parseLista(estudianteRaw);

    var plagiadas = detectarPlagio(baseArr, estArr);

    // Resultado: array con LAS FRASES DEL ESTUDIANTE plagiadas, en el mismo orden y sin modificar
    console.log("Base:", baseArr);
    console.log("Estudiante:", estArr);
    console.log("Plagiadas:", plagiadas);
    alert("Frases plagiadas: " + (plagiadas.length ? plagiadas.join(" | ") : "Ninguna"));
  }
}

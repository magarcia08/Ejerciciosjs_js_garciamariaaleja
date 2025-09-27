// funcion que encuentra el primer portal fuera de fase
function portalFueraDeFase(portales) {
  for (var i = 0; i < portales.length; i++) {
    var letra = portales[i];
    // Contamos cuántas veces aparece la letra en toda la cadena
    var veces = 0;
    for (var j = 0; j < portales.length; j++) {
      if (portales[j] === letra) {
        veces++;
      }
    }
    // Si aparece solo una vez, es el portal fuera de fase
    if (veces === 1) {
      return i;
    }
  }
  // Si todos están en fase (se repiten), devolvemos -1
  return -1;
}

// === ejemplos de prueba ===
console.log(portalFueraDeFase("xyxxyx")); // -1 (todas se repiten)
console.log(portalFueraDeFase("quasar")); // 0 (la 'q' es única en el índice 0)
console.log(portalFueraDeFase("aabbccddeeffg")); // 12 (la 'g' es única en el índice 12)

// === con prompt en navegador ===
var entrada = prompt("Ingresa la secuencia de portales (solo letras minúsculas):\nEjemplo: quasar, xyxxyx, aabbccddeeffg");
if (entrada) {
  var resultado = portalFueraDeFase(entrada.trim());
  alert("El índice del primer portal fuera de fase es: " + resultado);
  console.log("Entrada:", entrada, "Resultado:", resultado);
}

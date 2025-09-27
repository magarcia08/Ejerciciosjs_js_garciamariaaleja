function decodeSpell(cadena) {
  const valores = {
    "☽": 1,
    "☾": 5,
    "♁": 10,
    "⚕": 50,
    "⚡": 100
  };

  // Validar símbolos desconocidos
  for (const s of cadena) {
    if (!(s in valores)) {
      return NaN;
    }
  }

  let total = 0;
  for (let i = 0; i < cadena.length; i++) {
    const actual = valores[cadena[i]];
    const siguiente = valores[cadena[i + 1]] || 0;
    total += actual < siguiente ? -actual : actual;
  }
  return total;
}

// === Solicitar al usuario con prompt ===
const entrada = prompt("Ingresa la cadena de símbolos mágicos (ej: ☽☾⚡):");
if (entrada) {
  const resultado = decodeSpell(entrada);
  console.log("Resultado:", resultado);
  alert("El valor total es: " + resultado);
} else {
  alert("No ingresaste nada.");
}

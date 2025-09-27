// Función para verificar si dos palabras son anagramas
function esAnagrama(palabra1, palabra2) {
  // Pasar todo a minúsculas
  var p1 = palabra1.toLowerCase();
  var p2 = palabra2.toLowerCase();

  // Si no tienen la misma longitud, no pueden ser anagramas
  if (p1.length !== p2.length) {
    return false;
  }

  // Convertir a arrays, ordenar y comparar
  var arr1 = p1.split("").sort();
  var arr2 = p2.split("").sort();

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

// === Ejemplos de prueba ===
console.log(esAnagrama("cinema", "iceman")); // true
console.log(esAnagrama("hello", "world"));   // false
console.log(esAnagrama("Listen", "Silent")); // true
console.log(esAnagrama("evil", "vile"));     // true

// === Con prompt en navegador ===
var palabra1 = prompt("Ingresa la primera palabra:");
var palabra2 = prompt("Ingresa la segunda palabra:");

if (palabra1 && palabra2) {
  var resultado = esAnagrama(palabra1, palabra2);
  alert("¿Son anagramas? " + (resultado ? "true " : "false "));
  console.log("Palabra 1:", palabra1);
  console.log("Palabra 2:", palabra2);
  console.log("¿Son anagramas?", resultado);
} else {
  alert("No ingresaste las dos palabras.");
}

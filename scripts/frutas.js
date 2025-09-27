// === Función principal ===
function frutaEmpacadaCorrectamente(entrada, salida) {
  var pila = [];
  var j = 0;

  for (var i = 0; i < entrada.length; i++) {
    // Apilamos cada fruta de entrada
    pila.push(entrada[i]);

    // Mientras la cima coincida con la salida, desapilamos
    while (pila.length > 0 && pila[pila.length - 1] === salida[j]) {
      pila.pop();
      j++;
    }
  }

  // Si pudimos sacar todas las frutas en el orden de salida → válido
  return j === salida.length;
}

// === Pedir datos al usuario ===
var entradaStr = prompt("Ingresa las frutas de entrada (separa con comas):\nEj: manzana,banana,kiwi");
var salidaStr  = prompt("Ingresa las frutas de salida (separa con comas):\nEj: kiwi,banana,manzana");

if (entradaStr && salidaStr) {
  var entrada = entradaStr.split(",").map(function (s) { return s.trim(); });
  var salida  = salidaStr.split(",").map(function (s) { return s.trim(); });

  var resultado = frutaEmpacadaCorrectamente(entrada, salida);

  alert("¿Salida válida? " + (resultado ? "true " : "false "));
  console.log("Entrada:", entrada);
  console.log("Salida:", salida);
  console.log("¿Es válida?", resultado);
} else {
  alert("No ingresaste datos.");
}

// ===== Archivos comprometidos: interactivo + de pruebas =====
(function () {
  // ---------- Lógica principal ----------
  function getCompromisedFiles(lastSafeDownload, droneLogs) {
    var ids = [];
    for (var i = 0; i < droneLogs.length; i++) {
      var pair = droneLogs[i];
      if (!pair || pair.length < 2) continue;
      var id = Number(pair[0]);
      var ts = Number(pair[1]);
      if (Number.isFinite(id) && Number.isFinite(ts) && ts > lastSafeDownload) {
        if (ids.indexOf(id) === -1) ids.push(id);
      }
    }
    ids.sort(function (a, b) { return a - b; });
    return ids;
  }

  // ---------- Parsers robustos ----------
  function parseLastSafe(input) {
    if (input == null) return NaN;
    var m = String(input).match(/-?\d+/);
    return m ? Number(m[0]) : NaN;
  }

  function parseLogs(input) {
    if (input == null) return [];
    var s = String(input).trim();
    var logs = [];

    // Intento 1: JSON directo [[id,ts],...]
    if (s.startsWith("[")) {
      try {
        var arr = JSON.parse(s);
        if (Array.isArray(arr)) {
          for (var i = 0; i < arr.length; i++) {
            var p = arr[i];
            if (Array.isArray(p) && p.length >= 2) {
              var id = Number(p[0]);
              var ts = Number(p[1]);
              if (Number.isFinite(id) && Number.isFinite(ts)) logs.push([id, ts]);
            }
          }
          if (logs.length) return logs;
        }
      } catch (e) { /* fallback */ }
    }

    // Intento 2: pares separados por ';' o por saltos de línea
    var filas = s.split(/[\n;]+/).map(function (r) { return r.trim(); }).filter(Boolean);
    for (var j = 0; j < filas.length; j++) {
      var nums = filas[j].match(/-?\d+/g);
      if (nums && nums.length >= 2) {
        var id2 = Number(nums[0]);
        var ts2 = Number(nums[1]);
        if (Number.isFinite(id2) && Number.isFinite(ts2)) logs.push([id2, ts2]);
      }
    }
    return logs;
  }

  // ---------- Ejecutor de escenarios (para pruebas) ----------
  function runScenario(name, lastSafeStrOrNum, logsStr, expected) {
    var lastSafe = typeof lastSafeStrOrNum === "number" ? lastSafeStrOrNum : parseLastSafe(lastSafeStrOrNum);
    var logs = parseLogs(logsStr);
    var got = getCompromisedFiles(lastSafe, logs);

    console.group("Caso:", name);
    console.log("lastSafeDownload:", lastSafe);
    console.log("logs (parseados):", logs);
    console.log("Resultado:", got);

    if (Array.isArray(expected)) {
      var ok = arraysEqual(got, expected);
      console.log("Esperado:", expected, ok ? "OK" : "MISMATCH");
    } else {
      console.log("Sin esperado (solo demostración).");
    }
    console.groupEnd();
    return got;
  }

  function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  // ---------- Interactivo por prompt ----------
  var lastSafeRaw = prompt("Ingresa lastSafeDownload (ej: 1670000000)");
  var lastSafe = parseLastSafe(lastSafeRaw);

  var logsRaw = prompt(
    "Pega los logs.\n" +
    "• Con ';' : 42,1670000500; 13,1670000000; 8,1670000700\n" +
    "• JSON    : [[42,1670000500],[13,1670000000],[8,1670000700]]\n" +
    "• Por línea: 42,1670000500\\n13,1670000000\\n8,1670000700"
  );

  if (!Number.isFinite(lastSafe)) {
    alert("lastSafeDownload inválido.");
  } else {
    var parsedLogs = parseLogs(logsRaw);
    if (!parsedLogs.length) {
      alert("No se pudieron leer logs válidos.");
      console.log("Entrada de logs inválida:", logsRaw);
    } else {
      var result = getCompromisedFiles(lastSafe, parsedLogs);
      alert("✅ Archivos comprometidos: " + (result.length ? result.join(", ") : "Ninguno"));
      console.log(">>> Interactivo <<<");
      console.log("lastSafeDownload:", lastSafe);
      console.log("droneLogs:", parsedLogs);
      console.log("Comprometidos:", result);
    }
  }

  // ---------- tpruebas automática ----------
  console.log("==============================================");
  console.log("     Batería de casos de prueba (automática)  ");
  console.log("==============================================");

  // Ejemplo 1 (del enunciado)
  runScenario(
    "Enunciado - mezcla ;",
    1670000000,
    "42,1670000500; 13,1670000000; 8,1670000700; 8,1670000001; 99,1669999999",
    [8, 42]
  );

  // Ejemplo 2 (ninguno comprometido)
  runScenario(
    "Ninguno comprometido",
    2000000000,
    "42,1670000500; 13,1670000000; 8,1670000700",
    []
  );

  // Ejemplo 3 (IDs repetidos en logs, resultado sin repetir)
  runScenario(
    "IDs repetidos",
    1000,
    "1,2000; 1,3000; 2,4000; 1,5000",
    [1, 2]
  );

  // Ejemplo 4 (formato JSON)
  runScenario(
    "Formato JSON",
    1670000000,
    "[[10,1670001000],[11,1670002000],[12,1669999999]]",
    [10, 11]
  );

  // Ejemplo 5 (una por línea)
  runScenario(
    "Una por línea",
    5000,
    "7,10000\n8,2000\n9,6000",
    [7, 9]
  );

  // Ejemplo 6 (espacios y texto extra; el parser extrae números)
  runScenario(
    "Con texto y espacios",
    "last=  3000",
    "id: 3 , ts: 2500 ;   id: 4 , ts: 9000 ;\n(id=5, ts=1000)",
    [4]
  );

  // Ejemplo 7 (bordes: negativos o cero)
  runScenario(
    "Timestamps borde",
    0,
    "100,0; 101,-5; 102,1",
    [102]
  );

  // Ejemplo 8 (mixto: JSON inválido -> fallback)
  runScenario(
    "JSON inválido -> fallback",
    100,
    "[[mal,formato]], 7,200; 8,50",
    [7]
  );

})();

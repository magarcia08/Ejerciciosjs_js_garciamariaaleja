# Retos JavaScript — README (con `prompt` y JS separados)

Este repositorio reúne varios retos en **JavaScript** listos para ejecutarse en **navegador** usando `prompt`.  
Cada sección incluye **reglas**, **uso**, y un **snippet JS** autocontenible.

---

## Índice
- [🧙 El códice de Arkanus (decodeSpell)](#-el-códice-de-arkanus-decodespell)
- [🤖 Archivos comprometidos (getCompromisedFiles)](#-archivos-comprometidos-getcompromisedfiles)
- [📝 Frases plagiadas (detectarPlagio)](#-frases-plagiadas-detectarplagio)
- [🧃 Frutas envasadas (frutaEmpacadaCorrectamente)](#-frutas-envasadas-frutaempacadacorrectamente)
- [🧩 Habilidades compatibles (candidatosCompatibles)](#-habilidades-compatibles-candidatoscompatibles)
- [⏳ Puertas del portal temporal (portalFueraDeFase)](#-puertas-del-portal-temporal-portalfueradefase)
- [🔤 Anagramas (esAnagrama)](#-anagramas-esanagrama)

---

## 🧙 El códice de Arkanus (decodeSpell)

### Reglas
- Símbolos y valores: `☽=1`, `☾=5`, `♁=10`, `⚕=50`, `⚡=100`  
- **Suma** por defecto; si un símbolo **menor** está **antes** de uno mayor, **se resta**.  
- Símbolo desconocido → `NaN`.

### Uso
1. Crea `index.html` y enlaza un JS (por ejemplo `arkanus.js`).  
2. Abre en el navegador y escribe en el `prompt` una cadena de símbolos, ej: `☽☽☾⚡`.

### Código (arkanus.js)
```javascript
function decodeSpell(cadena) {
  var valores = { "☽":1, "☾":5, "♁":10, "⚕":50, "⚡":100 };
  for (var i = 0; i < cadena.length; i++) if (!(cadena[i] in valores)) return NaN;
  var total = 0;
  for (var j = 0; j < cadena.length; j++) {
    var actual = valores[cadena[j]];
    var sig = j + 1 < cadena.length ? valores[cadena[j + 1]] : 0;
    total += actual < sig ? -actual : actual;
  }
  return total;
}

var entrada = prompt("Ingresa símbolos (ej: ☽☽☾⚡):");
if (entrada) {
  var r = decodeSpell(entrada.trim());
  alert("Resultado: " + r);
  console.log("Entrada:", entrada, "Resultado:", r);
}
```

---

## 🤖 Archivos comprometidos (getCompromisedFiles)

### Reglas
1) Incluir el **ID** si **algún** timestamp es **posterior** a `lastSafeDownload`.  
2) **Sin duplicados**.  
3) **Orden ascendente**.  
4) Si no hay comprometidos → `[]`.

### Uso
- `lastSafeDownload`: número (ej: `1670000000`).  
- `droneLogs`: acepta `;`, **saltos de línea** o **JSON** `[[id,ts], ...]`.

### Código (comprometidos.js)
```javascript
(function () {
  function getCompromisedFiles(lastSafeDownload, droneLogs) {
    var ids = [];
    for (var i = 0; i < droneLogs.length; i++) {
      var p = droneLogs[i]; if (!p || p.length < 2) continue;
      var id = Number(p[0]), ts = Number(p[1]);
      if (Number.isFinite(id) && Number.isFinite(ts) && ts > lastSafeDownload) {
        if (ids.indexOf(id) === -1) ids.push(id);
      }
    }
    ids.sort(function (a, b) { return a - b; });
    return ids;
  }

  function parseLastSafe(input) {
    if (input == null) return NaN;
    var m = String(input).match(/-?\d+/); return m ? Number(m[0]) : NaN;
  }

  function parseLogs(input) {
    if (input == null) return [];
    var s = String(input).trim(), logs = [];
    if (s.startsWith("[")) { // JSON [[id,ts],...]
      try {
        var arr = JSON.parse(s);
        if (Array.isArray(arr)) {
          for (var i = 0; i < arr.length; i++) {
            var par = arr[i];
            if (Array.isArray(par) && par.length >= 2) {
              var id = Number(par[0]), ts = Number(par[1]);
              if (Number.isFinite(id) && Number.isFinite(ts)) logs.push([id, ts]);
            }
          }
          if (logs.length) return logs;
        }
      } catch (e) {}
    }
    var filas = s.split(/[\n;]+/).map(function (r) { return r.trim(); }).filter(Boolean);
    for (var j = 0; j < filas.length; j++) {
      var nums = filas[j].match(/-?\d+/g);
      if (nums && nums.length >= 2) {
        var id2 = Number(nums[0]), ts2 = Number(nums[1]);
        if (Number.isFinite(id2) && Number.isFinite(ts2)) logs.push([id2, ts2]);
      }
    }
    return logs;
  }

  var lastSafe = parseLastSafe(prompt("Ingresa lastSafeDownload (ej: 1670000000)"));
  var logsRaw = prompt("Pega logs ( ';' | saltos de línea | JSON [[id,ts],...] ):");
  if (!Number.isFinite(lastSafe)) { alert("lastSafeDownload inválido."); return; }
  var logs = parseLogs(logsRaw);
  if (!logs.length) { alert("No se pudieron leer logs válidos."); return; }

  var result = getCompromisedFiles(lastSafe, logs);
  alert("Archivos comprometidos: " + (result.length ? result.join(", ") : "Ninguno"));
  console.log("lastSafe:", lastSafe, "logs:", logs, "->", result);
})();
```

---

## 📝 Frases plagiadas (detectarPlagio)

### Reglas
- Ignora mayúsculas/minúsculas, espacios extremos y signos finales `.` `!` `?` (uno o varios).  
- Devuelve **las frases del estudiante** plagiadas, en **su orden**, **sin modificarlas**.

### Uso
- Pega frases **una por línea** o **separadas por `;`**.

### Código (plagio.js)
```javascript
function normalizar(frase) {
  var t = frase.trim().toLowerCase();
  while (t.endsWith(".") || t.endsWith("!") || t.endsWith("?")) { t = t.slice(0, -1).trimEnd(); }
  return t;
}
function detectarPlagio(base, frasesEstudiante) {
  var baseNorm = base.map(normalizar), out = [];
  for (var i = 0; i < frasesEstudiante.length; i++) {
    var original = frasesEstudiante[i];
    if (baseNorm.indexOf(normalizar(original)) !== -1) out.push(original);
  }
  return out;
}
function parseLista(raw) {
  if (!raw) return []; return raw.split(/\n|;/).map(function (s){return s.trim();}).filter(Boolean);
}
var baseRaw = prompt("BASE (una por línea o ';'):");
if (baseRaw !== null) {
  var estRaw = prompt("ESTUDIANTE (una por línea o ';'):");
  if (estRaw !== null) {
    var r = detectarPlagio(parseLista(baseRaw), parseLista(estRaw));
    alert("Plagiadas: " + (r.length ? r.join(" | ") : "Ninguna"));
    console.log("Plagiadas:", r);
  }
}
```

---

## 🧃 Frutas envasadas (frutaEmpacadaCorrectamente)

### Reglas
- Verificar si **salida** es posible con **una pila** (LIFO) a partir de **entrada**.  
- Frutas son **strings** (únicos).  
- Devuelve `true` / `false`.

### Uso
- Introduce **entrada** y **salida** separadas por comas: `manzana,banana,kiwi`

### Código (frutas.js)
```javascript
function frutaEmpacadaCorrectamente(entrada, salida) {
  var pila = [], j = 0;
  for (var i = 0; i < entrada.length; i++) {
    pila.push(entrada[i]);
    while (pila.length && pila[pila.length - 1] === salida[j]) {
      pila.pop(); j++;
    }
  }
  return j === salida.length;
}

var entradaStr = prompt("Entrada (comas): ej manzana,banana,kiwi");
var salidaStr  = prompt("Salida (comas):  ej kiwi,banana,manzana");
if (entradaStr && salidaStr) {
  var entrada = entradaStr.split(",").map(function(s){return s.trim();});
  var salida  = salidaStr.split(",").map(function(s){return s.trim();});
  var ok = frutaEmpacadaCorrectamente(entrada, salida);
  alert("¿Salida válida? " + (ok ? "true" : "false"));
  console.log("Entrada:", entrada, "Salida:", salida, "->", ok);
}
```

---

## 🧩 Habilidades compatibles (candidatosCompatibles)

### Reglas
- 70% de coincidencia sobre la cantidad de **requeridas** (`Math.floor(n * 0.7)`).  
- Ignora mayúsculas/minúsculas.  
- Sin repetir, orden **alfabético** por `id`.

### Uso
- **Oferta**: habilidades separadas por comas.  
- **Candidatos**: una línea por candidato con `id: skill1, skill2, ...`.

### Código (habilidades.js)
```javascript
function candidatosCompatibles(oferta, candidatos) {
  var req = oferta.map(function(s){return s.trim().toLowerCase();});
  var minimo = Math.floor(req.length * 0.7);
  var out = [];
  for (var i = 0; i < candidatos.length; i++) {
    var c = candidatos[i], skills = c.skills.map(function(s){return s.trim().toLowerCase();});
    var match = 0; for (var j = 0; j < req.length; j++) if (skills.indexOf(req[j]) !== -1) match++;
    if (match >= minimo && out.indexOf(c.id) === -1) out.push(c.id);
  }
  out.sort(); return out;
}

var ofertaStr = prompt("OFERTA (comas): ej JavaScript, React, Node, CSS, Git");
var candidatosStr = prompt(
  "CANDIDATOS (una línea por candidato):\n" +
  "id: skill1, skill2, ...\n" +
  "Ej:\njuan: JavaScript, React, Node, Git\nana: JavaScript, CSS, React, Node, Git\nlu: JavaScript, Node"
);

if (ofertaStr && candidatosStr) {
  var oferta = ofertaStr.split(",").map(function(s){return s.trim();});
  var lineas = candidatosStr.split("\n"), candidatos = [];
  for (var i = 0; i < lineas.length; i++) {
    var linea = lineas[i].trim(); if (!linea) continue;
    var partes = linea.split(":"); if (partes.length < 2) continue;
    var id = partes[0].trim(); var skills = partes.slice(1).join(":").split(",").map(function(s){return s.trim();});
    candidatos.push({ id: id, skills: skills });
  }
  var r = candidatosCompatibles(oferta, candidatos);
  alert("Compatibles: " + (r.length ? r.join(", ") : "Ninguno"));
  console.log("Compatibles:", r);
}
```

---

## ⏳ Puertas del portal temporal (portalFueraDeFase)

### Reglas
- Input: string con **minúsculas**.  
- Devuelve el **índice** del primer char **no repetido**; si no hay → `-1`.

### Uso
- Ingresa una cadena, ej: `quasar` → `0` (la `q` es única).

### Código (portal.js)
```javascript
function portalFueraDeFase(s) {
  for (var i = 0; i < s.length; i++) {
    var c = s[i], veces = 0;
    for (var j = 0; j < s.length; j++) if (s[j] === c) veces++;
    if (veces === 1) return i;
  }
  return -1;
}

var entrada = prompt("Secuencia de portales (minúsculas): ej quasar");
if (entrada) {
  var idx = portalFueraDeFase(entrada.trim());
  alert("Índice del primer portal único: " + idx);
  console.log("Entrada:", entrada, "->", idx);
}
```

---

## 🔤 Anagramas (esAnagrama)

### Reglas
- Insensible a mayúsculas/minúsculas.  
- Deben tener **misma longitud** y **mismas letras** (mismas cantidades).

### Uso
- Ingresa dos palabras y muestra `true/false`.

### Código (anagramas.js)
```javascript
function esAnagrama(a, b) {
  var p1 = a.toLowerCase(), p2 = b.toLowerCase();
  if (p1.length !== p2.length) return false;
  var arr1 = p1.split("").sort(), arr2 = p2.split("").sort();
  for (var i = 0; i < arr1.length; i++) if (arr1[i] !== arr2[i]) return false;
  return true;
}

var p1 = prompt("Primera palabra:");
var p2 = prompt("Segunda palabra:");
if (p1 && p2) {
  var r = esAnagrama(p1, p2);
  alert("¿Son anagramas? " + (r ? "true" : "false"));
  console.log("Entrada:", p1, p2, "->", r);
}
```

---

## 📦 Estructura sugerida
```
/proyecto
  index.html
  arkanus.js
  comprometidos.js
  plagio.js
  frutas.js
  habilidades.js
  portal.js
  anagramas.js
```

## ▶️ Instrucciones generales
1. Crea `index.html` y enlaza el script del reto que vayas a probar.  
2. Abre el archivo en un **navegador**.  
3. Responde a los `prompt` con los formatos indicados en cada sección.  
4. Revisa la salida en **alert** y **consola** (F12).

---

¡Listo! Cada reto está pensado con **lógica simple de principiante**, entradas por `prompt` y ejemplos claros de uso.

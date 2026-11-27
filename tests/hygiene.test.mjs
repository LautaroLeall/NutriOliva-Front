// Higiene automatica del Frontend de NutriOliva:
// 1. Codificacion UTF-8 limpia (0 mojibake)
// 2. Regla arquitectonica estricta: ningun archivo en src/ supera las 500 lineas
// 3. Ningun enlace con target="_blank" omite rel="noopener"
// 4. Sin referencias a correos o telefonos antiguos/ficticios (lautaroleal4, 5493810000000)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FRONT_ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC_DIR = path.join(FRONT_ROOT, "src");
const SCRIPTS_DIR = path.join(FRONT_ROOT, "scripts");
const INDEX_HTML = path.join(FRONT_ROOT, "index.html");

const MOJIBAKE_RE =
  /Ã[¡©­³º±¼ÁÉÍÓÚÑ€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]|Â[·¡¿°ªº]|â€|â†|âœ|â˜|ï¸|ðŸ|\uFFFD/;
const OUTDATED_CONTACT_RE = /lautaroleal4@gmail\.com|5493810000000|admin@nutrioliva\.com/;

let fail = 0;
let checkedFiles = 0;

function checkFile(filePath, isSrcFile = false) {
  checkedFiles++;
  const txt = fs.readFileSync(filePath, "utf8");
  const lines = txt.split(/\r?\n/);
  const relPath = path.relative(FRONT_ROOT, filePath);

  // 1. Verificar UTF-8 limpio
  lines.forEach((l, i) => {
    if (MOJIBAKE_RE.test(l)) {
      fail++;
      console.log(`  [FALLA] Mojibake en ${relPath}:${i + 1}`);
    }
  });

  // 2. Verificar limite arquitectonico de <= 500 lineas en src/
  if (isSrcFile && lines.length > 500) {
    fail++;
    console.log(
      `  [FALLA] Archivo supera las 500 lineas (${lines.length} lineas): ${relPath}`
    );
  }

  // 3. Verificar que no existan contactos viejos o ficticios
  if (OUTDATED_CONTACT_RE.test(txt)) {
    fail++;
    console.log(
      `  [FALLA] Contacto antiguo o ficticio detectado en ${relPath}`
    );
  }

  // 4. Todo target="_blank" literal debe tener rel="noopener..."
  if (/\.jsx$/i.test(filePath)) {
    const blankRe = /<a\b[^>]*target=["']_blank["'][^>]*>/g;
    let m;
    while ((m = blankRe.exec(txt))) {
      if (!/noopener/.test(m[0])) {
        fail++;
        console.log(`  [FALLA] target="_blank" sin noopener en ${relPath}`);
      }
    }
  }
}

function walk(dir, isSrc = false) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, isSrc);
    else if (/\.(js|jsx|mjs|css)$/i.test(e.name)) {
      checkFile(p, isSrc);
    }
  }
}

checkFile(INDEX_HTML, false);
walk(SRC_DIR, true);
walk(SCRIPTS_DIR, false);

console.log(
  fail
    ? `\n[FALLA] ${fail} problemas de higiene detectados en ${checkedFiles} archivos`
    : `[OK] Higiene Frontend verificada en ${checkedFiles} archivos (UTF-8 limpio, 100% archivos <= 500 lineas, contactos oficiales y enlaces seguros)`
);
process.exit(fail ? 1 : 0);

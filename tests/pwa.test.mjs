// Verificacion automatizada de la Web App Instalable (PWA), Service Worker seguro,
// Safe Areas moviles y plataforma compartida de NutriOliva.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isNativeApp,
  isInstalledPWA,
  isRegularWeb,
  getAccessMode,
  getAccessModeLabel,
} from "../src/lib/platform.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  [OK] ${name}`);
  } catch (err) {
    failed++;
    console.log(`  [FALLA] ${name}: ${err.message}`);
  }
}

console.log("\n[PWA / Mobile Readiness Test Suite]");

check(
  "platform.js detecta entorno no-DOM / Web de forma segura sin acoplar Capacitor",
  () => {
    assert.equal(isNativeApp(), false);
    assert.equal(isInstalledPWA(), false);
    assert.equal(isRegularWeb(), true);
    assert.equal(getAccessMode(), "web");
    assert.equal(getAccessModeLabel(), "Navegador Web");
  }
);

check(
  "manifest.json cumple estandar de instalacion PWA con id, start_url /mi-plan y shortcuts",
  () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(PUBLIC, "manifest.json"), "utf8")
    );
    assert.equal(manifest.id, "/");
    assert.equal(manifest.start_url, "/mi-plan");
    assert.equal(manifest.display, "standalone");
    assert.ok(
      Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 2,
      "manifest.json debe definir atajos rapidos (shortcuts) para el icono instalado"
    );
    assert.ok(
      manifest.shortcuts.some((s) => s.url === "/mi-plan?tab=hoy") &&
      manifest.shortcuts.some((s) => s.url === "/mi-plan?tab=plan"),
      "Los atajos deben apuntar a ?tab=hoy y ?tab=plan"
    );
  }
);

check(
  "index.html y styles/index.css incluyen viewport-fit=cover y utilidades Safe Area",
  () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.ok(
      html.includes("viewport-fit=cover"),
      "Falta viewport-fit=cover en index.html"
    );
    assert.ok(
      html.includes('name="mobile-web-app-capable" content="yes"'),
      "Falta mobile-web-app-capable en index.html"
    );

    const css = fs.readFileSync(
      path.join(ROOT, "src", "styles", "index.css"),
      "utf8"
    );
    assert.ok(css.includes(".pt-safe") && css.includes(".pb-safe"));
    assert.ok(css.includes("safe-area-inset-top"));
    assert.ok(css.includes("safe-area-inset-bottom"));
    assert.ok(
      css.includes("font-size: 16px !important") &&
      css.includes("touch-action: manipulation"),
      "index.css debe prevenir auto-zoom de teclado (16px) y zoom por doble toque en moviles"
    );
    assert.ok(
      css.includes(".h-dvh-fixed"),
      "index.css debe incluir utilidad .h-dvh-fixed para pantallas sin scroll"
    );
  }
);

check(
  "Login, SetPassword y Modal estan configurados sin desborde ni scroll externo en movil/PC",
  () => {
    const loginPage = fs.readFileSync(
      path.join(ROOT, "src", "pages", "Login.jsx"),
      "utf8"
    );
    const loginLeft = fs.readFileSync(
      path.join(ROOT, "src", "pages", "login", "LoginLeftPanel.jsx"),
      "utf8"
    );
    const setPassPage = fs.readFileSync(
      path.join(ROOT, "src", "pages", "SetPassword.jsx"),
      "utf8"
    );
    const modalUi = fs.readFileSync(
      path.join(ROOT, "src", "components", "ui", "Modal.jsx"),
      "utf8"
    );

    assert.ok(
      loginPage.includes("fixed inset-0 h-dvh-fixed"),
      "Login.jsx debe ser fijo a 100dvh sin scroll de pagina"
    );
    assert.ok(
      loginLeft.includes("hidden lg:flex"),
      "LoginLeftPanel debe compactarse en movil para evitar scroll vertical"
    );
    assert.ok(
      setPassPage.includes("fixed inset-0 h-dvh-fixed"),
      "SetPassword.jsx debe ser fijo a 100dvh sin scroll de pagina"
    );
    assert.ok(
      modalUi.includes("100dvh") && modalUi.includes("overscroll-contain"),
      "Modal.jsx debe limitar altura a dvh con scroll interno controlado"
    );
  }
);

check(
  "vercel.json protege Service Worker sin cache perpetuo y sirve .well-known moviles como JSON",
  () => {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")
    );
    const spaRewrite = cfg.rewrites[0].source;
    assert.ok(
      spaRewrite.includes("sw\\.js") && spaRewrite.includes("workbox-"),
      "El rewrite SPA debe excluir sw.js y workbox-*.js"
    );

    const swHeaderRule = cfg.headers.find((h) => h.source.includes("sw\\.js"));
    assert.ok(swHeaderRule, "Falta regla de Cache-Control para sw.js");
    assert.ok(
      swHeaderRule.headers.some(
        (h) =>
          h.key === "Cache-Control" && h.value.includes("must-revalidate")
      )
    );

    const mobileWellKnown = cfg.headers.find((h) =>
      h.source.includes("assetlinks")
    );
    assert.ok(
      mobileWellKnown?.headers.some(
        (h) =>
          h.key === "Content-Type" && h.value.includes("application/json")
      ),
      "assetlinks.json y apple-app-site-association deben servirse con application/json"
    );
  }
);

if (fs.existsSync(DIST)) {
  check(
    "Build de produccion genera dist/sw.js con regla de privacidad NetworkOnly sobre Supabase",
    () => {
      const swPath = path.join(DIST, "sw.js");
      assert.ok(
        fs.existsSync(swPath),
        "No se encontro dist/sw.js tras vite build"
      );
      const swCode = fs.readFileSync(swPath, "utf8");
      assert.ok(
        swCode.includes("supabase") && swCode.includes("NetworkOnly"),
        "El Service Worker debe aplicar NetworkOnly sobre *.supabase.co para no cachear datos clinicos"
      );
    }
  );
}

if (failed > 0) {
  console.log(`\n[FALLA] ${failed} fallos / ${passed} OK en pruebas PWA`);
  process.exit(1);
}
console.log(
  `\n[OK] Web App Instalable (PWA), Safe Areas y privacidad de cache verificadas (${passed}/${passed})\n`
);

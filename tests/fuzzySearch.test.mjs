// Pruebas unitarias del motor de busqueda difusa (fuzzySearch.js) tolerante a acentos, sinonimos y errores de tipeo.
import {
  normalizarTexto,
  claveFonetica,
  distanciaEdicion,
  calcularPuntajeBusqueda,
  filtrarYOrdenarBusqueda,
} from "../src/lib/fuzzySearch.js";

let pass = 0;
let fail = 0;

function ok(cond, msg) {
  if (cond) {
    pass++;
    console.log("  [OK]", msg);
  } else {
    fail++;
    console.log("  [FALLA]", msg);
  }
}

const CATALOGO_MUESTRA = [
  {
    nombre: "Pechuga de pollo grillada con brócoli al vapor",
    tipo_comida: "almuerzo",
    objetivo_ideal: "Bajar de peso",
  },
  {
    nombre: "Yogur descremado con arándanos y semillas de chía",
    tipo_comida: "desayuno",
    objetivo_ideal: "Bajar de peso",
  },
  {
    nombre: "Milanesa de ternera al horno con puré de calabaza",
    tipo_comida: "cena",
    objetivo_ideal: "Mantenimiento",
  },
  {
    nombre: "Tostadas integrales con aguacate y huevos revueltos",
    tipo_comida: "desayuno",
    objetivo_ideal: "Aumentar masa muscular",
  },
  {
    nombre: "Avena cocida con banana y mantequilla de maní",
    tipo_comida: "merienda",
    objetivo_ideal: "Hipertrofia",
  },
];

console.log("\n[1] Normalizacion de acentos y signos diacriticos");
ok(
  normalizarTexto("Brócoli, Arándanos y Té sin azúcar") ===
  "brocoli arandanos y te sin azucar",
  "Elimina tildes y signos de puntuacion correctamente"
);

console.log("\n[2] Equivalencia fonetica en español para errores ortograficos");
ok(
  claveFonetica("milaneza") === claveFonetica("milanesa"),
  "Equivalencia fonetica z/s: 'milaneza' === 'milanesa'"
);
ok(
  claveFonetica("huebos") === claveFonetica("huevos"),
  "Equivalencia fonetica h muda y b/v: 'huebos' === 'huevos'"
);
ok(
  claveFonetica("yogurt") === claveFonetica("yogur"),
  "Equivalencia fonetica t final: 'yogurt' === 'yogur'"
);
ok(
  claveFonetica("desalluno") === claveFonetica("desayuno"),
  "Equivalencia fonetica ll/y: 'desalluno' === 'desayuno'"
);
ok(
  claveFonetica("habena") === claveFonetica("avena"),
  "Equivalencia fonetica h/b: 'habena' === 'avena'"
);

console.log("\n[3] Distancia de edicion Damerau-Levenshtein (transposiciones y typos)");
ok(distanciaEdicion("ensalda", "ensalada", 2) === 1, "Letra faltante ('ensalda' -> 'ensalada') = 1");
ok(distanciaEdicion("pechgua", "pechuga", 2) === 1, "Transposicion ('pechgua' -> 'pechuga') = 1");
ok(distanciaEdicion("poyo", "pollo", 2) <= 2, "Sustitucion ('poyo' -> 'pollo') <= 2");

console.log("\n[4] Busqueda tolerante a acentos, errores de tipeo y sinonimos");
const getFields = (item) => [item.nombre, item.tipo_comida, item.objetivo_ideal];

const resBrocoli = filtrarYOrdenarBusqueda(CATALOGO_MUESTRA, "brocoli", getFields);
ok(
  resBrocoli.length === 1 && resBrocoli[0].nombre.includes("brócoli"),
  "Busca 'brocoli' sin tilde y encuentra 'brócoli'"
);

const resMilaneza = filtrarYOrdenarBusqueda(CATALOGO_MUESTRA, "milaneza", getFields);
ok(
  resMilaneza.length >= 1 && resMilaneza[0].nombre.includes("Milanesa"),
  "Busca 'milaneza' (con z) y encuentra 'Milanesa'"
);

const resYogurt = filtrarYOrdenarBusqueda(CATALOGO_MUESTRA, "yogurt arandano", getFields);
ok(
  resYogurt.length === 1 && resYogurt[0].nombre.includes("Yogur"),
  "Busca 'yogurt arandano' multi-palabra y encuentra 'Yogur descremado con arándanos'"
);

const resPalta = filtrarYOrdenarBusqueda(CATALOGO_MUESTRA, "palta huebos", getFields);
ok(
  resPalta.length === 1 && resPalta[0].nombre.includes("aguacate"),
  "Busca sinonimo 'palta' + typo 'huebos' y encuentra 'aguacate y huevos'"
);

const resZapallo = filtrarYOrdenarBusqueda(CATALOGO_MUESTRA, "zapallo", getFields);
ok(
  resZapallo.length === 1 && resZapallo[0].nombre.includes("calabaza"),
  "Busca sinonimo regional 'zapallo' y encuentra 'calabaza'"
);

const resObjetivo = filtrarYOrdenarBusqueda(CATALOGO_MUESTRA, "adelgazar", getFields);
ok(
  resObjetivo.length >= 2 && resObjetivo[0].objetivo_ideal === "Bajar de peso",
  "Busca sinonimo clinico 'adelgazar' y encuentra platos con objetivo 'Bajar de peso'"
);

const resTypoPechuga = filtrarYOrdenarBusqueda(CATALOGO_MUESTRA, "pechgua", getFields);
ok(
  resTypoPechuga.length >= 1 && resTypoPechuga[0].nombre.includes("Pechuga"),
  "Busca error de tipeo 'pechgua' y encuentra 'Pechuga'"
);

ok(
  calcularPuntajeBusqueda("pollo", "Pechuga de pollo") > 0,
  "calcularPuntajeBusqueda devuelve puntaje positivo para coincidencia valida"
);

console.log(`\n====== RESULTADO FUZZY SEARCH: ${pass} OK | ${fail} FALLAS ======\n`);
process.exit(fail ? 1 : 0);

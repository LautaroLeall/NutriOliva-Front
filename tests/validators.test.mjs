// Pruebas unitarias de validaciones y enlaces de contacto en tiempo real de NutriOliva.
import {
  ADMIN_EMAIL,
  ADMIN_WHATSAPP,
  ADMIN_INSTAGRAM_HANDLE,
  ADMIN_INSTAGRAM_URL,
  SITE_CANONICAL_URL,
  buildWhatsAppUrl,
  buildEmailUrl,
  getEmailLinkProps,
  validarCampoContacto,
} from "../src/utils/contactLinks.js";

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

console.log("\n[1] Constantes oficiales de contacto");
ok(ADMIN_EMAIL === "nutriolivaa@gmail.com", "Correo oficial nutriolivaa@gmail.com");
ok(ADMIN_WHATSAPP === "5493813399463", "WhatsApp oficial 5493813399463");
ok(ADMIN_INSTAGRAM_HANDLE === "@nutri_olivaa", "Handle de Instagram @nutri_olivaa");
ok(ADMIN_INSTAGRAM_URL === "https://www.instagram.com/nutri_olivaa/", "URL de Instagram oficial");
ok(SITE_CANONICAL_URL === "https://nutri-oliva.vercel.app", "Dominio canonico de produccion");

console.log("\n[2] Generadores de URLs en nueva pestaña");
ok(
  buildWhatsAppUrl("3813399463", "Hola NutriOliva").startsWith(
    "https://wa.me/5493813399463?text=Hola"
  ),
  "buildWhatsAppUrl normaliza prefijo 549 y codifica texto"
);
const mailUrl = buildEmailUrl(ADMIN_EMAIL, "Asunto prueba", "Cuerpo mensaje");
ok(
  mailUrl.startsWith("https://mail.google.com/mail/?") &&
  mailUrl.includes("view=cm") &&
  mailUrl.includes("nutriolivaa%40gmail.com"),
  "buildEmailUrl genera enlace Gmail Web Compose para nueva pestaña"
);
const mailProps = getEmailLinkProps(ADMIN_EMAIL, "Consulta");
ok(
  mailProps.target === "_blank" && mailProps.rel === "noopener noreferrer",
  "getEmailLinkProps incluye target=_blank y rel=noopener noreferrer"
);

console.log("\n[3] Validacion en tiempo real: Nombre y apellido");
ok(validarCampoContacto("nombre", "Mariana Gomez") === "", "Nombre y apellido validos");
ok(validarCampoContacto("nombre", "María José O'Connor") === "", "Nombre con tildes y apostrofe");
ok(validarCampoContacto("nombre", "") !== "", "Rechaza nombre vacio");
ok(validarCampoContacto("nombre", "Mariana") !== "", "Exige nombre y apellido (min 2 palabras)");
ok(validarCampoContacto("nombre", "Mariana 123") !== "", "Rechaza numeros en el nombre");
ok(validarCampoContacto("nombre", "Mariana @#") !== "", "Rechaza simbolos invalidos en el nombre");

console.log("\n[4] Validacion en tiempo real: Correo electronico (@)");
ok(validarCampoContacto("email", "nutriolivaa@gmail.com") === "", "Correo valido estandar");
ok(validarCampoContacto("email", "lic.mariana@consultorio.com.ar") === "", "Correo con subdominio .com.ar");
ok(validarCampoContacto("email", "") !== "", "Rechaza correo vacio");
ok(validarCampoContacto("email", "sin-arroba.com") !== "", "Rechaza correo sin @");
ok(validarCampoContacto("email", "usuario@") !== "", "Rechaza correo sin dominio despues de @");
ok(validarCampoContacto("email", "usuario@gmail") !== "", "Rechaza dominio sin punto ni TLD");
ok(validarCampoContacto("email", "usuario con espacio@gmail.com") !== "", "Rechaza correo con espacios");

console.log("\n[5] Validacion en tiempo real: Telefono / WhatsApp");
ok(validarCampoContacto("telefono", "3813399463") === "", "Telefono local de 10 digitos valido");
ok(validarCampoContacto("telefono", "+54 9 381 339-9463") === "", "Telefono con +54 9, espacios y guion valido");
ok(validarCampoContacto("telefono", "") !== "", "Rechaza telefono vacio");
ok(validarCampoContacto("telefono", "381abc9463") !== "", "Rechaza letras en el telefono");
ok(validarCampoContacto("telefono", "1234567") !== "", "Rechaza telefono con menos de 8 digitos");
ok(validarCampoContacto("telefono", "1234567890123456") !== "", "Rechaza telefono con mas de 15 digitos");

console.log("\n[6] Validacion en tiempo real: Consultorio, Pacientes y Mensaje");
ok(validarCampoContacto("consultorio", "Nutricion clinica y deportiva") === "", "Consultorio valido");
ok(validarCampoContacto("consultorio", "12345") !== "", "Rechaza consultorio con solo numeros");
ok(validarCampoContacto("consultorio", "Ab") !== "", "Rechaza consultorio menor a 3 caracteres");

ok(validarCampoContacto("pacientes", "25") === "", "Cantidad de pacientes entera valida");
ok(validarCampoContacto("pacientes", "0") !== "", "Rechaza 0 pacientes");
ok(validarCampoContacto("pacientes", "25abc") !== "", "Rechaza letras en cantidad de pacientes");

ok(
  validarCampoContacto(
    "mensaje",
    "Quiero implementar NutriOliva para el seguimiento de mis pacientes."
  ) === "",
  "Mensaje descriptivo valido (>= 10 caracteres)"
);
ok(validarCampoContacto("mensaje", "Hola") !== "", "Rechaza mensaje menor a 10 caracteres");
ok(validarCampoContacto("mensaje", "123456789012") !== "", "Rechaza mensaje sin letras reales");

console.log(`\n====== RESULTADO VALIDATORS: ${pass} OK | ${fail} FALLAS ======\n`);
process.exit(fail ? 1 : 0);

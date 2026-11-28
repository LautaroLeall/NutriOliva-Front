// src/pages/Privacidad.jsx
// Politica de Privacidad, Seguridad de Datos Clinicos y Baja de Cuenta (Ley 25.326 Argentina,
// Google Play Data Safety y Apple App Store Guideline 5.1.1).

import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Camera,
  Trash2,
  Stethoscope,
  Mail,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import {
  ADMIN_EMAIL,
  ADMIN_TELEFONO_DISPLAY,
  ADMIN_WHATSAPP,
  buildWhatsAppUrl,
  getEmailLinkProps,
} from "@/utils/contactLinks";

const SECCIONES = [
  {
    icon: ShieldCheck,
    titulo: "1. Responsable del tratamiento y alcance",
    texto:
      "NutriOliva (desarrollado en San Miguel de Tucuman, Tucuman, Republica Argentina) provee una plataforma tecnologica de acompanamiento nutricional para profesionales en nutricion y sus pacientes a traves de su version Web, Web App instalable (PWA) y Aplicacion Movil. El tratamiento de datos personales se rige por la Ley N.º 25.326 de Proteccion de los Datos Personales de la Republica Argentina y estandares internacionales de privacidad en salud digital.",
  },
  {
    icon: Stethoscope,
    titulo: "2. Que informacion recopilamos y con que finalidad",
    items: [
      "Datos de cuenta e identificacion: nombre completo, correo electronico, telefono opcional y fecha de nacimiento, utilizados unicamente para autenticar tu acceso y vincular tu perfil con tu nutricionista tratante.",
      "Ficha clinica y antropometrica: peso, altura, IMC, porcentaje de grasa, masa muscular, perimetro de cintura, objetivos y observaciones clinicas cargadas por tu profesional a cargo.",
      "Seguimiento diario del paciente: registros de comidas, estimaciones caloricas, actividad fisica y fotografias opcionales de platos o entrenamientos compartidas con tu nutricionista.",
    ],
  },
  {
    icon: Camera,
    titulo: "3. Permisos de camara y galeria fotografica",
    texto:
      "El acceso a la camara o galeria de imagenes del dispositivo es 100% opcional y se activa exclusivamente cuando el paciente decide adjuntar una foto de su comida o actividad fisica. NutriOliva no accede a la camara en segundo plano, no utiliza microfono ni geolocalizacion, y las imagenes se comprimen de forma segura antes de guardarse en almacenamiento privado.",
  },
  {
    icon: Lock,
    titulo: "4. Seguridad, aislamiento multi-tenant y no comercializacion",
    items: [
      "Toda comunicacion viaja cifrada mediante HTTPS / TLS.",
      "La base de datos aplica politicas estrictas de seguridad a nivel de fila (Row Level Security): cada paciente accede unicamente a su propia informacion y solo su nutricionista asignado puede visualizar su evolucion.",
      "Las fotografias de comidas y actividades se almacenan en contenedores privados y solo pueden visualizarse mediante enlaces firmados temporales.",
      "NutriOliva NO vende, alquila ni cede datos personales o clinicos a terceros, brokers de datos ni redes publicitarias.",
    ],
  },
  {
    icon: Trash2,
    titulo: "5. Derechos ARCO y eliminacion definitiva de cuenta y datos",
    texto:
      "Como titular de tus datos podes ejercer en cualquier momento tus derechos de acceso, rectificacion, actualizacion y supresion total. Para solicitar la baja y eliminacion definitiva de tu cuenta de acceso y tus registros asociados podes hacerlo directamente desde la pestaña 'Mi cuenta -> Privacidad y baja de cuenta' dentro del panel del paciente, o enviando una solicitud desde tu correo registrado a nutriolivaa@gmail.com con el asunto 'Solicitud de eliminacion de cuenta'. Procesamos la eliminacion definitiva en un plazo maximo de 72 horas habiles.",
  },
];

export default function Privacidad() {
  const navigate = useNavigate();

  function handleVolver() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-[#EFEAE0] text-olive-dark flex flex-col">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-cream-darker px-5 py-3.5 pt-safe">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display font-bold text-base text-olive-dark"
          >
            <Logo size={22} />
            <span>NutriOliva</span>
          </Link>

          <button
            type="button"
            onClick={handleVolver}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cream-darker bg-cream/60 hover:bg-cream font-display font-medium text-xs text-olive-dark transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Volver</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 pb-safe space-y-5">
        <section className="bg-white rounded-2xl border border-cream-darker p-6 sm:p-8 shadow-card">
          <span className="inline-block font-display font-semibold text-[11px] uppercase tracking-wider bg-olive/10 text-olive px-3 py-1 rounded-full mb-3">
            Privacidad, Seguridad y Datos de Salud
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-olive-dark mb-2">
            Politica de Privacidad y Eliminacion de Datos
          </h1>
          <p className="text-xs sm:text-sm text-muted font-body leading-relaxed">
            Ultima actualizacion: Noviembre 2026 · Aplicable a NutriOliva Web,
            Web App (PWA) y Aplicacion Movil (Android e iOS).
          </p>
        </section>

        {SECCIONES.map((sec) => {
          const Icon = sec.icon;
          return (
            <section
              key={sec.titulo}
              className="bg-white rounded-2xl border border-cream-darker p-5 sm:p-6 shadow-card space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
                  <Icon size={17} />
                </div>
                <h2 className="font-display font-bold text-[15px] sm:text-base text-olive-dark">
                  {sec.titulo}
                </h2>
              </div>

              {sec.texto && (
                <p className="text-[13px] sm:text-sm text-olive-dark/90 leading-relaxed">
                  {sec.texto}
                </p>
              )}

              {sec.items && (
                <ul className="list-disc pl-5 space-y-1.5 text-[13px] sm:text-sm text-olive-dark/90 leading-relaxed">
                  {sec.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        <section className="bg-cream rounded-2xl border border-cream-darker p-5 sm:p-6 space-y-3">
          <h2 className="font-display font-bold text-sm text-olive-dark">
            Aviso sobre acompanamiento nutricional profesional
          </h2>
          <p className="text-xs sm:text-[13px] text-muted leading-relaxed">
            NutriOliva es una herramienta digital de organizacion y registro
            diario supervisada por tu profesional en nutricion. La informacion
            mostrada en la aplicacion no sustituye la consulta, el diagnostico
            ni la indicacion medica personalizada. Ante cualquier duda sobre tu
            salud, consulta siempre con tu nutricionista o medico tratante.
          </p>

          <div className="pt-2 border-t border-cream-darker flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-muted">
              Contacto oficial de privacidad:{" "}
              <strong className="text-olive-dark">{ADMIN_EMAIL}</strong> ·{" "}
              <span>{ADMIN_TELEFONO_DISPLAY}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                {...getEmailLinkProps(
                  ADMIN_EMAIL,
                  "Consulta de Privacidad / Datos Personales — NutriOliva",
                  "Hola equipo de NutriOliva, les escribo en relacion con mis datos personales en la plataforma:"
                )}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-olive text-cream font-display font-semibold text-xs hover:bg-olive-dark transition-colors"
              >
                <Mail size={13} />
                <span>Escribir a privacidad</span>
              </a>
              <a
                href={buildWhatsAppUrl(
                  ADMIN_WHATSAPP,
                  "Hola equipo de NutriOliva, tengo una consulta sobre privacidad o baja de cuenta."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-olive text-olive font-display font-semibold text-xs hover:bg-white transition-colors"
              >
                <span>Soporte WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

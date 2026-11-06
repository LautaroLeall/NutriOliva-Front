// TabSuscripcionCupo.jsx — Pestaña 2: Detalle de suscripcion, uso de cupo de pacientes y planes disponibles

import { motion } from "framer-motion";
import {
  Award,
  Users,
  CheckCircle2,
  MessageCircle,
  Mail,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  ADMIN_EMAIL,
  ADMIN_WHATSAPP,
  buildEmailUrl,
  buildWhatsAppUrl,
} from "@/utils/contactLinks";

const FUNCIONES_INCLUIDAS = [
  "Planes alimenticios versionados e importacion inteligente con IA",
  "Seguimiento diario en vivo de comidas y actividad fisica",
  "Ficha clinica, historial antropometrico e IMC evolutivo",
  "Catalogo nutricional SARA completo + alimentos propios ilimitados",
];

const PLAN_SUBTITLES = {
  starter: "Ideal para consultorios individuales en etapa inicial.",
  pro: "Pensado para profesionales con cartera activa en crecimiento.",
  clinic: "Sin limite de cupo para consultorios de alto volumen o clinicas.",
};

export default function TabSuscripcionCupo({
  nutriData,
  planActualKey,
  planActual,
  planesMap,
  cupoBase,
  cupoMaximo,
  esIlimitado,
  porcentajeCupo,
  stats,
}) {
  const disponibles = esIlimitado
    ? "Ilimitados"
    : Math.max(0, cupoMaximo - stats.pacientesActivos);

  return (
    <motion.div
      key="tab-suscripcion"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="space-y-5"
    >
      {/* Tarjeta superior: Estado del cupo de pacientes */}
      <div className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3.5 border-b border-cream">
          <div>
            <div className="flex items-center gap-2">
              <span className={`badge badge-${planActualKey}`}>
                Plan {planActual?.nombre || planActualKey.toUpperCase()}
              </span>
              {nutriData.cupo_extra > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-olive/12 text-olive font-display text-[10.5px] font-semibold">
                  +{nutriData.cupo_extra} cupos extra asignados
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-olive-dark text-[16px] mt-1.5">
              Capacidad y uso de cartera de pacientes
            </h3>
          </div>

          <div className="sm:text-right">
            <div className="font-display text-2xl font-bold text-olive-dark">
              {stats.pacientesActivos}{" "}
              <span className="text-sm font-normal text-muted">
                / {esIlimitado ? "Ilimitado" : `${cupoMaximo} activos`}
              </span>
            </div>
            <p className="text-[11px] font-display text-muted">
              Cupos libres disponibles:{" "}
              <strong className="text-olive-dark">{disponibles}</strong>
            </p>
          </div>
        </div>

        {/* Barra de ocupacion del cupo */}
        <div className="h-3 w-full rounded-full bg-cream overflow-hidden mb-2.5 border border-cream-darker/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${porcentajeCupo}%` }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className={`h-full rounded-full ${porcentajeCupo >= 90
              ? "bg-accent"
              : porcentajeCupo >= 75
                ? "bg-amber-500"
                : "bg-olive"
              }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#FAF8F3] border border-cream-darker flex items-center justify-between">
            <span className="text-[11px] font-display text-muted">
              Cupo base del plan
            </span>
            <span className="font-display font-bold text-[12.5px] text-olive-dark">
              {esIlimitado ? "Ilimitado" : `${cupoBase} pacientes`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F3] border border-cream-darker flex items-center justify-between">
            <span className="text-[11px] font-display text-muted">
              Ampliacion (Cupo extra)
            </span>
            <span className="font-display font-bold text-[12.5px] text-olive">
              +{nutriData.cupo_extra} pacientes
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F3] border border-cream-darker flex items-center justify-between">
            <span className="text-[11px] font-display text-muted">
              Pacientes inactivos (no ocupan cupo)
            </span>
            <span className="font-display font-bold text-[12.5px] text-olive-dark">
              {stats.pacientesInactivos}
            </span>
          </div>
        </div>
      </div>

      {/* Grilla comparativa de los 3 planes — diferencia exclusiva por cantidad de pacientes */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
          <h4 className="font-display font-bold text-[14px] text-olive-dark">
            Planes segun tamano de tu cartera
          </h4>
          <p className="text-[11.5px] text-muted">
            Todos los planes incluyen el 100% de las funciones de NutriOliva.
            Solo varia el cupo de pacientes activos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["starter", "pro", "clinic"].map((key, idx) => {
            const plan = planesMap[key] || { nombre: key, cupo_pacientes: 15 };
            const esActual = planActualKey === key;
            const ilimitado = Number(plan.cupo_pacientes) >= 9999;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${esActual
                  ? "bg-white border-2 border-olive shadow-card"
                  : "bg-white/90 border-cream-darker"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`badge badge-${key}`}>{plan.nombre}</span>
                    {esActual && (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-display font-semibold text-olive bg-olive/10 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck size={11} /> Plan actual
                      </span>
                    )}
                  </div>

                  <div className="py-2">
                    <div className="flex items-center gap-2 text-olive-dark">
                      <Users size={18} className="text-olive flex-shrink-0" />
                      <span className="font-display font-bold text-xl">
                        {ilimitado
                          ? "Pacientes ilimitados"
                          : `Hasta ${plan.cupo_pacientes} pacientes`}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted mt-1.5 leading-relaxed">
                      {PLAN_SUBTITLES[key]}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-cream flex items-center gap-2 text-[11.5px] text-olive-dark font-display">
                    <CheckCircle2
                      size={13}
                      className="text-olive flex-shrink-0"
                    />
                    <span>Todas las funciones de la plataforma incluidas</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-cream">
                  {esActual ? (
                    <div className="w-full py-2 rounded-xl bg-olive/10 text-olive font-display text-[11.5px] font-semibold text-center">
                      Tu suscripcion actual
                    </div>
                  ) : (
                    <a
                      href={buildWhatsAppUrl(
                        ADMIN_WHATSAPP,
                        `Hola! Quiero consultar para cambiar mi cuenta de NutriOliva al Plan ${plan.nombre}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-cream hover:bg-olive hover:text-cream text-olive-dark font-display text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Solicitar Plan {plan.nombre}</span>
                      <ExternalLink size={11} className="opacity-75" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bloque unificado de herramientas incluidas en todos los planes */}
        <div className="bg-white rounded-2xl border border-cream-darker p-4">
          <p className="text-[11px] font-display font-semibold text-olive-dark uppercase tracking-wide mb-2.5">
            Incluido en todos los planes (Starter, Pro y Clinic)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FUNCIONES_INCLUIDAS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[12px] text-olive-dark"
              >
                <CheckCircle2 size={13} className="text-olive flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner de contacto directo para ampliar cupo */}
      <div className="bg-white rounded-2xl border border-cream-darker p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
            <Award size={18} />
          </div>
          <div>
            <h4 className="font-display font-bold text-olive-dark text-[13.5px]">
              Necesitas ampliar tu cupo de pacientes o cambiar de plan?
            </h4>
            <p className="text-[11.5px] text-muted mt-0.5">
              Contacta directamente con administracion para habilitar cupos
              adicionales al instante en tu cuenta.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <a
            href={buildWhatsAppUrl(
              ADMIN_WHATSAPP,
              "Hola! Necesito ampliar el cupo de pacientes de mi cuenta en NutriOliva."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-olive text-cream hover:bg-olive-deep font-display text-[11.5px] font-semibold transition-colors"
          >
            <MessageCircle size={13} />
            <span>WhatsApp directo</span>
            <ExternalLink size={11} className="opacity-80" />
          </a>
          <a
            href={buildEmailUrl(
              ADMIN_EMAIL,
              "Ampliacion de plan o cupo - NutriOliva",
              "Hola! Quiero consultar para ampliar el cupo o cambiar el plan de mi cuenta de nutricionista en NutriOliva."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream hover:bg-cream-darker text-olive-dark font-display text-[11.5px] font-medium transition-colors"
          >
            <Mail size={13} />
            <span>Enviar email</span>
            <ExternalLink size={11} className="opacity-70" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export const TERAPIA_SLUG = "terapia-con-violeta";
export const TERAPIA_TIME_ZONE = "America/Mexico_City";
export const VIOLETA_WHATSAPP = "529612331769";

export type Modalidad = "presencial" | "virtual";
export type ModalidadSlot = Modalidad | "ambas";
export type EstadoCita = "pendiente" | "confirmada" | "cancelada" | "completada" | "no_asistio";
export type EstadoPago = "pendiente" | "pagado" | "cortesia";

export type HorarioDisponible = {
  disponibilidad_id: string;
  inicio: string;
  fin: string;
  modalidad: ModalidadSlot;
};

export type Disponibilidad = {
  id: string;
  cliente_id: string;
  inicio: string;
  fin: string;
  modalidad: ModalidadSlot;
  estado: "disponible" | "bloqueado";
  notas: string | null;
};

export type Cita = {
  id: string;
  cliente_id: string;
  disponibilidad_id: string | null;
  paciente_nombre: string;
  paciente_telefono: string;
  paciente_email: string | null;
  motivo_consulta: string | null;
  inicio: string;
  fin: string;
  modalidad: Modalidad;
  servicio: string;
  estado: EstadoCita;
  pago_estado: EstadoPago;
  enlace_videollamada: string | null;
  notas_internas: string | null;
  created_at: string;
  updated_at: string;
};

const dayFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: TERAPIA_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDayFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: TERAPIA_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: TERAPIA_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatDay(value: string | Date) {
  return sentenceCase(dayFormatter.format(new Date(value)));
}

export function formatShortDay(value: string | Date) {
  return sentenceCase(shortDayFormatter.format(new Date(value)));
}

export function formatTime(value: string | Date) {
  return timeFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return `${formatDay(value)} a las ${formatTime(value)}`;
}

export function localDateKey(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TERAPIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function toMexicoIso(date: string, time: string) {
  return new Date(`${date}T${time}:00-06:00`).toISOString();
}

export function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TERAPIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
}

export function fromDateTimeLocal(value: string) {
  return new Date(`${value}:00-06:00`).toISOString();
}

export function whatsappConfirmationUrl(cita: Cita) {
  const modalidad =
    cita.modalidad === "virtual"
      ? "en modalidad virtual"
      : "de manera presencial en el consultorio de San Juan Aquiahuac, San Andrés Cholula";
  const meet =
    cita.modalidad === "virtual" && cita.enlace_videollamada
      ? `\n\nEnlace para la sesión: ${cita.enlace_videollamada}`
      : "";
  const message = `Hola, ${cita.paciente_nombre}. Te confirmo tu cita con la Psic. Violeta Guillén para el ${formatDateTime(cita.inicio)}, ${modalidad}.${meet}\n\nSi necesitas hacer algún cambio, por favor avísame por este medio.`;
  const phone = cita.paciente_telefono.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

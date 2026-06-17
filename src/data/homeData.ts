// src/data/homeData.ts
// Datos de presentacion del home y enlaces externos, extraidos de App.tsx (Bloque 0).
// Centraliza la data para evitar duplicacion con la UI. Sin cambio de comportamiento.

export const externalLinks = {
  agenciaVirtual: "https://www.sat.gob.pe/websitev9/Servicios/AgenciaVirtual",
  mesaPartes: "https://www.sat.gob.pe/WebSiteV9/Tramites/MesaPartesDigital",
  citas: "https://www.sat.gob.pe/WebSiteV9/CanalesAtencion/CitasSAT",
  pagos: "https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/p/pagosenlinea",
};

export const routeLanes = [
  {
    id: "papeleta",
    title: "Papeleta",
    cue: "Consulta, descargos y pago de papeletas.",
    data: "Placa o N. de papeleta",
    next: "Ver descuentos y opciones de pago",
    path: "/papeletas-multas",
    icon: "shield",
    tone: "consultar",
    intentId: "intent-consultar-deuda",
  },
  {
    id: "vehiculo",
    title: "Vehiculo",
    cue: "Tramites, transferencias y consultas vehiculares.",
    data: "Placa",
    next: "Revisar deuda o declaracion",
    path: "/tributos",
    icon: "car",
    tone: "pagar",
    intentId: "intent-declarar",
  },
  {
    id: "predio",
    title: "Predio",
    cue: "Impuestos, arbitrios y consultas de predio.",
    data: "Codigo de predio",
    next: "Consultar o declarar",
    path: "/tributos",
    icon: "home",
    tone: "predio",
    intentId: "intent-consultar-deuda",
  },
  {
    id: "alcabala",
    title: "Alcabala",
    cue: "Compra de inmuebles y declaracion jurada.",
    data: "DNI / RUC",
    next: "Liquidar requisitos",
    path: "/tributos",
    icon: "file",
    tone: "alcabala",
    intentId: "intent-declarar",
  },
  {
    id: "fraccionamiento",
    title: "Fraccionar",
    cue: "Fracciona y regulariza tus deudas.",
    data: "Deuda pendiente",
    next: "Simular facilidad",
    path: "/fraccionamiento",
    icon: "rocket",
    tone: "fraccionar",
    intentId: "intent-fraccionar",
  },
  {
    id: "sede",
    title: "Sede",
    cue: "Atencion presencial, horarios y ubicacion.",
    data: "Distrito o sede",
    next: "Elegir canal",
    path: "/atencion-sedes",
    icon: "map",
    tone: "sedes",
    intentId: "intent-contactar",
  },
];

export const heroAccessItems = [
  { label: "Agencia Virtual", icon: "shield", href: externalLinks.agenciaVirtual },
  { label: "Mesa de Partes", icon: "form", href: externalLinks.mesaPartes },
  { label: "Citas", icon: "calendar", href: externalLinks.citas },
  { label: "Sedes y canales", icon: "map", path: "/atencion-sedes" },
];

export const urbanIndicators = [
  {
    title: "Plazos proximos",
    value: "3 obligaciones",
    copy: "vencen pronto",
    action: "Ver calendario",
    icon: "clock",
    tone: "consultar",
  },
  {
    title: "Ahorra tiempo",
    value: "Paga en linea",
    copy: "y evita colas",
    action: "Ir a pagar",
    icon: "wallet",
    tone: "pagar",
  },
  {
    title: "Evita recargos",
    value: "Manten tus pagos",
    copy: "al dia",
    action: "Mas informacion",
    icon: "calendarDays",
    tone: "alcabala",
  },
  {
    title: "Canales oficiales",
    value: "Sedes, telefonicos",
    copy: "y digitales",
    action: "Ver canales",
    icon: "map",
    tone: "sedes",
  },
];

export const benefitItems = [
  { title: "Mas claro", copy: "Encontrar lo que necesitas en menos pasos.", icon: "heart" },
  { title: "Mas rapido", copy: "Rutas guiadas que te llevan directo.", icon: "workflow" },
  { title: "Mas humano", copy: "Un copiloto que te acompana siempre.", icon: "assistant" },
  { title: "Mas confiable", copy: "Informacion oficial, directa y actualizada.", icon: "badge" },
];

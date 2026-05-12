export type Channel =
  | "online"
  | "phone"
  | "whatsapp"
  | "email"
  | "inPerson"
  | "kiosk";

export type ServiceCategory =
  | "consultas-pagos"
  | "tributos"
  | "papeletas-multas"
  | "tramites-digitales"
  | "fraccionamiento"
  | "atencion"
  | "institucion";

export type ProcedureCategory =
  | "declaracion"
  | "pago"
  | "consulta"
  | "fraccionamiento"
  | "reclamo"
  | "seguimiento"
  | "atencion";

export type OfficeType = "agency" | "mainOffice" | "macCenter" | "deposit";

export type SourceLink = {
  id: string;
  label: string;
  url: string;
  category:
    | "portal"
    | "tributos"
    | "tramites"
    | "consultas-pagos"
    | "atencion-sedes"
    | "institucion"
    | "programas";
  note?: string;
};

export type PaymentTab = {
  id: string;
  label: string;
  prompt: string;
  example: string;
  helper: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  description: string;
  sourceIds?: string[];
};

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  category: ServiceCategory;
  icon: string;
  href?: string;
  inputHint?: string;
  sourceIds: string[];
};

export type ServiceItem = {
  id: string;
  title: string;
  summary: string;
  category: ServiceCategory;
  channels: Channel[];
  href?: string;
  availability?: string;
  keywords: string[];
  relatedProcedureIds?: string[];
  sourceIds: string[];
};

export type Procedure = {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: ProcedureCategory;
  audience: string;
  channel: string;
  channels: Channel[];
  requirements: string[];
  steps: string[];
  cost: string;
  timeframe: string;
  requiresAppointment: boolean;
  source: SourceLink;
  relatedServiceIds?: string[];
  sourceIds: string[];
};

export type OfficeLocation = {
  id: string;
  name: string;
  type: OfficeType;
  district: string;
  address: string;
  hours: string;
  schedule: string;
  notes?: string;
  services: string[];
  paymentMethods?: string[];
  sourceIds: string[];
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  topic: ServiceCategory;
  relatedProcedureIds?: string[];
  sourceIds: string[];
};

export type AssistantIntent = {
  id: string;
  label: string;
  userGoal: string;
  patterns: string[];
  response: string;
  quickActionIds?: string[];
  relatedProcedureIds?: string[];
  sourceIds: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  intentId?: string;
  quickActions?: QuickAction[];
};

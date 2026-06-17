// Mapa central de iconos por clave semantica. Centraliza el uso de
// lucide-react: la data referencia iconos por string ("car", "pay", ...) y la
// UI los resuelve aqui con un tamaño uniforme. Fallback a flecha si no existe.

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  CalendarDays,
  Car,
  CircleDollarSign,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  Heart,
  Landmark,
  MapPin,
  PanelRight,
  Rocket,
  Shield,
  ShieldCheck,
  Smartphone,
  ThumbsUp,
  Wallet,
  Workflow,
} from "lucide-react";

export function iconFor(icon: string) {
  const icons = {
    badge: <BadgeCheck size={22} />,
    pay: <CircleDollarSign size={22} />,
    car: <Car size={22} />,
    building: <Building2 size={22} />,
    calendar: <CalendarClock size={22} />,
    calendarDays: <CalendarDays size={22} />,
    clock: <Clock size={22} />,
    card: <CreditCard size={22} />,
    shield: <ShieldCheck size={22} />,
    shieldSimple: <Shield size={22} />,
    phone: <Smartphone size={22} />,
    map: <MapPin size={22} />,
    form: <ClipboardList size={22} />,
    file: <FileText size={22} />,
    heart: <Heart size={22} />,
    home: <Building2 size={22} />,
    institution: <Landmark size={22} />,
    assistant: <PanelRight size={22} />,
    bot: <PanelRight size={22} />,
    rocket: <Rocket size={22} />,
    thumbs: <ThumbsUp size={22} />,
    wallet: <Wallet size={22} />,
    workflow: <Workflow size={22} />,
  };

  return icons[icon as keyof typeof icons] ?? <ArrowRight size={22} />;
}

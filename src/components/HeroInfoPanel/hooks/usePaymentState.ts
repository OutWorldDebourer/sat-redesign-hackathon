// Estado del simulador de pago del HeroInfoPanel: maquina idle -> form ->
// processing -> success, datos de tarjeta saneados y numero de operacion. Se
// reinicia cuando cambia el resultado de la consulta. La autorizacion se delega
// a paymentService (demo, sin cargo real).

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { MockResultData } from "../../../services/satApi";
import { submitPayment } from "../../../services/paymentService";

export type PayState = "idle" | "form" | "processing" | "success";

export function usePaymentState({
  result,
  noResult,
}: {
  result: MockResultData | null;
  noResult: boolean;
}) {
  const [payState, setPayState] = useState<PayState>("idle");
  const [cardNum, setCardNum] = useState("");
  const [cvv, setCvv] = useState("");
  const [opNum] = useState(() => `OP-SAT-${Date.now().toString().slice(-8)}`);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Reiniciar el flujo de pago cuando llega un nuevo resultado de consulta.
  useEffect(() => {
    setPayState("idle");
    setCardNum("");
    setCvv("");
  }, [result, noResult]);

  /** Formatea el numero de tarjeta en grupos de 4 (max 16 digitos). */
  const updateCard = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    setCardNum(digits.replace(/(.{4})/g, "$1 ").trim());
  };

  /** Mantiene solo los 3 digitos del CVV. */
  const updateCvv = (raw: string) => {
    setCvv(raw.replace(/\D/g, "").slice(0, 3));
  };

  const startPayment = () => setPayState("form");
  const cancelPayment = () => setPayState("idle");

  const confirmPayment = (event: FormEvent) => {
    event.preventDefault();
    setPayState("processing");
    submitPayment().then(() => {
      if (mounted.current) setPayState("success");
    });
  };

  return {
    payState,
    cardNum,
    cvv,
    opNum,
    updateCard,
    updateCvv,
    startPayment,
    cancelPayment,
    confirmPayment,
  };
}

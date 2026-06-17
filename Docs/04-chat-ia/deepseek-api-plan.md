# Plan de integracion DeepSeek

Plan tecnico para conectar el chat fijo del SAT a la API de DeepSeek: modelo, parametros, costos, resiliencia y seguridad de la clave. Sin claves reales.

## Modelo recomendado

- Modelo: `deepseek-v4-flash`
- Justificacion:
  - El mas rapido y costo-efectivo de la familia V4 (equivalente "flash").
  - Soporta hasta ~2,500 solicitudes concurrentes (vs ~500 de `deepseek-v4-pro`), critico para asistencia ciudadana de alto volumen.
  - V4 trae el modo thinking activado por defecto; el chat lo DESACTIVA explicitamente (`reasoning_effort` bajo/nulo) para minima latencia, y lo activa solo en casos puntuales sin cambiar de modelo.
  - Ventana de contexto 1M tokens: cubre historial largo y contexto normativo.
  - Precio de cache hit muy bajo: clave para amortizar el system prompt y el catalogo de tramites repetidos.
- Escalamiento opcional: `deepseek-v4-pro` solo para casos minoritarios de razonamiento juridico-tributario profundo (NO para el grueso por costo ~3x y menor concurrencia).
- NO usar los alias legacy `deepseek-chat` ni `deepseek-reasoner`: se deprecan el 2026-07-24 15:59 UTC. Configurar el identificador oficial `deepseek-v4-flash` desde ahora.

## Credenciales y base URL

- Clave: leer SIEMPRE de la variable de entorno `DEEPSEEK_API_KEY`. Nunca hardcodear ni loguear la clave (real ni de ejemplo). Usar gestor de secretos en produccion.
- Header de autenticacion: `Authorization: Bearer $DEEPSEEK_API_KEY`.
- Base URL: `https://api.deepseek.com` (o `https://api.deepseek.com/v1` para clientes que esperan sufijo `/v1`; el `/v1` es solo compatibilidad OpenAI, no version del modelo).
- Obtencion de la clave: plataforma DeepSeek (https://platform.deepseek.com). No incluir su valor en este repo.

## Compatibilidad OpenAI

- La API es compatible con OpenAI (ChatCompletions). Se reutiliza el SDK de OpenAI cambiando solo `base_url` y `api_key`.
- Streaming soportado con `stream=true`.
- Function calling / tool calling soportado via `tools` (formato OpenAI). Strict Mode en beta (endpoint beta) para cumplimiento estricto de JSON schema.

### Ejemplo de configuracion (sin clave; clave desde entorno)

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],  # nunca hardcodear
    base_url="https://api.deepseek.com",
)

resp = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT_SAT},  # ver intenciones-y-prompts
        {"role": "user", "content": user_text},
    ],
    temperature=0.2,
    max_tokens=800,
    stream=True,
    tools=SAT_TOOLS,  # consultar deuda, calcular alcabala, dias habiles, etc.
)
```

## Parametros recomendados

| Parametro | Valor sugerido | Razon |
|---|---|---|
| `model` | `deepseek-v4-flash` | Velocidad + costo + concurrencia |
| `temperature` | 0.1 - 0.3 | Respuestas deterministas y precisas en materia tributaria; evita creatividad indeseada |
| `max_tokens` | 600 - 1000 | Respuestas breves y accionables; controla costo de salida |
| `stream` | `true` | Percepcion de rapidez en el chat fijo |
| `reasoning_effort` | bajo/nulo por defecto | Forzar modo non-thinking para minima latencia/costo; subir solo en casos complejos |
| `tools` | definidas | Function calling para consultar deuda, calcular, contar dias habiles, verificar canal oficial |
| `top_p` | 0.9 (default) | No alterar salvo necesidad |

Notas:
- Aprovechar prompt caching: mantener estable el system prompt y el catalogo de tramites para maximizar cache hits.
- Inyectar montos/plazos/UIT desde la fuente unica versionada (no en el system prompt) para no romper el cache cuando cambian cifras y para no hardcodear.

## Costos estimados (USD, revisar antes de cada ciclo)

Precios vigentes verificados (sujetos a cambio; confirmar en la doc oficial de pricing):

| Concepto | `deepseek-v4-flash` | `deepseek-v4-pro` |
|---|---|---|
| Input cache hit (1M tokens) | $0.0028 | $0.003625 |
| Input cache miss (1M tokens) | $0.14 | $0.435 |
| Output (1M tokens) | $0.28 | $0.87 |

- Estrategia de costo: cache hit es ~50x mas barato que cache miss en flash; el system prompt + catalogo de tramites deben servirse cacheados.
- `deepseek-v4-pro` cuesta ~3x en input miss y output; reservar a casos minoritarios.
- Pendiente de verificacion: descuentos off-peak (no observados en la doc actual) y limites/cuotas por plan.

## Resiliencia (timeout / retry / fallback)

- Timeout: definir timeout explicito en TODA llamada (sugerido 15-30 s para no-thinking; mayor si se activa thinking). Nunca llamadas sin timeout.
- Retry: reintentos con backoff exponencial (p.ej. 3 intentos, jitter) ante 429/5xx/timeout. Idempotencia por turno.
- Circuit breaker: ante fallos sostenidos del proveedor, abrir el circuito y degradar.
- Fallback / degradacion graciosa: si DeepSeek no responde, el chat NO deja al usuario sin salida:
  - Mensaje de error claro ("Ahora no puedo responder; mientras tanto puedes consultar aqui:").
  - Enlaces oficiales directos segun la intencion detectada por reglas locales (sin LLM): consulta de papeletas, pago en linea, Mesa de Partes, Agencia Virtual.
  - Boton "Hablar con un asesor".
- Estados de UI asociados (carga/error): ver [propuesta-chat-fijo.md](propuesta-chat-fijo.md).

## Rate limiting y concurrencia

- Limites del lado SAT: rate limit por usuario, por IP y global (responder 429 con `Retry-After` cuando se excede).
- Limite del proveedor: vigilar concurrencia (~2,500 en flash); encolar y aplicar backpressure si se aproxima al techo.
- Colas asincronas para picos (p.ej. campanas de vencimiento del 27-feb): consumidores idempotentes con backoff.
- Observabilidad: logging estructurado con correlation IDs, metricas de latencia/error/throughput en la ruta critica. No registrar PII ni la clave.

## Seguridad y cumplimiento

- DeepSeek tiene infraestructura en China; para datos de ciudadanos peruanos (tributarios/PII) evaluar cumplimiento de la Ley 29733: minimizar y anonimizar PII antes de enviar, revisar retencion del proveedor, y no enviar datos economicos individuales sin necesidad.
- No incrustar la API key en codigo, repos, logs ni en el system prompt.
- Detalle de minimizacion de PII, escalamiento y retencion: ver [seguridad-privacidad-y-limites.md](seguridad-privacidad-y-limites.md).

## Fuentes (verificadas 2026-06-17)

- DeepSeek API Docs — base URL, auth, compatibilidad OpenAI.
- DeepSeek API Docs — Models & Pricing.
- DeepSeek API Docs — V4 Preview (contexto 1M, mapeo legacy, deprecacion 2026-07-24).
- DeepSeek API Docs — Function Calling.

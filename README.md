# SAT Lima Redesign Hackathon

Prototipo frontend para reestructurar la experiencia informativa del SAT Lima con React, Vite y TypeScript, con un asistente SAT persistente (chat fijo) como propuesta de valor central.

Producción: https://sat-redesign-hackathon.vercel.app

## Objetivo

Crear una web civica, clara y accionable para orientar a ciudadanos en consultas, pagos, papeletas, tributos, fraccionamiento, sedes y tramites digitales.

## Scripts

```bash
npm install
npm run dev         # servidor de desarrollo (Vite)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest
npm run build       # tsc --noEmit && vite build
```

## Stack

- React 19 + Vite 7 + TypeScript
- React Router 7
- Lucide React
- CSS plano modular en capas (`src/styles/`), 100% OKLCH con tema claro/oscuro
- Funcion serverless Edge en Vercel (`api/chat.ts`) para el chat IA

## Chat IA (DeepSeek) — variables de entorno y blocker externo

El chat fijo funciona en dos modos:

- **Fallback canned (por defecto):** sin configurar la clave, el chat responde con orientacion guiada local (sin LLM) y el endpoint `POST /api/chat` devuelve `503 { "error": "chat_unavailable", "reason": "missing_api_key" }`. La app sigue 100% usable y el chat permanece visible/funcional.
- **Chat IA real (DeepSeek):** requiere provisionar credenciales en el entorno del servidor.

### Variables de entorno

**Solo servidor** (Vercel → Project → Settings → Environment Variables; NUNCA con prefijo `VITE_`, nunca commiteadas, nunca en logs):

| Variable | Obligatoria | Default | Descripcion |
|---|---|---|---|
| `DEEPSEEK_API_KEY` | Sí (para chat real) | — | Clave de la API de DeepSeek. La lee solo `api/chat.ts`; nunca llega al cliente. |
| `DEEPSEEK_MODEL_FAST` | No | `deepseek-v4-flash` | Modelo del modo normal (rápido, `reasoning_effort` bajo). |
| `DEEPSEEK_MODEL_THINK` | No | `deepseek-v4-flash` | Modelo del "modo pensar" (`reasoning_effort` alto; puede ser `deepseek-v4-pro`). |
| `DEEPSEEK_MODEL` | No | `deepseek-v4-flash` | Fallback legacy si no se definen FAST/THINK. |
| `DEEPSEEK_BASE_URL` | No | `https://api.deepseek.com` | Base URL del proveedor (se exige `https://`). |

> **Modo pensar:** el chat envía `mode: "normal" | "think"` a `/api/chat`. En `think` usa `DEEPSEEK_MODEL_THINK` con `reasoning_effort: "high"` (consultas complejas se auto-escalan); en `normal`, `DEEPSEEK_MODEL_FAST` con `reasoning_effort: "low"`. El razonamiento interno no se muestra al usuario. La base de conocimiento del chat se compila desde `src/data/satData.ts` (ver `src/data/satKnowledgeBase.ts`).

**Cliente** (prefijo `VITE_`, ver `.env.example`):

| Variable | Default | Descripcion |
|---|---|---|
| `VITE_CHAT_ENABLED` | (intenta) | Por defecto el cliente intenta `/api/chat` y degrada a canned si falla; `"false"` fuerza solo-canned. |
| `VITE_API_MODE` | `mock` | Origen de datos del adapter (`mock` / `real`). |
| `VITE_API_BASE_URL` | (vacío) | Base del backend; vacío = mismo origen (`/api`). |

> Seguridad: la clave vive solo server-side; el proxy nunca la reenvia en cuerpos, headers ni logs. No imprimas ni compartas su valor. No se pide la clave por chat, correo ni este repo.

### Activar el chat real y redeploy (Vercel)

1. En Vercel → Project `sat-redesign-hackathon` → Settings → Environment Variables: agregar `DEEPSEEK_API_KEY` (Production) y, opcionalmente, `DEEPSEEK_MODEL_FAST` / `DEEPSEEK_MODEL_THINK` / `DEEPSEEK_BASE_URL`.
2. Redeploy: `vercel --prod` (o un push a la rama conectada). No requiere `VITE_CHAT_ENABLED`: el cliente ya intenta el backend por defecto.
3. Verificar: `POST /api/chat` ya no devuelve `missing_api_key` y el chat responde en streaming (normal o modo pensar).

**Blocker actual:** mientras `DEEPSEEK_API_KEY` no este provisionada, el chat IA real queda inhabilitado y opera en fallback canned seguro. Es la unica dependencia externa pendiente del proyecto.

## Documentacion

- `Docs/` — investigacion (Fase 1), auditoria y plan de rediseno (Fase 2), incluido `Docs/04-chat-ia/` y `Docs/07-plan-redisenio-web/`.
- READMEs por carpeta en `src/` (indices AI-optimizados).

# Metodologia de investigacion

Alcance, metodo, criterios de confianza, limites y fecha de corte de la investigacion que sustenta el rediseno de la web del SAT de Lima con chat fijo.

## Fecha de corte

- Fecha de corte de la investigacion: 2026-06-17.
- Toda cifra, tasa, plazo, horario y vencimiento refleja la informacion disponible a esa fecha y debe revalidarse antes del lanzamiento (cartillas y normas cambian por anio fiscal).

## Alcance

- Objeto: SAT de Lima (organismo publico descentralizado de la Municipalidad Metropolitana de Lima), su catalogo de servicios y la experiencia ciudadana.
- Foco: rediseno de la web orientado a un chat fijo siempre visible que guia, ensenia, explica, deriva y pre-llena formularios.
- Materias cubiertas: predial y arbitrios (solo Cercado de Lima), impuesto vehicular, alcabala, juegos y espectaculos, papeletas e infracciones de transito, multas administrativas; mas transversales: consultas, pagos, Agencia Virtual, Mesa de Partes, fraccionamiento, reclamos/recursos, canales de atencion, perfiles ciudadanos y marco legal/privacidad.
- Proveedor LLM evaluado para el chat: DeepSeek (modelo recomendado `deepseek-v4-flash`).
- Fuera de alcance: implementacion de backend autenticado del SAT (no auditable externamente), integraciones con SUNARP/Tribunal Fiscal, y tarifas unitarias internas de ordenanzas no publicadas en texto legible.

## Como se investigo

1. Corpus local prioritario: punto de partida con el inventario institucional, materias, tramites, canales y casos UX ya documentados. Es la fuente base, pero NO se toma como verdad de cifras sin verificacion.
2. Verificacion online: cada cifra, plazo y tasa se contrasta contra fuentes oficiales (SAT, MEF, normas en El Peruano/SUNAT) y, en su defecto, prensa o terceros, registrando la URL.
3. Jerarquia de fuentes aplicada: fuente primaria SAT > norma legal/MEF > prensa nacional > tercero/agregador. Ver [fuentes-oficiales.md](fuentes-oficiales.md).
4. Separacion de HECHOS y SUPUESTOS: los hechos se citan con fuente; los supuestos se prefijan "Supuesto:" y los datos no confirmados se marcan "Pendiente de verificacion:".
5. Identificacion de fricciones UX y oportunidades de chat por materia y por perfil ciudadano, derivadas de las fuentes y de la arquitectura actual del portal.
6. Consolidacion de riesgos transversales (cifras volatiles, fragmentacion de dominios, confusiones recurrentes, privacidad/accesibilidad) en [supuestos-y-riesgos.md](supuestos-y-riesgos.md).

## Criterios de confianza

Cada hallazgo se etiqueta con un nivel:

| Nivel | Definicion | Uso permitido |
|---|---|---|
| `verified` | Confirmado en fuente primaria oficial (SAT, MEF, norma) o por doble fuente concordante | Publicable; el chat puede mostrarlo (siempre como estimacion orientativa si es monto) |
| `partial` | Confirmado parcialmente, por prensa o tercero; falta confirmacion en fuente primaria | Publicable con etiqueta de fecha/fuente y advertencia; revalidar |
| `unverified` | Solo indicio, tercero no oficial o inferencia (marcada INFERIDO) | NO publicar como dato firme; pasa a pendientes de verificacion |

Reglas:
- Ninguna cifra se presenta como fija si es temporal (campanas de descuento) o anual (UIT, tramos, tarifas de arbitrios, tabla MEF vehicular).
- Toda cifra se muestra con su anio de referencia y se lee de una fuente unica versionada, nunca hardcodeada en texto.
- Cuando dos fuentes discrepan (p.ej. plazo de DJ vehicular), se registra la discrepancia como pendiente y el chat lee el dato verificado, no lo fija.

## Cifras ancla verificadas (2026)

- UIT 2026 = S/ 5,500 (DS 301-2025-EF). UIT 2025 = S/ 5,350 (referencia comparativa).
- Alcabala: 3% sobre el exceso de 10 UIT; tramo inafecto 2026 = S/ 55,000.
- Vehicular: 1% de la base; minimo 1.5% UIT = S/ 82.50 en 2026; afecto 3 anios.
- Predial: alicuotas 0.2% / 0.6% / 1% por tramos (15 UIT y 60 UIT); minimo 0.6% UIT = S/ 33.
- Deduccion pensionista/adulto mayor: 50 UIT = S/ 275,000 (solo predial, no arbitrios).
- Estas cifras son ancla, pero igual deben leerse de fuente parametrizada por anio.

## Limites del metodo

- Acceso automatizado bloqueado: varias paginas oficiales del SAT (informacion, FAQ, vencimientos, canales) cerraron la conexion o devolvieron HTTP 418/403 durante el fetch. Su contenido textual exacto (URLs, horarios, tablas) debe validarse manualmente. Estos datos quedan en `partial`.
- Servicios autenticados no auditables: los flujos tras login (Agencia Virtual, liquidaciones, fraccionamiento) no se pueden previsualizar externamente; su UX real es desconocida.
- Tarifas unitarias no extraidas: las tarifas de arbitrios por categoria de predio viven en el PDF de la Ordenanza 2793 y no se extrajeron cifra por cifra.
- Reglamentos no fetchables: el Reglamento de Fraccionamiento (RJ 001-004-00004807) no se pudo descargar; los umbrales en %UIT (minimo de deuda, garantia) quedan como pendientes.
- Tablas de terceros: el mapeo codigo M -> %UIT -> soles de papeletas proviene de agregadores no oficiales; requiere verificacion contra el Reglamento Nacional de Transito (MTC/ATU/SUTRAN) y la legislacion del SAT.
- Datos de campanas: los descuentos extraordinarios (papeletas y multas administrativas) son temporales y por ordenanza; sus porcentajes y vigencias cambian y no deben presentarse como permanentes.
- Volatilidad anual: horarios, numeros de contacto, direcciones de sedes y depositos cambian por cartilla anual; el corpus y gob.pe discrepan en numeros de WhatSAT y horarios.
- Demografia inferida: las estadisticas de perfiles ciudadanos (cuantos adultos mayores, cuantos conductores en coactiva) son inferencias, no datos abiertos del SAT.

## Implicancias para el rediseno y el chat

- Fuente unica versionada: toda cifra (UIT, tramos, tasas, vencimientos, tablas) se centraliza en un origen parametrizado por anio fiscal; el chat la lee, no la hardcodea.
- El chat marca todo monto como estimacion orientativa y deriva a la liquidacion oficial autenticada; no emite actos con efectos juridicos.
- Los datos `partial`/`unverified` no se presentan como definitivos; el chat advierte o deriva a canal humano.
- Detalle consolidado de pendientes: ver [supuestos-y-riesgos.md](supuestos-y-riesgos.md).

## Trazabilidad

- Cada documento de la investigacion lista sus fuentes con URL.
- Las discrepancias entre fuentes se documentan explicitamente en lugar de elegir una arbitrariamente.
- El indice maestro de fuentes y dominios oficiales esta en [fuentes-oficiales.md](fuentes-oficiales.md).

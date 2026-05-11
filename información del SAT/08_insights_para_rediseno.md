# 08. Insights para rediseño

## Diagnostico general

El SAT tiene mucha informacion util, pero el contenido esta distribuido entre paginas informativas, sistemas antiguos, PDFs, noticias y aplicaciones externas. Para el ciudadano, la dificultad principal no es la falta de informacion, sino encontrar el camino correcto para completar una tarea.

## Problemas principales detectados

- La portada mezcla informacion institucional, banners, noticias, consultas, pagos y servicios.
- Hay saltos frecuentes entre `Websitev9`, `WebsiteV8`, `VirtualSAT`, `app.sat.gob.pe` y `transparenciav3`.
- Los accesos criticos no siempre explican que pasara despues de hacer clic.
- Las paginas de tributos explican conceptos, pero no siempre separan claramente acciones.
- Algunos servicios importantes aparecen en noticias, no como paginas permanentes.
- Las sedes no estan suficientemente conectadas con los tramites que atienden.
- Falta un lenguaje unico para deuda tributaria, deuda no tributaria, papeletas, multas, expedientes y fraccionamiento.

## Necesidades ciudadanas prioritarias

### Consultar

- Ver deuda por placa.
- Ver deuda por DNI/RUC.
- Ver papeletas.
- Ver estado de expediente.
- Ver estado de solicitud o tramite.

### Pagar

- Pagar predial y arbitrios.
- Pagar impuesto vehicular.
- Pagar alcabala.
- Pagar papeletas.
- Pagar multas administrativas.

### Declarar

- Declarar predio.
- Declarar vehiculo.
- Liquidar alcabala.

### Regularizar

- Fraccionar deuda.
- Solicitar facilidades de pago.
- Registrar papeleta fisica.
- Actualizar datos.

### Reclamar o impugnar

- Presentar descargo.
- Presentar recurso.
- Presentar reclamo por servicio.
- Solicitar devolucion o compensacion.
- Denunciar corrupcion.

### Contactar

- Elegir canal segun tema.
- Solicitar cita.
- Ubicar agencia.
- Usar Mesa de Partes Digital.

## Arquitectura sugerida

### Nivel 1

- Inicio.
- Consultar y pagar.
- Tributos.
- Papeletas y multas.
- Tramites.
- Fraccionamiento.
- Atencion y sedes.
- Institucion.

### Nivel 2 por tarea

Para cada materia, repetir el mismo patron:

- Informacion.
- Consultar deuda.
- Pagar.
- Declarar o registrar.
- Fraccionar.
- Reclamar o impugnar.
- Preguntas frecuentes.

## Componentes recomendados

- Buscador universal de deuda y pagos.
- Selector de perfil: vecino del Cercado, propietario vehicular, comprador de inmueble, empresa, conductor, usuario con multa.
- Fichas de tramite con requisitos, costo, plazo, canal, documentos y seguimiento.
- Simulador o asistente de descuentos para papeletas.
- Simulador de fraccionamiento.
- Calendario de vencimientos.
- Mapa de sedes con filtros.
- Estado de canales: abierto, cerrado, horario y alternativa.
- Centro de ayuda por temas.
- Alertas para campañas, vencimientos y beneficios.

## Rediseño de la portada

Prioridad visual recomendada:

1. Caja principal para consultar o pagar.
2. Accesos a Agencia Virtual, Mesa de Partes y Citas.
3. Rutas por necesidad: tributos, papeletas, multas, fraccionamiento.
4. Alertas importantes: vencimientos, beneficios, comunicados.
5. Canales de atencion y sedes.
6. Noticias y contenido institucional.

## Tono de contenido recomendado

- Directo y orientado a accion.
- Evitar nombres internos cuando el usuario necesita resolver una tarea.
- Usar verbos: consulta, paga, declara, fracciona, reclama, agenda, ubica.
- Mostrar requisitos antes de enviar al usuario a un sistema.
- Explicar diferencias entre canales digitales, presenciales y telefonicos.

## Riesgos a controlar

- Enlaces heredados que fallen o redirijan con errores.
- Informacion de horarios que pueda cambiar.
- PDFs o cartillas con informacion anual.
- Servicios que dependen de autenticacion y no pueden auditarse totalmente desde navegacion publica.
- Duplicidad entre secciones `CanalesAtencion` y `Contactenos`.


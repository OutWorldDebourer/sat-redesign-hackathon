# 02. Arquitectura actual del sitio

## Entrada principal

Portal base:

- https://www.sat.gob.pe/Websitev9

La pagina principal concentra accesos institucionales, menus, banners, servicios rapidos, noticias, comunicados, consultas y pagos. Tambien contiene enlaces a sistemas heredados y subdominios transaccionales.

## Navegacion principal detectada

El sitio actual agrupa informacion en:

- Sobre el SAT.
- Tributos y multas.
- Tramites.
- Servicios.
- Programas.
- Contactenos.
- Preguntas frecuentes.
- Noticias.
- Comunicados.
- Videos instructivos.
- Transparencia.
- Datos abiertos.

## Accesos transaccionales principales

Accesos detectados desde la portada o menus:

- Consulta de papeletas por placa.
- Consulta de impuesto vehicular por placa.
- Consulta de tributos por DNI/RUC.
- Mas consultas y pagos.
- Pagos en linea.
- Agencia Virtual SAT.
- Mesa de Partes Digital.
- Registro de papeleta.
- Pitazo preventivo.
- Libro de reclamaciones.
- Denuncia de actos de corrupcion.

## Sistemas y dominios mezclados

El ecosistema digital actual combina varias bases:

- `Websitev9`: portal informativo principal.
- `WebsiteV8`: modulos heredados de tramites, consultas y atencion.
- `VirtualSAT`: servicios transaccionales antiguos o especializados.
- `app.sat.gob.pe`: Agencia Virtual y servicios modernos de acceso.
- `transparenciav3`: transparencia, acceso a informacion, planeamiento y documentos institucionales.

## Hallazgos de organizacion

- La informacion de alto valor esta dispersa entre paginas informativas, noticias, PDFs, modulos heredados y aplicaciones externas.
- El usuario debe saltar entre estilos, dominios y rutas para completar una tarea.
- Hay servicios criticos presentados como enlaces sueltos, por ejemplo pago en linea, registro de papeleta, mesa de partes o fraccionamiento.
- Algunas explicaciones importantes estan dentro de noticias, no en paginas permanentes.
- "Tramites", "Servicios", "Consultas" y "Pagos" se superponen.
- Falta una arquitectura por intencion del usuario: quiero pagar, quiero consultar, quiero declarar, quiero reclamar, quiero pedir ayuda.

## Propuesta de agrupacion para rediseño

Agrupacion sugerida de primer nivel:

- Pagar y consultar.
- Tributos.
- Papeletas y multas.
- Tramites digitales.
- Fraccionamiento y deuda.
- Atencion y sedes.
- Institucion y transparencia.

Accesos persistentes recomendados:

- Pagar.
- Consultar deuda.
- Agencia Virtual.
- Mesa de Partes.
- Contactar al SAT.


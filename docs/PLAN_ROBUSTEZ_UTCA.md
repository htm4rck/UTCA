# Plan Integral de Robustez — Plataforma UTCA

## 1) Diagnóstico actual (estado del proyecto)

### Fortalezas
- Base funcional end-to-end: API NestJS + UI Angular + seed académico inicial.
- Estructura clara por módulos (`carrera`, `curso`, `semana`, `nota`, `ejercicio`, `report`).
- Malla de 6 ciclos ya modelada y lista para expandirse a más carreras.
- Flujo de aprendizaje ya usable: malla → curso → semana → notas/ejercicios.

### Riesgos y brechas que limitan escalabilidad
1. **Sin autenticación/autorización**: cualquier cliente puede crear/editar notas y ejercicios.
2. **Sin roles académicos**: no hay separación Alumno / Docente / Admin.
3. **Validación de datos insuficiente**: se usan `Partial<Entity>` directamente en controllers.
4. **`synchronize: true` en producción es riesgoso**: puede causar cambios no controlados en esquema.
5. **Sin observabilidad robusta**: faltan métricas, trazas, correlación de logs y alertas.
6. **Sin versionado de sílabos/contenido**: riesgo de inconsistencia al publicar información académica.
7. **UX centrada en exploración, no en progreso del alumno**: falta “ruta de estudio” y seguimiento personal.
8. **Seed monolítico inicial**: crecer a múltiples carreras requiere gobernanza de catálogo y calidad de datos.

---

## 2) Objetivo estratégico (12 meses)

Convertir UTCA en una **plataforma académica robusta, trazable e intuitiva** para:
- Publicar contenido académico confiable (malla, sílabos, semanas, evaluaciones).
- Gestionar tu avance como alumno en la carrera semilla:
  **Economía, Ingeniería Financiera y Data Science**.
- Escalar a nuevas carreras sin rehacer arquitectura.

KPI meta:
- Disponibilidad API/UI: **≥ 99.5%**.
- Error rate backend (5xx): **< 0.5%**.
- Tiempo de respuesta p95 (lecturas): **< 500 ms**.
- Consistencia de malla/sílabo publicada: **100% con workflow de aprobación**.
- NPS interno de usabilidad (alumnos): **≥ 8/10**.

---

## 3) Arquitectura objetivo

## 3.1 Dominio funcional (mínimo robusto)
1. **Catálogo académico**
   - Carrera, ciclo, curso, sílabo, semanas, evaluaciones.
   - Versionado de contenidos y estado (`draft`, `review`, `published`, `archived`).
2. **Identidad y acceso**
   - Usuarios, perfiles, roles y permisos granulares.
3. **Trayectoria del alumno**
   - Inscripción, progreso por curso, avance por ciclo, hitos y portafolio de proyectos.
4. **Contenido pedagógico**
   - Notas, ejercicios, recursos externos (APIs financieras, datasets, notebooks).
5. **Analítica académica**
   - Dashboard de avance, riesgo de retraso, cobertura de competencias.

## 3.2 Capas técnicas recomendadas
- **Backend**: NestJS modular + DTOs + validación + guards + interceptors.
- **Datos**: PostgreSQL con migraciones (TypeORM migrations), índices y constraints explícitos.
- **UI**: Angular con estado por feature, guardas por rol y componentes reutilizables.
- **Observabilidad**: OpenTelemetry + Prometheus/Grafana + logs estructurados.
- **Seguridad**: JWT + refresh token + RBAC + rate limiting + auditoría.

---

## 4) Plan por fases (ejecutable)

## Fase 0 (Semana 1–2) — Base de control
**Meta:** tener seguridad y calidad mínima para crecer.

### Entregables
- Desactivar `synchronize` en ambientes no locales.
- Configurar migraciones y pipeline de BD.
- Introducir DTOs con `class-validator` en todos los endpoints mutables.
- Manejo uniforme de errores (`HttpExceptionFilter`) y formato de respuesta.
- `.env` por entorno (`dev`, `staging`, `prod`).

### Criterios de éxito
- No hay escrituras sin validación.
- Cualquier cambio de esquema pasa por migración.

## Fase 1 (Semana 3–6) — Seguridad y gobierno académico
**Meta:** proteger datos y asegurar publicación confiable.

### Entregables
- Auth (login + refresh + logout).
- RBAC inicial:
  - `admin_academico`
  - `docente`
  - `alumno`
- Workflow de publicación de contenido:
  - borrador → revisión → publicado.
- Historial de cambios (quién editó, cuándo, qué cambió).

### Criterios de éxito
- Alumno no puede alterar contenido oficial.
- Todo sílabo publicado tiene trazabilidad.

## Fase 2 (Semana 7–10) — Experiencia intuitiva del alumno
**Meta:** que estudiar la malla sea simple y guiado.

### Entregables
- Modo “Mi ruta”:
  - cursos activos,
  - progreso por ciclo,
  - próximos entregables,
  - backlog de estudio semanal.
- Checklist por curso:
  - temas vistos,
  - ejercicios resueltos,
  - mini-evaluaciones.
- Búsqueda global (curso, tema, semana).
- Diseño UX orientado a flujo: Inicio → Ruta → Curso → Semana → Evidencia.

### Criterios de éxito
- Un alumno nuevo entiende “qué estudiar hoy” en < 2 minutos.

## Fase 3 (Semana 11–14) — Calidad de contenido y portafolio diferencial
**Meta:** material académico utilizable en práctica real.

### Entregables
- Plantillas de sílabo por tipo de curso (economía, finanzas, data science).
- Repositorio de proyectos acumulativos por ciclo:
  - I: simulación oferta-demanda
  - II: dashboard financiero
  - III: modelo económico
  - IV: regresión con datos reales
  - V: modelo de riesgo
  - VI: bot de trading
- Integración inicial con datasets/API reales (sandbox).

### Criterios de éxito
- Cada curso tiene objetivos, rúbrica y proyecto asociado.

## Fase 4 (Semana 15–18) — Operación robusta
**Meta:** operar con confiabilidad de plataforma real.

### Entregables
- Monitoreo técnico y funcional.
- Backups automáticos + prueba de restore.
- Pruebas automáticas mínimas:
  - unitarias,
  - integración,
  - smoke e2e de flujos críticos.
- Hardening de performance (caché de lecturas, índices, paginación).

### Criterios de éxito
- Runbook de incidentes y RTO/RPO definidos.

---

## 5) Diseño académico de la carrera semilla (recomendación operativa)

## 5.1 Estructura curricular oficial inicial
Nombre recomendado para catálogo:
- **Economía, Ingeniería Financiera y Data Science**

Mantener los 6 ciclos ya planteados y agregar metadatos por curso:
- competencias,
- prerequisitos,
- nivel Bloom,
- herramientas (Python, SQL, BI, APIs, etc.),
- evidencia de aprendizaje.

## 5.2 Núcleo diferencial UTCA
Priorizar desde el diseño de contenido:
1. **Arquitectura de Sistemas Financieros** (curso bandera).
2. **Data real desde ciclo II** (APIs y datasets de mercado).
3. **Portafolio acumulativo** como criterio de egreso.

## 5.3 Trayectoria personal como alumno (tu caso)
Implementar módulo “Mi Progreso” con:
- meta semanal,
- horas de estudio reales,
- avance por competencia,
- bitácora de aprendizaje,
- KPI personal (ritmo, cursos críticos, alertas).

---

## 6) Backlog priorizado (Top 20)

### Prioridad Alta (hacer primero)
1. Auth + RBAC.
2. DTOs + validaciones en `nota` y `ejercicio`.
3. Migraciones DB y desactivar `synchronize` en prod/staging.
4. Versionado de sílabo y cursos.
5. Dashboard “Mi Ruta”.
6. Auditoría de cambios.
7. Índices en consultas frecuentes (cursoId, semanaId, cicloId).
8. Paginación/listados en endpoints.
9. Pruebas e2e de flujos críticos.
10. Manejo de errores consistente + mensajes amigables en UI.

### Prioridad Media
11. Búsqueda global por tema.
12. Etiquetado por competencias.
13. Motor de prerequisitos y sugerencia de secuencia.
14. Integración de notebooks/links externos por semana.
15. Modo offline ligero para lectura de sílabos.

### Prioridad Estratégica
16. Analítica de aprendizaje (riesgo de abandono).
17. Recomendador de estudio semanal.
18. Integración LMS futura (si aplica).
19. API pública controlada para contenido académico.
20. Certificados por hitos (microcredenciales).

---

## 7) Gobierno de datos y publicación

Reglas mínimas:
- Todo contenido pasa por validación académica antes de publicar.
- No se sobreescribe contenido publicado sin crear nueva versión.
- Se define dueño por curso (owner académico + owner técnico).
- Diccionario de datos curricular (campos, formatos, reglas).

Checklist de publicación:
1. Objetivos y competencias claros.
2. Semana a semana completa.
3. Evaluación y ponderaciones consistentes.
4. Bibliografía/recursos verificables.
5. Estado `published` + timestamp + aprobador.

---

## 8) Plan de implementación inmediato (próximos 14 días)

### Semana A
- Diseñar modelo de usuarios/roles.
- Implementar login JWT.
- Crear DTOs de `nota` y `ejercicio`.
- Crear migración base inicial.

### Semana B
- Proteger endpoints mutables con guards.
- Crear vista “Mi Ruta” en frontend.
- Añadir progreso por curso (porcentaje simple).
- Definir plantilla estándar de sílabo (v1).

Resultado esperado al día 14:
- Plataforma ya segura para uso personal como alumno.
- Información académica con mejor control de calidad.
- Base lista para escalar a nuevas carreras.

---

## 9) Riesgos y mitigaciones

- **Riesgo:** crecer funcionalidades sin base de seguridad.
  - **Mitigación:** no desarrollar features nuevas antes de Fase 0–1.
- **Riesgo:** contenido inconsistente al aumentar carreras.
  - **Mitigación:** workflow editorial + versionado + ownership.
- **Riesgo:** complejidad UX por exceso de vistas.
  - **Mitigación:** diseño centrado en 3 acciones: estudiar, practicar, medir avance.

---

## 10) Recomendación final

Para tu objetivo (aprender toda la malla como alumno y escalar la universidad digital), el orden correcto es:

1. **Seguridad + gobierno del contenido.**
2. **Experiencia intuitiva del alumno con “Mi Ruta”.**
3. **Portafolio/proyectos diferenciales por ciclo.**
4. **Observabilidad y operación robusta.**

Con ese orden, UTCA pasa de MVP académico a plataforma institucional escalable.

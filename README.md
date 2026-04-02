# 🎓 Economía Cuantitativa — Plataforma Académica

> **Universidad Tecnológica de Ciencias Aplicadas (UTCA)** · Lima, Perú  
> Facultad de Ciencias Económicas y Analítica de Datos

Plataforma web para la gestión académica de la carrera de **Economía Cuantitativa**: malla curricular, sílabos, semanas de clase, evaluaciones, ejercicios con soluciones y generación de reportes PDF.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS + TypeORM + PostgreSQL |
| Frontend | Angular 19 + Angular Material |
| Reportes | pdfmake |
| Seed | CSVs — 6 ciclos, 30 cursos, 480 semanas |

## Estructura del Proyecto

```
platform/
├── apps/
│   ├── api/          # NestJS backend (REST API + reportes PDF)
│   └── ui/           # Angular frontend (SPA)
└── seed/
    └── csv/          # Data inicial de la carrera
        ├── carreras.csv
        ├── ciclos.csv
        ├── cursos.csv
        ├── semanas.csv
        └── evaluaciones.csv
```

## Requisitos Previos

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm ≥ 9

## Setup

### 1. Base de datos

```bash
psql -U postgres -c "CREATE DATABASE economia_cuantitativa;"
```

### 2. Backend

```bash
cd apps/api
cp .env.example .env   # Ajustar credenciales si es necesario
npm install
npm run start:dev
```

> El seed se ejecuta automáticamente al iniciar si la BD está vacía.

### 3. Frontend

```bash
cd apps/ui
npm install
npx ng serve
```

### 4. Acceder

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:4999 |
| API | http://localhost:3999/api |
| Malla curricular (PDF) | http://localhost:3999/api/reports/malla |
| Sílabo de curso (PDF) | http://localhost:3999/api/reports/silabo/{cursoId} |

## API Endpoints

### Consultas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/carreras | Listar carreras |
| GET | /api/carreras/:id | Detalle de carrera con ciclos y cursos |
| GET | /api/cursos?cicloId= | Listar cursos (filtro opcional por ciclo) |
| GET | /api/cursos/:id | Detalle de curso con semanas y evaluaciones |
| GET | /api/semanas?cursoId= | Listar semanas de un curso |
| GET | /api/semanas/:id | Detalle de semana con notas y ejercicios |

### CRUD

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST/PUT/DELETE | /api/notas | Gestión de notas |
| GET/POST/PUT/DELETE | /api/ejercicios | Gestión de ejercicios (con soluciones) |

### Reportes PDF

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/reports/malla | Malla curricular completa |
| GET | /api/reports/silabo/:cursoId | Sílabo de un curso específico |

## Licencia

Proyecto académico — UTCA, Lima, Perú.

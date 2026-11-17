# Taller 303 - Sistema de gestión para talleres mecánicos

Proyecto Integrador de Laboratorio de Tecnologías (Grupo 6). Backend en Node.js + Express conectado a PostgreSQL y frontend en React + Vite.

## Requisitos

- Node.js 22 o posterior
- PostgreSQL 16 o posterior (con `psql` disponible en la terminal)
- Git

## 1. Clonar el repositorio

```bash
git clone https://github.com/tadeo2411/Laboratorio-de-Tecnologias.git
cd Laboratorio-de-Tecnologias
```

## 2. Crear la base de datos

El script `schema.sql` crea la base `taller-303` y sus tablas. El script `seed.sql` carga los datos de prueba.

```bash
# 1. Crear la base "taller-303" y todas sus tablas (si ya existía, borrarla antes)
psql -U postgres -f database/schema.sql
# 2. Cargar los datos de precarga (seed)
psql -U postgres -d taller-303 -v ON_ERROR_STOP=1 -f seed.sql
```

Si la base ya existía, borrarla antes con `DROP DATABASE "taller-303";`.

## 3. Configurar y levantar el backend

```bash
cd backend
npm install
```

Copiar `.env.example` como `.env` y completar los valores:

| Variable | Ejemplo | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto del servidor |
| `CORS_ORIGIN` | `http://localhost:5173` | Origen permitido (el frontend) |
| `JWT_SECRET` | una cadena larga y aleatoria | Clave para firmar los tokens |
| `JWT_EXPIRES_IN` | `8h` | Duración del token |
| `PGHOST` | `localhost` | Servidor de PostgreSQL |
| `PGPORT` | `5432` | Puerto de PostgreSQL |
| `PGUSER` | `postgres` | Usuario de PostgreSQL |
| `PGPASSWORD` | tu contraseña | Contraseña de PostgreSQL |
| `PGDATABASE` | `taller-303` | Nombre de la base |

```bash
npm run dev
```

El servidor queda en `http://localhost:3000`. Para comprobarlo: `http://localhost:3000/api/health`.

## 4. Levantar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`. El panel de gestión está en `/gestor` y pide iniciar sesión.

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin303!` | Administrador |

 Una vez ingresado puede crear mas usuarios con rol de mecánico 

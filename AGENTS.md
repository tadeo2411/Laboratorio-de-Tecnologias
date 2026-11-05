# AGENTS.md

Sistema de gestión para taller mecánico (Taller 303): backend Express 5 + PostgreSQL y frontend React 19 + Vite. El código, la UI y los mensajes de error están en español.

## Comandos

No hay workspace en la raíz (el `package-lock.json` raíz está vacío): instalar y ejecutar dentro de `backend/` y `frontend/`.

```bash
# backend -> http://localhost:3000
cd backend
npm install
cp .env.example .env    # completar JWT_SECRET y PGPASSWORD
npm run dev             # node --watch src/server.js; npm start para producción

# frontend -> http://localhost:5173
cd frontend
npm install
npm run dev
```

- No hay tests, typecheck ni CI. Verificación del frontend: `npm run lint` y `npm run build`. No existen comandos de test que se puedan correr.
- Verificación del backend: `GET /api/health` y la colección Postman `postman/collections/Taller 303 - API` (YAML), con el entorno `postman/environments/Entorno.environment.yaml` (`base_url`, `token`). `.postman/` es metadata de la herramienta, no la colección.

## Base de datos
--bash
- `psql -U postgres -f database/schema.sql` crea la base `taller-303`. El script usa `CREATE DATABASE` y `\c`, así que debe ejecutarse con `psql`, no con un cliente PostgreSQL genérico.
- Si la base ya existe, borrarla antes con `DROP DATABASE "taller-303";`.
- `psql -U postgres -d taller-303 -f database/seed.sql` carga usuarios con hash bcrypt (`admin`/`Admin303!`, `mecanico`/`Mecanico303!`, `ex.mecanico` inactivo) y datos de prueba.
- No hay migraciones ni codegen: los cambios de esquema van en `database/schema.sql` y los datos iniciales en `database/seed.sql`.

## Backend

- Cada módulo en `src/modules/<modulo>/` sigue `routes → controller → service → repository`. Los services validan y lanzan `httpError(status, mensaje)` (`src/utils/httpError.js`); `errorHandler` responde `{ error }` y convierte el unique de PostgreSQL (23505) en 409. No armar respuestas de error a mano en los controllers.
- Todos los routers salvo `auth` aplican `router.use(verificarToken)`. `soloAdministrador` protege las rutas de administración. Un módulo nuevo se registra en `src/app.js` bajo `/api/<nombre>`.
- `.env` se carga con `process.loadEnvFile()` en `src/config/env.js`; si falta `JWT_SECRET` el proceso no arranca. Requiere Node 22 o posterior.
- `src/server.js` lee `process.env.PORT` directamente (no `env.PORT`); el `.env` ya quedó cargado por la cadena de imports.

## Frontend

- React Router v8: importar de `react-router` y `react-router/dom`, no de `react-router-dom`.
- Rutas en `src/router.jsx`. Todo lo privado cuelga de `/gestor` con el loader `protegerRuta`; las páginas nuevas van como children de esa ruta y no duplican navbar ni footer (los aporta `LayoutGestor` con `<Outlet />`).
- Organización por feature en `src/features/<feature>/`; cada una expone lo público en su `index.js` y no se importan archivos internos de otra feature. `shared/` no debe depender de ninguna feature.
- Sesión en `sessionStorage` (`gestorTaller303:token` y `gestorTaller303:usuario`). Los services mandan `Authorization: Bearer` y llaman `manejarSesionVencida(respuesta)` para redirigir al login ante un 401.
- Las URLs de la API están hardcodeadas a `http://localhost:3000` en cada service (no hay variables `VITE_*`). Cambiar puerto u host obliga a tocar los services.
- Migración a medias; no asumir que todo persiste:
  - Usan la API real: auth, clientes, turnos y órdenes (listar, editar, fichas, trabajos).
  - Siguen simuladas con JSON de `/backend/data/*.json`: vehículos, repuestos, tableros, catálogo de trabajos y presupuestos. Los cambios viven en memoria y se pierden al recargar.
  - `crearOrden` en `features/ordenes/services/ordenesService.js` todavía crea en memoria en lugar de llamar a la API.
- Esos JSON de `backend/data/` no son la semilla de PostgreSQL: los sirve un plugin de Vite para las features simuladas.
- El plugin `servirBackend()` de `vite.config.js` solo implementa `configureServer`: los datos simulados funcionan con `npm run dev`, no con `build` ni `preview`.
- `frontend/README.md` sirve como guía de organización por features, pero sus detalles de auth (`AuthProvider`, `token.js`, `features/fichas`) están desactualizados; la fuente de verdad es el código.
- Bootstrap se carga por CDN en `index.html`; `frontend/public/bootstrap-5.3.8-dist` es una copia legacy. No agregar Bootstrap por npm.
- Para usar un SVG como componente: `import Icono from './icono.svg?react'` (vite-plugin-svgr).
- Estilos junto a cada feature/componente; las pantallas del gestor comparten `src/features/estilos.css` y solo los globales viven en `src/styles/vbles.css`.

## Convenciones

- Nombres de funciones, variables, componentes de UI y mensajes en español rioplatense (`listar`, `alta`, `modificar`, `eliminar`, `pedir`, `obtener...`). Mantener ese estilo en el código nuevo.
- Los estados del dominio y los roles van en mayúsculas (`ADMINISTRADOR`, `RECIBIDO`, `EN_REPARACION`, `PENDIENTE`), igual que en `schema.sql`.

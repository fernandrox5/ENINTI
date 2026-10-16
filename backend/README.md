# Backend

API REST de la plataforma ENINTI, desarrollada en Node.js con Express y autenticación JWT.

## Estructura

```
backend/
├── src/
│   ├── config/          # Configuración y conexión a la base de datos
│   ├── modules/         # Un módulo por carpeta (rutas, controladores y servicios)
│   │   ├── auth/
│   │   ├── cliente/
│   │   ├── trabajador/
│   │   └── administrador/
│   ├── shared/          # Middlewares (JWT y roles) y utilidades comunes
│   └── routes/          # Registro de rutas de la API
└── tests/               # Pruebas
```

## Cómo levantarlo

1. Crear la base de datos en PostgreSQL: `CREATE DATABASE eninti;`
2. Copiar `.env.example` a `.env` y ajustar `DATABASE_URL`.
3. Instalar y cargar tablas y datos de prueba:

```
npm install
npm run db:init
npm run dev
```

`db:init` ejecuta en orden los `.sql` de `database/schema` y `database/seeds`; se puede correr más de una vez.

## Endpoints disponibles

Todos bajo `/api/admin`, protegidos con JWT y rol `administrador`. Mientras no exista la autenticación (T-09), `AUTH_BYPASS=true` en `.env` deja pasar las peticiones como administrador.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/plantas?cliente_id=&comuna=` | Listado de plantas con su cliente y suscripción vigente |
| POST | `/plantas` | Crear planta con su ficha técnica |
| GET | `/plantas/:id` | Ficha técnica, cliente y suscripción vigente |
| PUT | `/plantas/:id` | Editar campos de la ficha (parcial) |
| GET | `/plantas/:id/suscripciones` | Historial de suscripciones de la planta |
| POST | `/plantas/:id/suscripciones` | Crear suscripción (`plan_id`, `fecha_inicio` opcional) |
| PATCH | `/suscripciones/:id` | Cambiar `plan_id` o `estado` (`al_dia`, `morosa`, `cancelada`) |
| GET | `/planes` | Planes activos |

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

1. Crear la base de datos en PostgreSQL: `CREATE DATABASE eninti ENCODING 'UTF8' TEMPLATE template0;`
2. Copiar `.env.example` a `.env` y ajustar `DATABASE_URL`.
3. Instalar y cargar tablas y datos de prueba:

```
npm install
npm run db:init
npm run dev
```

`db:init` ejecuta en orden los `.sql` de `database/schema` y `database/seeds`; se puede correr más de una vez.

## Usuarios de prueba

Todos con la contraseña `Eninti2026`:

| Correo | Rol |
|---|---|
| admin@eninti.test | administrador |
| pedro.ramirez@eninti.test | trabajador |
| maria.gonzalez@ejemplo.cl | cliente (2 plantas) |
| luis.perez@ejemplo.cl | cliente (1 planta, morosa) |

Carmen Soto (RUT `33.333.333-3`) es cliente pero aún no tiene cuenta: sirve para probar el registro.

## Autenticación (`/api/auth`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/registro` | Registro del cliente con `rut`, `email` y `password` (mínimo 8). Solo para RUT que ya son clientes de ENINTI |
| POST | `/login` | `email` y `password`. Devuelve `{ token, usuario }`; el token dura 8 horas |
| GET | `/me` | Usuario de la sesión actual (requiere token) |

Las demás rutas reciben el token en la cabecera `Authorization: Bearer <token>`. Las contraseñas se guardan con scrypt (módulo `crypto` de Node). Con `AUTH_BYPASS=true` en `.env`, una petición **sin** token pasa como administrador (solo desarrollo).

## Cliente (`/api/cliente`, rol `cliente`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/plantas` | Plantas del cliente que inició sesión, con el estado de su suscripción |

## Administrador (`/api/admin`, rol `administrador`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/plantas?id_cliente=&id_comuna=` | Listado de plantas con su cliente, comuna y suscripción vigente |
| POST | `/plantas` | Crear planta con su ficha técnica |
| GET | `/plantas/:id` | Ficha técnica, cliente y suscripción vigente |
| PUT | `/plantas/:id` | Editar campos de la ficha (parcial) |
| GET | `/plantas/:id/suscripciones` | Historial de suscripciones de la planta |
| POST | `/plantas/:id/suscripciones` | Crear la suscripción mensual (opcionales `monto_mensual`, por defecto $15.000; `fecha_inicio`; `dia_cobro` 1–28) |
| PATCH | `/suscripciones/:id` | Cambiar `monto_mensual`, `dia_cobro` o `estado` (`al_dia`, `morosa`, `cancelada`) |
| GET | `/clientes` | Listado básico de clientes para selectores |
| GET | `/comunas` | Comunas disponibles |

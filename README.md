# ENINTI · Plataforma de Suscripciones

Plataforma web para gestionar las suscripciones de mantención de sistemas solares fotovoltaicos de ENINTI.

## Estructura

```
ENINTI/
├── frontend/   # Interfaz web (React)
├── backend/    # API REST (Node.js + Express)
├── database/   # Base de datos PostgreSQL
└── docs/       # Documentación del proyecto
```

Cada carpeta tiene su propio README con el detalle de su contenido.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React |
| Backend | Node.js + Express, JWT |
| Base de datos | PostgreSQL |
| Pagos | Webpay Plus o Flow (sandbox) |

## Desarrollo

Desde la raíz del proyecto:

```
npm run install:all   # solo la primera vez
npm run dev           # levanta backend (3001) y frontend (5174) juntos
```

Abre http://localhost:5174 e inicia sesión con un usuario de prueba (ver `backend/README.md`). Para detener ambos: Ctrl + C.

## Equipos

| Equipo | Integrantes | Módulo |
|---|---|---|
| Equipo 1 | Cristofer Álvarez, Fernando Castillo | Cliente |
| Equipo 2 | Branyan Espinoza, Jeremy Herrera, Rachel Díaz | Trabajador |
| Conjunto | Ambos equipos | Administrador, autenticación y base de datos |

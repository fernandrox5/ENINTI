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

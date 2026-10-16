-- ENINTI · Clientes, plantas, planes y suscripciones (HU-03)
-- La tabla clientes es mínima: se completa en T-15 (administración de clientes)
-- y se enlaza con usuarios cuando el Equipo 2 entregue la autenticación (T-09).

CREATE TABLE IF NOT EXISTS clientes (
    id          SERIAL PRIMARY KEY,
    rut         VARCHAR(12)  NOT NULL UNIQUE,
    nombre      VARCHAR(120) NOT NULL,
    email       VARCHAR(120) NOT NULL UNIQUE,
    telefono    VARCHAR(20),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Planes como datos, no como valores fijos en el código (RNF-07)
CREATE TABLE IF NOT EXISTS planes (
    id                          SERIAL PRIMARY KEY,
    nombre                      VARCHAR(60)   NOT NULL UNIQUE,
    precio_mensual              INTEGER       NOT NULL CHECK (precio_mensual >= 0), -- CLP
    frecuencia_mantencion_meses SMALLINT      NOT NULL CHECK (frecuencia_mantencion_meses > 0),
    activo                      BOOLEAN       NOT NULL DEFAULT true,
    created_at                  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Planta fotovoltaica con su ficha técnica (HU-03, HU-10)
CREATE TABLE IF NOT EXISTS plantas (
    id                 SERIAL PRIMARY KEY,
    cliente_id         INTEGER       NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    direccion          VARCHAR(200)  NOT NULL,
    comuna             VARCHAR(80)   NOT NULL, -- usada por el calendario por comuna (HU-04)
    potencia_kwp       NUMERIC(6,2)  NOT NULL CHECK (potencia_kwp > 0),
    inversor_marca     VARCHAR(80)   NOT NULL,
    inversor_modelo    VARCHAR(80)   NOT NULL,
    paneles_cantidad   SMALLINT      NOT NULL CHECK (paneles_cantidad > 0),
    paneles_modelo     VARCHAR(80)   NOT NULL,
    baterias           VARCHAR(120), -- NULL si la planta no tiene baterías
    fecha_instalacion  DATE          NOT NULL,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plantas_cliente ON plantas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_plantas_comuna  ON plantas(comuna);

-- Suscripción de mantención asociada a una planta.
-- No se guarda ningún dato de tarjeta (RNF-03): el medio de pago vive en la pasarela.
CREATE TABLE IF NOT EXISTS suscripciones (
    id                 SERIAL PRIMARY KEY,
    planta_id          INTEGER      NOT NULL REFERENCES plantas(id) ON DELETE RESTRICT,
    plan_id            INTEGER      NOT NULL REFERENCES planes(id)  ON DELETE RESTRICT,
    fecha_inicio       DATE         NOT NULL DEFAULT CURRENT_DATE,
    estado             VARCHAR(20)  NOT NULL DEFAULT 'al_dia'
                       CHECK (estado IN ('al_dia', 'morosa', 'cancelada')),
    fecha_cancelacion  DATE,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CHECK ((estado = 'cancelada') = (fecha_cancelacion IS NOT NULL))
);

-- Una planta tiene como máximo una suscripción vigente
CREATE UNIQUE INDEX IF NOT EXISTS uq_suscripcion_vigente
    ON suscripciones(planta_id) WHERE estado <> 'cancelada';

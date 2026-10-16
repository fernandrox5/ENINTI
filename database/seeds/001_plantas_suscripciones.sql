-- Datos de prueba ficticios (RNF-04): ningún dato corresponde a clientes reales.

INSERT INTO clientes (rut, nombre, email, telefono) VALUES
    ('11111111-1', 'María González Rojas',  'maria.gonzalez@ejemplo.cl', '+56911111111'),
    ('22222222-2', 'Luis Pérez Araya',      'luis.perez@ejemplo.cl',     '+56922222222'),
    ('33333333-3', 'Carmen Soto Vega',      'carmen.soto@ejemplo.cl',    '+56933333333')
ON CONFLICT (rut) DO NOTHING;

INSERT INTO planes (nombre, precio_mensual, frecuencia_mantencion_meses) VALUES
    ('Básico',   15000, 6),
    ('Completo', 25000, 3)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO plantas (cliente_id, direccion, comuna, potencia_kwp, inversor_marca, inversor_modelo,
                     paneles_cantidad, paneles_modelo, baterias, fecha_instalacion)
SELECT c.id, p.direccion, p.comuna, p.potencia_kwp, p.inversor_marca, p.inversor_modelo,
       p.paneles_cantidad, p.paneles_modelo, p.baterias, p.fecha_instalacion::date
FROM (VALUES
    ('11111111-1', 'Av. Granaderos 1234',  'Calama',                 3.30, 'Huawei',  'SUN2000-3KTL', 6,  'JA Solar 550W',  NULL,                    '2023-03-15'),
    ('11111111-1', 'Parcela 12, Ayquina',  'Calama',                 5.50, 'Growatt', 'SPH 5000',     10, 'Longi 550W',     'Pylontech US5000 x2',   '2024-01-20'),
    ('22222222-2', 'Calle Caracoles 45',   'San Pedro de Atacama',   2.20, 'Fronius', 'Primo 3.0',    4,  'Trina 550W',     NULL,                    '2022-11-02'),
    ('33333333-3', 'Pasaje Los Aromos 89', 'Antofagasta',            4.40, 'Huawei',  'SUN2000-5KTL', 8,  'JA Solar 550W',  NULL,                    '2023-08-10'),
    ('33333333-3', 'Sector Quillagua s/n', 'María Elena',            1.65, 'Victron', 'MultiPlus-II', 3,  'Canadian 550W',  'Victron Lithium 200Ah', '2024-05-05')
) AS p(rut, direccion, comuna, potencia_kwp, inversor_marca, inversor_modelo,
       paneles_cantidad, paneles_modelo, baterias, fecha_instalacion)
JOIN clientes c ON c.rut = p.rut
WHERE NOT EXISTS (SELECT 1 FROM plantas);

-- Suscripciones para las 4 primeras plantas; la quinta queda sin suscripción para probar el alta
INSERT INTO suscripciones (planta_id, plan_id, fecha_inicio, estado)
SELECT pl.id, pn.id, s.fecha_inicio::date, s.estado
FROM (VALUES
    ('Av. Granaderos 1234',  'Básico',   '2023-04-01', 'al_dia'),
    ('Parcela 12, Ayquina',  'Completo', '2024-02-01', 'al_dia'),
    ('Calle Caracoles 45',   'Básico',   '2022-12-01', 'morosa'),
    ('Pasaje Los Aromos 89', 'Completo', '2023-09-01', 'al_dia')
) AS s(direccion, plan, fecha_inicio, estado)
JOIN plantas pl ON pl.direccion = s.direccion
JOIN planes  pn ON pn.nombre    = s.plan
WHERE NOT EXISTS (SELECT 1 FROM suscripciones);

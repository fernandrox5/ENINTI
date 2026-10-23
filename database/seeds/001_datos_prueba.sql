-- Datos de prueba ficticios (RNF-04): ningún dato corresponde a personas reales.
-- Solo se cargan si la base está vacía, así el script se puede ejecutar varias veces.
-- password_hash es provisional hasta que el Equipo 2 entregue la autenticación (T-09).

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM usuario) THEN
    RETURN;
  END IF;

  INSERT INTO comuna (nombre) VALUES
    ('Antofagasta'), ('Calama'), ('María Elena'), ('Mejillones'), ('Ollagüe'),
    ('San Pedro de Atacama'), ('Sierra Gorda'), ('Taltal'), ('Tocopilla');

  INSERT INTO usuario (nombre, email, password_hash, rol) VALUES
    ('Administración ENINTI', 'admin@eninti.test',          'pendiente-T09', 'administrador'),
    ('Pedro Ramírez Castro',  'pedro.ramirez@eninti.test',  'pendiente-T09', 'trabajador'),
    ('María González Rojas',  'maria.gonzalez@ejemplo.cl',  'pendiente-T09', 'cliente'),
    ('Luis Pérez Araya',      'luis.perez@ejemplo.cl',      'pendiente-T09', 'cliente');

  -- Carmen aún no se registra en la plataforma: cliente sin usuario
  INSERT INTO cliente (id_usuario, rut, nombre, telefono, direccion, id_comuna)
  SELECT u.id_usuario, c.rut, c.nombre, c.telefono, c.direccion, co.id_comuna
  FROM (VALUES
    ('maria.gonzalez@ejemplo.cl', '11111111-1', 'María González Rojas', '+56911111111', 'Av. Granaderos 1234',  'Calama'),
    ('luis.perez@ejemplo.cl',     '22222222-2', 'Luis Pérez Araya',     '+56922222222', 'Calle Caracoles 45',   'San Pedro de Atacama'),
    (NULL,                        '33333333-3', 'Carmen Soto Vega',     '+56933333333', 'Pasaje Los Aromos 89', 'Antofagasta')
  ) AS c(email, rut, nombre, telefono, direccion, comuna)
  LEFT JOIN usuario u ON u.email = c.email
  JOIN comuna co ON co.nombre = c.comuna;

  INSERT INTO planta (id_cliente, id_comuna, direccion, potencia_kw, inversor, paneles, baterias, fecha_instalacion)
  SELECT cl.id_cliente, co.id_comuna, p.direccion, p.potencia_kw, p.inversor, p.paneles, p.baterias, p.fecha::date
  FROM (VALUES
    ('11111111-1', 'Calama',               'Av. Granaderos 1234',  3.30, 'Huawei SUN2000-3KTL', '6 × JA Solar 550 W',    NULL,                    '2023-03-15'),
    ('11111111-1', 'Calama',               'Parcela 12, Ayquina',  5.50, 'Growatt SPH 5000',    '10 × Longi 550 W',      'Pylontech US5000 × 2',  '2024-01-20'),
    ('22222222-2', 'San Pedro de Atacama', 'Calle Caracoles 45',   2.20, 'Fronius Primo 3.0',   '4 × Trina 550 W',       NULL,                    '2022-11-02'),
    ('33333333-3', 'Antofagasta',          'Pasaje Los Aromos 89', 4.40, 'Huawei SUN2000-5KTL', '8 × JA Solar 550 W',    NULL,                    '2023-08-10'),
    ('33333333-3', 'María Elena',          'Sector Quillagua s/n', 1.65, 'Victron MultiPlus-II','3 × Canadian 550 W',    'Victron Lithium 200 Ah','2024-05-05')
  ) AS p(rut, comuna, direccion, potencia_kw, inversor, paneles, baterias, fecha)
  JOIN cliente cl ON cl.rut = p.rut
  JOIN comuna co ON co.nombre = p.comuna;

  -- Todas con la cuota vigente por defecto ($15.000).
  -- La planta de Quillagua queda sin suscripción para probar el alta.
  INSERT INTO suscripcion (id_planta, fecha_inicio, dia_cobro, estado)
  SELECT pl.id_planta, s.inicio::date, s.dia, s.estado
  FROM (VALUES
    ('Av. Granaderos 1234',  '2023-04-01', 5, 'al_dia'),
    ('Parcela 12, Ayquina',  '2024-02-01', 5, 'al_dia'),
    ('Calle Caracoles 45',   '2022-12-01', 5, 'morosa'),
    ('Pasaje Los Aromos 89', '2023-09-01', 5, 'al_dia')
  ) AS s(direccion, inicio, dia, estado)
  JOIN planta pl ON pl.direccion = s.direccion;

  -- Cuotas de agosto a octubre 2026; Calle Caracoles adeuda septiembre y octubre
  INSERT INTO cuota (id_suscripcion, periodo, monto, fecha_vencimiento, estado)
  SELECT s.id_suscripcion, p.periodo, s.monto_mensual, (p.periodo || '-05')::date,
         CASE
           WHEN pl.direccion = 'Calle Caracoles 45' AND p.periodo >= '2026-09' THEN 'vencida'
           WHEN p.periodo = '2026-10' THEN 'pendiente'
           ELSE 'pagada'
         END
  FROM suscripcion s
  JOIN planta pl ON pl.id_planta = s.id_planta
  CROSS JOIN (VALUES ('2026-08'), ('2026-09'), ('2026-10')) AS p(periodo);

  -- Pagos manuales de las cuotas pagadas, registrados por el administrador
  INSERT INTO pago (id_cuota, registrado_por, origen, monto, fecha_pago, referencia)
  SELECT c.id_cuota, u.id_usuario, 'transferencia', c.monto,
         c.fecha_vencimiento + interval '2 days', 'TRF-' || c.id_cuota
  FROM cuota c
  CROSS JOIN usuario u
  WHERE c.estado = 'pagada' AND u.rol = 'administrador';

  -- Una solicitud del cliente ya asignada y una mantención preventiva programada
  INSERT INTO solicitud_mantencion (id_planta, motivo, estado, fecha_asignada)
  SELECT id_planta, 'El inversor muestra una alarma de aislamiento', 'asignada', DATE '2026-10-22'
  FROM planta WHERE direccion = 'Parcela 12, Ayquina';

  INSERT INTO mantencion (id_planta, id_solicitud, id_trabajador, tipo, fecha_programada, estado)
  SELECT sm.id_planta, sm.id_solicitud, u.id_usuario, 'correctiva', sm.fecha_asignada, 'pendiente'
  FROM solicitud_mantencion sm CROSS JOIN usuario u
  WHERE u.rol = 'trabajador';

  INSERT INTO mantencion (id_planta, id_trabajador, tipo, fecha_programada, fecha_ejecucion, actividades, estado)
  SELECT pl.id_planta, u.id_usuario, 'preventiva', DATE '2026-09-10', DATE '2026-09-10',
         'Limpieza de paneles, revisión de conexiones y lectura del inversor', 'finalizada'
  FROM planta pl CROSS JOIN usuario u
  WHERE pl.direccion = 'Av. Granaderos 1234' AND u.rol = 'trabajador';
END $$;

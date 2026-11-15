-- Datos de prueba compatibles con database/schema.sql (version 1)
-- Ejecutar DESPUES de crear la base y aplicar schema.sql.
-- Ejemplo: sudo -u postgres psql -d "taller-303" -v ON_ERROR_STOP=1 -f database/seed.sql

BEGIN;

-- Clientes
INSERT INTO clientes (documento, tipo, nombre, telefono)
VALUES
    ('30123456', 'PERSONA', 'Juan Pérez', '2664123456'),
    ('30712345678', 'EMPRESA', 'Transporte Los Andes SRL', '2664987654')
ON CONFLICT (documento) DO NOTHING;

-- Vehículos
INSERT INTO vehiculos (patente, marca, modelo, anio, descripcion, kilometraje)
VALUES
    ('AE123BC', 'Toyota', 'Corolla', 2021, 'Sedán gris, motor 1.8', 15000),
    ('AD456EF', 'Ford', 'Ranger', 2020, 'Pickup blanca, doble cabina', 35000)
ON CONFLICT (patente) DO NOTHING;

-- Relación cliente-vehículo
INSERT INTO duenos (id_cliente, id_vehiculo)
SELECT c.id, v.id
FROM (VALUES
    ('30123456', 'AE123BC'),
    ('30712345678', 'AD456EF')
) AS x(documento, patente)
JOIN clientes c ON c.documento = x.documento
JOIN vehiculos v ON v.patente = x.patente
ON CONFLICT (id_cliente, id_vehiculo) DO NOTHING;

-- Catálogo de trabajos
INSERT INTO tipos_trabajo (nombre, categoria, precio_estandar)
VALUES
    ('Cambio de aceite y filtros', 'MANTENIMIENTO', 45000.00),
    ('Diagnóstico de motor', 'DIAGNOSTICO', 18000.00),
    ('Reparación de frenos', 'REPARACION', 65000.00)
ON CONFLICT (nombre) DO NOTHING;

-- Catálogo de repuestos
INSERT INTO repuestos (nombre, precio_estandar)
VALUES
    ('Filtro de aceite Toyota Corolla', 12000.00),
    ('Aceite sintético 5W-30 (litro)', 9500.00),
    ('Pastillas de freno Ford Ranger', 38000.00)
ON CONFLICT (nombre) DO NOTHING;

-- Turnos
INSERT INTO turnos (id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado)
SELECT c.id, v.id, CURRENT_TIMESTAMP + INTERVAL '2 days', 60,
       'Cambio de aceite y filtros', 'CONFIRMADO'
FROM clientes c
JOIN vehiculos v ON v.patente = 'AE123BC'
WHERE c.documento = '30123456'
  AND NOT EXISTS (
      SELECT 1 FROM turnos t
      WHERE t.id_cliente = c.id
        AND t.id_vehiculo = v.id
        AND t.motivo = 'Cambio de aceite y filtros'
        AND t.fecha_hora > CURRENT_TIMESTAMP
  );

INSERT INTO turnos (id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado)
SELECT c.id, v.id, CURRENT_TIMESTAMP + INTERVAL '3 days', 90,
       'Revisión del sistema de frenos', 'SOLICITADO'
FROM clientes c
JOIN vehiculos v ON v.patente = 'AD456EF'
WHERE c.documento = '30712345678'
  AND NOT EXISTS (
      SELECT 1 FROM turnos t
      WHERE t.id_cliente = c.id
        AND t.id_vehiculo = v.id
        AND t.motivo = 'Revisión del sistema de frenos'
        AND t.fecha_hora > CURRENT_TIMESTAMP
  );

-- Órdenes de trabajo. turno_id se deja NULL porque los turnos son futuros.
INSERT INTO ordenes_trabajo
    (id_cliente, id_vehiculo, diagnostico, estado, es_service, es_urgencia, garantia_dias)
SELECT c.id, v.id,
       'Mantenimiento programado; revisar posibles pérdidas de aceite.',
       'RECIBIDO', TRUE, FALSE, 30
FROM clientes c
JOIN vehiculos v ON v.patente = 'AE123BC'
WHERE c.documento = '30123456'
  AND NOT EXISTS (
      SELECT 1 FROM ordenes_trabajo o
      WHERE o.id_cliente = c.id
        AND o.id_vehiculo = v.id
        AND o.diagnostico = 'Mantenimiento programado; revisar posibles pérdidas de aceite.'
  );

INSERT INTO ordenes_trabajo
    (id_cliente, id_vehiculo, diagnostico, estado, es_service, es_urgencia, garantia_dias)
SELECT c.id, v.id,
       'Desgaste de pastillas delanteras; verificar discos.',
       'DIAGNOSTICANDO', FALSE, TRUE, 60
FROM clientes c
JOIN vehiculos v ON v.patente = 'AD456EF'
WHERE c.documento = '30712345678'
  AND NOT EXISTS (
      SELECT 1 FROM ordenes_trabajo o
      WHERE o.id_cliente = c.id
        AND o.id_vehiculo = v.id
        AND o.diagnostico = 'Desgaste de pastillas delanteras; verificar discos.'
  );

-- Fichas de ingreso: solo se crean si la orden todavía no tiene ficha de ingreso.
INSERT INTO fichas (orden_id, tipo, fecha, kilometraje, conformidad)
SELECT o.id, 'INGRESO', CURRENT_TIMESTAMP, v.kilometraje, 'APROBADA'
FROM ordenes_trabajo o
JOIN vehiculos v ON v.id = o.id_vehiculo
WHERE o.diagnostico IN (
    'Mantenimiento programado; revisar posibles pérdidas de aceite.',
    'Desgaste de pastillas delanteras; verificar discos.'
)
AND NOT EXISTS (
    SELECT 1 FROM fichas f
    WHERE f.orden_id = o.id AND f.tipo = 'INGRESO'
);

-- Trabajos asociados a cada orden.
INSERT INTO trabajos
    (orden_id, tipo_trabajo_id, descripcion, mano_de_obra, fecha, estado)
SELECT o.id, tt.id, 'Realizar cambio de aceite y filtros',
       22000.00, CURRENT_TIMESTAMP, 'PENDIENTE'
FROM ordenes_trabajo o
JOIN tipos_trabajo tt ON tt.nombre = 'Cambio de aceite y filtros'
WHERE o.diagnostico = 'Mantenimiento programado; revisar posibles pérdidas de aceite.'
  AND NOT EXISTS (
      SELECT 1 FROM trabajos t
      WHERE t.orden_id = o.id AND t.tipo_trabajo_id = tt.id
  );

INSERT INTO trabajos
    (orden_id, tipo_trabajo_id, descripcion, mano_de_obra, fecha, estado)
SELECT o.id, tt.id, 'Revisar y reemplazar pastillas delanteras',
       35000.00, CURRENT_TIMESTAMP, 'EN_PROCESO'
FROM ordenes_trabajo o
JOIN tipos_trabajo tt ON tt.nombre = 'Reparación de frenos'
WHERE o.diagnostico = 'Desgaste de pastillas delanteras; verificar discos.'
  AND NOT EXISTS (
      SELECT 1 FROM trabajos t
      WHERE t.orden_id = o.id AND t.tipo_trabajo_id = tt.id
  );

-- Repuestos usados en los trabajos de prueba.
INSERT INTO repuestos_usados (trabajo_id, repuesto_id, cantidad, precio_unitario)
SELECT t.id, r.id, 1, 12000.00
FROM trabajos t
JOIN ordenes_trabajo o ON o.id = t.orden_id
JOIN repuestos r ON r.nombre = 'Filtro de aceite Toyota Corolla'
WHERE o.diagnostico = 'Mantenimiento programado; revisar posibles pérdidas de aceite.'
  AND NOT EXISTS (
      SELECT 1 FROM repuestos_usados ru
      WHERE ru.trabajo_id = t.id AND ru.repuesto_id = r.id
  );

INSERT INTO repuestos_usados (trabajo_id, repuesto_id, cantidad, precio_unitario)
SELECT t.id, r.id, 4.5, 9500.00
FROM trabajos t
JOIN ordenes_trabajo o ON o.id = t.orden_id
JOIN repuestos r ON r.nombre = 'Aceite sintético 5W-30 (litro)'
WHERE o.diagnostico = 'Mantenimiento programado; revisar posibles pérdidas de aceite.'
  AND NOT EXISTS (
      SELECT 1 FROM repuestos_usados ru
      WHERE ru.trabajo_id = t.id AND ru.repuesto_id = r.id
  );

INSERT INTO repuestos_usados (trabajo_id, repuesto_id, cantidad, precio_unitario)
SELECT t.id, r.id, 1, 38000.00
FROM trabajos t
JOIN ordenes_trabajo o ON o.id = t.orden_id
JOIN repuestos r ON r.nombre = 'Pastillas de freno Ford Ranger'
WHERE o.diagnostico = 'Desgaste de pastillas delanteras; verificar discos.'
  AND NOT EXISTS (
      SELECT 1 FROM repuestos_usados ru
      WHERE ru.trabajo_id = t.id AND ru.repuesto_id = r.id
  );

-- Presupuestos
INSERT INTO presupuestos (numero, orden_id, fecha_emision, vigencia_dias, estado)
SELECT 1001, o.id, CURRENT_DATE, 15, 'ENVIADO'
FROM ordenes_trabajo o
WHERE o.diagnostico = 'Mantenimiento programado; revisar posibles pérdidas de aceite.'
  AND NOT EXISTS (SELECT 1 FROM presupuestos p WHERE p.numero = 1001);

INSERT INTO presupuestos (numero, orden_id, fecha_emision, vigencia_dias, estado)
SELECT 1002, o.id, NULL::date, 10, 'BORRADOR'
FROM ordenes_trabajo o
WHERE o.diagnostico = 'Desgaste de pastillas delanteras; verificar discos.'
  AND NOT EXISTS (SELECT 1 FROM presupuestos p WHERE p.numero = 1002);

-- Renglones de presupuesto; evita duplicarlos al reejecutar.
INSERT INTO presupuesto_items
    (presupuesto_id, concepto, descripcion, cantidad, precio_unitario, trabajo_id)
SELECT
    p.id,
    x.concepto::concepto_item,
    x.descripcion,
    x.cantidad,
    x.precio_unitario,
    t.id
FROM presupuestos p
JOIN (
    VALUES
        (1001, 'MANO_DE_OBRA', 'Cambio de aceite y filtros', 1::numeric, 22000.00::numeric),
        (1001, 'REPUESTO', 'Filtro de aceite Toyota Corolla', 1::numeric, 12000.00::numeric),
        (1001, 'REPUESTO', 'Aceite sintético 5W-30 (litro)', 4.5::numeric, 9500.00::numeric),
        (1002, 'MANO_DE_OBRA', 'Reparación de frenos', 1::numeric, 35000.00::numeric),
        (1002, 'REPUESTO', 'Pastillas de freno Ford Ranger', 1::numeric, 38000.00::numeric)
) AS x(numero_presupuesto, concepto, descripcion, cantidad, precio_unitario)
    ON TRUE
LEFT JOIN trabajos t
    ON t.orden_id = p.orden_id
WHERE p.numero = x.numero_presupuesto
  AND NOT EXISTS (
      SELECT 1
      FROM presupuesto_items pi
      WHERE pi.presupuesto_id = p.id
        AND pi.concepto = x.concepto::concepto_item
        AND pi.descripcion = x.descripcion
  );

-- Empleados de prueba. Se conserva el hash provisto originalmente.
INSERT INTO empleados (nombre, usuario, password_hash, activo)
VALUES
    ('Administrador', 'admin', '$2b$10$ZQ8AAy2ZP7NA26E9iks7buT7T9nQOyKmTMNteE79JnBbJpYdrRgCW', TRUE),
    ('Mecánico de prueba', 'mecanico', '$2b$10$iZzThdco2k0aW9iB2j4NWOtnVxoGMPS9CK8SWUQhz5tBuWOXD.4O6', TRUE),
    ('Ex mecánico de prueba', 'ex.mecanico', '$2b$10$yJXrozYvRnTfgLNaL766OuHuJHocJJgTuPqfV/EOZ4gt936D4GiDK', FALSE)
ON CONFLICT (usuario) DO NOTHING;

-- Roles y asignaciones
INSERT INTO roles (nombre)
VALUES ('ADMINISTRADOR'), ('MECANICO')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO empleados_roles (empleado_id, rol_id)
SELECT e.id, r.id
FROM empleados e
JOIN roles r ON r.nombre = CASE
    WHEN e.usuario = 'admin' THEN 'ADMINISTRADOR'
    WHEN e.usuario IN ('mecanico', 'ex.mecanico') THEN 'MECANICO'
END
WHERE e.usuario IN ('admin', 'mecanico', 'ex.mecanico')
ON CONFLICT (empleado_id, rol_id) DO NOTHING;

-- Conceptos de ficha y ejemplos de inspección.
INSERT INTO conceptos_ficha (nombre, tipo_valor, activo)
VALUES
    ('Nivel de combustible', 'TEXTO', TRUE),
    ('Rayones', 'TEXTO', TRUE)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO items_ficha (ficha_id, concepto_id, concepto, valor)
SELECT f.id, cf.id, cf.nombre,
       CASE cf.nombre
           WHEN 'Nivel de combustible' THEN '1/2'
           WHEN 'Rayones' THEN 'Paragolpes trasero'
       END
FROM fichas f
JOIN ordenes_trabajo o ON o.id = f.orden_id
JOIN conceptos_ficha cf ON cf.nombre IN ('Nivel de combustible', 'Rayones')
WHERE f.tipo = 'INGRESO'
  AND o.diagnostico = 'Mantenimiento programado; revisar posibles pérdidas de aceite.'
  AND NOT EXISTS (
      SELECT 1 FROM items_ficha i
      WHERE i.ficha_id = f.id AND i.concepto = cf.nombre
  );

COMMIT;
-- Datos de prueba para Taller 303
-- Ejecutar dentro de la base de datos "taller-303"
-- Ejemplo: sudo -u postgres psql -d "taller-303" -f database/datos_prueba.sql

BEGIN;

INSERT INTO clientes (documento, tipo, nombre, telefono) VALUES
('30123456', 'PERSONA', 'Juan Pérez', '2664123456'),
('30712345678', 'EMPRESA', 'Transporte Los Andes SRL', '2664987654');

INSERT INTO vehiculos (patente, marca, modelo, anio, descripcion) VALUES
('AE123BC', 'Toyota', 'Corolla', 2021, 'Sedán gris, motor 1.8'),
('AD456EF', 'Ford', 'Ranger', 2020, 'Pickup blanca, doble cabina');

INSERT INTO duenos (cliente_documento, vehiculo_patente) VALUES
('30123456', 'AE123BC'),
('30712345678', 'AD456EF');

INSERT INTO tipos_trabajo (nombre, categoria, precio_estandar) VALUES
('Cambio de aceite y filtros', 'MANTENIMIENTO', 45000.00),
('Diagnóstico de motor', 'DIAGNOSTICO', 18000.00),
('Reparación de frenos', 'REPARACION', 65000.00);

INSERT INTO repuestos (nombre, precio_estandar) VALUES
('Filtro de aceite Toyota Corolla', 12000.00),
('Aceite sintético 5W-30 (litro)', 9500.00),
('Pastillas de freno Ford Ranger', 38000.00);

INSERT INTO turnos (cliente_documento, vehiculo_patente, fecha_hora, duracion_min, motivo, estado) VALUES
('30123456', 'AE123BC', CURRENT_TIMESTAMP + INTERVAL '2 days', 60, 'Cambio de aceite y filtros', 'CONFIRMADO'),
('30712345678', 'AD456EF', CURRENT_TIMESTAMP + INTERVAL '3 days', 90, 'Revisión del sistema de frenos', 'SOLICITADO');

INSERT INTO ordenes_trabajo
(cliente_documento, vehiculo_patente, diagnostico, estado, es_service, es_urgencia, garantia_dias)
VALUES
('30123456', 'AE123BC', 'Mantenimiento programado; revisar posibles pérdidas de aceite.', 'RECIBIDO', TRUE, FALSE, 30),
('30712345678', 'AD456EF', 'Desgaste de pastillas delanteras; verificar discos.', 'DIAGNOSTICANDO', FALSE, TRUE, 60);

INSERT INTO fichas (orden_id, tipo, fecha, kilometraje, conformidad) VALUES
(1, 'INGRESO', CURRENT_TIMESTAMP, 45200, 'APROBADA'),
(2, 'INGRESO', CURRENT_TIMESTAMP, 78300, 'APROBADA');

INSERT INTO trabajos (orden_id, tipo_trabajo_id, descripcion, mano_de_obra) VALUES
(1, (SELECT id FROM tipos_trabajo WHERE nombre = 'Cambio de aceite y filtros'), 'Realizar cambio de aceite y filtros', 22000.00),
(2, (SELECT id FROM tipos_trabajo WHERE nombre = 'Reparación de frenos'), 'Revisar y reemplazar pastillas delanteras', 35000.00);

INSERT INTO repuestos_usados (trabajo_id, repuesto_id, cantidad, precio_unitario) VALUES
(1, (SELECT id FROM repuestos WHERE nombre = 'Filtro de aceite Toyota Corolla'), 1, 12000.00),
(1, (SELECT id FROM repuestos WHERE nombre = 'Aceite sintético 5W-30 (litro)'), 4.5, 9500.00),
(2, (SELECT id FROM repuestos WHERE nombre = 'Pastillas de freno Ford Ranger'), 1, 38000.00);

INSERT INTO presupuestos (numero, orden_id, fecha_emision, vigencia_dias, estado) VALUES
(1001, 1, CURRENT_DATE, 15, 'ENVIADO'),
(1002, 2, CURRENT_DATE, 10, 'BORRADOR');

INSERT INTO presupuesto_items (presupuesto_id, concepto, descripcion, cantidad, precio_unitario) VALUES
((SELECT id FROM presupuestos WHERE numero = 1001), 'MANO_DE_OBRA', 'Cambio de aceite y filtros', 1, 22000.00),
((SELECT id FROM presupuestos WHERE numero = 1001), 'REPUESTO', 'Filtro de aceite Toyota Corolla', 1, 12000.00),
((SELECT id FROM presupuestos WHERE numero = 1001), 'REPUESTO', 'Aceite sintético 5W-30 (litro)', 4.5, 9500.00),
((SELECT id FROM presupuestos WHERE numero = 1002), 'MANO_DE_OBRA', 'Reparación de frenos', 1, 35000.00),
((SELECT id FROM presupuestos WHERE numero = 1002), 'REPUESTO', 'Pastillas de freno Ford Ranger', 1, 38000.00);

COMMIT;
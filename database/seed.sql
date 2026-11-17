-- Ejecutar DESPUES de crear la base y aplicar database/schema.sql.
-- Ejemplo: psql -U postgres -d "taller-303" -v ON_ERROR_STOP=1 -f dumptaller.sql
-- Seed creado a partir de los datos que quedaron en el servidor privado

BEGIN;

-- public.roles (2 filas)
INSERT INTO public.roles (id, nombre) VALUES
    (1, 'ADMINISTRADOR'),
    (2, 'MECANICO')
ON CONFLICT DO NOTHING;

-- Sin datos para public.permisos

-- public.empleados (8 filas)
INSERT INTO public.empleados (id, nombre, usuario, password_hash, activo) VALUES
    (1, 'Administrador', 'admin', '$2b$10$ZQ8AAy2ZP7NA26E9iks7buT7T9nQOyKmTMNteE79JnBbJpYdrRgCW', true),
    (4, 'Vital Cristian Ezequiel', 'ezequielvital', '$2b$10$CGajvSeRPX/dQE0YtYq6TuOJUEgu0LFsrRMRdSiCzw273RImqp3uW', true),
    (9, 'Thiago de la fuente', 'tdlftest', '$2b$10$WZHYrED5q1L5SlWxXX8uSeSEC.3Cie9if7/mZxJAvvqRFOQsQtO/O', true),
    (10, 'Ezequiel Vital', 'evtest', '$2b$10$lcFNImIux6.CAEZcA/eKyubRIrB4Til41M3uFxBe6fItpMK462be.', true),
    (12, 'ezequielvital2', 'ezequielvital2', '$2b$10$/kb7WqVaoIE62u3e5J7TKuKSrpVTXMADCHTtsaQLExRNrXzUabPJ2', false),
    (13, 'leonardo mataris', 'leo', '$2b$10$lbP4Zd/NiKgFWyn6bxZ8G.poRGgVeGOI6mHBoIlRLRahFrKdUDd5a', true),
    (14, 'Lorena Baigorria', 'pruebademo', '$2b$10$QJJ8CdH.mE2LjQXSH413QuDIhGB3HXYeSrDLXag4Ik6ON7.EKN.RG', true),
    (15, 'Valentina Baglioni', 'purebademo2', '$2b$10$mphNZyUoJwQmXvl84cSS.uxeU33oZBtx4OrhiB0NREcrKpxIVLJJm', true)
ON CONFLICT DO NOTHING;

-- public.clientes (8 filas)
INSERT INTO public.clientes (id, documento, tipo, nombre, telefono, created_at) VALUES
    (1, '46333144', 'PERSONA', 'Thiago De La Fuente', '2665298833', '2026-11-15 20:47:52.328625'),
    (2, '40486229', 'PERSONA', 'Vital Cristian Ezequiel', '2664859891', '2026-11-15 22:16:48.7936'),
    (3, '46807608', 'PERSONA', 'Tadeo Viano Arboit', '2664218002', '2026-11-15 22:55:53.071408'),
    (4, '21761425', 'PERSONA', 'Sergio De La Fuente', '2665298838', '2026-11-15 22:58:45.842838'),
    (5, '20703635', 'PERSONA', 'Hugo Viano', '2664588335', '2026-11-16 09:47:30.738856'),
    (6, '21304356', 'PERSONA', 'Marcos Irusta', '2665321490', '2026-11-16 09:47:54.903225'),
    (7, '40576892', 'PERSONA', 'Juan Perez', '2657123456', '2026-11-16 09:48:22.964779'),
    (8, '40000000', 'PERSONA', 'Laboratorio de Tecnologia', '2664788592', '2026-11-16 11:41:08.887694')
ON CONFLICT DO NOTHING;

-- public.vehiculos (8 filas)
INSERT INTO public.vehiculos (id, patente, marca, modelo, anio, descripcion, kilometraje, created_at) VALUES
    (1, 'AG625NA', 'citroen', 'c3', 2024, '', 30000, '2026-11-15 20:48:49.140982'),
    (2, 'ETX123', 'Ford', 'Eco Sport', 2006, 'Espejos rotos', 500000, '2026-11-15 22:18:58.150317'),
    (3, 'AI444IW', 'Ford', 'Mondeo', 2020, '', 123000, '2026-11-15 22:57:37.034237'),
    (4, 'NLP698', 'volkswagen', 'amarok', 2012, '', 200000, '2026-11-15 23:00:02.335755'),
    (5, 'GOD123', 'Volkswagen', 'Bora', 2009, 'Escape cortado, biturbo, 300hp stage 3', 321000, '2026-11-16 09:49:37.585689'),
    (6, 'AI123IW', 'Chevrolet', 'Spin', 2026, '', 4000, '2026-11-16 09:50:19.407149'),
    (7, 'SET451', 'Ford', 'Focus', 2014, 'Ruido en caja cuando pone reversa', 79000, '2026-11-16 09:51:04.810595'),
    (8, 'ABC123', 'Ford', 'Ka', 2005, '', 123123, '2026-11-16 11:43:48.164981')
ON CONFLICT DO NOTHING;

-- Sin datos para public.conceptos_ficha

-- public.tipos_trabajo (9 filas)
INSERT INTO public.tipos_trabajo (id, nombre, categoria, precio_estandar, activo) VALUES
    (2, 'Suspension', 'MANTENIMIENTO', 80000.00, true),
    (3, 'Cambio de aceite y filtro', 'MANTENIMIENTO', 90000.00, true),
    (1, 'Cambio de frenos', 'MANTENIMIENTO', 20000.00, true),
    (4, 'Electricidad automotriz', 'DIAGNOSTICO', 50000.00, true),
    (5, 'Direccion', 'REPARACION', 45000.00, true),
    (6, 'Aire acondicionado', 'MANTENIMIENTO', 60000.00, true),
    (7, 'Cambio de caja manual', 'REPARACION', 150000.00, true),
    (8, 'Cambio de caja automática', 'REPARACION', 170000.00, true),
    (9, 'Chip tunning', 'MANTENIMIENTO', 250000.00, true)
ON CONFLICT DO NOTHING;

-- public.repuestos (13 filas)
INSERT INTO public.repuestos (id, nombre, precio_estandar, activo) VALUES
    (1, 'Aceite 2t Semi Sintético 4 Litros Bh555', 40000.00, true),
    (2, 'Kit X4 Amortiguadores Sadar P/ Renault 12 - R12', 240000.00, true),
    (4, 'frenos citroen', 40000.00, true),
    (5, 'Pivote Repuesto Aluminio De Espejo Amarok', 18000.00, true),
    (6, 'Pomo Bocha Palanca Cambio Peugeot 307 308 408 Citroen C3 C4', 8000.00, true),
    (7, 'Kit Mangueras Refrigeracion Fiat Siena Palio Strada 1.4 Fire', 80260.00, true),
    (8, 'Direccion de Amarok (Reacondicionada)', 180000.00, true),
    (9, 'Filpint Filtro De Pintura - 1 Y 4 Litros', 36700.00, true),
    (10, 'Filtro Combustible Nafta Universal 0986bf0008 Bosch', 6500.00, true),
    (11, 'Kit X2 Parrillas Delanteras Ford Escort (95/..)', 6500.00, true),
    (12, 'Kit X2 Amortiguadores Traseros Chevrolet Corsa Desde 1991', 69500.00, true),
    (13, 'Forma Juntas Victor Reinz Gris 70ml Sellador Para Juntas', 22600.00, true),
    (14, 'Deposito Bidon Agua + Tapa Fiat Duna Uno Fiorino 147', 19800.00, true)
ON CONFLICT DO NOTHING;

-- public.empleados_roles (7 filas)
INSERT INTO public.empleados_roles (empleado_id, rol_id) VALUES
    (1, 1),
    (9, 1),
    (10, 1),
    (12, 2),
    (13, 2),
    (14, 1),
    (15, 2)
ON CONFLICT DO NOTHING;

-- Sin datos para public.roles_permisos

-- public.duenos (8 filas)
INSERT INTO public.duenos (id_cliente, id_vehiculo, ultima_visita) VALUES
    (1, 1, '2026-11-15 20:49:31.068146'),
    (2, 2, '2026-11-15 22:32:49.058211'),
    (4, 4, '2026-11-15 23:00:45.979167'),
    (3, 3, '2026-11-15 23:01:48.676253'),
    (5, 5, '2026-11-16 09:49:37.585689'),
    (7, 7, '2026-11-16 09:52:38.246773'),
    (6, 6, '2026-11-16 09:53:37.875217'),
    (8, 8, '2026-11-16 11:44:50.377238')
ON CONFLICT DO NOTHING;

-- public.turnos (3 filas)
INSERT INTO public.turnos (id, id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado, created_at) VALUES
    (1, 1, NULL, '2026-11-19 11:11:00', 11, 'Cambio de aceite', 'CONFIRMADO', '2026-11-15 22:16:15.95315'),
    (2, 2, NULL, '2026-11-10 09:04:00', 60, 'qawsda', 'CANCELADO', '2026-11-16 09:04:45.214775'),
    (3, 8, NULL, '2026-11-17 11:41:00', 60, 'Consulta', 'CONFIRMADO', '2026-11-16 11:42:04.970052')
ON CONFLICT DO NOTHING;

-- public.avisos_service (4 filas)
INSERT INTO public.avisos_service (id, id_vehiculo, fecha_prevista, estado, empleado_id, fecha_gestion, created_at) VALUES
    (1, 1, '2027-05-15', 'ENVIADO', 9, '2026-11-15 22:47:05.389225', '2026-11-15 22:41:49.915085'),
    (2, 4, '2027-05-15', 'PENDIENTE', NULL, NULL, '2026-11-15 23:50:40.701808'),
    (3, 6, '2027-05-16', 'PENDIENTE', NULL, NULL, '2026-11-16 09:59:39.123359'),
    (4, 8, '2027-05-16', 'PENDIENTE', NULL, NULL, '2026-11-16 12:01:57.721732')
ON CONFLICT DO NOTHING;

-- public.ordenes_trabajo (9 filas)
INSERT INTO public.ordenes_trabajo (id, id_cliente, id_vehiculo, turno_id, diagnostico, estado, es_service, es_urgencia, garantia_dias, created_at) VALUES
    (2, 2, 2, NULL, NULL, 'DIAGNOSTICANDO', true, false, 15, '2026-11-15 22:32:49.060975'),
    (9, 8, 8, NULL, NULL, 'ENTREGADO', true, false, 15, '2026-11-16 11:44:50.38073'),
    (1, 1, 1, NULL, 'Viene para hacer service', 'ENTREGADO', true, false, 15, '2026-11-15 20:49:31.070839'),
    (3, 3, 3, NULL, NULL, 'CANCELADO', true, false, 15, '2026-11-15 22:58:44.738873'),
    (4, 4, 4, NULL, NULL, 'ENTREGADO', true, false, 15, '2026-11-15 23:00:45.98166'),
    (6, 4, 4, NULL, NULL, 'ENTREGADO', true, false, 15, '2026-05-15 22:32:49.06'),
    (8, 6, 6, NULL, NULL, 'ENTREGADO', true, false, 15, '2026-11-16 09:53:37.877239'),
    (7, 7, 7, NULL, 'Ruido en caja, vibracion en todo el tren delantero', 'CANCELADO', false, true, 15, '2026-11-16 09:52:38.248243'),
    (5, 3, 3, NULL, NULL, 'TERMINADO', true, false, 15, '2026-11-15 23:01:48.678164')
ON CONFLICT DO NOTHING;

-- public.fichas (12 filas)
INSERT INTO public.fichas (id, orden_id, tipo, fecha, kilometraje, conformidad, created_at) VALUES
    (1, 1, 'INGRESO', '2026-11-15 20:49:31.072583', 30000, 'APROBADA', '2026-11-15 20:49:31.072583'),
    (2, 2, 'INGRESO', '2026-11-15 22:32:49.062333', 500000, 'PENDIENTE', '2026-11-15 22:32:49.062333'),
    (3, 1, 'EGRESO', '2026-11-15 22:41:42.749718', 50000, 'APROBADA', '2026-11-15 22:41:42.749718'),
    (4, 3, 'INGRESO', '2026-11-15 22:58:44.739985', 123001, 'APROBADA', '2026-11-15 22:58:44.739985'),
    (6, 5, 'INGRESO', '2026-11-15 23:01:48.679026', 132500, 'APROBADA', '2026-11-15 23:01:48.679026'),
    (5, 4, 'INGRESO', '2026-11-15 23:00:45.982686', 200000, 'APROBADA', '2026-11-15 23:00:45.982686'),
    (7, 4, 'EGRESO', '2026-11-15 23:50:40.24352', 200000, 'APROBADA', '2026-11-15 23:50:40.24352'),
    (9, 8, 'INGRESO', '2026-11-16 09:53:37.878105', 10000, 'APROBADA', '2026-11-16 09:53:37.878105'),
    (8, 7, 'INGRESO', '2026-11-16 09:52:38.249276', 79000, 'APROBADA', '2026-11-16 09:52:38.249276'),
    (10, 8, 'EGRESO', '2026-11-16 09:59:31.181142', 10000, 'APROBADA', '2026-11-16 09:59:31.181142'),
    (11, 9, 'INGRESO', '2026-11-16 11:44:50.382198', 123123, 'APROBADA', '2026-11-16 11:44:50.382198'),
    (12, 9, 'EGRESO', '2026-11-16 12:01:56.717215', 123123, 'APROBADA', '2026-11-16 12:01:56.717215')
ON CONFLICT DO NOTHING;

-- public.trabajos (7 filas)
INSERT INTO public.trabajos (id, orden_id, tipo_trabajo_id, descripcion, mano_de_obra, fecha, estado) VALUES
    (3, 2, 1, NULL, 47500.00, '2026-11-15 22:35:53.153733', 'PENDIENTE'),
    (4, 2, 3, NULL, 90000.00, '2026-11-15 22:36:33.680809', 'PENDIENTE'),
    (5, 1, 1, NULL, 47500.00, '2026-11-15 22:38:10.091162', 'PENDIENTE'),
    (6, 4, 5, 'se le aplicará un cambio de direccion al vehiculo', 45000.00, '2026-11-15 23:49:24.808613', 'PENDIENTE'),
    (7, 8, 3, NULL, 90000.00, '2026-11-16 09:56:07.37976', 'PENDIENTE'),
    (8, 5, 9, NULL, 250000.00, '2026-11-16 10:01:56.691071', 'PENDIENTE'),
    (9, 9, 1, NULL, 20000.00, '2026-11-16 11:49:23.314163', 'PENDIENTE')
ON CONFLICT DO NOTHING;

-- public.presupuestos (7 filas)
INSERT INTO public.presupuestos (id, numero, orden_id, fecha_emision, vigencia_dias, observaciones, estado, fecha_respuesta) VALUES
    (1, 1, 2, NULL, 15, NULL, 'BORRADOR', NULL),
    (2, 2, 2, NULL, 15, NULL, 'BORRADOR', NULL),
    (3, 3, 1, '2026-11-15', 15, NULL, 'APROBADO', '2026-11-15'),
    (4, 4, 4, '2026-11-15', 15, NULL, 'APROBADO', '2026-11-15'),
    (5, 5, 8, '2026-11-16', 15, NULL, 'APROBADO', '2026-11-16'),
    (6, 6, 5, '2026-11-16', 15, NULL, 'APROBADO', '2026-11-16'),
    (7, 7, 9, '2026-11-16', 15, NULL, 'APROBADO', '2026-11-16')
ON CONFLICT DO NOTHING;

-- public.items_ficha (36 filas)
INSERT INTO public.items_ficha (id, ficha_id, concepto_id, concepto, valor) VALUES
    (1, 1, NULL, 'Nivel de combustible', '1/2'),
    (2, 1, NULL, 'Rayones', 'no'),
    (3, 1, NULL, 'Rueda de auxilio', 'Sí'),
    (4, 2, NULL, 'Nivel de combustible', '1/2'),
    (5, 2, NULL, 'Rayones', 'No'),
    (6, 2, NULL, 'Rueda de auxilio', 'Sí'),
    (7, 3, NULL, 'Nivel de combustible', 'Reserva'),
    (8, 3, NULL, 'Rayones', 'no'),
    (9, 3, NULL, 'Rueda de auxilio', 'Sí'),
    (10, 4, NULL, 'Nivel de combustible', '1/2'),
    (11, 4, NULL, 'Rayones', 'Si, la optica'),
    (12, 4, NULL, 'Rueda de auxilio', 'Sí'),
    (13, 5, NULL, 'Nivel de combustible', '1/2'),
    (14, 5, NULL, 'Rayones', 'no'),
    (15, 5, NULL, 'Rueda de auxilio', 'No'),
    (16, 6, NULL, 'Nivel de combustible', '1/4'),
    (17, 6, NULL, 'Rayones', 'Si'),
    (18, 6, NULL, 'Rueda de auxilio', 'Sí'),
    (19, 7, NULL, 'Nivel de combustible', 'Reserva'),
    (20, 7, NULL, 'Rayones', 'no'),
    (21, 7, NULL, 'Rueda de auxilio', 'No'),
    (22, 8, NULL, 'Nivel de combustible', '3/4'),
    (23, 8, NULL, 'Rayones', 'Si, puerta trasera izquierda y falta en espejo izquierdo'),
    (24, 8, NULL, 'Rueda de auxilio', 'Sí'),
    (25, 9, NULL, 'Nivel de combustible', '1/2'),
    (26, 9, NULL, 'Rayones', 'No'),
    (27, 9, NULL, 'Rueda de auxilio', 'Sí'),
    (28, 10, NULL, 'Nivel de combustible', '1/2'),
    (29, 10, NULL, 'Rayones', 'No'),
    (30, 10, NULL, 'Rueda de auxilio', 'Sí'),
    (31, 11, NULL, 'Nivel de combustible', '1/2'),
    (32, 11, NULL, 'Rayones', 'Si'),
    (33, 11, NULL, 'Rueda de auxilio', 'Sí'),
    (34, 12, NULL, 'Nivel de combustible', '1/2'),
    (35, 12, NULL, 'Rayones', 'Si'),
    (36, 12, NULL, 'Rueda de auxilio', 'Sí')
ON CONFLICT DO NOTHING;

-- Sin datos para public.fotos

-- public.repuestos_usados (5 filas)
INSERT INTO public.repuestos_usados (id, trabajo_id, repuesto_id, cantidad, precio_unitario) VALUES
    (1, 3, 2, 2.00, 240000.00),
    (2, 4, 1, 1.00, 40000.00),
    (3, 5, 4, 1.00, 40000.00),
    (4, 6, 8, 1.00, 180000.00),
    (5, 9, 4, 1.00, 40000.00)
ON CONFLICT DO NOTHING;

-- public.trabajos_empleados (7 filas)
INSERT INTO public.trabajos_empleados (trabajo_id, empleado_id) VALUES
    (5, 1),
    (6, 13),
    (7, 4),
    (7, 10),
    (8, 9),
    (9, 14),
    (9, 15)
ON CONFLICT DO NOTHING;

-- public.presupuesto_items (12 filas)
INSERT INTO public.presupuesto_items (id, presupuesto_id, concepto, descripcion, cantidad, precio_unitario, trabajo_id) VALUES
    (1, 1, 'MANO_DE_OBRA', 'Cambio de frenos', 1.00, 47500.00, 3),
    (2, 1, 'REPUESTO', 'Kit X4 Amortiguadores Sadar P/ Renault 12 - R12', 2.00, 240000.00, 3),
    (3, 2, 'MANO_DE_OBRA', 'Cambio de aceite y filtro', 1.00, 90000.00, 4),
    (4, 2, 'REPUESTO', 'Aceite 2t Semi Sintético 4 Litros Bh555', 1.00, 40000.00, 4),
    (7, 3, 'MANO_DE_OBRA', 'Cambio de frenos', 1.00, 47500.00, 5),
    (8, 3, 'REPUESTO', 'frenos citroen', 1.00, 40000.00, 5),
    (11, 4, 'MANO_DE_OBRA', 'Direccion', 1.00, 45000.00, 6),
    (12, 4, 'REPUESTO', 'Direccion de Amarok (Reacondicionada)', 1.00, 180000.00, 6),
    (14, 5, 'MANO_DE_OBRA', 'Cambio de aceite y filtro', 1.00, 90000.00, 7),
    (16, 6, 'MANO_DE_OBRA', 'Chip tunning', 1.00, 250000.00, 8),
    (19, 7, 'MANO_DE_OBRA', 'Cambio de frenos', 1.00, 20000.00, 9),
    (20, 7, 'REPUESTO', 'frenos citroen', 1.00, 40000.00, 9)
ON CONFLICT DO NOTHING;

-- Sincronizar secuencias
SELECT pg_catalog.setval('public.avisos_service_id_seq', 4, true);
SELECT pg_catalog.setval('public.clientes_id_seq', 8, true);
SELECT pg_catalog.setval('public.conceptos_ficha_id_seq', 1, false);
SELECT pg_catalog.setval('public.empleados_id_seq', 15, true);
SELECT pg_catalog.setval('public.fichas_id_seq', 12, true);
SELECT pg_catalog.setval('public.fotos_id_seq', 1, false);
SELECT pg_catalog.setval('public.items_ficha_id_seq', 36, true);
SELECT pg_catalog.setval('public.ordenes_trabajo_id_seq', 9, true);
SELECT pg_catalog.setval('public.permisos_id_seq', 1, false);
SELECT pg_catalog.setval('public.presupuesto_items_id_seq', 20, true);
SELECT pg_catalog.setval('public.presupuestos_id_seq', 7, true);
SELECT pg_catalog.setval('public.repuestos_id_seq', 14, true);
SELECT pg_catalog.setval('public.repuestos_usados_id_seq', 5, true);
SELECT pg_catalog.setval('public.roles_id_seq', 3, true);
SELECT pg_catalog.setval('public.tipos_trabajo_id_seq', 9, true);
SELECT pg_catalog.setval('public.trabajos_id_seq', 9, true);
SELECT pg_catalog.setval('public.turnos_id_seq', 3, true);
SELECT pg_catalog.setval('public.vehiculos_id_seq', 8, true);

COMMIT;


import { pool } from '../../config/db.js';

// Listar trabajos
async function listar() {
    const { rows } = await pool.query(
        `SELECT
            t.id,
            t.orden_id,
            t.tipo_trabajo_id,
            t.descripcion,
            t.fecha,
            t.estado,
            t.mano_de_obra,

            -- Nombre del tipo de trabajo
            (SELECT tt.nombre FROM tipos_trabajo tt WHERE tt.id = t.tipo_trabajo_id) AS tipo_trabajo,

            -- Total de repuestos
            COALESCE(
                SUM(ru.precio_unitario * ru.cantidad), 0
            ) AS total_repuestos,

            -- Total general
            t.mano_de_obra + COALESCE(
                SUM(ru.precio_unitario * ru.cantidad), 0
            ) AS total,

            -- Empleados asociados
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'empleado_id', te.empleado_id,
                            'nombre', e.nombre
                        )
                        ORDER BY e.nombre
                    )
                    FROM trabajos_empleados te
                    JOIN empleados e
                        ON e.id = te.empleado_id
                    WHERE te.trabajo_id = t.id
                ),
                '[]'::json
            ) AS empleados,

            -- Repuestos utilizados
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'repuesto_id', ru_detalle.repuesto_id,
                            'nombre', r.nombre,
                            'precio_unitario', ru_detalle.precio_unitario,
                            'cantidad', ru_detalle.cantidad,
                            'subtotal', ru_detalle.precio_unitario * ru_detalle.cantidad
                        )
                        ORDER BY r.nombre
                    )
                    FROM repuestos_usados ru_detalle
                    JOIN repuestos r
                        ON r.id = ru_detalle.repuesto_id
                    WHERE ru_detalle.trabajo_id = t.id
                ),
                '[]'::json
            ) AS repuestos

        FROM trabajos t

        LEFT JOIN repuestos_usados ru
            ON ru.trabajo_id = t.id

        GROUP BY t.id
        ORDER BY t.fecha DESC, t.id DESC`
    );

    return rows;
}

// Eliminar trabajo
async function eliminar(id) {
    const resultado = await pool.query(
        `DELETE FROM trabajos
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return resultado.rows[0];
}

// Cargar trabajo
async function cargar(datos) {
    const {
        orden_id,
        tipo_trabajo_id,
        descripcion,
        empleados = [],
        mano_de_obra,
        estado,
        repuestos = []
    } = datos;

    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        // 1. Registrar trabajo
        let consulta;

        if (estado !== undefined) {
            consulta = await conexion.query(
                `INSERT INTO trabajos
                    (orden_id, tipo_trabajo_id, descripcion, mano_de_obra, estado)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [
                    orden_id,
                    tipo_trabajo_id,
                    descripcion,
                    mano_de_obra,
                    estado
                ]
            );
        } else {
            consulta = await conexion.query(
                `INSERT INTO trabajos
                    (orden_id, tipo_trabajo_id, descripcion, mano_de_obra)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [
                    orden_id,
                    tipo_trabajo_id,
                    descripcion,
                    mano_de_obra
                ]
            );
        }

        const trabajo = consulta.rows[0];

        // 2. Registrar empleados asociados
        for (const empleado_id of empleados) {
            await conexion.query(
                `INSERT INTO trabajos_empleados
                    (trabajo_id, empleado_id)
                 VALUES ($1, $2)`,
                [
                    trabajo.id,
                    empleado_id
                ]
            );
        }

        // 3. Registrar repuestos utilizados
        for (const repuesto of repuestos) {

            const resultadoRepuesto = await conexion.query(
                `SELECT precio_estandar
                 FROM repuestos
                 WHERE id = $1 AND activo = TRUE`,
                [repuesto.repuesto_id]
            );

            if (resultadoRepuesto.rowCount === 0) {
                throw new Error(
                    `El repuesto con ID ${repuesto.repuesto_id} no existe o está inactivo`
                );
            }

            const precioUnitario =
                resultadoRepuesto.rows[0].precio_estandar;

            await conexion.query(
                `INSERT INTO repuestos_usados
                    (trabajo_id, repuesto_id, cantidad, precio_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [
                    trabajo.id,
                    repuesto.repuesto_id,
                    repuesto.cantidad,
                    precioUnitario
                ]
            );
        }

        await conexion.query('COMMIT');

        return await buscar(trabajo.id);

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
}

// Modificar trabajo
async function modificar(datos) {
    const {
        id,
        orden_id,
        tipo_trabajo_id,
        descripcion,
        empleados,
        mano_de_obra,
        estado,
        repuestos
    } = datos;

    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        // 1. Actualizar información principal
        const resultado = await conexion.query(
            `UPDATE trabajos
             SET orden_id = $1,
                 tipo_trabajo_id = $2,
                 descripcion = $3,
                 mano_de_obra = $4,
                 estado = COALESCE($5, estado)
             WHERE id = $6
             RETURNING *`,
            [
                orden_id,
                tipo_trabajo_id,
                descripcion,
                mano_de_obra,
                estado ?? null,
                id
            ]
        );

        if (resultado.rowCount === 0) {
            throw new Error('El trabajo no existe');
        }

        // 2. Actualizar empleados asociados
        if (empleados !== undefined) {

            // Eliminar relaciones anteriores
            await conexion.query(
                `DELETE FROM trabajos_empleados
                 WHERE trabajo_id = $1`,
                [id]
            );

            // Registrar los nuevos empleados
            for (const empleado_id of empleados) {
                await conexion.query(
                    `INSERT INTO trabajos_empleados
                        (trabajo_id, empleado_id)
                     VALUES ($1, $2)`,
                    [id, empleado_id]
                );
            }
        }

        // 3. Actualizar repuestos utilizados
        if (repuestos !== undefined) {

            // Obtener precios históricos
            const anteriores = await conexion.query(
                `SELECT repuesto_id, precio_unitario
                 FROM repuestos_usados
                 WHERE trabajo_id = $1`,
                [id]
            );

            const preciosAnteriores = new Map(
                anteriores.rows.map((r) => [
                    Number(r.repuesto_id),
                    Number(r.precio_unitario)
                ])
            );

            // Eliminar relaciones anteriores
            await conexion.query(
                `DELETE FROM repuestos_usados
                 WHERE trabajo_id = $1`,
                [id]
            );

            // Registrar nuevamente los repuestos
            for (const repuesto of repuestos) {

                let precioUnitario = preciosAnteriores.get(
                    Number(repuesto.repuesto_id)
                );

                // Si es nuevo, obtener precio actual
                if (precioUnitario === undefined) {

                    const resultadoRepuesto = await conexion.query(
                        `SELECT precio_estandar
                         FROM repuestos
                         WHERE id = $1 AND activo = TRUE`,
                        [repuesto.repuesto_id]
                    );

                    if (resultadoRepuesto.rowCount === 0) {
                        throw new Error(
                            `El repuesto ${repuesto.repuesto_id} no existe o está inactivo`
                        );
                    }

                    precioUnitario = Number(
                        resultadoRepuesto.rows[0].precio_estandar
                    );
                }

                await conexion.query(
                    `INSERT INTO repuestos_usados
                        (trabajo_id, repuesto_id, cantidad, precio_unitario)
                     VALUES ($1, $2, $3, $4)`,
                    [
                        id,
                        repuesto.repuesto_id,
                        repuesto.cantidad,
                        precioUnitario
                    ]
                );
            }
        }

        await conexion.query('COMMIT');

        return await buscar(id);

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
}

// Buscar trabajo por ID
async function buscar(id) {
    const resultado = await pool.query(
        `SELECT
            t.id,
            t.orden_id,
            t.tipo_trabajo_id,
            t.descripcion,
            t.fecha,
            t.estado,
            t.mano_de_obra,

            -- Nombre del tipo de trabajo
            (SELECT tt.nombre FROM tipos_trabajo tt WHERE tt.id = t.tipo_trabajo_id) AS tipo_trabajo,

            -- Total de repuestos
            COALESCE(
                (SELECT SUM(ru.precio_unitario * ru.cantidad)
                 FROM repuestos_usados ru
                 WHERE ru.trabajo_id = t.id),
                0
            ) AS total_repuestos,

            -- Total general
            t.mano_de_obra + COALESCE(
                (SELECT SUM(ru.precio_unitario * ru.cantidad)
                 FROM repuestos_usados ru
                 WHERE ru.trabajo_id = t.id),
                0
            ) AS total,

            -- Empleados asociados
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'empleado_id', te.empleado_id,
                            'nombre', e.nombre
                        )
                        ORDER BY e.nombre
                    )
                    FROM trabajos_empleados te
                    JOIN empleados e
                        ON e.id = te.empleado_id
                    WHERE te.trabajo_id = t.id
                ),
                '[]'
            ) AS empleados,

            -- Repuestos utilizados
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'repuesto_id', ru.repuesto_id,
                            'nombre', r.nombre,
                            'precio_unitario', ru.precio_unitario,
                            'cantidad', ru.cantidad,
                            'subtotal', ru.precio_unitario * ru.cantidad
                        )
                    )
                    FROM repuestos_usados ru
                    JOIN repuestos r
                        ON r.id = ru.repuesto_id
                    WHERE ru.trabajo_id = t.id
                ),
                '[]'
            ) AS repuestos

        FROM trabajos t
        WHERE t.id = $1`,
        [id]
    );

    return resultado.rows[0];
}

// Buscar tipo de trabajo
async function buscarTipoTrabajo(id) {
    const { rows } = await pool.query(
        `SELECT *
         FROM tipos_trabajo
         WHERE id = $1`,
        [id]
    );

    return rows[0];
}

// Listar tipos de trabajo
async function listarTipos() {
    const { rows } = await pool.query(
        `SELECT *
         FROM tipos_trabajo
         ORDER BY id`
    );

    return rows;
}

export default {
    listar,
    cargar,
    eliminar,
    modificar,
    buscar,
    buscarTipoTrabajo,
    listarTipos
};

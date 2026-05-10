const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite que tu front (puerto diferente o file://) se comunique con el back
app.use(express.json());

// Configuración de conexión (Ajusta con tus datos)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'seleccionRH',
  password: 'Pr0m3t4lic0$2024*',
  //port: 5433, //Para el portatil
  port: 5432,
});

// Ruta de prueba para verificar conexión
app.get('/test', (req, res) => {
    res.send('El servidor está funcionando correctamente');
});

// Ruta para autenticación de usuarios
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    console.log("Intento de login para:", usuario); // Esto te ayudará a ver si llega la petición

    try {
        const query = 'SELECT * FROM usuarios WHERE usuario = $1 AND password = $2 AND activo = true';
        const result = await pool.query(query, [usuario, password]);

        if (result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Usuario o clave incorrectos' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error interno' });
    }
});

// Ruta para guardar calificaciones
app.post('/guardar-calificacion', async (req, res) => {
  // Extraemos todos los campos que vienen del formulario
  const { 
    nombre_candidato, cargo_candidato, nombre_calificador, 
    cargo_calificador, puntaje_tecnico, puntaje_entrevista, 
    apto, observacion, numero_requisicion 
  } = req.body;

  try {
    const query = `
      INSERT INTO "dataCalificacion" 
      (nombre_candidato, cargo_candidato, nombre_calificador, cargo_calificador, 
       puntaje_tecnico, puntaje_entrevista, apto, observacion, numero_requisicion) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    
    const values = [
      nombre_candidato, cargo_candidato, nombre_calificador, 
      cargo_calificador, puntaje_tecnico, puntaje_entrevista, 
      apto, observacion, numero_requisicion
    ];

    const result = await pool.query(query, values);
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error en Postgres:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ruta para buscar candidatos por nombre o número de requisición
app.post('/buscar-candidato', async (req, res) => {

  const { tipo, valor } = req.body;

  try {

    let query = '';
    let params = [];

    // Buscar por nombre
    if (tipo === 'nombre') {

      query = `
        SELECT * 
        FROM "dataCalificacion"
        WHERE nombre_candidato ILIKE $1
      `;

      params = [`%${valor}%`];

    }

    // Buscar por cédula o requisición
    else {

      query = `
        SELECT * 
        FROM "dataCalificacion"
        WHERE numero_requisicion = $1
      `;

      params = [valor];

    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error("Error en búsqueda:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// Ruta para guardar seguimiento
app.post('/guardar-seguimiento', async (req, res) => {

  // Extraer datos enviados desde el frontend
  const {
    nombre_candidato,
    cargo_candidato,
    telefono_candidato,
    correo_candidato,
    fecha_postulacion,
    numero_requisicion,
    estado,
    observacion
  } = req.body;

  try {

    const query = `
      INSERT INTO "dataSeguimiento"
      (
        nombre_candidato,
        cargo_candidato,
        telefono_candidato,
        correo_candidato,
        fecha_postulacion,
        numero_requisicion,
        estado,
        observacion
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      nombre_candidato,
      cargo_candidato,
      telefono_candidato,
      correo_candidato,
      fecha_postulacion,
      numero_requisicion || null,
      estado,
      observacion || null
    ];

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error("Error guardando seguimiento:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// Ruta para buscar seguimientos
app.post('/buscar-seguimiento', async (req, res) => {

  const { nombre, cargo } = req.body;

  try {

    let query = `SELECT * FROM "dataSeguimiento" WHERE 1=1`;
    const params = [];

    if (nombre && nombre.trim() !== '') {
      query += ` AND nombre_candidato ILIKE $${params.length + 1}`;
      params.push(`%${nombre}%`);
    }

    if (cargo && cargo.trim() !== '') {
      query += ` AND cargo_candidato ILIKE $${params.length + 1}`;
      params.push(`%${cargo}%`);
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error("Error en búsqueda de seguimiento:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// Ruta para actualizar seguimiento
app.put('/actualizar-seguimiento', async (req, res) => {

    try {

        const {
            id_registro,
            nombre_candidato,
            telefono_candidato,
            correo_candidato,
            estado,
            observacion
        } = req.body;

        const query = `
            UPDATE "dataSeguimiento"
            SET
                nombre_candidato = $1,
                telefono_candidato = $2,
                correo_candidato = $3,
                estado = $4,
                observacion = $5
            WHERE id_registro = $6
            RETURNING *
        `;

        const result = await pool.query(query, [
            nombre_candidato,
            telefono_candidato,
            correo_candidato,
            estado,
            observacion,
            id_registro
        ]);

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        console.error("Error actualizando seguimiento:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor de RH corriendo en http://localhost:${PORT}`);
});
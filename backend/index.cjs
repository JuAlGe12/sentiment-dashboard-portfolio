require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/mentions', async (req, res) => { // <--- ¡Añadimos "async" aquí!
  const { brand } = req.query;

  try {
    let query = 'SELECT * FROM brand_mentions ORDER BY created_at DESC';
    const params = [];

    if (brand) {
      query = 'SELECT * FROM brand_mentions WHERE brand_name = $1 ORDER BY created_at DESC';
      params.push(brand);
    }
    
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las menciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
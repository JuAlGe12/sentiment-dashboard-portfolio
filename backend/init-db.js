const db = require('./db');

async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS brand_mentions (
      id SERIAL PRIMARY KEY,
      brand_name VARCHAR(100) NOT NULL,
      mention_text TEXT NOT NULL,
      source VARCHAR(50) NOT NULL,
      sentiment VARCHAR(10) CHECK (sentiment IN ('positive', 'negative', 'neutral')),
      score NUMERIC(5, 4),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(createTableQuery);
    console.log('Tabla "brand_mentions" creada o ya existente.');
  } catch (err) {
    console.error('Error al crear la tabla:', err.stack);
  }
}

initializeDatabase();
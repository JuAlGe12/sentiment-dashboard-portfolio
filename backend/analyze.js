const Sentiment = require('sentiment');
const db = require('./db');

// Inicializamos la librería de análisis
const sentiment = new Sentiment();

async function analyzeMentions() {
  try {
    console.log('Buscando menciones sin analizar...');
    
    // 1. Obtenemos todas las menciones donde el sentimiento es nulo
    const { rows: mentionsToAnalyze } = await db.query(
      'SELECT id, mention_text FROM brand_mentions WHERE sentiment IS NULL'
    );

    if (mentionsToAnalyze.length === 0) {
      console.log('No hay menciones nuevas para analizar. ¡Todo al día!');
      return;
    }

    console.log(`Se encontraron ${mentionsToAnalyze.length} menciones. Analizando...`);

    // 2. Iteramos sobre cada mención y la analizamos
    for (const mention of mentionsToAnalyze) {
      const { id, mention_text } = mention;

      // Usamos la librería para obtener el resultado del análisis
      const result = sentiment.analyze(mention_text);
      const score = result.comparative; // Un puntaje normalizado de -5 a 5

      let sentimentLabel;
      // 3. Traducimos el puntaje a una etiqueta simple
      if (score > 0.5) {
        sentimentLabel = 'positive';
      } else if (score < -0.5) {
        sentimentLabel = 'negative';
      } else {
        sentimentLabel = 'neutral';
      }
      
      // 4. Actualizamos la base de datos con el resultado
      await db.query(
        'UPDATE brand_mentions SET sentiment = $1, score = $2 WHERE id = $3',
        [sentimentLabel, score, id]
      );
    }

    console.log('¡Análisis completado con éxito!');

  } catch (error) {
    console.error('Ocurrió un error durante el análisis:', error);
  }
}

analyzeMentions();
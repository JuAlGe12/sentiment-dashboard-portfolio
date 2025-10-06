const { faker } = require('@faker-js/faker');
const db = require('./db');

const BRANDS = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Coca-Cola'];
const NUM_MENTIONS = 100; // Generaremos 100 menciones en total

const positiveKeywords = ['amazing', 'love', 'best', 'excellent', 'perfect', 'fantastic'];
const negativeKeywords = ['terrible', 'hate', 'worst', 'awful', 'disappointed', 'problem'];
const sources = ['Twitter', 'Facebook', 'Reddit'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedDatabase() {
  try {
    console.log('Limpiando la tabla de menciones...');
    await db.query('TRUNCATE TABLE brand_mentions RESTART IDENTITY CASCADE');

    console.log(`Generando ${NUM_MENTIONS} menciones falsas...`);

    const mentions = [];
    for (let i = 0; i < NUM_MENTIONS; i++) {
      const brand = getRandomElement(BRANDS);
      let text = '';
      const coinToss = Math.random();

      // Generar texto con sentimiento mixto
      if (coinToss > 0.65) { // 35% de probabilidad de ser negativo
        text = `I really ${getRandomElement(negativeKeywords)} the new product from @${brand}. ${faker.lorem.sentence()}`;
      } else if (coinToss > 0.35) { // 30% de prob de ser positivo
        text = `Just got my new @${brand} device, it's ${getRandomElement(positiveKeywords)}! ${faker.lorem.sentence()}`;
      } else { // 35% de prob de ser neutral
        text = `Thinking about buying something from @${brand}. ${faker.lorem.sentence()}`;
      }

      mentions.push([
        brand,
        text,
        getRandomElement(sources),
        // Dejamos sentiment y score nulos por ahora, los calcularemos en el día 3
      ]);
    }

    // Usamos una sola consulta para insertar todas las menciones (más eficiente)
    for (const mention of mentions) {
      const query = 'INSERT INTO brand_mentions (brand_name, mention_text, source) VALUES ($1, $2, $3)';
      await db.query(query, mention);
    }

    console.log('¡Base de datos poblada con éxito!');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    // Es buena práctica cerrar el pool de conexiones si el script termina
    // pero nuestro db.js no exporta el pool. En una app real lo haríamos.
  }
}

seedDatabase();
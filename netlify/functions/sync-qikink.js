const { Client } = require('pg');
const fetch = require('node-fetch');

exports.handler = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // 1. Fetch from Qikink
    const qikinkRes = await fetch("https://api.qikink.com/v1/products", {
      headers: { "Authorization": `Bearer ${process.env.QIKINK_API_KEY}` }
    });
    const data = await qikinkRes.json();
    const products = data.products || [];

    // 2. Loop and save to Neon (Inventory Cache)
    for (const prod of products) {
      await client.query(
        `INSERT INTO inventory_cache (sku, name, price, image_url, last_updated)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (sku) 
         DO UPDATE SET name = $2, price = $3, image_url = $4, last_updated = NOW()`,
        [prod.sku, prod.name, prod.price, prod.image_url]
      );
    }

    return { statusCode: 200, body: JSON.stringify({ message: `Synced ${products.length} products` }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.end();
  }
};


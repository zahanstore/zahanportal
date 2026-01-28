const { Client } = require('pg');
const fetch = require('node-fetch');

exports.handler = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Starting Sync...");
    await client.connect();

    // 1. Get Access Token
    const authRes = await fetch("https://api.qikink.com/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.QIKINK_CLIENT_ID,
        client_secret: process.env.QIKINK_CLIENT_SECRET,
        grant_type: "client_credentials"
      })
    });
    
    const authData = await authRes.json();
    if (!authData.access_token) throw new Error("Could not get Qikink Token. Check Credentials.");

    // 2. Fetch Products
    const qikinkRes = await fetch("https://api.qikink.com/v1/products", {
      headers: { "Authorization": `Bearer ${authData.access_token}` }
    });
    const data = await qikinkRes.json();
    
    // Qikink sometimes wraps products in data.data or data.products
    const products = data.products || data.data || [];
    console.log(`Found ${products.length} products to sync.`);

    // 3. Update Neon
    for (const prod of products) {
      // Mapping Qikink fields to your Neon table fields
      await client.query(
        `INSERT INTO inventory_cache (sku, name, price, image_url, last_updated)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (sku) 
         DO UPDATE SET name = $2, price = $3, image_url = $4, last_updated = NOW()`,
        [prod.sku, prod.name, prod.price, prod.image_url || prod.image]
      );
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: `Successfully synced ${products.length} products.` }) 
    };

  } catch (err) {
    console.error("Sync Error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.end();
  }
};


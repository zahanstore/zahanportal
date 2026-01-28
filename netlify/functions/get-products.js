const fetch = require('node-fetch');

exports.handler = async () => {
  const API_KEY = process.env.QIKINK_API_KEY;
  const QIKINK_URL = "https://api.qikink.com/"; // Verify this URL in Qikink docs

  try {
    const response = await fetch(QIKINK_URL, {
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.products || data) 
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};


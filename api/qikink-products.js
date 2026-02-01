export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;
    const BASE_URL = "https://sandbox.qikink.com"; // Change to api.qikink.com for Live

    try {
        // 1. Get Access Token
        const tokenResponse = await fetch(`${BASE_URL}/api/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ClientId: CLIENT_ID,
                client_secret: CLIENT_SECRET
            })
        });
        const tokenData = await tokenResponse.json();
        const token = tokenData.Accesstoken;

        // 2. Fetch Products using the token
        const productResponse = await fetch(`${BASE_URL}/api/products`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const products = await productResponse.json();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch from Qikink Sandbox" });
    }
}

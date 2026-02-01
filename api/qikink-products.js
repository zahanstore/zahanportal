let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;
    const BASE_URL = "https://sandbox.qikink.com"; 

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if we have a valid cached token
        if (!cachedToken || currentTime >= tokenExpiry) {
            const tokenRes = await fetch(`${BASE_URL}/api/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ClientId: CLIENT_ID, client_secret: CLIENT_SECRET })
            });
            const tokenData = await tokenRes.json();
            
            cachedToken = tokenData.Accesstoken;
            // Set expiry 1 minute early to be safe
            tokenExpiry = currentTime + (parseInt(tokenData.expires_in) - 60); 
        }

        const productRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${cachedToken}` }
        });
        const products = await productRes.json();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "API Connection Failed" });
    }
}

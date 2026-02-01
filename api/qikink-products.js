let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;
    const BASE_URL = "https://sandbox.qikink.com"; 

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        // 1. TOKEN CACHING LOGIC
        if (!cachedToken || currentTime >= tokenExpiry) {
            const tokenRes = await fetch(`${BASE_URL}/api/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ClientId: CLIENT_ID, 
                    client_secret: CLIENT_SECRET 
                })
            });
            
            const tokenData = await tokenRes.json();
            
            if (tokenData.Accesstoken) {
                cachedToken = tokenData.Accesstoken;
                // Cache for the duration Qikink specifies (minus 60 seconds safety margin)
                tokenExpiry = currentTime + (parseInt(tokenData.expires_in) - 60);
            } else {
                throw new Error("Failed to obtain access token");
            }
        }

        // 2. FETCH PRODUCTS
        const productRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${cachedToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await productRes.json();
        
        // Return the data directly
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Qikink API Error:", error);
        res.status(500).json({ error: "API Connection Failed", details: error.message });
    }
}

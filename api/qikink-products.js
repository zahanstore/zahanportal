// Global variables for in-memory caching to respect the 30-req/min limit
let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;
    const BASE_URL = "https://sandbox.qikink.com";

    // 1. Safety Check: Ensure Vercel has the keys
    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ error: "Environment variables missing on Vercel." });
    }

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        // 2. TOKEN LOGIC: Fetch new token only if cached one is expired
        if (!cachedToken || currentTime >= tokenExpiry) {
            console.log("Token expired or missing. Fetching new token...");
            
            // Qikink prefers credentials as URLSearchParams (form-data)
            const params = new URLSearchParams();
            params.append('ClientId', CLIENT_ID);
            params.append('client_secret', CLIENT_SECRET);

            const tokenRes = await fetch(`${BASE_URL}/api/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            });

            const tokenData = await tokenRes.json();

            if (!tokenRes.ok || !tokenData.Accesstoken) {
                return res.status(401).json({ 
                    error: "Qikink Authentication Failed", 
                    details: tokenData 
                });
            }

            // Cache the token
            cachedToken = tokenData.Accesstoken;
            // Set expiry with a 60-second buffer
            tokenExpiry = currentTime + (parseInt(tokenData.expires_in) - 60);
        }

        // 3. PRODUCT FETCH: Using the /v1/ route to avoid 404 errors
        // We try the standard v1 route first
        let productRes = await fetch(`${BASE_URL}/api/v1/products`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${cachedToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Fallback: If v1 returns 404, try the direct api/products route
        if (productRes.status === 404) {
            productRes = await fetch(`${BASE_URL}/api/products`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${cachedToken}` }
            });
        }

        const data = await productRes.json();

        // 4. Handle Case where Sandbox is empty
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return res.status(200).json({ 
                message: "Connected, but no products found in Sandbox.",
                products: [] 
            });
        }

        // Return successful data
        return res.status(200).json(data);

    } catch (error) {
        console.error("Internal Server Error:", error.message);
        return res.status(500).json({ 
            error: "Internal Server Error", 
            message: error.message 
        });
    }
}


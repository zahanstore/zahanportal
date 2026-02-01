// Global variables for caching (staying under the 30-req limit)
let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    // 1. Check if Environment Variables exist
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error("CRITICAL ERROR: Environment Variables Missing");
        return res.status(500).json({ error: "Server Configuration Error: Missing API Keys" });
    }

    const BASE_URL = "https://sandbox.qikink.com"; 

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        // 2. TOKEN LOGIC
        if (!cachedToken || currentTime >= tokenExpiry) {
            console.log("Fetching new Access Token from Qikink...");
            const tokenRes = await fetch(`${BASE_URL}/api/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ClientId: CLIENT_ID, 
                    client_secret: CLIENT_SECRET 
                })
            });

            if (!tokenRes.ok) {
                const errorText = await tokenRes.text();
                console.error("Qikink Token Error:", errorText);
                return res.status(500).json({ error: "Qikink rejected our credentials", details: errorText });
            }

            const tokenData = await tokenRes.json();
            cachedToken = tokenData.Accesstoken;
            tokenExpiry = currentTime + (parseInt(tokenData.expires_in) - 60);
        }

        // 3. PRODUCT FETCH
        console.log("Fetching products using token...");
        const productRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${cachedToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!productRes.ok) {
            throw new Error(`Qikink Product API returned ${productRes.status}`);
        }

        const data = await productRes.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Internal Function Crash:", error.message);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

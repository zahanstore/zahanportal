let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;

    // Log to Vercel dashboard (internal logs only) to verify variables are loaded
    console.log("Checking Credentials...");
    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ error: "Environment variables are missing on Vercel." });
    }

    const BASE_URL = "https://sandbox.qikink.com"; 

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        if (!cachedToken || currentTime >= tokenExpiry) {
            // Using URLSearchParams is often more reliable for Token endpoints
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
                console.error("Qikink rejected credentials:", tokenData);
                return res.status(401).json({ 
                    error: "Qikink Authentication Failed", 
                    details: tokenData 
                });
            }

            cachedToken = tokenData.Accesstoken;
            tokenExpiry = currentTime + (parseInt(tokenData.expires_in) - 60);
        }

        const productRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${cachedToken}` }
        });

        const data = await productRes.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}


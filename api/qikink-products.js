let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;
    const BASE_URL = "https://sandbox.qikink.com";

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        // 1. AUTHENTICATION (Working)
        if (!cachedToken || currentTime >= tokenExpiry) {
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
                return res.status(401).json({ error: "Auth Failed", details: tokenData });
            }

            cachedToken = tokenData.Accesstoken;
            tokenExpiry = currentTime + (parseInt(tokenData.expires_in) - 60);
        }

        // 2. THE FETCH (Targeting the specific Qikink V1 route)
        // Note: Qikink Sandbox often requires /v1/ to be lowercase
        const productRes = await fetch(`${BASE_URL}/api/v1/products`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${cachedToken}`,
                'Content-Type': 'application/json'
            }
        });

        const rawResponse = await productRes.text();
        
        // If we get data, parse and return
        if (productRes.ok) {
            const data = JSON.parse(rawResponse);
            return res.status(200).json(data);
        }

        // If we still get a 404, we'll return a helpful debug message
        return res.status(productRes.status).json({
            error: `Qikink Sandbox returned ${productRes.status}`,
            path_tried: "/api/v1/products",
            server_response: rawResponse.substring(0, 200) // First 200 chars of the error
        });

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}


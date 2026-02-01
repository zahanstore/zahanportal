let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;
    const BASE_URL = "https://sandbox.qikink.com";

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        // 1. AUTHENTICATION
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

        // 2. THE WATERFALL FETCH (Trying multiple Sandbox routes)
        const routes = [
            `${BASE_URL}/api/v1/products`,      // Most likely for Sandbox
            `${BASE_URL}/api/products`,         // Standard
            `${BASE_URL}/api/v1/get_products`   // Legacy Sandbox
        ];

        let finalData = null;
        let lastError = null;

        for (let route of routes) {
            console.log(`Trying route: ${route}`);
            const productRes = await fetch(route, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${cachedToken}` }
            });

            if (productRes.ok) {
                finalData = await productRes.json();
                break; // Exit loop if we get a 200 OK
            } else {
                lastError = await productRes.text();
            }
        }

        if (finalData) {
            return res.status(200).json(finalData);
        } else {
            // If all routes fail, return the last error encountered
            return res.status(404).json({
                error: "All Sandbox product routes returned 404",
                message: "Ensure you have created products in the Sandbox Dashboard.",
                last_raw_error: lastError
            });
        }

    } catch (error) {
        return res.status(500).json({ error: "Server Error", message: error.message });
    }
}


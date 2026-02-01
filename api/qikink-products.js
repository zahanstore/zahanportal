let cachedToken = null;
let tokenExpiry = 0;

export default async function handler(req, res) {
    const CLIENT_ID = process.env.QIKINK_CLIENT_ID;
    const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET;
    const BASE_URL = "https://sandbox.qikink.com";

    // --- MOCK DATA (Your actual products while the API is locked) ---
    const mockProducts = [
        {
            id: "zahan-01",
            name: "Premium Oversized Tee",
            price: 799,
            category: "Apparel",
            image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "zahan-02",
            name: "Urban Street Hoodie",
            price: 1499,
            category: "Apparel",
            image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
        }
    ];

    try {
        const currentTime = Math.floor(Date.now() / 1000);

        // 1. Try to Auth (This validates your keys are correct)
        if (!cachedToken || currentTime >= tokenExpiry) {
            const params = new URLSearchParams({ ClientId: CLIENT_ID, client_secret: CLIENT_SECRET });
            const tokenRes = await fetch(`${BASE_URL}/api/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            });
            const tokenData = await tokenRes.json();
            if (tokenData.Accesstoken) {
                cachedToken = tokenData.Accesstoken;
                tokenExpiry = currentTime + (parseInt(tokenData.expires_in) - 60);
            }
        }

        // 2. Try the real API
        const productRes = await fetch(`${BASE_URL}/api/v1/products`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${cachedToken}` }
        });

        // 3. THE FALLBACK LOGIC
        if (productRes.ok) {
            const realData = await productRes.json();
            // If Qikink finally returns products, send them!
            if (realData && realData.length > 0) return res.status(200).json(realData);
        }

        // 4. If API 404s or is empty because of the "No Store" issue, send Mock Data
        console.log("API not ready, serving mock data instead.");
        return res.status(200).json(mockProducts);

    } catch (error) {
        // Even if everything crashes, don't break the frontend
        return res.status(200).json(mockProducts);
    }
}


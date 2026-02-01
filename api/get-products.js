export default async function handler(req, res) {
    const API_KEY = process.env.QIKINK_API_KEY; // Set this in Vercel Dashboard
    
    try {
        const response = await fetch('https://qikink.com/api/v1/products', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch from Qikink" });
    }
}


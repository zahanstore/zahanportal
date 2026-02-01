import Razorpay from 'razorpay';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { amount } = JSON.parse(req.body);

    const instance = new Razorpay({
        key_id: "rzp_live_SAq711xB58uR33", // Ensure this matches your public key
        key_secret: process.env.RAZORPAY_SECRET, // Must be in Vercel Env Variables
    });

    try {
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise (INR * 100)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: "Failed to create order", details: error.message });
    }
}


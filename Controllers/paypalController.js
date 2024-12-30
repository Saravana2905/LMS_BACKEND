const paypal = require("@paypal/checkout-server-sdk");
const { response } = require("express");
require("dotenv").config();


const plans = [
    {
        plan_id: "P-5CK70515E6264735YM5XIW3I",
        plan_name: "Standard",
        duration: "month",
    },
];

const generateToken = async () => {
    try {
        
        const client_ID = process.env.PAYPAL_CLIENT_ID;
        const client_Secret = process.env.PAYPAL_CLIENT_SECRET;
        console.log({ client_ID, client_Secret });
        if (!client_ID || !client_Secret) {
            throw new Error("Paypal credentials are required");
        }
    
        const auth = Buffer.from(`${client_ID}:${client_Secret}`).toString("base64");
        console.log({auth});
    
        const url = `https://api-m.sandbox.paypal.com/v1/oauth2/token`;
        console.log({auth})
    
        const response = await fetch(url, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const data = await response.json();
        console.log("Token Response:", data);

        if (!data.access_token) {
            throw new Error(data.error_description || "Failed to generate token");
        } 

        return data.access_token;
    } catch (error) {
        console.log(error);
        throw error;
        
    }
};

exports.createSubscription = async (req, res) => {
    const { plan_name, duration } = req.body;
    const plan = plans.find(
        (p) => p.duration === duration && p.plan_name === plan_name
    );
    if (!plan) {
        return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    try {
        const accessToken = await generateToken();
        console.log({ accessToken });

        const url = `https://api-m.sandbox.paypal.com/v1/billing/subscriptions`; // Corrected "bilings" to "billing"
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                prefer: "return=representation",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                plan_id: plan.plan_id,
                application_context: {
                    user_action: "SUBSCRIBE_NOW",
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("PayPal API Error:", errorData);
            return res.status(response.status).json({ success: false, error: errorData });
        }

        const data = await response.json();
        return res
            .status(200)
            .json({ success: true, paypalSubscription: data, status: data.status });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



exports.savePayment = async (req, res)=>{
    const {orderID, subscriptionID} = req.body;
    if(!orderID || !subscriptionID){
        return res.status(400).json({success: false, message: "Order Id and Subscription Id are required"});
    }
    const url = `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}/transactions`;
    const accessToken = await generateToken();
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            prefer: "return=representation",
            Authorization: `Bearer ${accessToken}`,
        }
    });

        const paypaldata = await response.json();
        console.log(paypaldata);
        return res.status(200).json({success: true, data: paypaldata});
}




// const clientId =
//     "AdaFnxz7WSyc_9CS3lC3c676g2FRBR0anboWuMcklhPK4B2HbNkfmeyWevp55NHYAfEJ1AwV03YjLk5b";
// const clientSecret =
//     "EBlpJHjI9yaKNMyZyKKRrRtnYwK--y2pUVX5TIu8sCsg1osZjN4Ydx_XENXRkefJlgB6F-_BnqfFskvZ";

// const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// const client = new paypal.core.PayPalHttpClient(environment);

// exports.createOrder = async (req, res) => {
//     const request = new paypal.orders.OrdersCreateRequest();
//     request.requestBody({
//         intent: "CAPTURE",
//         purchase_units: [
//             {
//                 amount: {
//                     currency_code: "USD",
//                     value: "199.00", // Set your amount here
//                 },
//             },
//         ],
//     });

//     try {
//         const order = await client.execute(request);
//         res.json({ id: order.result.id });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error creating PayPal order");
//     }
// };
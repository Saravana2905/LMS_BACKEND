const paypal = require('@paypal/checkout-server-sdk');
const clientId = 'AdaFnxz7WSyc_9CS3lC3c676g2FRBR0anboWuMcklhPK4B2HbNkfmeyWevp55NHYAfEJ1AwV03YjLk5b';
const clientSecret = 'EBlpJHjI9yaKNMyZyKKRrRtnYwK--y2pUVX5TIu8sCsg1osZjN4Ydx_XENXRkefJlgB6F-_BnqfFskvZ';

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const createOrder = async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '199.00', // Set your amount here
            },
        }],
    });

    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating PayPal order');
    }
};

module.exports = { createOrder };

const express = require('express');
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');
const app = express();

paypal.configure({
    'mode': 'sandbox', // Set to 'live' for production
    'clientID': 'YOUR_CLIENT_ID',
    'clientSecret': 'YOUR_CLIENT_SECRET'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/create-product', (req, res) => {
    const product = {
        name: 'Subscription Plan',
        description: 'Monthly subscription plan',
        type: 'SERVICE',
        category: 'SOFTWARE',
        image_url: 'https://example.com/image.jpg',
        home_url: 'https://example.com/home'
    };

    paypal.catalogs.products.create(product, (error, result) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(result);
        }
    });
});


app.post('/create-subscription', (req, res) => {
    const plan = {
        name: 'Monthly Subscription',
        description: 'Monthly subscription plan',
        billing_cycles: '12',
        pricing_scheme: {
            fixed_price: {
                value: '10.00',
                currency: 'USD'
            }
        },
        payment_preferences: {
            payment_failure: {
                payer_email_address: {
                    notify_on_failure: true
                }
            }
        }
    };

    paypal.subscriptions.plans.create(plan, (error, result) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(result);
        }
    });
});


app.post('/subscribe', (req, res) => {
    const planId = req.body.plan_id;
    const subscription = {
        plan_id: planId,
        payment_preferences: {
            payment_failure: {
                payer_email_address: {
                    notify_on_failure: true
                }
            }
        }
    };

    paypal.subscriptions.create(subscription, (error, result) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(result);
        }
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

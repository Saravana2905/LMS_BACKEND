const axios = require('axios');
require('dotenv').config();

exports.createsubscription = async (req, res) => {
    try {
        const {firstname, lastname, email, } = req.body
      // Use request body values if provided, otherwise fallback to defaults.
      const {
        plan_id = process.env.PAYPAL_PLAN_ID,
        start_time = new Date(Date.now() + 86400000).toISOString(), // defaults to tomorrow
        shipping_amount = { currency_code: "USD", value: "1.00" },
        subscriber = {
          name: { given_name: firstname, surname: lastname },
          email_address: email,
        },
        application_context = {
          brand_name: "TITA Technologies Inc",
          locale: "en-US",
          shipping_preference: "SET_PROVIDED_ADDRESS",
          user_action: "SUBSCRIBE_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
          },
          return_url: "https://example.com/return",
          cancel_url: "https://titatechnology.com"
        }
      } = req.body;
  
      const data = JSON.stringify({
        plan_id,
        start_time,
        shipping_amount,
        subscriber,
        application_context
      });
  
      // Retrieve PayPal access token
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
      console.log('client Id---->',process.env.PAYPAL_CLIENT_ID)
      console.log('client secret---->',process.env.PAYPAL_CLIENT_SECRET)
      console.log('Auth---->',auth)
      const tokenResponse = await axios.post(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      const accessToken = tokenResponse.data.access_token;
  
      const subscriptionConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        // Use your base_url from config or fallback to sandbox endpoint.
        url: `${process.env.PAYPAL_BASE_URL}/v1/billing/subscriptions`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, 
          'PayPal-Request-Id': 'cac09070-ae40-4e8b-b2dc-bbf0e0f296d689',
          'Prefer': 'return=representation'
        },
        data: data
      };
  
      const subscriptionResponse = await axios.request(subscriptionConfig);
    //   console.log("subscriptionResponse----->", subscriptionResponse);
      console.log("subscriptionLink--->",subscriptionResponse.data.links[0])
      res.json({
        status:200,
        subscriptionLink:subscriptionResponse.data.links[0]
      });
    } catch (error) {
      console.error("error----->", error.response ? error.response.data : error);
      res.status(500).send('An error occurred');
    }
  }
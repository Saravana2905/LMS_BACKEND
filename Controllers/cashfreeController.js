const axios = require('axios');
const { v4: uuidv4 } = require('uuid');


exports.CreatePlans = async (req, res) => {
    try {
        // Plan ID as a constant
        const PLAN_ID = 'P-01202002';
        const response = await axios.post(`${BASE_URL}/plans`, {
          plan_id: PLAN_ID,
          plan_name: 'Premium_10',
          plan_type: 'PERIODIC',      
          plan_intervals:1,
          plan_currency: 'INR',      
          plan_interval_type:"MONTH",
          plan_recurring_amount : 1,
          plan_max_amount: 10,
          plan_note: 'Test Plan Cashfree',
        }, {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-api-version': API_VERSION,
            'x-client-id': CLIENT_ID,
            'x-client-secret': CLIENT_SECRET,
          },
        });
        console.log('Plan Created:', response.data);
        res.json(response.data);
      } catch (error) {
        console.error('Error creating plan:', error.response ? error.response.data : error.message);
        res.status(500).json(error.response ? error.response.data : { message: error.message });
      }
}


exports.createSubscription = async (req, res)=>{
    const { customer_name, customer_email, customer_phone } = req.body;
  const subscription_id = uuidv4(); // Generate a unique subscription ID
  try {
    const response = await axios.post(`${BASE_URL}/subscriptions`, {
      customer_details: {
        customer_name,
        customer_email,
        customer_phone,
        // You can add other customer details if required
      },
      plan_details: {
        plan_id: PLAN_ID,
        plan_name: 'Premium_09',
        plan_type: 'PERIODIC',
      },
      authorization_details: {
        authorization_amount: 1,
        authorization_amount_refund: true,
        authorization_time: 1,
      },
      subscription_tags: {
        subscription_note: 'test create subs',
      },
      subscription_meta: {
        return_url: 'https://itrain.io',
        notification_channel: ['EMAIL', 'SMS'],
      },
      subscription_id, // Use the generated subscription ID
      subscription_note: 'test subscription create',
      subscription_expiry_time: '2028-12-24T14:15:22Z',
    }, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-version': API_VERSION,
        'x-client-id': CLIENT_ID,
        'x-client-secret': CLIENT_SECRET,
      },
    });
    console.log('Subscription Created:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating subscription:', error.response ? error.response.data : error.message);
    res.status(500).json(error.response ? error.response.data : { message: error.message });
  }
}

exports.getSubscription = async(req, res) => {
    const { id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/subscriptions/${id}`, {
      headers: {
        accept: 'application/json',
        'x-api-version': API_VERSION,
        'x-client-id': CLIENT_ID,
        'x-client-secret': CLIENT_SECRET,
      },
    });
    console.log('Subscription Details:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting subscription details:', error.response ? error.response.data : error.message);
    res.status(500).json(error.response ? error.response.data : { message: error.message });
  }
}
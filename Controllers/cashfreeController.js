import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Plan ID as a constant
const PLAN_ID = 'P-01202002';

exports.createPlan = async (req, res) => {
    try {
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
    try {
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
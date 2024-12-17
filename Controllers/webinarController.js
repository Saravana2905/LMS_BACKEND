const Webinar = require("../Models/webinarModel");
const axios = require('axios');

exports.createWebinar = async (req, res) => {
  const { webinarTitle, date, time, courseCategory, courseLevel } = req.body;
  const account_id = 'g6uJyuGmT3iIxvcrbRoFEw';
  const client_id = 'mpCvNIyGRX2CpsNAOEfj8g';
  const client_secret = '6VzWpGzMaBqTwT4D3QD74Iu5qbzjYo2g';
  const topic = webinarTitle;
  const start_time = date;
  const duration = 40;
  const settings = {
    host_video: true,
    participant_video: true
  };

  try {
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'account_credentials', 
        account_id: account_id, 
        client_id: client_id, 
        client_secret: client_secret
      }
    });

    const accessToken = tokenResponse.data.access_token;
    console.log('Access Token Response:', tokenResponse.data);
    const webinarResponse = await axios.post('https://api.zoom.us/v2/users/me/webinars', {
      topic: topic,
      type: 2,
      start_time: start_time,
      duration: duration,
      settings: settings
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log('Webinar Response:', webinarResponse.data);

    // Save the meeting details to your database
    const webinar = await Webinar.create({webinarTitle, date, time, courseCategory, courseLevel, joinUrl: webinarResponse.data.join_url});

    // Respond with the Zoom meeting join URL
    res.status(200).json({ join_url: webinarResponse.data.join_url, webinar });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.find();
    res.status(200).json(webinar);
  } catch (error) {
    console.error('Error fetching webinars:', error);
    res.status(500).json({ error: error.message });
  }
}

exports.getWebinarById = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }
    res.status(200).json(webinar);
  } catch (error) {
    console.error('Error fetching webinar by ID:', error);
    res.status(500).json({ error: error.message });
  }
}

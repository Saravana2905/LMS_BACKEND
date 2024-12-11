const Meeting = require("../Models/meetingModel");
const axios = require('axios');

exports.createMeeting = async (req, res) => {
  const { meetingTitle, date, time, courseCategory, courseLevel } = req.body;
  const account_id = 'g6uJyuGmT3iIxvcrbRoFEw';
  const client_id = 'mpCvNIyGRX2CpsNAOEfj8g';
  const client_secret = '6VzWpGzMaBqTwT4D3QD74Iu5qbzjYo2g';
  const topic = meetingTitle;
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

    const meetingResponse = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
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

    console.log('Meeting Response:', meetingResponse.data);

    // Save the meeting details to your database
    const meeting = await Meeting.create({meetingTitle, date, time, courseCategory, courseLevel, joinUrl: meetingResponse.data.join_url});

    // Respond with the Zoom meeting join URL
    res.status(200).json({ join_url: meetingResponse.data.join_url, meeting });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.find();
    res.status(200).json(meeting);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: error.message });
  }
}

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.status(200).json(meeting);
  } catch (error) {
    console.error('Error fetching meeting by ID:', error);
    res.status(500).json({ error: error.message });
  }
}

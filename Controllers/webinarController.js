const Webinar = require("../Models/webinarModel");
const axios = require('axios');
const Trainer = require('../Models/trainermodel');
const Course = require('../Models/courseModel');

exports.createWebinar = async (req, res) => {
  const { webinarTitle, trainerName, date, time, course, courseLevel, timeZone } = req.body;

  const account_id = 'g6uJyuGmT3iIxvcrbRoFEw';
  const client_id = 'mpCvNIyGRX2CpsNAOEfj8g';
  const client_secret = '6VzWpGzMaBqTwT4D3QD74Iu5qbzjYo2g';
  const topic = webinarTitle;
  const start_time = new Date(date).toISOString(); // Ensure correct format
  const duration = 40; // Duration in minutes
  const settings = {
    host_video: true,
    participant_video: true,
  };

  try {
    // Validate trainer existence
    const trainer = await Trainer.findById(trainerName);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Validate course existence
    const courseObj = await Course.findById(course);
    if (!courseObj) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get the access token from Zoom
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'account_credentials',
        account_id: account_id,
        client_id: client_id,
        client_secret: client_secret,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Create the webinar using Zoom API
    const webinarResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: topic,
        type: 2,
        start_time: start_time,
        duration: duration,
        settings: settings,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Save the webinar details to the database
    const webinar = await Webinar.create({
      webinarTitle,
      trainerName,
      date,
      time,
      course,
      courseLevel,
      timeZone,
      joinUrl: webinarResponse.data.join_url,
    });

    res.status(200).json({ join_url: webinarResponse.data.join_url, webinar });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getWebinar = async (req, res) => {
  try {
    const webinars = await Webinar.find()
      .populate('trainerName', 'name email') // Adjust the fields as per the trainer schema
      .populate('course', 'title description'); // Adjust the fields as per the course schema
    res.status(200).json(webinars);
  } catch (error) {
    console.error('Error fetching webinars:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getWebinarById = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id)
      .populate('trainerName', 'name email') // Adjust the fields as per the trainer schema
      .populate('course', 'title description'); // Adjust the fields as per the course schema

    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    res.status(200).json(webinar);
  } catch (error) {
    console.error('Error fetching webinar by ID:', error.message);
    res.status(500).json({ error: error.message });
  }
};

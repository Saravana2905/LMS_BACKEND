const mongoose = require('mongoose');

const webinarSchema = mongoose.Schema({
  webinarTitle: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  courseCategory: {
    type: String,
    required: true
  },
  courseLevel: {
    type: String,
    required: true
  },
  joinUrl: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Webinar', webinarSchema);
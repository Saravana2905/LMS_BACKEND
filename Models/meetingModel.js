const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
  meetingTitle: {
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
  courseTime: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);
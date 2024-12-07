const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  courseTitle: {
    type: String,
    required: true
  },
  courseDescription: {
    type: String,
    required: true
  },
  courseCategory: {
    type: String,
    required: true
  },
  courseDuration: {
    type: Number,
    required: true
  },
  courseVideoTitle: {
    type: String,
    required: true
  },
  courseVideo: {
    type: String,
    required: true
  },
  courseThumbnail: {
    type: String,
    required: true
  },
  courseAttachment: {
    type: [String], // Change this line to accept an array of strings
    default: [],
    required: true
  }
},
{timestamps: true}
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

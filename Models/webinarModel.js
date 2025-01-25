const mongoose = require('mongoose');

const webinarSchema =  mongoose.Schema({
  webinarTitle: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseLevel: { type: String, required: true },
  timeZone: { type: String, required: true },
  trainerName: { type: String, required: true },
  desc:{type: String, required:false},
  joinUrl : { type: String, required: true }, 
});

module.exports = mongoose.model('Webinar', webinarSchema);

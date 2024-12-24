const mongoose = require('mongoose');

const webinarSchema =  mongoose.Schema({
  webinarTitle: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseLevel: { type: String, required: true },
  timeZone: {
    value: { type: String, required: true },
    label: { type: String, required: true },
    offset: { type: Number, required: true },
    abbrev: { type: String, required: true },
    altName: { type: String, required: true }
  },
  trainerName: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  joinUrl : { type: String, required: true }, 
});

module.exports = mongoose.model('Webinar', webinarSchema);

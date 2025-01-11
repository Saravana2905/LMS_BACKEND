const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema({
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: true
    },
    mailId: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    resume: {
      type: String,
      required: true
    },
    myCourse: {
      type: [String],
      default: [],
      required: true
    },
    role:{
      type: String,
      default: "Trainer",
      required: true
    }
    // ... existing fields ...
  });

const Trainer = mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;
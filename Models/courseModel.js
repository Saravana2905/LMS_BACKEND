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
  },
  courseLevel: {
    type: String,
    values: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
    whatYouWillLearn:{
        type: [String],
        default: [],
        required: false
    },
    keyFeatures:{
        type: [String],
        default: [],
        required: false
    },
    whoCanEnroll:{
        type: [String],
        default: [],
        required: false
    },
    itSkillsCovered:{
        type: [String],
        default: [],
        required: false
    },
    whyShouldJoin:{
        type: [String],
        default: [],
        required: false
    },
    certification:{
        type: String,
        required: false
    },
    courseCurriculum:{
        type: [String],
        default: [],
        required: true
    },
    courseCurriculumAttachment:{
        type: String,
        required: false
    },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
  ],  
},
{timestamps: true}
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

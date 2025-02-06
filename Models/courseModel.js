const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  dayTitle: {
    type: String,
    required: true
  },
  pdf: {
    type: String,
    required: true
  },
  ppt: {
    type: String,
    required: true
  },
});

const weekSchema = new mongoose.Schema({
  weekTitle: {
    type: String,
    required: true
  },
  days: {
    type: [daySchema],
    default: [],
    required: true
  }
});

const courseSchema = new mongoose.Schema({
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
    type: String,
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
    type: [weekSchema], // Updated to include weeks and days with specific fields
    default: [],
    required: true
  },
  courseLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'], // Changed 'values' to 'enum'
    required: true
  },
  whatYouWillLearn: {
    type: [String],
    default: [],
    required: false
  },
  keyFeatures: {
    type: [String],
    default: [],
    required: false
  },
  whoCanEnroll: {
    type: [String],
    default: [],
    required: false
  },
  itSkillsCovered: {
    type: [String],
    default: [],
    required: false
  },
  whyShouldJoin: {
    type: [String],
    default: [],
    required: false
  },
  certification: {
    type: String,
    required: false
  },
  courseCurriculum: {
    type: [String],
    default: [],
    required: true
  },
  courseCurriculumAttachment: {
    type: String,
    required: false
  },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
  ],
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

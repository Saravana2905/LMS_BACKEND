const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  pdf: { type: String, required: false },
  ppt: { type: String, required: false }
});

const weekSchema = new mongoose.Schema({
  day1: resourceSchema,
  day2: resourceSchema,
  day3: resourceSchema
});

const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseCategory: { type: String, required: true },
    courseDuration: { type: String, required: true },
    courseVideoTitle: { type: String, required: true },
    courseVideo: { type: String, required: true },
    courseThumbnail: { type: String, required: true },
    courseLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    whatYouWillLearn: { type: [String], default: [] },
    keyFeatures: { type: [String], default: [] },
    whoCanEnroll: { type: [String], default: [] },
    itSkillsCovered: { type: [String], default: [] },
    whyShouldJoin: { type: [String], default: [] },
    certification: { type: String, required: false },
    courseCurriculum: { type: [String], default: [], required: true },
    courseCurriculumAttachment: { type: String, required: false },
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],

    courseAttachment: {
      week1: weekSchema,
      week2: weekSchema,
      week3: weekSchema,
      week4: weekSchema,
      week5: weekSchema,
      week6: weekSchema
    }
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

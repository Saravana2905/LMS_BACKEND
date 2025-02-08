const mongoose = require('mongoose');

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
      week1: {
        day1: { pdf: { type: String }, ppt: { type: String } },
        day2: { pdf: { type: String }, ppt: { type: String } },
        day3: { pdf: { type: String }, ppt: { type: String } }
      },
      week2: {
        day1: { pdf: { type: String }, ppt: { type: String } },
        day2: { pdf: { type: String }, ppt: { type: String } },
        day3: { pdf: { type: String }, ppt: { type: String } }
      },
      week3: {
        day1: { pdf: { type: String }, ppt: { type: String } },
        day2: { pdf: { type: String }, ppt: { type: String } },
        day3: { pdf: { type: String }, ppt: { type: String } }
      },
      week4: {
        day1: { pdf: { type: String }, ppt: { type: String } },
        day2: { pdf: { type: String }, ppt: { type: String } },
        day3: { pdf: { type: String }, ppt: { type: String } }
      },
      week5: {
        day1: { pdf: { type: String }, ppt: { type: String } },
        day2: { pdf: { type: String }, ppt: { type: String } },
        day3: { pdf: { type: String }, ppt: { type: String } }
      },
      week6: {
        day1: { pdf: { type: String }, ppt: { type: String } },
        day2: { pdf: { type: String }, ppt: { type: String } },
        day3: { pdf: { type: String }, ppt: { type: String } }
      }
    }
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

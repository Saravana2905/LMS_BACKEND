const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const mongoose = require("mongoose");
const Course = require("../Models/courseModel");
const Student = require("../Models/StudentModel");
const Batch = require("../Models/BatchModel");
const multer = require('multer');

// Create a course
exports.createCourse = async (req, res) => {
  try {
    if (!req.body.courseLevel || !req.files.courseVideo || !req.files.courseThumbnail) {
      return res.status(400).json({
        success: false,
        message: "Course creation failed",
        error: "Missing required fields: courseVideo, courseThumbnail, or courseLevel",
      });
    }

    const {
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseVideoTitle,
      courseLevel,
      whatYouWillLearn,
      keyFeatures,
      whoCanEnroll,
      itSkillsCovered,
      whyShouldJoin,
      certification,
      courseCurriculum,
    } = req.body;

    const basePath = path.resolve("../../../uploads");
    const courseFolderName = slugify(courseTitle, { lower: true, strict: true });
    const courseFolderPath = path.join(basePath, courseFolderName);

    // Ensure the course folder exists
    if (!fs.existsSync(courseFolderPath)) {
      fs.mkdirSync(courseFolderPath, { recursive: true });
    }

    // Handle course video upload and URL generation
    const courseVideoPath = path.join(courseFolderPath, req.files.courseVideo[0].originalname);
    fs.rename(req.files.courseVideo[0].path, courseVideoPath, async (err) => {
      if (err) {
        console.error(`Failed to rename course video: ${err.message}`);
        return res.status(500).json({
          success: false,
          message: "Failed to process course video",
          error: err.message,
        });
      }
      const courseVideoUrl = `https://${req.get('host')}/files/${courseFolderName}/${req.files.courseVideo[0].originalname}`;

      // Handle course thumbnail upload and URL generation
      const courseThumbnailPath = path.join(courseFolderPath, req.files.courseThumbnail[0].originalname);
      fs.renameSync(req.files.courseThumbnail[0].path, courseThumbnailPath);
      const courseThumbnailUrl = `https://${req.get('host')}/files/${courseFolderName}/${req.files.courseThumbnail[0].originalname}`;
      
      // Initialize the variable
let courseCurriculumAttachmentUrl = null;

// Check if courseCurriculumAttachment is provided
if (req.files.courseCurriculumAttachment && req.files.courseCurriculumAttachment.length > 0) {
  const courseCurriculumAttachmentPath = path.join(courseFolderPath, req.files.courseCurriculumAttachment[0].originalname);
  fs.renameSync(req.files.courseCurriculumAttachment[0].path, courseCurriculumAttachmentPath);
  courseCurriculumAttachmentUrl = `https://${req.get('host')}/files/${courseFolderName}/${req.files.courseCurriculumAttachment[0].originalname}`;
} else {
  console.error('Course curriculum attachment not provided');
  // Optionally, set a default URL or handle the absence of the file
}



// Handle course attachments (if any) and URL generation
const courseAttachmentUrls = [];
if (req.body.courseAttachment) {
  const courseAttachment = JSON.parse(req.body.courseAttachment);
  for (const week of courseAttachment) {
    const weekFolderPath = path.join(courseFolderPath, slugify(week.weekTitle, { lower: true, strict: true }));
    if (!fs.existsSync(weekFolderPath)) {
      fs.mkdirSync(weekFolderPath, { recursive: true });
    }
    const weekData = { weekTitle: week.weekTitle, days: [] };
    for (const days of week.days) {
      const dayFolderPath = path.join(weekFolderPath, slugify(days.dayTitle, { lower: true, strict: true }));
      if (!fs.existsSync(dayFolderPath)) {
        fs.mkdirSync(dayFolderPath, { recursive: true });
      }
      const pdfPath = path.join(dayFolderPath, days.pdf);
      const pptPath = path.join(dayFolderPath, days.ppt);
      fs.renameSync(days.pdf, pdfPath);
      fs.renameSync(days.ppt, pptPath);
      weekData.days.push({
        dayTitle: days.dayTitle,
        pdf: `https://${req.get('host')}/files/${courseFolderName}${days.pdf}`,
        ppt: `https://${req.get('host')}/files/${courseFolderName}${days.ppt}`
      });
    }
    courseAttachmentUrls.push(weekData);
  }
}
      // Create the course in the database
      const course = await Course.create({
        courseTitle,
        courseDescription,
        courseCategory,
        courseDuration,
        courseVideoTitle,
        courseLevel,
        courseVideo: courseVideoUrl,
        courseThumbnail: courseThumbnailUrl,
        courseAttachment: courseAttachmentUrls,
        whatYouWillLearn,
        keyFeatures,
        whoCanEnroll,
        itSkillsCovered,
        whyShouldJoin,
        certification,
        courseCurriculum,
        courseCurriculumAttachment: courseCurriculumAttachmentUrl
      });

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        course,
      });
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Course creation failed",
      error: error.message,
    });
  }
};


// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course by ID
exports.updateCourseById = async (req, res) => {
  try {
    const {
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseVideoTitle,
      courseLevel,
      keyFeatures,
      whoCanEnroll,
      itSkillsCovered,
      whyShouldJoin,
      certification,
      courseCurriculum
    } = req.body;

    // Generate folder path for the course
    const courseFolderName = slugify(courseTitle, { lower: true, strict: true });
    const courseFolderPath = path.resolve(`../../../uploads/${courseFolderName}`);

    // Ensure the folder exists
    if (!fs.existsSync(courseFolderPath)) {
      fs.mkdirSync(courseFolderPath, { recursive: true });
    }

    // Handle the course video file
    let courseVideoUrl = null;
    if (req.files.courseVideo) {
      const courseVideoPath = path.join(courseFolderPath, req.files.courseVideo[0].originalname);
      fs.renameSync(req.files.courseVideo[0].path, courseVideoPath);
      courseVideoUrl = `https://${req.get('host')}/files/${courseFolderName}/${req.files.courseVideo[0].originalname}`;
    }

    // Handle the course thumbnail file
    let courseThumbnailUrl = null;
    if (req.files.courseThumbnail) {
      const courseThumbnailPath = path.join(courseFolderPath, req.files.courseThumbnail[0].originalname);
      fs.renameSync(req.files.courseThumbnail[0].path, courseThumbnailPath);
      courseThumbnailUrl = `https://${req.get('host')}/files/${courseFolderName}/${req.files.courseThumbnail[0].originalname}`;
    }

    // Handle the course curriculum attachment file
    let courseCurriculumAttachmentUrl = null;
    if (req.files.courseCurriculumAttachment) {
      const courseCurriculumAttachmentPath = path.join(courseFolderPath, req.files.courseCurriculumAttachment[0].originalname);
      fs.renameSync(req.files.courseCurriculumAttachment[0].path, courseCurriculumAttachmentPath);
      courseCurriculumAttachmentUrl = `https://${req.get('host')}/files/${courseFolderName}/${req.files.courseCurriculumAttachment[0].originalname}`;
    } else {
      // Handle the case where the file is not provided
      console.error('Course curriculum attachment not provided');
      // You might want to return an error response or set a default value
    }

    // Handle course attachments (if any) and URL generation
    const courseAttachmentUrls = [];
    if (req.body.courseAttachment) {
      const courseAttachment = JSON.parse(req.body.courseAttachment);
      for (const week of courseAttachment) {
        const weekFolderPath = path.join(courseFolderPath, slugify(week.weekTitle, { lower: true, strict: true }));
        if (!fs.existsSync(weekFolderPath)) {
          fs.mkdirSync(weekFolderPath, { recursive: true });
        }
        const weekData = { weekTitle: week.weekTitle, days: [] };
        for (const days of week.days) {
          const dayFolderPath = path.join(weekFolderPath, slugify(days.dayTitle, { lower: true, strict: true }));
          if (!fs.existsSync(dayFolderPath)) {
            fs.mkdirSync(dayFolderPath, { recursive: true });
          }
          const pdfPath = path.join(dayFolderPath, days.pdf);
          const pptPath = path.join(dayFolderPath, days.ppt);
          weekData.days.push({
            dayTitle: days.dayTitle,
            pdf: `https://${req.get('host')}/files/${courseFolderName}/${slugify(week.weekTitle, { lower: true, strict: true })}/${slugify(days.dayTitle, { lower: true, strict: true })}/${days.pdf}`,
            ppt: `https://${req.get('host')}/files/${courseFolderName}/${slugify(week.weekTitle, { lower: true, strict: true })}/${slugify(days.dayTitle, { lower: true, strict: true })}/${days.ppt}`
          });
        }
        courseAttachmentUrls.push(weekData);
      }
    }

    // Find and update the course in the database
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        courseTitle,
        courseDescription,
        courseCategory,
        courseDuration,
        courseVideoTitle,
        courseLevel,
        courseVideo: courseVideoUrl, // Save video URL
        courseThumbnail: courseThumbnailUrl, // Save thumbnail URL
        courseAttachment: courseAttachmentUrls, // Save attachment URLs
        courseCurriculumAttachment: courseCurriculumAttachmentUrl, // Save curriculum attachment URL
        keyFeatures,
        whoCanEnroll,
        itSkillsCovered,
        whyShouldJoin,
        certification,
        courseCurriculum
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Course update failed',
      error: error.message,
    });
  }
};

// Delete course by ID
exports.deleteCourseById = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (course) {
      const courseFolderPath = path.resolve(`../../../uploads/${slugify(course.courseTitle, { lower: true, strict: true })}`);
      if (fs.existsSync(courseFolderPath)) {
        fs.rmSync(courseFolderPath, { recursive: true, force: true });
      }
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all courses
exports.deleteAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    courses.forEach(course => {
      const courseFolderPath = path.resolve(`../../../uploads/${slugify(course.courseTitle, { lower: true, strict: true })}`);
      if (fs.existsSync(courseFolderPath)) {
        fs.rmSync(courseFolderPath, { recursive: true, force: true });
      }
    });

    await Course.deleteMany();
    res.status(200).json({ message: "All courses deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Register course
exports.registerCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.body.student;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.courses.includes(courseId)) {
      return res.status(400).json({ message: "Course already registered" });
    }

    let latestBatch = await Batch.findOne({ courseId })
      .sort({ batchNumber: -1 })
      .exec();

    if (!latestBatch || latestBatch.students.length >= 15) {
      const newBatchNumber = latestBatch ? latestBatch.batchNumber + 1 : 1;
      latestBatch = await Batch.create({
        courseId,
        batchNumber: newBatchNumber,
        students: [],
      });
    }

    latestBatch.students.push(studentId);
    await latestBatch.save();

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $push: { courses: courseId },
        batchNumber: latestBatch.batchNumber,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Student registered and added to batch",
      batchNumber: latestBatch.batchNumber,
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by student ID
exports.getCourseByStudentId = async (req, res) => {
  try {
    const courses = await Course.find({ student: req.params.id });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by category
exports.getCourseByCategory = async (req, res) => {
  try {
    const courses = await Course.find({ courseCategory: req.params.category });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reading materials for courses registered by a student
exports.getReadingMaterial = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courses = await Course.find({ _id: { $in: student.courses } });

    const courseDetailsWithAttachments = courses.map(course => ({
      courseId: course._id,
      courseTitle: course.courseTitle,
      courseDescription: course.courseDescription,
      courseCategory: course.courseCategory,
      courseLevel: course.courseLevel,
      courseDuration: course.courseDuration,
      courseVideo: course.courseVideo,
      courseThumbnail: course.courseThumbnail,
      attachments: course.courseAttachment,
    }));

    res.status(200).json({ courses: courseDetailsWithAttachments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Define upload destination outside the project folder
const UPLOAD_DIR = path.resolve(__dirname, '../../../../uploads');

// Ensure the root upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { courseId, week, day } = req.params;

    try {
      const course = await Course.findById(courseId);
      if (!course) return cb(new Error("Course not found"));

      // Define structured folders
      const courseFolder = slugify(`${course.courseTitle}`, { lower: true, strict: true });
      const weekFolder = `${week}`;
      const dayFolder = `${day}`;

      const finalPath = path.join(UPLOAD_DIR, courseFolder, weekFolder, dayFolder);

      // Ensure folder exists
      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }

      cb(null, finalPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname); // Get file extension
    const fileName = `${Date.now()}-${slugify(path.basename(file.originalname, extension), { lower: true, strict: true })}${extension}`;
    cb(null, fileName);
  },
});

// Multer Upload Middleware (Only Defined Once)
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).fields([{ name: 'pdf', maxCount: 1 }, { name: 'ppt', maxCount: 1 }]);

// Controller to Create File Attachments
exports.createCourseAttachment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    try {
      const { courseId, week, day } = req.params;
      const course = await Course.findById(courseId);
      console.log('course', course)
      if (!course) return res.status(404).json({ message: "Course not found" });

      const courseFolder = slugify(`${course.courseTitle}`, { lower: true, strict: true });
      const weekKey = `${week}`;
      const dayKey = `${day}`;

      const baseUrl = `https://${req.get('host')}/files/${courseFolder}/${weekKey}/${dayKey}`;

      let pdfUrl = req.files?.pdf ? `${baseUrl}/${req.files.pdf[0].filename}` : null;
      let pptUrl = req.files?.ppt ? `${baseUrl}/${req.files.ppt[0].filename}` : null;

      // Structure for new attachment
      const newAttachment = {
        [`courseAttachment.${weekKey}.${dayKey}`]: {
          pdf: pdfUrl,
          ppt: pptUrl
        }
      };

      // Create a new entry (ensure course exists first)
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $set: newAttachment },
        { new: true, upsert: true } // upsert ensures it creates a new entry if none exists
      );

      return res.status(201).json({
        message: "Course attachment created successfully",
        data: {
          week: weekKey,
          day: dayKey,
          pdf: pdfUrl,
          ppt: pptUrl
        }
      });
    } catch (error) {
      console.error("Error creating course attachment:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
};


// Controller to Handle File Uploads
exports.updateCourseAttachment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    try {
      const { courseId, week, day } = req.params;
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      const courseFolder = slugify('attachment', { lower: true, strict: true });
      const weekKey = `${week}`;
      const dayKey = `${day}`;

      const baseUrl = `https://${req.get('host')}/files/${courseFolder}/${weekKey}/${dayKey}`;

      let pdfUrl = req.files?.pdf ? `${baseUrl}/${req.files.pdf[0].filename}` : null;
      let pptUrl = req.files?.ppt ? `${baseUrl}/${req.files.ppt[0].filename}` : null;

      // Explicitly updating the nested structure
      const updateFields = {};
      if (pdfUrl) updateFields[`${weekKey}_${dayKey}_pdf`] = pdfUrl;
      if (pptUrl) updateFields[`${weekKey}_${dayKey}_ppt`] = pptUrl;

      await Course.findByIdAndUpdate(courseId, { $set: updateFields });

      return res.json({
        message: "Course attachment updated successfully",
        data: {
          week: weekKey,
          day: dayKey,
          pdf: pdfUrl,
          ppt: pptUrl
        }
      });
    } catch (error) {
      console.error("Error updating course attachment:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
};
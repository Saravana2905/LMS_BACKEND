const Course = require("../Models/courseModel");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const Student = require("../Models/StudentModel");
const Batch = require("../Models/BatchModel");

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
    } = req.body;

    const basePath = path.resolve("./uploads");
    const courseFolderName = slugify(courseTitle, { lower: true, strict: true });
    const courseFolderPath = path.join(basePath, courseFolderName);

    if (!fs.existsSync(courseFolderPath)) {
      fs.mkdirSync(courseFolderPath, { recursive: true });
    }

    // Save course video locally
    const courseVideoPath = path.join(courseFolderPath, req.files.courseVideo[0].originalname);
    fs.renameSync(req.files.courseVideo[0].path, courseVideoPath);

    // Save course thumbnail locally
    const courseThumbnailPath = path.join(courseFolderPath, req.files.courseThumbnail[0].originalname);
    fs.renameSync(req.files.courseThumbnail[0].path, courseThumbnailPath);

    // Save course attachments locally
    const courseAttachmentPaths = [];
    if (req.files.courseAttachment) {
      for (const file of req.files.courseAttachment) {
        const attachmentPath = path.join(courseFolderPath, file.originalname);
        fs.renameSync(file.path, attachmentPath);
        courseAttachmentPaths.push(attachmentPath);
      }
    }

    const course = await Course.create({
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseVideoTitle,
      courseLevel,
      courseVideo: courseVideoPath,
      courseThumbnail: courseThumbnailPath,
      courseAttachment: courseAttachmentPaths,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
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
    } = req.body;

    const courseFolderPath = path.resolve(`./uploads/${slugify(courseTitle, { lower: true, strict: true })}`);

    if (!fs.existsSync(courseFolderPath)) {
      fs.mkdirSync(courseFolderPath, { recursive: true });
    }

    // Save updated course video locally
    let courseVideoPath;
    if (req.files.courseVideo) {
      courseVideoPath = path.join(courseFolderPath, req.files.courseVideo[0].originalname);
      fs.renameSync(req.files.courseVideo[0].path, courseVideoPath);
    }

    // Save updated course thumbnail locally
    let courseThumbnailPath;
    if (req.files.courseThumbnail) {
      courseThumbnailPath = path.join(courseFolderPath, req.files.courseThumbnail[0].originalname);
      fs.renameSync(req.files.courseThumbnail[0].path, courseThumbnailPath);
    }

    // Save updated course attachments locally
    const courseAttachmentPaths = [];
    if (req.files.courseAttachment) {
      for (const file of req.files.courseAttachment) {
        const attachmentPath = path.join(courseFolderPath, file.originalname);
        fs.renameSync(file.path, attachmentPath);
        courseAttachmentPaths.push(attachmentPath);
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        courseTitle,
        courseDescription,
        courseCategory,
        courseDuration,
        courseVideoTitle,
        courseLevel,
        courseVideo: courseVideoPath,
        courseThumbnail: courseThumbnailPath,
        courseAttachment: courseAttachmentPaths,
      },
      { new: true }
    );

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete course by ID
exports.deleteCourseById = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (course) {
      const courseFolderPath = path.resolve(`./uploads/${slugify(course.courseTitle, { lower: true, strict: true })}`);
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
      const courseFolderPath = path.resolve(`./uploads/${slugify(course.courseTitle, { lower: true, strict: true })}`);
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

const Test = require('../Models/TestModel');
const Course = require('../Models/courseModel');
const Batch = require('../Models/BatchModel');

exports.createTest = async (req, res) => {
    try {
        const { course, batch, ...questions } = req.body;

        // Find the course and batch by their IDs
        const courseExists = await Course.findById(course);
        const batchExists = await Batch.findById(batch);

        if (!courseExists) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (!batchExists) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Create a new test
        const newTest = new Test({
            course,
            batch,
            ...questions
        });

        // Save the test to the database
        await newTest.save();
        res.status(201).json(newTest);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTests = async (req, res) => {
    try {
        const tests = await Test.find().populate('course batch');
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id).populate('course batch');
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateTest = async (req, res) => {
    try {
        const { course, batch, ...questions } = req.body;

        // Find the course and batch by their IDs
        const courseExists = await Course.findById(course);
        const batchExists = await Batch.findById(batch);

        if (!courseExists) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (!batchExists) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        const updatedTest = await Test.findByIdAndUpdate(
            req.params.id,
            { course, batch, ...questions },
            { new: true }
        );
        if (!updatedTest) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        const deletedTest = await Test.findByIdAndDelete(req.params.id);
        if (!deletedTest) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json({ message: 'Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
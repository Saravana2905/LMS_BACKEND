const DoubtSession = require('../Models/DoubtSessionModel');
const Student = require('../Models/StudentModel');
const Trainer = require('../Models/trainermodel');
const TrainerAvailableTime = require('../Models/TrainerAvailableTimeModel');

exports.createDoubtSession = async (req, res) => {
    try {
        const { doubt, studentId, trainerId, sessionDate, sessionTime, timeZone, trainerAvailbletime } = req.body;
        const student = await Student.findById(studentId);
        const trainer = await Trainer.findById(trainerId);
        const trainerAvailableTime = await TrainerAvailableTime.findById(trainerId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        if (!trainerAvailableTime) {
            return res.status(404).json({ message: 'Trainer available time not found' });
        }

        const newDoubtSession = new DoubtSession({
            doubt,
            student: studentId,
            trainer: trainerId,
            sessionDate,
            sessionTime,
            timeZone,
            trainerAvailbletime : trainerAvailableTime,
            status: 'pending'
        });

        await newDoubtSession.save();
        res.status(201).json(newDoubtSession);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDoubtSessions = async (req, res) => {
    try {
        const doubtSessions = await DoubtSession.find().populate('student trainer batch');
        res.status(200).json(doubtSessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDoubtSessionById = async (req, res) => {
    try {
        const doubtSession = await DoubtSession.findById(req.params.id).populate('student trainer batch');
        if (!doubtSession) {
            return res.status(404).json({ message: 'Doubt session not found' });
        }
        res.status(200).json(doubtSession);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateDoubtSession = async (req, res) => {
    try {
        const { doubt, sessionDate, sessionTime, timeZone, sessionDuration, trainerAvailbletime, status, joinUrl } = req.body;
        const updatedDoubtSession = await DoubtSession.findByIdAndUpdate(
            req.params.id,
            { doubt, sessionDate, sessionTime, timeZone, sessionDuration, trainerAvailbletime, status, joinUrl },
            { new: true }
        );
        if (!updatedDoubtSession) {
            return res.status(404).json({ message: 'Doubt session not found' });
        }
        res.status(200).json(updatedDoubtSession);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteDoubtSession = async (req, res) => {
    try {
        const deletedDoubtSession = await DoubtSession.findByIdAndDelete(req.params.id);
        if (!deletedDoubtSession) {
            return res.status(404).json({ message: 'Doubt session not found' });
        }
        res.status(200).json({ message: 'Doubt session deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
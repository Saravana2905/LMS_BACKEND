const TrainerAvailableTime = require('../Models/TrainerAvailableTimeModel');

// Create a single available time slot for a trainer
exports.createTrainerAvailableTime = async (req, res) => {
    try {
        const { trainerId, availableDate, startTime, endTime } = req.body;

        // Validate required fields
        if (!trainerId || !availableDate || !startTime || !endTime) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new availability slot
        const newTrainerAvailableTime = new TrainerAvailableTime({
            trainerId,
            availableDate,
            startTime,
            endTime
        });

        await newTrainerAvailableTime.save();
        res.status(201).json({
            message: 'Trainer availability slot created successfully.',
            data: newTrainerAvailableTime
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all available times for a specific trainer
exports.getTrainerAvailableTimes = async (req, res) => {
    try {
        const trainerId = req.params.trainerId;

        if (!trainerId) {
            return res.status(400).json({ message: 'Trainer ID is required.' });
        }

        const availableTimes = await TrainerAvailableTime.find({ trainerId });
        res.status(200).json({
            message: 'Trainer availability fetched successfully.',
            data: availableTimes
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a specific time slot for a trainer
exports.updateTrainerAvailableTime = async (req, res) => {
    try {
        const slotId = req.params.slotId;
        const { availableDate, startTime, endTime } = req.body;

        if (!slotId) {
            return res.status(400).json({ message: 'Slot ID is required.' });
        }

        const updatedSlot = await TrainerAvailableTime.findByIdAndUpdate(
            slotId,
            { availableDate, startTime, endTime },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({ message: 'Slot not found.' });
        }

        if (updatedSlot.status === 'booked') {
            return res.status(400).json({ message: 'This slot is already booked.' });
        }

        res.status(200).json({
            message: 'Trainer availability slot updated successfully.',
            data: updatedSlot
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a specific time slot for a trainer
exports.deleteTrainerAvailableTime = async (req, res) => {
    try {
        const slotId = req.params.slotId;

        if (!slotId) {
            return res.status(400).json({ message: 'Slot ID is required.' });
        }

        const deletedSlot = await TrainerAvailableTime.findByIdAndDelete(slotId);

        if (!deletedSlot) {
            return res.status(404).json({ message: 'Slot not found.' });
        }

        res.status(200).json({ message: 'Trainer availability slot deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.bookTrainerAvailableTime = async (req, res) => {
    try {
        const slotId = req.params.slotId;

        if (!slotId) {
            return res.status(400).json({ message: 'Slot ID is required.' });
        }

        // Update the status to "booked"
        const updatedSlot = await TrainerAvailableTime.findByIdAndUpdate(
            slotId,
            { status: 'booked' },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({ message: 'Slot not found.' });
        }

        if (updatedSlot.status === 'booked') {
            return res.status(400).json({ message: 'This slot is already booked.' });
        }

        res.status(200).json({
            message: 'Slot booked successfully.',
            data: updatedSlot
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

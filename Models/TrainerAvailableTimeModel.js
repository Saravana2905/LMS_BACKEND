const mongoose = require('mongoose');

const TrainerAvailableTimeSchema = new mongoose.Schema({
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Trainer'
    },
    availableDate: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'cancelled'],
        default: 'available' // Default status is available
    }
});

module.exports = mongoose.model('TrainerAvailableTime', TrainerAvailableTimeSchema);

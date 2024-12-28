const mongoose = require('mongoose');

const TrainerAvailableTimeSchema = mongoose.Schema({
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    availableDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
});

const TrainerAvailableTime = mongoose.model('TrainerAvailableTime', TrainerAvailableTimeSchema);

module.exports = TrainerAvailableTime;
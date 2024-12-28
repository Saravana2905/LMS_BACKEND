const mongoose = require('mongoose');

const DoubtSessionSchema = mongoose.Schema({
    doubt:{
        type: String,
        required: true
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    trainer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    batch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    status:{
        type: String,
        values: ['pending', 'resolved'],
        required: true
    },
    joinUrl:{
        type: String,
        required: false
    },
    sessionDate:{
        type: Date,
        required: true
    },
    sessionTime:{
        type: String,
        required: true
    },
    timeZone:{
        type: String,
        required: true
    },
    sessionDuration:{
        type: Number,
        required: true
    },
    trainerAvailbletime:{
        type: String,
        required: true
    }
})

const DoubtSession = mongoose.model('DoubtSession', DoubtSessionSchema);
module.exports = DoubtSession;
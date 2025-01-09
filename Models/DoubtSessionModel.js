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
    joinUrl:{
        type: String,
        required: false
    },
    sessionTime:{
        type: String,
        required: true
    },
    sessionDate:{
        type: Date,
        required: true
    },
    timeZone:{
        type: String,
        required: true
    }
})

const DoubtSession = mongoose.model('DoubtSession', DoubtSessionSchema);
module.exports = DoubtSession;
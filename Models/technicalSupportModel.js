const mongoose = require('mongoose')

const TechnicalSupportSchema = mongoose.Schema({
    clientId: {
        type: String,
        required : true
    },
    firstname: {
        type: String,
        required : true
    },
    lastname: {
        type: String,
        required : true
    },
    batchno: {
        type: String,
        required : true
    },
    emailId: {
        type: String,
        required : true
    },
    issuedate: {
        type: Date,
        required : true
    },
    closedate: {
        type: Date,
        required : true
    },
    status: {
        type: String,
        required : true
    }
})


const TechnicalSupport = mongoose.model("TechnicalSupport",TechnicalSupportSchema)

module.exports = TechnicalSupport
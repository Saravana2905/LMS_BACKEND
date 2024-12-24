const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const TestSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    question1: QuestionSchema,
    question2: QuestionSchema,
    question3: QuestionSchema,
    question4: QuestionSchema,
    question5: QuestionSchema,
    question6: QuestionSchema,
    question7: QuestionSchema,
    question8: QuestionSchema,
    question9: QuestionSchema,
    question10: QuestionSchema,
    question11: QuestionSchema,
    question12: QuestionSchema,
    question13: QuestionSchema,
    question14: QuestionSchema,
    question15: QuestionSchema,
    question16: QuestionSchema,
    question17: QuestionSchema,
    question18: QuestionSchema,
    question19: QuestionSchema,
    question20: QuestionSchema,
    question21: QuestionSchema,
    question22: QuestionSchema,
    question23: QuestionSchema,
    question24: QuestionSchema,
    question25: QuestionSchema
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
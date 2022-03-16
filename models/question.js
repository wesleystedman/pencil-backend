const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    annotations: [String]
});

module.exports = mongoose.model('Question', questionSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    _id: Number,
    annotations: [String]
});

questionSchema.index({ annotations: 1 });

module.exports = mongoose.model('Question', questionSchema);

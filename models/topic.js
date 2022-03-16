const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    text: String,
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    }]
});

module.exports = mongoose.model('Topic', topicSchema);

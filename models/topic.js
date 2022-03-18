const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Using the Nested Sets pattern from https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-nested-sets/
// The topic tree will be static, and the search needs to efficiently find subtrees, making this a perfect fit
const topicSchema = new Schema({
    _id: String,
    left: Number,
    right: Number
});

topicSchema.index({ left: 1, right: 1 });

module.exports = mongoose.model('Topic', topicSchema);

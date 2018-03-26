var mongoose = require('mongoose');

var schema = mongoose.Schema,

incrementSchema = new schema({
        injured_id: Number,
        EMSevent_id: Number
    }, {collection: 'increment'})

var Increment = mongoose.model('increment', incrementSchema);
module.exports = Increment;
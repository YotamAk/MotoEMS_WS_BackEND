var mongoose = require('mongoose');

var schema = mongoose.Schema,

    
    EventSchema = new schema({
        id: {type:Number, required:true},
        description: String,
        createByUserID: Number,
        time: { type : Date, default: Date.now },
        location: [Number],
        active: Boolean
    }, {collection: 'EMSevent'});

var EMSevent = mongoose.model('EMSevent', EventSchema);

module.exports = EMSevent;
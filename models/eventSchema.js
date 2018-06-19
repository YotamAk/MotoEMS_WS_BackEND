var mongoose = require('mongoose');

var schema = mongoose.Schema,

    
    EventSchema = new schema({
        id: {type:String, required:true},
        EventDescription: String,
        createByUserID: String,
        EventTime: { type : Date, default: Date.now },
        location: { type : String, default: "Shenkar" }
    }, {collection: 'EMSevent'});

var EMSevent = mongoose.model('EMSevent', EventSchema);

module.exports = EMSevent;
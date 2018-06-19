var mongoose = require('mongoose');

var schema = mongoose.Schema,

    
    EventSchema = new schema({
        id: {type:String, required:true},
        description: String,
        createByUserID: String,
        time: { type : Date, default: Date.now },
        location: { type : String, default: "Shenkar" },
        active: Boolean
    }, {collection: 'EMSevent'});

var EMSevent = mongoose.model('EMSevent', EventSchema);

module.exports = EMSevent;
var mongoose = require('mongoose');

var schema = mongoose.Schema,
    
    HospitalSchema = new schema({
        id: {type:String, required:true},
        name: String,
        location: [Number],
        password: String,
        phone: String
    }, {collection: 'Hospital'});

var Hospital = mongoose.model('Hospital', HospitalSchema);

module.exports = Hospital;
var mongoose = require('mongoose');

var schema = mongoose.Schema,
    
    UserSchema = new schema({
        id: {type:String, required:true},
        name: String,
        role:{ 
            type: String,
            enum: ['paramedic', 'medic','firstAid']
        },
        corpId: Number,
        phone: Number,
        location: Number
    }, {collection: 'Users'});

var User = mongoose.model('User', UserSchema);

module.exports = User;
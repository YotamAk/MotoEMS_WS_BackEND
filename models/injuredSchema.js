var mongoose = require('mongoose');

var schema = mongoose.Schema,


    injuredSchema = new schema({
        id: {type:String, required:true},
        gender      :   { 
            type: String,
            enum: ['male', 'female']
        },
        age   :   { type: Number, min: 0, max: 120 },
        name        :   String,
        location    :   [Number],
        airWay      :   Boolean,
        breathing   :   Number,
        circulation :   String,
        disability  :   String,
        exposure    :   String,
        heartbeat   :   { type: Number, min: 30, max: 200 },
        toHospital  :   String,
        TandT       :   Boolean,
        time        :   { type : Date, default: Date.now },
        severity:{ 
            type: String,
            enum: ['dead', 'critical','urgent-stable','urgent','not-urgent','OK']
        },

        addBy       : String,
        ModifyBy    : String,
        QrId        : String,
        eventId     : String,
        InHospital  : Boolean
    }, {collection: 'Injured'});

var Injured = mongoose.model('Injured', injuredSchema);

module.exports = Injured;
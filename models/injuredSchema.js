var mongoose = require('mongoose');

var schema = mongoose.Schema,


    injuredSchema = new schema({
        id: {type:String, required:true},
        gender      :   { 
            type: String,
            enum: ['male', 'female']
        },
        age   :   { type: Number, min: 0, max: 100 },
        name        :   { type : String, default: "Unknown" },
        location    :   [Number],
        airWay      :   Boolean,
        breathing   :   Number,
        blood_pressure :   Number,
        disability  :   String,
        exposure    :   String,
        heartbeat   :   { type: Number, min: 30, max: 150 },
        toHospital  :   { type : String, default: "Unknown" },
        TandT       :   Boolean,
        time        :   { type : Date, default: Date.now },
        severity:{ 
            type: String,
            enum: ['dead', 'critical','urgent-stable','urgent','not-urgent','OK']
        },
        treatment   : String,
        addBy       : String,
        ModifyBy    : String,
        QrId        : String,
        eventId     : String,
        InHospital  : Boolean
    }, {collection: 'Injured'});

var Injured = mongoose.model('Injured', injuredSchema);

module.exports = Injured;
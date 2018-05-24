var mongoose = require('mongoose');

var schema = mongoose.Schema,


    injuredSchema = new schema({
        id: {type:Number, required:true},
        name:String,
        location: [Number],
        airWay: Boolean,
        breathing: Boolean,
        circulation: String,
        disability: String,
        exposure: String,
        toHospital: String,
        TandT: Boolean,
        time: { type : Date, default: Date.now },
        severity:{ 
            type: String,
            enum: ['dead', 'critical','urgent-stable','urgent','not-urgent','OK']
        },
        // severity: String,
        addBy: Number,
        ModifyBy: Number,
        QrId: String,
        eventId:Number,
        heartbeat:     { type: Number, min: 30, max: 200 },
        InHospital: Boolean
    }, {collection: 'Injured'});

var Injured = mongoose.model('Injured', injuredSchema);

module.exports = Injured;
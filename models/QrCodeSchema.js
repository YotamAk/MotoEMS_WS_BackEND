var mongoose = require('mongoose');

var schema = mongoose.Schema,
    
    QrCodeSchema = new schema({
        id: {type:String, required:true},
        qrCode: Number,
        injuredId: Number;
    }, {collection: 'QrCode'});

var QrCode = mongoose.model('QrCode', QrCodeSchema);

module.exports = QrCode;
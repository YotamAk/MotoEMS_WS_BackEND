'use strict';
const   mongoose = require('mongoose'),
        Injured   = require('./../models/injuredSchema'),
        EMSevent   = require('./../models/eventSchema'),
        Increment = require('./../models/increment');
class Event {


    getIncrements() {
        return new Promise((resolve, reject) => {
            Increment.findOne((err, result) => {
                if (err) console.log(err); 
                else resolve(result);
            })
        })
    }


    addNewInjured(injuredDetails) {
        var headers = JSON.parse(injuredDetails), //remove when sending from client side
            injured_id = -1;
        return new Promise((resolve, reject) => {
            this.getIncrements().then((result) => {
                injured_id = result.injured_id;
                if (injured_id == -1) resolve(new Error('injured_id not updating properly'));
                //if successfully got the index from DB, increment by 1 and save to DB
                 Increment.update({$inc:{'injured_id': 1}}, (err) =>{
                    if (err) console.log(err)
                 });  
            
                let newInjured = new Injured({
                    id: injured_id,
                    name:headers.name,
                    location: headers.location,
                    airWay: headers.airWay,
                    breathing: headers.breathing,
                    circulation: headers.circulation,
                    disability: headers.disability,
                    exposure: headers.exposure,
                    toHospital: headers.toHospital,
                    TandT: headers.TandT,
                    severity: headers.severity,
                    addBy: headers.addBy,
                    ModifyBy: headers.ModifyBy,
                    QrId: headers.QrId,
                    eventId:headers.eventId
                });

                newInjured.save(
                    (err) => {
                        if (err) resolve("ERROR in injured insertion, ",err);
                        // else resolve(`Entered as SourceID  the following documenet: `);
                    })
            })
        })
    }


    addNewEvent(EventDetails) {
        var headers = JSON.parse(EventDetails), //remove when sending from client side
            EMSevent_id = -1;
        return new Promise((resolve, reject) => {
            this.getIncrements().then((result) => {
                EMSevent_id = result.EMSevent_id;
                if (EMSevent_id == -1) resolve(new Error('injured_id not updating properly'));
                //if successfully got the index from DB, increment by 1 and save to DB
                 Increment.update({$inc:{'EMSevent_id': 1}}, (err) =>{
                    if (err) console.log(err)
                 });  
            
                let newEvent = new EMSevent({
                    id: EMSevent_id,
                    description:headers.description,
                    createByUserID: headers.createByUserID,
                    location: headers.location
                });

                newEvent.save(
                    (err) => {
                        if (err) resolve("ERROR in injured insertion, ",err);
                        // else resolve(`Entered as SourceID  the following documenet: `);
                    })
            })
        })
    }

    getInjuredById(id) {
        return new Promise((resolve, reject) => {
            Injured.findOne({id: id},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    getEventById(id) {
        return new Promise((resolve, reject) => {
            EMSevent.findOne({id: id},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };


    getInjuredsByPriority(severity) {
        return new Promise((resolve, reject) => {
            Injured.find({severity: severity},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

}
module.exports = () => {
    var event = new Event();
    return event;
}
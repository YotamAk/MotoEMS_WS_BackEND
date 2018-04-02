'use strict';
const   mongoose = require('mongoose'),
        Injured   = require('./../models/injuredSchema'),
        EMSevent   = require('./../models/eventSchema'),
        User   = require('./../models/userSchema'),
        Increment = require('./../models/increment'),
        Hospital = require('./../models/hospitalSchema');

class Event {

    /**
     * The following methods are inside class methods and not called
     * By any route from a server, they are to be used internally only!
     */

    getIncrements() {
        return new Promise((resolve, reject) => {
            Increment.findOne((err, result) => {
                if (err) console.log(err); 
                else resolve(result);
            })
        })
    }


    checkSeverity(circulation, heartbeat,breathing){
        var severity = "OK";
        if((heartbeat> 130 || heartbeat< 50) && circulation === "high" ){
            severity ="urgent-stable"; 
        }
        return severity;
    }


    /**
     * The following methods are called by routes only from the server.js file
     */

    addNewInjured(injuredDetails) {
        var headers = JSON.parse(injuredDetails), //remove when sending from client side
            injured_id = -1,
            severityResult = 0;
        return new Promise((resolve, reject) => {
            this.getIncrements().then((result) => {
                injured_id = result.injured_id;
                if (injured_id == -1) resolve(new Error('injured_id not updating properly'));
                //if successfully got the index from DB, increment by 1 and save to DB
                 Increment.update({$inc:{'injured_id': 1}}, (err) =>{
                    if (err) console.log(err)
                 });  
                severityResult = this.checkSeverity(headers.circulation, headers.heartbeat,headers.breathing);

                let newInjured = new Injured({
                    id: injured_id,
                    name:headers.name,
                    location: headers.location,
                    airWay: headers.airWay,
                    breathing: headers.breathing,
                    circulation: headers.circulation,
                    heartbeat:  headers.heartbeat,
                    disability: headers.disability,
                    exposure: headers.exposure,
                    toHospital: headers.toHospital,
                    TandT: headers.TandT,
                    severity: severityResult,
                    addBy: headers.addBy,
                    ModifyBy: headers.ModifyBy,
                    QrId: headers.QrId,
                    eventId:headers.eventId
                });

                newInjured.save(
                    (err) => {
                        if (err) resolve("ERROR in injured insertion, ",err);
                        else resolve(`Entered as ${newInjured.name}`);
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

    addNewUser(UserDetails) {
        var headers = JSON.parse(UserDetails), //remove when sending from client side
            user_id = -1;

        return new Promise((resolve, reject) => {
            this.getIncrements().then((result) => {
                user_id = result.user_id;
                if (user_id == -1) resolve(new Error('user_id not updating properly'));
                //if successfully got the index from DB, increment by 1 and save to DB
                 Increment.update({$inc:{'user_id': 1}}, (err) =>{
                    if (err) console.log(err)
                 });  
            
                let newUser = new User({
                    id: user_id,
                    name: headers.name,
                    role: headers.role,
                    corpId:headers.corpId,
                    phone: headers.phone
                });

                newUser.save(
                    (err) => {
                        if (err) resolve("ERROR in User insertion, ",err);
                        else resolve(`Entered ${newUser.name} `);
                    })
            })
        })
    }

    addNewHospital(HospitalDetails) {
        var headers = JSON.parse(HospitalDetails), //remove when sending from client side
            hospital_id = -1;

        return new Promise((resolve, reject) => {
            this.getIncrements().then((result) => {
                hospital_id = result.hospital_id;
                if (hospital_id == -1) resolve(new Error('hospital_id not updating properly'));
                //if successfully got the index from DB, increment by 1 and save to DB
                 Increment.update({$inc:{'hospital_id': 1}}, (err) =>{
                    if (err) console.log(err)
                 });  
            
                let newHospital = new Hospital({
                    id: hospital_id,
                    name: headers.name,
                    location: headers.location
                });

                newHospital.save(
                    (err) => {
                        if (err) resolve("ERROR in User insertion, ",err);
                        else resolve(`Entered ${newHospital.name} `);
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


    getInjuredsSeverity(severity) {
        return new Promise((resolve, reject) => {
            Injured.find({severity: severity},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    getInjuredsByEvent(eventId) {
        return new Promise((resolve, reject) => {
            Injured.find({eventId: eventId},
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

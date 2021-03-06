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

    // check the severity of injured by injured data
    checkSeverity(blood_pressure, heartbeat,breathing){
        var severity = "OK";
        if(heartbeat> 100 || heartbeat< 60){
            severity ="urgent-stable"; 
        }
        return severity;
    }


    /**
     * The following methods are called by routes only from the server.js file
     */

    // Login function get hospital name and password and return hospital data from DB
    login(name ,password) {
        return new Promise((resolve, reject) => {
            Hospital.findOne({$and:[{name:name},{password:password}]},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    //used by hospital desktop, return all the injureds do not admietted in this hospital yet
    activeInjuredsByHospital(toHospital) {
        return new Promise((resolve, reject) => {
            Injured.find({$and:[{InHospital:false},{toHospital:toHospital}]},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };
    //used by event manager , return all injureds are still not in the way to hospital
    activeInjuredsByEvent(eventId) {
        return new Promise((resolve, reject) => {
            Injured.find({$and:[{InHospital:false},{eventId:eventId}]},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };


    getAllUsers() {
        return new Promise((resolve, reject) => {
            User.find({}, '-_id', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })    
    }

    getAllEvents() {
        return new Promise((resolve, reject) => {
            EMSevent.find({}, '-_id', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })    
    }

    getAllInjureds() {
        return new Promise((resolve, reject) => {
            Injured.find({}, '-_id', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })    
    }

    getAllHospitals() {
        return new Promise((resolve, reject) => {
            Hospital.find({}, '-_id', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })    
    }
    //get Data from motorola smartphone and add injured to DB
    addNewInjured(injuredDetails) {
        var headers = injuredDetails,
            injured_id = -1;
            // severityResult = 0;
        return new Promise((resolve, reject) => {
            this.getIncrements().then((result) => {
                injured_id = result.injured_id;
                if (injured_id == -1) resolve(new Error('injured_id not updating properly'));
                //if successfully got the index from DB, increment by 1 and save to DB
                 Increment.update({$inc:{'injured_id': 1}}, (err) =>{
                    if (err) console.log(err)
                 });  
                // not used- severityResult = this.checkSeverity(headers.blood_pressure, headers.heartbeat,headers.breathing);

                let newInjured = new Injured({
                    id: injured_id,
                    name:headers.name,
                    age:headers.age,
                    gender: headers.gender,
                    location: headers.location,
                    airWay: headers.airWay,
                    breathing: headers.breathing,
                    blood_pressure: headers.blood_pressure,
                    heartbeat:  headers.heartbeat,
                    disability: headers.disability,
                    exposure: headers.exposure,
                    toHospital: headers.toHospital,
                    TandT: headers.TandT,
                    severity: headers.severity,
                    treatment: headers.treatment,
                    addBy: headers.addBy,
                    ModifyBy: headers.ModifyBy,
                    QrId: headers.QrId,
                    eventId:headers.eventId,
                    InHospital : false
                });

                newInjured.save(
                    (err) => {
                        if (err) reject("ERROR in injured insertion, ",err);
                        else resolve(`Entered as ${newInjured.name}`);
                })
            })
        })
    }


    addNewEvent(EventDetails) {
        var headers = EventDetails,
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
                    EventDescription:headers.EventDescription,
                    createByUserID: headers.createByUserID,
                    location: headers.location
                });

                newEvent.save(
                    (err) => {
                        if (err) reject("ERROR in injured insertion, ",err);
                        else resolve(` ${EMSevent_id} `)
                    })
            })
        })
    }

    addNewUser(UserDetails) {
        var headers = UserDetails, 
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
                    password : headers.password,
                    role: headers.role,
                    corpId:headers.corpId,
                    phone: headers.phone,
                    active:true
                });

                newUser.save(
                    (err) => {
                        if (err) reject("ERROR in User insertion, ",err);
                        else resolve(`Entered ${newUser.name} `);
                    })
            })
        })
    }

    addNewHospital(HospitalDetails) {
        var headers = HospitalDetails,
        // JSON.parse(HospitalDetails), //remove when sending from client side
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
                    password: headers.password,
                    phone : headers.phone,
                    location: headers.location
                });

                newHospital.save(
                    (err) => {
                        if (err) reject("ERROR in User insertion, ",err);
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

    getInjuredByQR(QrId) {
        return new Promise((resolve, reject) => {
            Injured.findOne({QrId: QrId},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    getUserById(id) {
        return new Promise((resolve, reject) => {
            User.findOne({id: id},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    getHospitalById(id) {
        return new Promise((resolve, reject) => {
            Hospital.findOne({id: id},
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

    // return injureds by severity
    getInjuredsSeverity(severity) {
        return new Promise((resolve, reject) => {
            Injured.find({severity: severity},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    //return all injureds of specific event
    getInjuredsByEvent(eventId) {
        return new Promise((resolve, reject) => {
            Injured.find({eventId: eventId},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                    console.log(result);
                });
        });
    };

    InjuredsByHospital(toHospital) {
        return new Promise((resolve, reject) => {
            Injured.find({toHospital: toHospital},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                    console.log(result);
                });
        });
    };

    //user.active change to false 
    SetInactiveUser(id) {                                    
        return new Promise((resolve, reject) => {
                User.update({'id': id}, 
                {$set:{"active": false}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${id} is inactive`);
                });
        })
    }

    
    //user.active change to true
    SetActiveUser(id) {                                     
        return new Promise((resolve, reject) => {
                User.update({'id': id}, 
                {$set:{"active": true}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${id} is active`);
                });
        })
    }

     //when event Manager change ToHospital of injured - send him to hospital 
    SetToHospital(InjuredDetails) { 
    var headers = InjuredDetails;   
    // var headers = JSON.parse(InjuredDetails);                                  
        return new Promise((resolve, reject) => {
                Injured.update({'id': headers.id}, 
                {$set:{"toHospital": headers.toHospital}}, (err) => {
                    if (err) reject (err);
                    else resolve(`is in hospital`);
                });
        })
    }

     //Injured.InHospital  change to true - when hospital receive the injured
    hospitalGetInjured(id) {                                   
        return new Promise((resolve, reject) => {
                Injured.update({'id': id}, 
                {$set:{"InHospital": true}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${id} in hospital`);
                });
        })
    }

    //get updated user details and update by user id
    editUser(UserDetails) { 
    var headers = UserDetails;                               
        return new Promise((resolve, reject) => {
                User.update({'id': headers.id}, 
                {$set:{"name": headers.name,
                    "password" : headers.password,
                    "role": headers.role,
                    "corpId":headers.corpId,
                    "phone": headers.phone }}, (err) => {
                    if (err) reject (err);
                    else resolve(`${headers.id}`);
                });
        })
    }

    editHospital(HospitalDetails) { 
    var headers = HospitalDetails;                               
        return new Promise((resolve, reject) => {
                Hospital.update({'id': headers.id}, 
                {$set:{"name": headers.name,
                    "password" : headers.password,
                    "location":headers.location,
                    "phone": headers.phone }}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${headers.name}`);
                });
        })
    }

    editEvent(EventDetails) { 
    var headers = EventDetails;                               
        return new Promise((resolve, reject) => {
                EMSevent.update({'id': headers.id}, 
                {$set:{"EventDescription": headers.EventDescription,
                    "createByUserID" : headers.createByUserID,
                    "location":headers.location,
                    "EventTime": headers.EventTime}}, (err) => {
                    if (err) reject (err);
                     else resolve(`edit ${headers.id}`);
                });
        })
    }

    //edit injured's personla details by hospital
    editInjured(InjuredDetails) { 
    var headers = InjuredDetails;                               
        return new Promise((resolve, reject) => {
                Injured.update({'id': headers.id}, 
                {$set:{"gender": headers.gender,
                    "age" : headers.age,
                    "name":headers.name}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${headers.id}`);
                });
        })
    }

     //edit injured's medical details by paramedic
    editMedicalDetails(InjuredDetails) { 
    var headers = JSON.parse(InjuredDetails);                              
        return new Promise((resolve, reject) => {
                Injured.update({'id': headers.id}, 
                {$set:{ "airWay"         : headers.airWay,
                        "breathing"      : headers.breathing,
                        "blood_pressure" : headers.blood_pressure,
                        "disability"     : headers.disability,
                        "exposure"       : headers.exposure,
                        "heartbeat"      : headers.heartbeat,
                        "toHospital"     : headers.toHospital}}, (err) => {
                    if (err) reject (err);
                    else resolve(`edit ${headers.id}`);
                });
        })
    }

    //Dashboard - get all the injured do not hospitalize yet
    notHospitalInjureds() {
        return new Promise((resolve, reject) => {
            Injured.find({InHospital: false},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    getAllActiveUsers() {
        return new Promise((resolve, reject) => {
            User.find({active: true},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    getInActiveUsers() {
        return new Promise((resolve, reject) => {
            User.find({active: false},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    getAllActiveEvents() {
        return new Promise((resolve, reject) => {
            EMSevent.find({active: true},
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

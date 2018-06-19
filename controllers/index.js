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


    login(name ,password) {
        return new Promise((resolve, reject) => {
            Hospital.findOne({$and:[{name:name},{password:password}]},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    activeInjuredsByHospital(toHospital) {
        return new Promise((resolve, reject) => {
            Injured.find({$and:[{InHospital:false},{toHospital:toHospital}]},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };

    activeInjuredsByEvent(eventId) {
        return new Promise((resolve, reject) => {
            Injured.find({$and:[{InHospital:false},{eventId:eventId}]},
                (err, result) => {
                    if (err) reject (err);
                    else resolve (result);
                });
        });
    };


    checkSeverity(blood_pressure, heartbeat,breathing){
        var severity = "OK";
        if((heartbeat> 130 || heartbeat< 50) && blood_pressure === "high" ){
            severity ="urgent-stable"; 
        }
        return severity;
    }


    /**
     * The following methods are called by routes only from the server.js file
     */
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

    addNewInjured(injuredDetails) {
        var headers = injuredDetails, //remove when sending from client side
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
                severityResult = this.checkSeverity(headers.blood_pressure, headers.heartbeat,headers.breathing);

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
                    severity: severityResult,
                    treatment: headers.treatment,
                    addBy: headers.addBy,
                    ModifyBy: headers.ModifyBy,
                    QrId: headers.QrId,
                    eventId:headers.eventId,
                    InHospital : false
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
                    description:headers.description,
                    createByUserID: headers.createByUserID,
                    location: headers.location,
                    active: true
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
                        if (err) resolve("ERROR in User insertion, ",err);
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
                    console.log(result);
                });
        });
    };

    SetInactiveUser(id) {                                    //user.active change to false
        return new Promise((resolve, reject) => {
                User.update({'id': id}, 
                {$set:{"active": false}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${id} is inactive`);
                });
        })
    }

    

    SetActiveUser(id) {                                     //user.active change to true
        return new Promise((resolve, reject) => {
                User.update({'id': id}, 
                {$set:{"active": true}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${id} is active`);
                });
        })
    }

    SetToHospital(InjuredDetails) { 
    var headers = InjuredDetails;   
    // var headers = JSON.parse(InjuredDetails);                                   //when Manager change ToHospital of injured 
        return new Promise((resolve, reject) => {
                Injured.update({'id': headers.id}, 
                {$set:{"toHospital": headers.toHospital}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${id} is in hospital`);
                });
        })
    }

    hospitalGetInjured(id) {                                    //Injured.InHospital  change to true - when hospital get the injured
        return new Promise((resolve, reject) => {
                Injured.update({'id': id}, 
                {$set:{"InHospital": true}}, (err) => {
                    if (err) reject (err);
                    else resolve(` ${id} in hospital`);
                });
        })
    }

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
                    else resolve(`edit ${headers.name}`);
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
                    else resolve(`edit ${headers.name}`);
                });
        })
    }

    editEvent(EventDetails) { 
    var headers = EventDetails;                               
        return new Promise((resolve, reject) => {
                EMSevent.update({'id': headers.id}, 
                {$set:{"description": headers.description,
                    "createByUserID" : headers.createByUserID,
                    "location":headers.location,
                    "time": headers.time,
                    "active": headers.active }}, (err) => {
                    if (err) reject (err);
                     else resolve(`edit ${headers.description}`);
                });
        })
    }

    editInjured(InjuredDetails) { 
    var headers = InjuredDetails;                               //edit injured's personla details by hospital
        return new Promise((resolve, reject) => {
                Injured.update({'id': headers.id}, 
                {$set:{"gender": headers.gender,
                    "age" : headers.age,
                    "name":headers.name}}, (err) => {
                    if (err) reject (err);
                    else resolve(`edit ${headers.name}`);
                });
        })
    }

    editMedicalDetails(InjuredDetails) { 
    var headers = JSON.parse(InjuredDetails);                               //edit injured's medical details by paramedic
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

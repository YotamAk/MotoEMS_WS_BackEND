const express = require('express'),
      url = require('url'),
      bodyParser = require('body-parser'),
      mangoconnect = require('./mangoconnect'),
      app = express(),
      port = process.env.PORT || 3000,
      event = require('./controllers');
      data = event();


  app.use('assets',express.static('${__dirname}/public'))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true}));
  app.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
      // Pass to next layer of middleware
      next();
  });


  app.get('/test', function(req,res){
      injured.find().then(function(results){
                console.log(' Get All Data :P ');
                console.log(results);
                res.json(results);
      }).catch(function(e){
        res.json(e);
      });
  });


 app.get('/getInjuredById/:id', (req,res,next) => {
    data.getInjuredById(req.params.id).then((result) => {
        res.status(200).send(result);    
	console.log("Get injured by id : " + req.params.id);
    }, (error) => {
        console.log(error);
        next();
    })
  })

 app.get('/getEventById/:id', (req,res,next) => {
    data.getEventById(req.params.id).then((result) => {
        res.status(200).send(result);    
	console.log("Get  Event By Id : " , req.params.id );
    }, (error) => {
        console.log(error);
        next();
    })
  })

 app.get('/getInjuredsSeverity/:severity', (req,res,next) => {
    data.getInjuredsSeverity(req.params.severity).then((result) => {
        res.status(200).send(result);
	console.log("Get Injured By Severity : " + req.params.severity );    
    }, (error) => {
        console.log(error);
        next();
    })
  })


 app.post('/addNewInjured/', (req, res, next) => {
    data.addNewInjured(
        req.body.injuredDetails).then((result) => {
        result.length === 0 ? next() : res.status(200).json(result);
	console.log("Add New Injured : "+result)
    }, (error) => {
        console.log(error);
        next();
    })
  })

  app.post('/addNewEvent/', (req, res, next) => {
    data.addNewEvent(
        req.body.EventDetails).then((result) => {
        result.length === 0 ? next() : res.status(200).json(result);
        }, (error) => {
        console.log(error);
        next();
        })
  })

  app.post('/addNewUser/', (req, res, next) => {
    data.addNewUser(
        req.body.UserDetails).then((result) => {
        result.length === 0 ? next() : res.status(200).json(result);
	console.log("Add New User : " + result);
        }, (error) => {
        console.log(error);
        next();
        })
  })


  app.post('/addNewHospital/', (req, res, next) => {
    data.addNewHospital(
        req.body.HospitalDetails).then((result) => {
        result.length === 0 ? next() : res.status(200).json(result);
	console.log("Add new hospital : " +  result );
        }, (error) => {
        console.log(error);
        next();
        })
  })

    app.get('*', function(req,res){
      res.send('Got Lost? This is Friendly 404 Page ;) ');
    //  console.log(' 404 Get Lost ');
    });

        app.listen(port);
       console.log('listening to port :  '+ port );

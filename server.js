var express = require('express');
var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');
var multer = require('multer');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var db = require('./db.js');
var FCM = require('fcm-push');
var Sequelize = require ('sequelize');
var moment = require('moment');

var app = express();
var PORT = process.env.PORT || 8000;



app.use(morgan('dev'));
app.use(bodyParser.json());

var serverKey = 'AAAACXYx8nU:APA91bHEwZK7Ua_siwJ0tJgG-TYnkap_8KTIQFchdKdkoOTQ1dxN0oECvgt4Rhh7RxnBKOu_d_BT3hWSQThu9TMHVQiFsbUnYPk9HimsOoEWlmW5a6D2wfsJRFQO1mWX0yQQyT9VChwE';
var fcm = new FCM(serverKey);

var currentLoc={
    "lat": "0",
    "long":"0"
};





var location = {    
    "lat" : "34.065904" ,
    "long" : "72.635813"
};

app.get('/location', function (req, res) {
    console.log(location);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json(location);
   
});

app.post('/test', function (req, res) {  
    if (req.body.hasOwnProperty('lat')) {
        location.lat = req.body.lat;
    }
    if (req.body.hasOwnProperty('long')) {
        location.long = req.body.long;
    }
    if (req.body.hasOwnProperty('locationName')) {
        location.locationName = req.body.locationName;
    }


  var message = {
    to: 'eognJHtm-zE:APA91bG5UrSh1BFnDwpdI2DjWkGqbafF3YI4J7LZ5KOeicTorfgv48RPbI1VmfaKhnZ1gBtFkjL-vgzv3_ct4BNauqBrOUGk7Lyhu5iGHu88uzV3zF9dPkJ_kwx09hQ1evAS-9U6JK-R', // required fill with device token or topics
    
    data: {
        click_action : 'com.example.sosecure.sosecurego.PushActivity',
        lat : location.lat,
        long :location.long,
        //locationName:location.locationName
    },
    notification: {
        title: 'SOSecure Alert',
        body: 'Accident occured at ' + location.locationName
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
res.status(200).send('Ok');
});



cloudinary.config({ 
  cloud_name: 'fyp-sosecure', 
  api_key: '939993396375476', 
  api_secret: '4IOffraTFxkUI7iPnOnPmAuCCdA' 
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary
});

var parser = multer({ storage: storage});

app.post('/upload', parser.single('file'), function (req, res) {
  console.log(req.file.secure_url);
  console.log (req.body);
  res.status(200).send('Sent successfully');
});

app.get('/', function (req, res) {
  res.send('SOSecure Server');
});

app.get('/users', function (req, res) {
    db.user.findAll().then(function (users) {
       return res.json(users);
    }, function () {
        res.status(500).send();
    });

    
});

app.post('/userLogin', function (req, res) {
    var param = req.body;
    console.log(param);
    db.user.findOne({ where: { userName: param.userName ,password: param.password} }).then(function (user) {
        if (user) {
            console.log(user);
          res.json(user.toJSON());
          res.status(200).send();
        }
        else {
            
            res.status(404).send();
        }
    })
});

app.post('/driverLogin', function (req, res) {
    var param = req.body;
    console.log(param);
    db.driver.findOne({ where: { userName: param.userName ,password: param.password} }).then(function (user) {
        if (user) {
            console.log(user);
          res.json(user.toJSON());
          res.status(200).send();
        }
        else {
            
            res.status(404).send();
        }
    })
});

app.get('/user/:id', function (req, res) {
    db.user.findById(req.params.id).then(function (user) {
        if (user)
            res.json(user.toJSON());
            
        else
            res.status(404).send();
    }, function () {
        res.status(500).send();
    });
});


app.post('/user', function (req, res) {
    var param = req.body;
    console.log(param);
    db.user.create(param).then(function (user) {
        console.log(user);
        return res.json(user.toJSON());
    }, function (e) {
        console.log(e);
        res.status(400).json(e.errors[0].message);
    });
   
});


app.post('/driver', function (req, res) {
    var param = req.body;
    console.log(param);
    db.driver.create(param).then(function (user) {
        return res.json(user.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
   
});

app.delete('/user/:id', function (req, res) {
    db.user.destroy({ where: { id: req.params.id } }).then(function (numDeletedRows) {
        if (numDeletedRows > 0)
            res.status(204).send();
        else
            res.status(404).send();
    }, function () {
        res.status(500).send();
    });
});



app.post('/updateProfile', parser.single('file'), function (req, res) {
  console.log("profilePicURl    ",req.file.secure_url);
  console.log ("body/updateProfile   ",req.body);
  
    var upUser = {};

    if (req.file.secure_url != null) {
        upUser.photo= req.file.secure_url;
    }

    if (req.body.name != undefined) {
        upUser.name = req.body.name;
    }
    if (req.body.dob != undefined) {
        upUser.dob = req.body.dob;
    }
    if (req.body.city != undefined) {
        upUser.city = req.body.city;
    }
    db.user.findOne({ where: { userName: req.body.userName } }).then(function (user) {
        if (user) {
            user.update(upUser).then(function (User) {
                res.json(User.toJSON());
                console.log("updated User  ",User);
            }, function (e) {
                console.log("error/updateProfile  ",e);
                res.status(400).json(e);
            });
        }
        else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
});

app.get('/userInformation/:username', function(req, res){
    var username = req.params.username;
    var User = {};
    console.log(username);
    /*sequelize.query("SELECT name, city, dob, photo FROM `user` WHERE userName = :username",
    { type: sequelize.QueryTypes.SELECT}).then(function(user) {
        if (user){
            res.json(user.toJSON());
        } else {
            res.status(404).send();
        }
    },
    function() {
        res.status(500).send();
      });
    });*/
    db.user.findOne({ where: { userName: username} }).then(function(user) {
    if (user){
        User.name = user.name
        User.city = user.city;
        User.dob = user.dob;
        User.photo = user.photo;
        res.json(User);
    }
    else{
      res.status(404).send();
    }
  }, function() {
        res.status(500).send();
      });
    });

app.get('/driverInformation/', function(req, res){
    db.user.findAll({attributes: ['name', 'city', 'dob', 'photo']}).then(function(drivers) {
    if (drivers){
        res.json(drivers);
    }
    else{
      res.status(404).send();
    }
  }, function() {
        res.status(500).send();
      });
});

/*-------------------------------------Emergency Contacts------------------*/
app.post ('/emergencyContacts', function (req, res){
  db.emergencyContacts.create(req.body).then(function (other) {
      res.json(other.toJSON());
      res.status(200).send();
    }, function (e) {
      res.status(400).json(e);
    });
});

app.get('/emergencyContacts/:username', function(req, res){
    var username = req.params.username;
    db.emergencyContacts.findAll({ where: {
      userName: username
    }}).then(function(emergencyContacts) {
      if (emergencyContacts){
        res.json(emergencyContacts);
        res.status(200).send();
    } else{
      res.status(404).send();
    }
  }, function() {
        res.status(500).send();
      });
});
/*-------------------------------------Emergency Contacts------------------*/


/*-------------------------------------USERS & DRIVERS COUNT------------------*/
app.get ('/countDrivers', function (req, res){
    db.user.findAndCountAll().then(function(drivers){
        if(drivers){
             res.json(drivers.count);
            res.status(200).send();
        } else{
            res.status(404).send();
        }
  }, function() {
        res.status(500).send();
    })
});

app.get ('/countUsers', function (req, res){
    db.user.findAndCountAll().then(function(users){
        if(users){
            res.json(users.count);
            res.status(200).send();
        } else{
            res.status(404).send();
        }
  }, function() {
        res.status(500).send();
    })
});
/*-------------------------------------USERS & DRIVERS COUNT------------------*/

app.post ('/accident', function (req, res ){
    db.accidentRecords.create(req.body).then(function (accident) {
        res.json(accident.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});

app.get('/accident', function(req, res){
    db.accidentRecords.findAll({ where: {
        date: {
            $gte: moment().subtract(7, 'days').toDate()
        }
    } ,
    group: 'date'})
    .then(function(accident){
        if (accident){
            res.json(accident);
            res.status(200).send();
        } else {
            res.status(404).send();
        }
    });
});

app.put('/user/:id', function (req, res) {
    var upUser = {};

    if (req.body.hasOwnProperty('name')) {
        upUser.name = req.body.name;
    }
    if (req.body.hasOwnProperty('dob')) {
        upUser.dob = req.body.dob;
    }
    if (req.body.hasOwnProperty('city')) {
        upUser.city = req.body.city;
    }
    if (req.body.hasOwnProperty('email')) {
        upUser.email = req.body.email;
    }
    if (req.body.hasOwnProperty('userName')) {
        upUser.userName = req.body.userName;
    }
    if (req.body.hasOwnProperty('password')) {
        upUser.password = req.body.password;
    }


    db.user.findOne({ where: { id: req.params.id } }).then(function (user) {
        if (user) {
            user.update(upUser).then(function (User) {
                res.json(User.toJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        }
        else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
});

//Routes for vehicles

app.get('/vehicles', function (req, res) {
    db.vehicle.findAll().then(function (vehicles) {
        res.json(vehicles);
    }, function () {
        res.status(500).send();
    });
});

app.get('/vehicle/:id', function (req, res) {
    db.vehicle.findById(req.params.id).then(function (vehicle) {
        if (vehicle)
            res.json(vehicle.toJSON());
        else
            res.status(404).send();
    }, function () {
        res.status(500).send();
    });
});

app.post('/vehicle', function (req, res) {
    var param = req.body;
    db.vehicle.create(param).then(function (vehicle) {
        res.json(vehicle.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});


app.delete('/vehicle/:id', function (req, res) {
    db.vehicle.destroy({ where: { VID: req.params.id } }).then(function (numDeletedRows) {
        if (numDeletedRows > 0)
            res.status(204).send();
        else
            res.status(404).send();
    }, function () {
        res.status(500).send();
    });
});

app.put('/vehicle/:id', function (req, res) {
    var upvehicle = {};

    if (req.body.hasOwnProperty('VID')) {
        upvehicle.VID = req.body.VID;
    }
    if (req.body.hasOwnProperty('timeIN')) {
        upvehicle.timeIN = req.body.timeIN;
    }
    if (req.body.hasOwnProperty('timeOut')) {
        upvehicle.timeOut = req.body.timeOut;
    }
    if (req.body.hasOwnProperty('capacity')) {
        upvehicle.capacity = req.body.capacity;
    }
    if (req.body.hasOwnProperty('date')) {
        upvehicle.date = req.body.date;
    }

    db.vehicle.findOne({ where: { VID: req.params.id } }).then(function (vehicle) {
        if (vehicle) {
            vehicle.update(upvehicle).then(function (Vehicle) {
                res.json(Vehicle.toJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        }
        else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
});

app.post('/currentLoc', function (req, res) {
    var param = req.body;
    currentLoc.lat=param.lat;
    currentLoc.long=param.long;
    console.log(currentLoc);

});

app.get('/currentLoc', function (req, res) {
    var dist= getDistanceFromLatLonInKm(currentLoc.lat,currentLoc.long,34.0697809,72.6416786);
    var answ={
        "lat" : currentLoc.lat ,
        "long": currentLoc.long ,
        "dist":dist,
        "GreenFlag" :false
    }

    if(dist<=0.15){
        answ.GreenFlag=true;
    }
    console.log(dist);
    console.log(currentLoc);
    return res.json(answ);
   
});


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

db.database.sync({force: true}).then(function () {
    app.listen(PORT, function () {
        console.log('Server running on 8000 PORT');
    });

});
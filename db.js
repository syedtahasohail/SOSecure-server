var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';

var db;

if (env === 'production') {
    db = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        typeValidation: true
    });
}
else {
    db = new Sequelize(undefined, undefined, undefined, {
        dialect: 'sqlite',
        storage: './data/database.sqlite',
        typeValidation: true,
        //timezone: '+05:00'
    });
}


var user = db.import('./models/user.js');
var driver = db.import('./models/goDriver.js');
var emergencyContacts = db.import('./models/emergency-contacts');
var accidentRecords = db.import('./models/accident-records');

user.hasMany(emergencyContacts, { foreignKey: 'userName' });

module.exports.database = db;
module.exports.Sequelize = Sequelize;
module.exports.user = user;
module.exports.driver = driver;
module.exports.accidentRecords = accidentRecords;
module.exports.emergencyContacts = emergencyContacts;



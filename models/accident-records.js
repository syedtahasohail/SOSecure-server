module.exports = function (sequelize, DataTypes) {
    var accidentRecords = sequelize.define('accident-records', {
        userName:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        lat: {
            type: DataTypes.DOUBLE,
        }, 
        lng: {
            type: DataTypes.DOUBLE,
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        }, 
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true
        } 
    });
    return accidentRecords;
};
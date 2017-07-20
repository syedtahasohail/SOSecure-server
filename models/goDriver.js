//var bcrypt = require('bcryptjs');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('goDriver', {
        name: {
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
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: false
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: false,
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
            /*,
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', hashedPassword);
               /* this.setDataValue('hashed_password', hashedPassword);
                this.setDataValue('salt', salt); 
            }
*/
        }
        ,
        dob: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
};
//var bcrypt = require('bcryptjs');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: false
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: false
            }
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
            args: true,
            message: 'Username must be unique.'
            },
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
                isEmail: {
                    args: true,
                    msg: 'Invalid Email'
                }
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
            allowNull: true
        },
        photo:{
            type: DataTypes.STRING,
            allowNull:true,
            unique:true
        }
    });
};
module.exports = function (sequelize, DataTypes) {
    var emergencyContacts = sequelize.define('emergency-contacts', {
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        }, 
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
            model: 'users',
            key: 'userName'
        }
    }
});
    return emergencyContacts;
};
import Sequelize from 'sequelize';
import sequelize from '../../config/database.js';
import bcryptService from '../services/bcrypt.service.js';

const User = sequelize.define(
    'User', 
    {
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        hooks: {
            beforeCreate: (user,_) => {
                user.password = bcryptService().password(user);
            }
        },
        tableName: 'users',
    }
);

User.prototype.toJSON = function() {
    const values = Object.assign({},this.get());
    delete values.password;
    return values;
};

export default User;

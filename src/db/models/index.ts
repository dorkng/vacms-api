import { Sequelize } from 'sequelize/types';
import Department, { init as initDepartment } from './department.model';
import User, { init as initUser } from './user.model';
import UserAccess, { init as initUserAccess } from './userAccess.model';
import UserVerification, { init as initUserVerification } from './userVerification.model';

function associate() {
  // User Relationships
  User.hasOne(UserAccess, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'access',
  });
  // User Access Relationships
  UserAccess.belongsTo(User, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'user',
  });
  UserAccess.belongsTo(Department, {
    foreignKey: {
      allowNull: true,
      name: 'departmentId',
      field: 'departmentId',
    },
    as: 'department',
  });
}

export { Department, User, UserAccess, UserVerification };

export function init(connection: Sequelize) {
  initDepartment(connection);
  initUser(connection);
  initUserAccess(connection);
  initUserVerification(connection);
  associate();
}
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  AccessLevel,
  IUserAccessAttribute,
} from '../../interfaces/user.interface';
import { Department, User } from './index';

class UserAccess
  extends Model<
  InferAttributes<UserAccess>,
  InferCreationAttributes<UserAccess>
  >
  implements IUserAccessAttribute {
  declare id: CreationOptional<number>;

  declare userId: number;

  declare accessLevel: AccessLevel;

  declare departmentId?: number;
}

export function init(connection: Sequelize) {
  UserAccess.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
      },
      accessLevel: {
        type: DataTypes.ENUM(
          'registrar',
          'lawyer',
          'director',
          'permanent-secretary',
          'attorney-general',
        ),
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'user_access',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
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

export default UserAccess;

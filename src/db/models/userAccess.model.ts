import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { AccessLevel, IUserAccessAttribute } from '../../interfaces/user.interface';

class UserAccess
  extends Model<InferAttributes<UserAccess>, InferCreationAttributes<UserAccess>>
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
        type: DataTypes.ENUM('registrar', 'lawyer', 'director', 'permanent-secretary', 'attorney-general'),
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

export default UserAccess;
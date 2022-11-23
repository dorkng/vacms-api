import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import serverConfig from '../../config/server.config';
import { IUserAttribute } from '../../interfaces/user.interface';
import { UserAccess } from './index';

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements IUserAttribute {
  declare id: CreationOptional<number>;

  declare email: string;

  declare password: string;

  declare firstName: string;

  declare lastName: string;

  declare phoneNumber: string;

  declare isAdmin: boolean;

  public access?: UserAccess;
}

export function init(connection: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ['password'],
          },
        },
      },
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = bcrypt.genSaltSync(serverConfig.BCRYPT_SALT_ROUNDS);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          const changes = user.changed() as string[];
          if (user.changed() && changes.includes('password')) {
            const salt = bcrypt.genSaltSync(serverConfig.BCRYPT_SALT_ROUNDS);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
      sequelize: connection,
    },
  );
}

export default User;
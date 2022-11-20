import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { IUserVerificationAttribute } from '../../interfaces/user.interface';

class UserVerification
  extends Model<InferAttributes<UserVerification>, InferCreationAttributes<UserVerification>>
  implements IUserVerificationAttribute {
  declare id: CreationOptional<number>;

  declare userId: number;

  declare otp: string;

  declare expiresOn: Date;

  declare isUsed: boolean;
}

export function init(connection: Sequelize) {
  UserVerification.init(
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
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresOn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'user_verification',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default UserVerification;
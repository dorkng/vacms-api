import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICourtAddressAttribute } from '../../interfaces/court.interface';

class CourtAddress
  extends Model<InferAttributes<CourtAddress>, InferCreationAttributes<CourtAddress>>
  implements ICourtAddressAttribute {
  declare id: CreationOptional<number>;

  declare street: string;

  declare city: string;

  declare state: string;
}

export function init(connection: Sequelize) {
  CourtAddress.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'court_addresses',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default CourtAddress;
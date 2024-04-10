import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICourtAddressAttribute } from '../../interfaces/court.interface';
import { State } from './index';

class CourtAddress
  extends Model<
  InferAttributes<CourtAddress>,
  InferCreationAttributes<CourtAddress>
  >
  implements ICourtAddressAttribute {
  declare id: CreationOptional<number>;

  declare street?: string;

  declare city?: string;

  declare stateId: number;

  public readonly state?: State;
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
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stateId: {
        type: DataTypes.INTEGER.UNSIGNED,
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

export function associate() {
  CourtAddress.belongsTo(State, {
    foreignKey: {
      allowNull: false,
      name: 'stateId',
      field: 'stateId',
    },
    onDelete: 'CASCADE',
    as: 'state',
  });
}

export default CourtAddress;

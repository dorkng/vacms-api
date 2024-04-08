import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICustodialFacilityAttribute } from '../../interfaces/custodialFacility.interface';
import { State } from './index';
import helperUtil from '../../utils/helper.util';

class CustodialFacility
  extends Model<
  InferAttributes<CustodialFacility>,
  InferCreationAttributes<CustodialFacility>
  >
  implements ICustodialFacilityAttribute {
  declare id: CreationOptional<number>;

  declare name: string;

  declare label: string;

  declare capacity: number;

  declare stateId: number;
}

export function init(connection: Sequelize) {
  CustodialFacility.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set() {
          this.setDataValue('label', helperUtil.getLabel(this.name));
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stateId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'custodial_facilities',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  CustodialFacility.belongsTo(State, {
    foreignKey: {
      allowNull: false,
      name: 'stateId',
      field: 'stateId',
    },
    onDelete: 'CASCADE',
    as: 'state',
  });
}

export default CustodialFacility;

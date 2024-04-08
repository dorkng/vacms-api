import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  IProsecutingAgencyAttribute,
  JurisdictionType,
} from '../../interfaces/prosecutingAgency.interface';
import { State } from './index';

class ProsecutingAgency
  extends Model<
  InferAttributes<ProsecutingAgency>,
  InferCreationAttributes<ProsecutingAgency>
  >
  implements IProsecutingAgencyAttribute {
  declare id: CreationOptional<number>;

  declare name: string;

  declare label: string;

  declare jurisdiction: JurisdictionType;

  declare stateId: number;
}

export function init(connection: Sequelize) {
  ProsecutingAgency.init(
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
          this.setDataValue(
            'label',
            this.name.replace(/\s+/g, '-').toLowerCase(),
          );
        },
      },
      jurisdiction: {
        type: DataTypes.ENUM(...Object.values(JurisdictionType)),
        allowNull: false,
      },
      stateId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'prosecurting_agencies',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  ProsecutingAgency.belongsTo(State, {
    foreignKey: {
      allowNull: false,
      name: 'stateId',
      field: 'stateId',
    },
    onDelete: 'CASCADE',
    as: 'state',
  });
}

export default ProsecutingAgency;

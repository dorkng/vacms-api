import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICourtAttribute } from '../../interfaces/court.interface';
import { CourtAddress, CourtType } from './index';
import helperUtil from '../../utils/helper.util';

class Court
  extends Model<InferAttributes<Court>, InferCreationAttributes<Court>>
  implements ICourtAttribute {
  declare id: CreationOptional<number>;

  declare name: string;

  declare label: string;

  declare typeId: number;

  declare addressId: number;

  declare numberOfCourtRooms?: number;

  declare chiefRegistrar?: string;

  public readonly address?: CourtAddress;
}

export function init(connection: Sequelize) {
  Court.init(
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
      typeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      addressId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      numberOfCourtRooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      chiefRegistrar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'courts',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  Court.belongsTo(CourtType, {
    foreignKey: {
      allowNull: false,
      name: 'typeId',
      field: 'typeId',
    },
    onDelete: 'CASCADE',
    as: 'type',
  });

  Court.belongsTo(CourtAddress, {
    foreignKey: {
      allowNull: false,
      name: 'addressId',
      field: 'addressId',
    },
    onDelete: 'CASCADE',
    as: 'address',
  });
}

export default Court;

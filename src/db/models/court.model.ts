import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICourtAttribute } from '../../interfaces/court.interface';

class Court
  extends Model<InferAttributes<Court>, InferCreationAttributes<Court>>
  implements ICourtAttribute {
  declare id: CreationOptional<number>;

  declare name: string;

  declare label: string;

  declare typeId: number;

  declare addressId: number;

  declare numberOfCourtRooms: number;

  declare chiefRegistrar?: string;
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
          this.setDataValue('label', this.name.replace(/\s+/g, '-').toLowerCase());
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
        allowNull: false,
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

export default Court;
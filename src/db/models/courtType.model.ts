import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICourtTypeAttribute } from '../../interfaces/court.interface';
import helperUtil from '../../utils/helper.util';

class CourtType
  extends Model<InferAttributes<CourtType>, InferCreationAttributes<CourtType>>
  implements ICourtTypeAttribute {
  declare id: CreationOptional<number>;

  declare name: string;

  declare label: string;

  declare logoUrl?: string;
}

export function init(connection: Sequelize) {
  CourtType.init(
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
      logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue('logoUrl');

          return helperUtil.getFileUrl(value);
        },
      },
    },
    {
      tableName: 'court_types',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default CourtType;

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICourtTypeAttribute } from '../../interfaces/court.interface';
import serverConfig from '../../config/server.config';

class CourtType
  extends Model<InferAttributes<CourtType>, InferCreationAttributes<CourtType>>
  implements ICourtTypeAttribute {
  declare id: CreationOptional<number>;

  declare name: string;

  declare label: string;

  declare logoUrl: string;
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
          this.setDataValue(
            'label',
            this.name.replace(/\s+/g, '-').toLowerCase(),
          );
        },
      },
      logoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          const value = this.getDataValue('logoUrl');

          if (value.startsWith('.files')) {
            return `${serverConfig.BASE_URL}/file?path=${value}`;
          }

          return value;
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

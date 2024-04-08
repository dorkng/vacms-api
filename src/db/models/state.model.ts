import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { IStateAttribute } from '../../interfaces/state.interface';
import helperUtil from '../../utils/helper.util';

class State
  extends Model<InferAttributes<State>, InferCreationAttributes<State>>
  implements IStateAttribute {
  declare id: CreationOptional<number>;

  declare name: string;

  declare label: string;
}

export function init(connection: Sequelize) {
  State.init(
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
    },
    {
      tableName: 'states',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default State;

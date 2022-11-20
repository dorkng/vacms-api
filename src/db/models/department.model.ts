import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { IDepartmentAttribute } from '../../interfaces/department.interface';

class Department
  extends Model<InferAttributes<Department>, InferCreationAttributes<Department>>
  implements IDepartmentAttribute {
  declare id: CreationOptional<number>;

  declare name: string;
}

export function init(connection: Sequelize) {
  Department.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'departments',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default Department;
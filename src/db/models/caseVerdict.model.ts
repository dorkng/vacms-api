import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseVerdictAttribute } from '../../interfaces/case.interface';
import { Case } from './index';

class CaseVerdict
  extends Model<
  InferAttributes<CaseVerdict>,
  InferCreationAttributes<CaseVerdict>
  >
  implements ICaseVerdictAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare path: string;
}

export function init(connection: Sequelize) {
  CaseVerdict.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      caseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'case_verdicts',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  CaseVerdict.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'case',
  });
}

export default CaseVerdict;

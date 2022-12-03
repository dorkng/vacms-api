import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseReportAttribute } from '../../interfaces/case.interface';

class CaseReport
  extends Model<InferAttributes<CaseReport>, InferCreationAttributes<CaseReport>>
  implements ICaseReportAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare content: string;
}

export function init(connection: Sequelize) {
  CaseReport.init(
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
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
    },
    {
      tableName: 'case_reports',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default CaseReport;
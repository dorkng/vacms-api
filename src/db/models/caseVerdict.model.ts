import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseVerdictAttribute, CaseVerdictType,  CaseVerdictStatus } from '../../interfaces/case.interface';

class CaseVerdict
  extends Model<InferAttributes<CaseVerdict>, InferCreationAttributes<CaseVerdict>>
  implements ICaseVerdictAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare type: CaseVerdictType;

  declare status: CaseVerdictStatus;

  declare judge: string;
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
      type: {
        type: DataTypes.ENUM(...Object.values(CaseVerdictType)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(CaseVerdictStatus)),
        allowNull: false,
      },
      judge: {
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

export default CaseVerdict;
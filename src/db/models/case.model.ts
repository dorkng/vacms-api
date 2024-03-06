import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseAttribute, CaseType, CaseStatus } from '../../interfaces/case.interface';

class Case
  extends Model<InferAttributes<Case>, InferCreationAttributes<Case>>
  implements ICaseAttribute {
  declare id: CreationOptional<number>;

  declare suitNumber: string;

  declare initiatingParties: string;

  declare respondingParties: string;

  declare type: CaseType;

  declare status: CaseStatus;

  declare courtId: number;

  declare presidingJudge?: string;

  declare originatingOrganisation?: string;

  declare parentCaseId?: number;

  declare remarks?: string;

  declare createdAt?: Date;
}

export function init(connection: Sequelize) {
  Case.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      suitNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      initiatingParties: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      respondingParties: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(CaseType)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(CaseStatus)),
        allowNull: false,
      },
      courtId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      presidingJudge: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      originatingOrganisation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentCaseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'cases',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default Case;
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseAdjournmentAttribute, CaseAdjournmentStatus } from '../../interfaces/case.interface';

class CaseAdjournment
  extends Model<InferAttributes<CaseAdjournment>, InferCreationAttributes<CaseAdjournment>>
  implements ICaseAdjournmentAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare date: Date;

  declare dateAdjournedTo: Date;

  declare status: CaseAdjournmentStatus;

  declare reason: string;
}

export function init(connection: Sequelize) {
  CaseAdjournment.init(
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
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateAdjournedTo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(CaseAdjournmentStatus)),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'case_adjournments',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default CaseAdjournment;
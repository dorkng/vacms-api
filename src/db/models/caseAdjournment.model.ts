import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseAdjournmentAttribute } from '../../interfaces/case.interface';

class CaseAdjournment
  extends Model<InferAttributes<CaseAdjournment>, InferCreationAttributes<CaseAdjournment>>
  implements ICaseAdjournmentAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare dateAdjournedTo: Date;

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
      dateAdjournedTo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT('long'),
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
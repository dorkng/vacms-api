import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseNoteAttribute } from '../../interfaces/case.interface';

class CaseNote
  extends Model<InferAttributes<CaseNote>, InferCreationAttributes<CaseNote>>
  implements ICaseNoteAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare from: string;

  declare to: string;

  declare content: string;

  declare date: Date;
}

export function init(connection: Sequelize) {
  CaseNote.init(
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
      from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'case_notes',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default CaseNote;
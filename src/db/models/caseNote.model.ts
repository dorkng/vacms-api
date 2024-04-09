import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseNoteAttribute } from '../../interfaces/case.interface';
import { User, Case } from './index';

class CaseNote
  extends Model<InferAttributes<CaseNote>, InferCreationAttributes<CaseNote>>
  implements ICaseNoteAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare fromId: number;

  declare toId: number;

  declare content: string;

  declare to?: User;

  declare from?: User;

  declare case?: Case;
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
      fromId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      toId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT('long'),
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

export function associate() {
  CaseNote.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'case',
  });

  CaseNote.belongsTo(User, {
    foreignKey: {
      allowNull: false,
      name: 'toId',
      field: 'toId',
    },
    onDelete: 'CASCADE',
    as: 'to',
  });

  CaseNote.belongsTo(User, {
    foreignKey: {
      allowNull: false,
      name: 'fromId',
      field: 'fromId',
    },
    as: 'from',
  });
}

export default CaseNote;

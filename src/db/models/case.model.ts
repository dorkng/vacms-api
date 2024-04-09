import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  ICaseAttribute,
  CaseType,
  CaseStatus,
} from '../../interfaces/case.interface';
import {
  CaseAdjournment,
  CaseDocument,
  CaseNote,
  CaseReport,
  CaseVerdict,
  Court,
} from './index';

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

export function associate() {
  Case.belongsTo(Court, {
    foreignKey: {
      allowNull: false,
      name: 'courtId',
      field: 'courtId',
    },
    as: 'court',
    onDelete: 'CASCADE',
  });

  Case.hasMany(Case, {
    foreignKey: {
      allowNull: true,
      name: 'parentCaseId',
      field: 'parentCaseId',
    },
    onDelete: 'CASCADE',
    as: 'interlocutories',
  });

  Case.hasMany(CaseAdjournment, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'adjournments',
  });

  Case.hasMany(CaseDocument, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'documents',
  });

  Case.hasMany(CaseReport, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'reports',
  });

  Case.hasMany(CaseNote, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'notes',
  });

  Case.hasOne(CaseVerdict, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'verdict',
  });
}

export default Case;

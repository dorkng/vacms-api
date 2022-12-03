import { Sequelize } from 'sequelize/types';
import Case, { init as initCase } from './case.model';
import CaseAdjournment, { init as initCaseAdjournment } from './caseAdjournment.model';
import CaseDocument, { init as initCaseDocument } from './caseDocument.model';
import CaseNote, { init as initCaseNote } from './caseNote.model';
import CaseReport, { init as initCaseReport } from './caseReport.model';
import CaseVerdict, { init as initCaseVerdict } from './caseVerdict.model';
import Court, { init as initCourt } from './court.model';
import CourtAddress, { init as initCourtAddress } from './courtAddress.model';
import CourtType, { init as initCourtType } from './courtType.model';
import Department, { init as initDepartment } from './department.model';
import User, { init as initUser } from './user.model';
import UserAccess, { init as initUserAccess } from './userAccess.model';
import UserVerification, { init as initUserVerification } from './userVerification.model';

function associate() {
  // Case Relationships
  Case.belongsTo(Court, {
    foreignKey: {
      allowNull: false,
      name: 'courtId',
      field: 'courtId',
    },
    as: 'court',
  });
  Case.hasMany(Case, {
    foreignKey: {
      allowNull: true,
      name: 'parentCaseId',
      field: 'parentCaseId',
    },
    as: 'interlocutories',
  });
  Case.hasMany(CaseAdjournment, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'adjournments',
  });
  Case.hasMany(CaseDocument, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'documents',
  });
  Case.hasMany(CaseReport, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'reports',
  });
  Case.hasMany(CaseNote, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'notes',
  });
  Case.hasOne(CaseVerdict, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'verdict',
  });
  // Case Adjournment Relationships
  CaseAdjournment.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'case',
  });
  // Case Document Relationships
  CaseDocument.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'case',
  });
  // Case Note Relationships
  CaseNote.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'case',
  });
  // Case Report Relationships
  CaseReport.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'case',
  });
  // Case Verdict Relationships
  CaseVerdict.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    as: 'case',
  });
  // Court Relationships
  Court.belongsTo(CourtType, {
    foreignKey: {
      allowNull: false,
      name: 'typeId',
      field: 'typeId',
    },
    as: 'type',
  });
  Court.belongsTo(CourtAddress, {
    foreignKey: {
      allowNull: false,
      name: 'addressId',
      field: 'addressId',
    },
    as: 'address',
  });
  // User Relationships
  User.hasOne(UserAccess, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'access',
  });
  // User Access Relationships
  UserAccess.belongsTo(User, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'user',
  });
  UserAccess.belongsTo(Department, {
    foreignKey: {
      allowNull: true,
      name: 'departmentId',
      field: 'departmentId',
    },
    as: 'department',
  });
}

export { 
  Case, CaseAdjournment, CaseDocument, CaseNote, CaseReport, CaseVerdict, Court,
  CourtAddress, CourtType, Department, User, UserAccess, UserVerification,
};

export function init(connection: Sequelize) {
  initCase(connection);
  initCaseAdjournment(connection);
  initCaseDocument(connection);
  initCaseNote(connection);
  initCaseReport(connection);
  initCaseVerdict(connection);
  initCourt(connection);
  initCourtAddress(connection);
  initCourtType(connection);
  initDepartment(connection);
  initUser(connection);
  initUserAccess(connection);
  initUserVerification(connection);
  associate();
}
import { Sequelize } from 'sequelize/types';
import Case, {
  init as initCase,
  associate as associateCase,
} from './case.model';
import CaseAdjournment, {
  init as initCaseAdjournment,
  associate as associateCaseAdjournment,
} from './caseAdjournment.model';
import CaseDocument, {
  init as initCaseDocument,
  associate as associateCaseDocument,
} from './caseDocument.model';
import CaseNote, {
  init as initCaseNote,
  associate as associateCaseNote,
} from './caseNote.model';
import CaseReport, {
  init as initCaseReport,
  associate as associateCaseReport,
} from './caseReport.model';
import CaseVerdict, {
  init as initCaseVerdict,
  associate as associateCaseVerdict,
} from './caseVerdict.model';
import Court, {
  init as initCourt,
  associate as associateCourt,
} from './court.model';
import CourtAddress, { init as initCourtAddress } from './courtAddress.model';
import CourtType, { init as initCourtType } from './courtType.model';
import Department, { init as initDepartment } from './department.model';
import User, {
  init as initUser,
  associate as associateUser,
} from './user.model';
import UserAccess, {
  init as initUserAccess,
  associate as associateUserAccess,
} from './userAccess.model';
import UserVerification, {
  init as initUserVerification,
} from './userVerification.model';

function associate() {
  // Case Relationships
  associateCase();
  // Case Adjournment Relationships
  associateCaseAdjournment();
  // Case Document Relationships
  associateCaseDocument();
  // Case Note Relationships
  associateCaseNote();
  // Case Report Relationships
  associateCaseReport();
  // Case Verdict Relationships
  associateCaseVerdict();
  // Court Relationships
  associateCourt();
  // User Relationships
  associateUser();
  // User Access Relationships
  associateUserAccess();
}

export {
  Case,
  CaseAdjournment,
  CaseDocument,
  CaseNote,
  CaseReport,
  CaseVerdict,
  Court,
  CourtAddress,
  CourtType,
  Department,
  User,
  UserAccess,
  UserVerification,
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

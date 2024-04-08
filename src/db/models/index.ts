import { Sequelize } from 'sequelize/types';
import AwaitingTrialInmate, {
  init as initAwaitingTrialInmate,
  associate as associateAwaitingTrialInmate,
} from './awaitingTrialInmate.model';
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
import ConvictedInmate, {
  init as initConvictedInmate,
  associate as associateConvictedInmate,
} from './convictedInmate.model';
import Court, {
  init as initCourt,
  associate as associateCourt,
} from './court.model';
import CourtAddress, {
  init as initCourtAddress,
  associate as associateCourtAddress,
} from './courtAddress.model';
import CourtType, { init as initCourtType } from './courtType.model';
import CustodialFacility, {
  init as initCustodialFacility,
  associate as associateCustodialFacility,
} from './custodialFacility.model';
import Department, { init as initDepartment } from './department.model';
import ProsecutingAgency, {
  init as initProsecutingAgency,
  associate as associateProsecutingAgency,
} from './prosecutingAgency.model';
import State, { init as initState } from './state.model';
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
  // Awaiting Trial Inmate Relationships
  associateAwaitingTrialInmate();
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
  // Convicted Inmate Relationships
  associateConvictedInmate();
  // Court Relationships
  associateCourt();
  // Court Address Relationships
  associateCourtAddress();
  // Custodial Facility Relationships
  associateCustodialFacility();
  // Prosecuting Agency Relationships
  associateProsecutingAgency();
  // User Relationships
  associateUser();
  // User Access Relationships
  associateUserAccess();
}

export {
  AwaitingTrialInmate,
  Case,
  CaseAdjournment,
  CaseDocument,
  CaseNote,
  CaseReport,
  CaseVerdict,
  ConvictedInmate,
  Court,
  CustodialFacility,
  CourtAddress,
  CourtType,
  Department,
  ProsecutingAgency,
  State,
  User,
  UserAccess,
  UserVerification,
};

export function init(connection: Sequelize) {
  initAwaitingTrialInmate(connection);
  initCase(connection);
  initCaseAdjournment(connection);
  initCaseDocument(connection);
  initCaseNote(connection);
  initCaseReport(connection);
  initCaseVerdict(connection);
  initConvictedInmate(connection);
  initCourt(connection);
  initCourtAddress(connection);
  initCourtType(connection);
  initCustodialFacility(connection);
  initDepartment(connection);
  initProsecutingAgency(connection);
  initState(connection);
  initUser(connection);
  initUserAccess(connection);
  initUserVerification(connection);
  associate();
}

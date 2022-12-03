export enum CaseType {
  civil = 'civil-case',
  appeal = 'appeal-case',
  criminal = 'criminal-case',
}

export enum CaseStatus {
  'pending' = 'pending',
  'in-court' = 'in-court',
  'struck-out' = 'struck-out',
  'verdict/judgement-passed' = 'verdict/judgement-passed',
  'preliminary-hearing' = 'preliminary-hearing',
}

export interface ICaseAttribute {
  id: number;
  suitNumber: string;
  initiatingParties: string;
  respondingParties: string;
  type: CaseType;
  status: CaseStatus;
  courtId: number;
  presidingJudge?: string;
  originatingOrganisation?: string;
  parentCaseId?: number;
  remarks?: string;
}

export enum CaseDocumentType {
  'cover-letter' = 'cover-letter',
  'case-file' = 'case-file',
  'supporting-documents' = 'supporting-documents',
}

export interface ICaseDocumentAttribute {
  id: number;
  caseId: number;
  type: CaseDocumentType;
  path: string;
}

export interface ICaseAdjournmentAttribute {
  id: number;
  caseId: number;
  dateAdjournedTo: Date;
  reason: string;
}

export interface ICaseReportAttribute {
  id: number;
  caseId: number;
  content: string;
}

export interface ICaseVerdictAttribute {
  id: number;
  caseId: number;
  path: string;
}

export interface ICaseNoteAttribute {
  id: number;
  caseId: number;
  fromId: number;
  toId: number;
  content: string;
}

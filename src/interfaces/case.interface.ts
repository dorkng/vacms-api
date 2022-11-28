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
}

export enum CaseFileType {
  'cover-letter' = 'cover-letter',
  'case-file' = 'case-file',
  'supporting-documents' = 'supporting-documents',
}

export interface ICaseFileAttribute {
  id: number;
  caseId: number;
  type: CaseFileType;
  path: string;
}

export enum CaseAdjournmentStatus {
  pending = 'pending',
  held = 'sitting-held',
  cancelled = 'sitting-cancelled',
}

export interface ICaseAdjournmentAttribute {
  id: number;
  caseId: number;
  date: Date;
  dateAdjournedTo: Date;
  status: CaseAdjournmentStatus;
  reason: string;
}

export enum CaseVerdictStatus {
  passed = 'passed',
  'struck-out' = 'struck-out',
}

export enum CaseVerdictType {
  main = 'substantive/main-suit',
  interlocutory = 'interlocutory',
}

export interface ICaseVerdictAttribute {
  id: number;
  caseId: number;
  type: CaseVerdictType;
  status: CaseVerdictStatus;
  judge: string;
}

export interface ICaseNoteAttribute {
  id: number;
  caseId: number;
  from: string;
  to: string;
  content: string;
  date: Date;
}

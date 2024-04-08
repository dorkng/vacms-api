export interface IAwaitingTrialInmateAttribute {
  id: number;
  firstName: string;
  lastName: string;
  otherName?: string;
  image: string;
  sex: string;
  custodyNumber?: string;
  custodialFacilityId: number;
  caseNumber?: string;
  courtId: number;
  offense?: string;
  offenseInterpretation?: string;
  prosecutingAgencyId: number;
  dateOfArraignment?: Date;
  dateOfAdmission?: Date;
  otherMeansOfId?: string;
}

export interface IConvictedInmateAttribute {
  id: number;
  firstName: string;
  lastName: string;
  otherName?: string;
  image: string;
  sex: string;
  custodyNumber?: string;
  custodialFacilityId: number;
  caseNumber?: string;
  courtId: number;
  offense?: string;
  offenseInterpretation?: string;
  prosecutingAgencyId: number;
  edr?: Date;
  ldr?: Date;
  compensation?: string;
  sentence?: string;
  optionOfFine?: string;
  dateOfConviction?: Date;
}

export enum JurisdictionType {
  STATE = 'state',
  FEDERAL = 'federal',
}

export interface IProsecutingAgencyAttribute {
  id: number;
  name: string;
  label: string;
  jurisdiction: JurisdictionType;
  stateId: number;
}

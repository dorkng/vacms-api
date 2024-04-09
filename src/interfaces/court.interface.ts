export interface ICourtTypeAttribute {
  id: number;
  name: string;
  label: string;
  logoUrl: string;
}

export interface ICourtAddressAttribute {
  id: number;
  street: string;
  city: string;
  stateId: number;
}

export interface ICourtAttribute {
  id: number;
  name: string;
  label: string;
  typeId: number;
  addressId: number;
  numberOfCourtRooms: number;
  chiefRegistrar?: string;
}

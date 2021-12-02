export default interface CalcMassResponse {
  uid: string;
  idx: number;
  mass: number;
  status: string;
}

export interface CalcMassErrorResponse {
  uid: string;
  idx: number;
  error: string;
}

export default interface CalcMassRequest {
  uid: string;
  idx: number;
  dim: {
    l: number;
    w: number;
    h: number;
  };
}

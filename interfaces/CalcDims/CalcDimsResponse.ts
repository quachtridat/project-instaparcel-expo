import CalcDimsRespondedData from "./CalcDimsRespondedData";

export default interface CalcDimsResponse {
  uid: string;
  data: CalcDimsRespondedData;
  status: string;
}

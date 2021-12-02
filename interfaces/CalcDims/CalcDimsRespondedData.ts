import Dim2D from "@/interfaces/Dim2D";

export interface CalcDimsRespondedData {
  boundeds: string[];
  croppeds: string[];
  dimensions: Dim2D[];
  frameIndices: number[];
}

export default CalcDimsRespondedData;

import Dim2D from "@/interfaces/Dim2D";

export default interface SizeAnalyzedImageData {
  uid: string;
  data: {
    boundeds: string[];
    croppeds: string[];
    dimensions: Dim2D[];
    frameIndices: number[];
  };
}

export interface FetchedSizeAnalyzedImageData extends SizeAnalyzedImageData {
  status: string;
}

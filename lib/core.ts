import { CalcMassRequest, CalcMassResponse, CalcMassErrorResponse } from "@/interfaces/CalcMass";
import { CalcDimsRequest, CalcDimsResponse } from "@/interfaces/CalcDims";
import { SaveImageResponse } from "@/interfaces/SaveImage";
import * as FileSystem from "expo-file-system";
import {
  // @ts-ignore
  SAVE_IMG_ENDPOINT,
  // @ts-ignore
  CALC_DIMS_ENDPOINT,
  // @ts-ignore
  CALC_MASS_ENDPOINT,
  // @ts-ignore
  SAVE_IMG_DUMMY_ENDPOINT,
  // @ts-ignore
  CALC_DIMS_DUMMY_ENDPOINT,
  // @ts-ignore
  CALC_MASS_DUMMY_ENDPOINT,
} from "react-native-dotenv";

export async function postUriFetchSaveImgDummy(): Promise<SaveImageResponse> {
  return await fetch(SAVE_IMG_DUMMY_ENDPOINT, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then<SaveImageResponse>(response => response.json());
}

export async function postUriFetchSaveImg(uri: string): Promise<SaveImageResponse> {
  const res = await FileSystem.uploadAsync(SAVE_IMG_ENDPOINT, uri).then<SaveImageResponse, SaveImageResponse>(
    res => {
      return JSON.parse(res.body);
    },
    reason => {
      return <SaveImageResponse>{
        status: "error",
        uid: "",
      };
    },
  );
  return res;
}

export async function postCalcDimsFetchDims(data: CalcDimsRequest, dummy?: boolean): Promise<CalcDimsResponse> {
  console.log(dummy && dummy ? CALC_DIMS_DUMMY_ENDPOINT : CALC_DIMS_ENDPOINT);
  const res = await fetch(dummy && dummy ? CALC_DIMS_DUMMY_ENDPOINT : CALC_DIMS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then<CalcDimsResponse>(res => res.json());
  {
    /* vscode console log: res */
  }
  return res;
}

export async function postCalcMassFetchMass(
  data: CalcMassRequest,
  dummy?: boolean,
): Promise<CalcMassResponse | CalcMassErrorResponse> {
  const res = await fetch(dummy && dummy ? CALC_MASS_DUMMY_ENDPOINT : CALC_MASS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then<CalcMassResponse | CalcMassErrorResponse>(res => res.json());
  {
    /* vscode console log: res */
  }
  return res;
}

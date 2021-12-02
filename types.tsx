/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalcDimsResponse } from "./interfaces/CalcDims";
import Dim3D from "./interfaces/Dim3D";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabHome: undefined;
  TabCamera: undefined;
  TabMeasureDimensions: undefined;
  TabMeasureMass: {
    dimsDataFront?: CalcDimsResponse;
    dimsDataTop?: CalcDimsResponse;
    dimsDataSide?: CalcDimsResponse;
    selectedFrameIndices?: {
      front: number;
      top: number;
      side: number;
    };
  };
  TabCalculateCost: {
    dims: Dim3D;
    mass: number;
  };
  TabSettings: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

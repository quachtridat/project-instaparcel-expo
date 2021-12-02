import React from "react";
import { View } from "@/components/Themed";
import tw from "@/lib/tailwind";
import { NavigationProp } from "@react-navigation/native";
import { StyleProp, ViewStyle } from "react-native";
import SimpleCostCalculator from "../SimpleCostCalculator";
import Dim3D from "@/interfaces/Dim3D";

export interface Props {
  style?: StyleProp<ViewStyle>;
  navigation?: NavigationProp<any>;
  objectInfo: {
    dims: Dim3D;
    mass: number;
  };
}

export const SimpleCostCalculatorView: React.FC<Props> = props => {
  return (
    <View style={props.style}>
      <SimpleCostCalculator
        style={tw`flex w-full h-full`}
        getVolume={() => props.objectInfo.dims.length * props.objectInfo.dims.width * props.objectInfo.dims.height}
        getMass={() => props.objectInfo.mass}
      />
    </View>
  );
};

export default SimpleCostCalculatorView;

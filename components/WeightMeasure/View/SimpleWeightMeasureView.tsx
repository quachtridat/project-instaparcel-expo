import React from "react";
import { Text, View } from "react-native";
import tw from "@/lib/tailwind";

export const SimpleWeightMeasureView: React.FC = () => (
  <View style={tw`flex justify-center items-center`}>
    <Text>Measure</Text>
  </View>
);

export default SimpleWeightMeasureView;

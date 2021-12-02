import React from "react";
import { Text, View } from "react-native";
import tw from "@/lib/tailwind";

export const SimpleSettings: React.FC = () => (
  <View style={tw`flex justify-center items-center`}>
    <Text>Settings!</Text>
  </View>
);

export default SimpleSettings;

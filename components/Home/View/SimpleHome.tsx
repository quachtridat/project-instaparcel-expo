import React from "react";
import { Button, StyleProp, Text, View, ViewStyle } from "react-native";
import tw from "@/lib/tailwind";
import { NavigationProp } from "@react-navigation/native";

export interface Props {
  style?: StyleProp<ViewStyle>;
  navigation: NavigationProp<any>;
}

export const SimpleHomeView: React.FC<Props> = props => {
  const handleQuickNavigationToCameraTab = () => {
    props.navigation.navigate("TabCamera");
  };

  return (
    <View style={[tw`flex flex-1 flex-col justify-center items-center`, props.style]}>
      <View style={tw`max-w-2xl w-full flex flex-1 flex-col justify-center items-center`}>
        <Text style={tw`font-bold text-4xl py-6`}>Welcome to Project InstaParcel!</Text>
        <Text style={tw`py-2`}>This application helps you measure the dimensions and weight of your parcel.</Text>
        <Text style={tw`py-2`}>
          Take 3 pictures of the front, top, and side of your parcel, and follow the instructions on each screen.
        </Text>
        <Text style={tw`py-2`}>To begin, press the Camera tab on the bottom tab bar, or press the button below.</Text>
        <Button title="Switch to Camera tab" onPress={handleQuickNavigationToCameraTab} />
      </View>
    </View>
  );
};

export default SimpleHomeView;

import React from "react";
import SimpleCostCalculatorView from "@/components/CostCalculator/View/SimpleCostCalculatorView";
import { RootTabScreenProps } from "../types";
import { View, Text } from "@/components/Themed";
import useColorScheme from "@/hooks/useColorScheme";
import tw from "@/lib/tailwind";
import { Button } from "react-native";

export interface Props extends RootTabScreenProps<"TabCalculateCost"> {}

export const TabCalculateCostScreen: React.FC<Props> = ({ navigation, route }) => {
  const colorScheme = useColorScheme();

  if (route.params) {
    return <SimpleCostCalculatorView navigation={navigation} objectInfo={route.params} />;
  } else {
    return (
      <View style={tw.style(colorScheme === "dark" ? "dark" : "", `flex flex-1 justify-center items-center px-4`)}>
        <Text>
          Please measure the object&apos;s dimensions and mass before calculating the cost. Click the button below to go
          back to the dimensions measure screen.
        </Text>
        <Button
          title="Go to dimensions measure screen"
          onPress={async () => navigation.navigate("TabMeasureDimensions")}
        />
      </View>
    );
  }
};

export default TabCalculateCostScreen;

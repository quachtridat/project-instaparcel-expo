import SimpleMassMeasureView from "@/components/MassMeasure/View/SimpleMassMeasureView";
import Colors from "@/constants/Colors";
import useColorScheme from "@/hooks/useColorScheme";
import { DimensionMismatchCorrection, get3d } from "@/lib/calc";
import tw from "@/lib/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Button, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function TabMeasureMassScreen({ route, navigation }: RootTabScreenProps<"TabMeasureMass">) {
  const [mass, setMass] = React.useState(0);

  const colorScheme = useColorScheme();

  const requireDimensions = (
    <View style={tw.style(colorScheme === "dark" ? "dark" : "", `flex flex-1 justify-center items-center px-4`)}>
      <Text>
        Please measure the front, top and side dimensions of the object before measuring the mass. Click the button
        below to go back to the dimension measure screen.
      </Text>
      <Button
        title="Go to dimension measure screen"
        onPress={async () => navigation.navigate("TabMeasureDimensions")}
      />
    </View>
  );

  if (route.params) {
    const params = route.params;
    const { dimsDataFront, dimsDataTop, dimsDataSide, selectedFrameIndices } = params;
    if (dimsDataFront && dimsDataTop && dimsDataSide && selectedFrameIndices) {
      React.useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("TabCalculateCost", {
                  dims: get3d(
                    dimsDataFront.data.dimensions[selectedFrameIndices.front],
                    dimsDataTop.data.dimensions[selectedFrameIndices.top],
                    dimsDataSide.data.dimensions[selectedFrameIndices.side],
                    DimensionMismatchCorrection.Average,
                  ),
                  mass: mass,
                })
              }
            >
              <FontAwesome name="arrow-circle-right" color={Colors[colorScheme].text} style={tw`text-xl mr-4`} />
            </TouchableOpacity>
          ),
        });
      }, [mass]);
      return (
        <View style={tw.style(colorScheme === "dark" ? "dark" : "", `flex flex-1 justify-center items-center`)}>
          <SimpleMassMeasureView
            style={tw`w-full`}
            dimsData={{
              front: dimsDataFront.data.dimensions[selectedFrameIndices.front],
              top: dimsDataTop.data.dimensions[selectedFrameIndices.top],
              side: dimsDataSide.data.dimensions[selectedFrameIndices.side],
            }}
            uid={dimsDataFront.uid}
            frameIdx={dimsDataFront.data.frameIndices[selectedFrameIndices.front]}
            onMassChange={mass => setMass(mass)}
          />
        </View>
      );
    } else return requireDimensions;
  } else {
    return requireDimensions;
  }
}

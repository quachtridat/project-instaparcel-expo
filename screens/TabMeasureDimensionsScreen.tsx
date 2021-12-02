import SimpleDimMeasureView from "@/components/DimensionMeasure/View/SimpleDimMeasureView";
import Colors from "@/constants/Colors";
import useColorScheme from "@/hooks/useColorScheme";
import { CalcDimsResponse } from "@/interfaces/CalcDims";
import tw from "@/lib/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Button, Modal, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export interface Props extends RootTabScreenProps<"TabMeasureDimensions"> {}

export const TabMeasureDimensionsScreen: React.FC<Props> = ({ navigation }) => {
  const colorScheme = useColorScheme();

  const [isInstructionModalVisible, setIsInstructionModalVisible] = React.useState(false);
  const [dimsDataFront, setDimsDataFront] = React.useState<CalcDimsResponse | null>(null);
  const [dimsDataTop, setDimsDataTop] = React.useState<CalcDimsResponse | null>(null);
  const [dimsDataSide, setDimsDataSide] = React.useState<CalcDimsResponse | null>(null);
  const [selectedFrontFrameIndex, setSelectedFrontFrameIndex] = React.useState<number>(0);
  const [selectedTopFrameIndex, setSelectedTopFrameIndex] = React.useState<number>(0);
  const [selectedSideFrameIndex, setSelectedSideFrameIndex] = React.useState<number>(0);

  const handleHeaderRightPress = () => {
    dimsDataTop &&
      0 <= selectedTopFrameIndex &&
      selectedTopFrameIndex < dimsDataTop.data.frameIndices.length &&
      dimsDataSide &&
      0 <= selectedSideFrameIndex &&
      selectedSideFrameIndex < dimsDataSide.data.frameIndices.length &&
      dimsDataFront &&
      0 <= selectedFrontFrameIndex &&
      selectedFrontFrameIndex < dimsDataFront.data.frameIndices.length &&
      navigation.navigate("TabMeasureMass", {
        dimsDataFront,
        dimsDataTop,
        dimsDataSide,
        selectedFrameIndices: {
          front: selectedFrontFrameIndex,
          top: selectedTopFrameIndex,
          side: selectedSideFrameIndex,
        },
      });
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            setIsInstructionModalVisible(!isInstructionModalVisible);
          }}
        >
          <FontAwesome name="question-circle" color={Colors[colorScheme].text} style={tw`text-xl ml-4`} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => handleHeaderRightPress()}>
          <FontAwesome name="arrow-circle-right" color={Colors[colorScheme].text} style={tw`text-xl mr-4`} />
        </TouchableOpacity>
      ),
    });
  }, [
    dimsDataFront,
    dimsDataTop,
    dimsDataSide,
    selectedFrontFrameIndex,
    selectedTopFrameIndex,
    selectedSideFrameIndex,
  ]);

  return (
    <View style={tw.style(colorScheme === "dark" ? "dark" : "", `flex flex-1 justify-center items-center`)}>
      <Modal visible={isInstructionModalVisible}>
        <View style={tw`flex flex-col w-3/4 items-start mx-auto h-full pt-8`}>
          <Text style={tw`font-bold text-lg`}>Instructions:</Text>
          <View style={tw`w-full pl-2`}>
            <Text style={tw`mt-2`}>
              1. For each section, please select an image that shows the face of the object as described in the section
              title.
            </Text>
            <Text style={tw`mt-2`}>
              2. Then, press the "Measure dimensions" button in each section to measure the dimensions of the object.
            </Text>
            <Text style={tw`mt-2`}>
              3. Once the dimensions have been calculated, tap the image again to select an image frame in which the
              bounding box is wrapped around the correct region of the object you wish to measure.
            </Text>
            <Text style={tw`mt-2`}>
              4. Once all three sections have been completed, tap the arrow icon on the top right of this screen to
              continue to measure the mass of the object.
            </Text>
          </View>
          <Button title="Got it!" onPress={() => setIsInstructionModalVisible(false)} />
        </View>
      </Modal>
      <SimpleDimMeasureView
        style={tw`w-full`}
        onFrontDimsChange={data => {
          data && console.log("front dims changed");
          setDimsDataFront(data);
        }}
        onTopDimsChange={data => {
          data && console.log("top dims changed");
          setDimsDataTop(data);
        }}
        onSideDimsChange={data => {
          data && console.log("side dims changed");
          setDimsDataSide(data);
        }}
        onFrontFrameIndexChange={index => setSelectedFrontFrameIndex(index)}
        onTopFrameIndexChange={index => setSelectedTopFrameIndex(index)}
        onSideFrameIndexChange={index => setSelectedSideFrameIndex(index)}
      />
    </View>
  );
};

export default TabMeasureDimensionsScreen;

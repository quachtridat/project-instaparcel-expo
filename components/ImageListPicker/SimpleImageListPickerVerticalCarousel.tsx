import React, { useState } from "react";
import tw from "@/lib/tailwind";
import {
  StyleProp,
  ViewStyle,
  ScrollView,
  Image,
  ImageSourcePropType,
  ImageStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { View, Text } from "@/components/Themed";

export interface Props {
  imgSrcs: ImageSourcePropType[];
  sideAreaStyle?: StyleProp<ViewStyle>;
  sideImageStyle?: StyleProp<ImageStyle>;
  mainAreaStyle?: StyleProp<ViewStyle>;
  mainImageStyle?: StyleProp<ImageStyle>;
  onSelectImage: (index: number) => void;
}

export const SimpleImageListPickerVerticalCarousel: React.FC<Props> = props => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnPressSideImage = (event: GestureResponderEvent) => {
    event.target;
  };

  return (
    <>
      <ScrollView style={[tw`w-12 flex flex-col`, props.sideAreaStyle]}>
        {props.imgSrcs.map(imgSrc => (
          <TouchableOpacity onPress={handleOnPressSideImage}>
            <Image source={imgSrc} style={[tw`w-full`, props.sideImageStyle]} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={[tw`flex flex-1`, props.mainAreaStyle]}>
        {props.imgSrcs.length < 1 ? (
          <View style={tw`w-full h-full flex items-center justify-center`}>
            <Text>There are no images!</Text>
          </View>
        ) : (
          <Image source={props.imgSrcs[currentIndex]} style={[tw`w-full h-full`, props.mainImageStyle]} />
        )}
      </View>
    </>
  );
};

export default SimpleImageListPickerVerticalCarousel;

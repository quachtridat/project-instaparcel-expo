import React from "react";
import tw from "@/lib/tailwind";
import { View, Text, Animated, ScrollView, FlatList, StyleProp, ViewStyle, Image } from "react-native";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";

type ImageUri = string;

export interface Props {
  uris: ImageUri[];
  onSnapToItem?: (slideIndex: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const ImageCarousel: React.FC<Props> = props => {
  const renderItem: (baseData: { index: number; dataIndex: number; item: string }) => React.ReactNode = ({
    item,
    index,
  }) => {
    return (
      <View style={tw`h-full w-full`}>
        <Image source={{ uri: item }} style={tw`w-48 h-48`} />
      </View>
    );
  };

  const handleSnapToItem = (slideIndex: number) => {
    if (props.onSnapToItem) {
      props.onSnapToItem(slideIndex);
    }
  };

  return (
    <Carousel
      data={props.uris}
      renderItem={renderItem}
      vertical={true}
      onSnapToItem={handleSnapToItem}
      style={props.style}
      itemHeight={192}
      sliderHeight={512}
    />
  );
};

export default ImageCarousel;

import React from "react";
import tw from "@/lib/tailwind";
import { ScrollView, StyleProp, ViewStyle, Modal, Text, View } from "react-native";
import SimpleDimMeasurePanel from "../SimpleDimMeasurePanel";
import { CalcDimsResponse } from "@/interfaces/CalcDims";

export interface Props {
  style?: StyleProp<ViewStyle>;
  onFrontDimsChange?: (data: CalcDimsResponse) => void;
  onTopDimsChange?: (data: CalcDimsResponse) => void;
  onSideDimsChange?: (data: CalcDimsResponse) => void;
  onFrontFrameIndexChange?: (index: number) => void;
  onTopFrameIndexChange?: (index: number) => void;
  onSideFrameIndexChange?: (index: number) => void;
}

export const SimpleDimMeasureView: React.FC<Props> = props => {
  return (
    <ScrollView style={[tw`flex flex-1 flex-col px-8`, props.style]}>
      <SimpleDimMeasurePanel
        title="Front shot"
        style={tw`mt-8`}
        onDimsDataChange={data => props.onFrontDimsChange && props.onFrontDimsChange(data)}
        onSelectedFrameIndexChange={index => props.onFrontFrameIndexChange && props.onFrontFrameIndexChange(index)}
      />
      <SimpleDimMeasurePanel
        title="Top shot"
        style={tw`mt-8`}
        onDimsDataChange={data => props.onTopDimsChange && props.onTopDimsChange(data)}
        onSelectedFrameIndexChange={index => props.onTopFrameIndexChange && props.onTopFrameIndexChange(index)}
      />
      <SimpleDimMeasurePanel
        title="Side shot"
        style={tw`mt-8`}
        onDimsDataChange={data => props.onSideDimsChange && props.onSideDimsChange(data)}
        onSelectedFrameIndexChange={index => props.onSideFrameIndexChange && props.onSideFrameIndexChange(index)}
      />
    </ScrollView>
  );
};

export default SimpleDimMeasureView;

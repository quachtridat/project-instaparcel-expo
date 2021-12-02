import React from "react";
import tw from "@/lib/tailwind";
import { ScrollView, StyleProp, ViewStyle, Modal, Text, View, Button } from "react-native";
import { DimensionMismatchCorrection, get3d } from "@/lib/calc";
import Dim2D from "@/interfaces/Dim2D";
import { postCalcMassFetchMass } from "@/lib/core";

export interface Props {
  style?: StyleProp<ViewStyle>;
  uid: string;
  frameIdx: number;
  dimsData: {
    front: Dim2D;
    top: Dim2D;
    side: Dim2D;
  };
  onMassChange?: (mass: number) => void;
}

export const SimpleMassMeasureView: React.FC<Props> = props => {
  const [mass, setMass] = React.useState<number | undefined>();
  const [status, setStatus] = React.useState<string>("Calculation not started.");

  const dim3d = get3d(
    props.dimsData.front,
    props.dimsData.top,
    props.dimsData.side,
    DimensionMismatchCorrection.Average,
  );

  const handleCalcMass = async () => {
    setStatus("Calculating...");
    const res = await postCalcMassFetchMass({
      dim: {
        l: dim3d.length,
        h: dim3d.height,
        w: dim3d.width,
      },
      idx: props.frameIdx,
      uid: props.uid,
    });
    if ("error" in res) {
      setStatus(res.error);
    } else {
      setMass(res.mass);
      setStatus("Calculation finished.");
    }
  };

  const handleCalcMassDummy = async () => {
    setStatus("Calculating...");
    const res = await postCalcMassFetchMass(
      {
        dim: {
          l: 0,
          h: 0,
          w: 0,
        },
        idx: 0,
        uid: "dummy",
      },
      true,
    );
    if ("error" in res) {
      setStatus(res.error);
    } else {
      setMass(res.mass);
      if (props.onMassChange) {
        props.onMassChange(res.mass);
      }
      setStatus("Calculation finished.");
    }
  };

  return (
    <ScrollView style={[tw`flex w-full flex-col p-8`, props.style]}>
      <View style={tw`flex border w-full mb-8`}>
        <View style={tw`flex flex-col w-full bg-black justify-center items-center`}>
          <Text style={tw`font-bold text-lg text-white`}>Dimensions</Text>
        </View>
        <View style={tw`flex flex-col w-full p-4`}>
          <Text>Length: {dim3d.length} in.</Text>
          <Text></Text>
          <Text>Width: {dim3d.width} in.</Text>
          <Text></Text>
          <Text>Height: {dim3d.height} in.</Text>
        </View>
      </View>
      <View style={tw`flex w-full border mb-8`}>
        <View style={tw`flex flex-col w-full bg-black justify-center items-center`}>
          <Text style={tw`font-bold text-lg text-white`}>Mass</Text>
        </View>
        <View style={tw`flex flex-col w-full p-4`}>
          <View style={tw`flex flex-row justify-center items-center`}>
            <Text style={tw`font-bold text-4xl`}>{mass ? `${mass.toFixed(2)} lbs` : "N/A"}</Text>
          </View>
          <Button title="Calculate mass" onPress={handleCalcMass} />
          <Button title="Debug" onPress={handleCalcMassDummy} />
        </View>
      </View>
      <Text>Status: {status}</Text>
    </ScrollView>
  );
};

export default SimpleMassMeasureView;

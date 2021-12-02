import { GeocodeAPIRequest } from "@/interfaces/GeocodeAPI/ForwardGeocoding";
import { GeographicCoordinates } from "@/interfaces/GeographicCoordinates";
import { calcDistance, simpleCost } from "@/lib/calc";
import { forwardGeocoding } from "@/lib/geocodeapi";
import tw from "@/lib/tailwind";
import React from "react";
import { ScrollView, Button, StyleProp, TextInput, ViewStyle } from "react-native";
import { View, Text } from "../Themed";

export interface Props {
  style?: StyleProp<ViewStyle>;
  getVolume: () => number;
  getMass: () => number;
}

async function getCoords(request: GeocodeAPIRequest): Promise<GeographicCoordinates> {
  const geocode = await forwardGeocoding(request);
  if (geocode.features && geocode.features.length > 0) {
    const { geometry } = geocode.features[0];
    if (geometry && geometry.coordinates) {
      return {
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      };
    }
  }
  throw new Error("No coordinates found");
}

export const SimpleCostCalculator: React.FC<Props> = props => {
  const [fromAddress, setFromAddress] = React.useState("");
  const [fromAddressCoords, setFromAddressCoords] = React.useState<GeographicCoordinates>();
  const [canPressLocateFromAddress, setCanPressLocateFromAddress] = React.useState(false);
  const [toAddress, setToAddress] = React.useState("");
  const [toAddressCoords, setToAddressCoords] = React.useState<GeographicCoordinates>();
  const [canPressLocateToAddress, setCanPressLocateToAddress] = React.useState(false);
  const [cost, setCost] = React.useState<number>();
  const [status, setStatus] = React.useState<string>("Status: Not calculated!");

  const handleLocateAddress = async (updateCoords: (coords: GeographicCoordinates) => void) => {
    try {
      await getCoords({ text: fromAddress }).then(coords => {
        updateCoords(coords);
        setStatus("Coordinates updated!");
      });
    } catch (e) {
      if (e instanceof Error) setStatus(e.message);
    }
  };

  const handleCalculate = () => {
    if (!fromAddressCoords || !toAddressCoords) {
      setStatus("Coordinates could not be obtained for one or both addresses!");
    } else {
      const distance = calcDistance(fromAddressCoords, toAddressCoords);
      setCost(simpleCost(props.getVolume(), props.getMass(), distance));
      setStatus("Cost calculated!");
    }
  };

  return (
    <ScrollView style={[tw`p-8`, props.style]}>
      <View style={tw`border mb-8`}>
        <View style={tw`flex justify-center items-center bg-black`}>
          <Text style={tw`text-lg text-white font-bold`}>Addresses</Text>
        </View>
        <View style={tw`p-4`}>
          <Text>From:</Text>
          <TextInput
            textContentType="fullStreetAddress"
            placeholder="Address"
            value={fromAddress}
            onChangeText={text => {
              setFromAddress(text);
              setCanPressLocateFromAddress(true);
            }}
            style={tw`p-2 border`}
          />
          <Button
            title="Locate"
            onPress={async () => {
              await handleLocateAddress(coords => setFromAddressCoords(coords));
              setCanPressLocateFromAddress(false);
            }}
            disabled={!canPressLocateFromAddress}
          ></Button>
          <Text>To:</Text>
          <TextInput
            textContentType="fullStreetAddress"
            placeholder="Address"
            value={toAddress}
            onChangeText={text => {
              setToAddress(text);
              setCanPressLocateToAddress(true);
            }}
            style={tw`p-2 border`}
          />
          <Button
            title="Locate"
            onPress={async () => {
              await handleLocateAddress(coords => setToAddressCoords(coords));
              setCanPressLocateToAddress(false);
            }}
            disabled={!canPressLocateToAddress}
          ></Button>
        </View>
      </View>
      <View style={tw`border mb-8`}>
        <View style={tw`flex justify-center items-center bg-black`}>
          <Text style={tw`text-lg text-white font-bold`}>Cost</Text>
        </View>

        <View style={tw`p-4`}>
          <View style={tw`flex flex-row justify-center items-center`}>
            <Text style={tw`font-bold text-4xl`}>{cost ? `$${cost.toFixed(2)}` : "N/A"}</Text>
          </View>
          <Button title="Calculate" onPress={handleCalculate} disabled={!fromAddress || !toAddress} />
        </View>
      </View>
      <Text>{status}</Text>
    </ScrollView>
  );
};

export default SimpleCostCalculator;

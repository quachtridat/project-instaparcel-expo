import { SimpleCamera } from "@/components/Camera";
import tw from "@/lib/tailwind";
import * as React from "react";
import { StyleSheet } from "react-native";

export default function TabCameraScreen() {
  return <SimpleCamera style={tw`flex w-full h-full flex-1`} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

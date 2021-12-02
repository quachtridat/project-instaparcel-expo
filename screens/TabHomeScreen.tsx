import SimpleHomeView from "@/components/Home/View/SimpleHome";
import * as React from "react";
import { RootTabScreenProps } from "../types";

export default function TabHomeScreen({ navigation }: RootTabScreenProps<"TabHome">) {
  return <SimpleHomeView navigation={navigation} />;
}

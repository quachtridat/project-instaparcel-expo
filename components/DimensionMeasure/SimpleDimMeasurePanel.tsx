import React from "react";
import tw from "@/lib/tailwind";
import * as ImagePicker from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { StyleProp, ViewStyle, Button, Image, Pressable, Modal } from "react-native";
import { postUriFetchSaveImg, postCalcDimsFetchDims } from "@/root/lib/core";
import { CalcDimsResponse } from "@/root/interfaces/CalcDims";
import { Text, View } from "@/components/Themed";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
// @ts-ignore
import { GET_IMG_ENDPOINT } from "react-native-dotenv";

export interface Props {
  title: string;
  style?: StyleProp<ViewStyle>;
  onDimsDataChange?: (dims: CalcDimsResponse) => void;
  onSelectedFrameIndexChange?: (index: number) => void;
}

export interface State {
  hasMediaLibraryPermission: boolean;
  pickedImageInfo: ImageInfo | null;
  status: string;
  dimsData: CalcDimsResponse | null;
  selectedFrameIndex: number;
  framePickerModalVisible: boolean;
}

export class SimpleImageUploadPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasMediaLibraryPermission: false,
      pickedImageInfo: null,
      status: "No image",
      dimsData: null,
      selectedFrameIndex: 0,
      framePickerModalVisible: false,
    };
  }

  getMediaLibraryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const granted = status === "granted";
    this.setState({ hasMediaLibraryPermission: granted });
    return granted;
  };

  handlePickImage = async () => {
    if (this.state.hasMediaLibraryPermission || (await this.getMediaLibraryPermission())) {
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
        base64: true,
      }).then(result => {
        if (result.cancelled === false) {
          this.setState({ pickedImageInfo: result, status: "Image selected." });
        }
      });
    } else {
      alert("Permission to access media library denied!");
      this.setState({ status: "Error! Please try again." });
    }
  };

  handleStartFramePickerModal = () => {
    this.setState({
      framePickerModalVisible: true,
    });
  };

  handleImageCellOption = async () => {
    if (this.state.pickedImageInfo === null) {
      await this.handlePickImage();
    } else {
      this.handleStartFramePickerModal();
    }
  };

  handleResetImage = () => {
    this.setState({ pickedImageInfo: null, status: "Image reset." });
  };

  handleMeasure = async () => {
    if (this.state.pickedImageInfo !== null) {
      this.setState({ status: "Uploading..." });
      const dataSaveImg = await postUriFetchSaveImg(this.state.pickedImageInfo.uri);
      this.setState({ status: "Uploaded!" });

      if (dataSaveImg.status === "error") {
        this.setState({ status: "Error! Please try again." });
        return;
      }

      this.setState({ status: "Calculating dimensions..." });
      const dataCalcDims = await postCalcDimsFetchDims(dataSaveImg);
      if (this.props.onDimsDataChange) {
        this.props.onDimsDataChange(dataCalcDims);
      }
      this.setState({ status: "Calculated!", dimsData: dataCalcDims, selectedFrameIndex: 0 });
    }
  };

  handleDebugButtonPress = async () => {
    this.setState({ status: "Calculating dimensions..." });
    const dataCalcDims = await postCalcDimsFetchDims({ uid: "dummy" }, true);
    if (this.props.onDimsDataChange) {
      this.props.onDimsDataChange(dataCalcDims);
    }
    this.setState({ status: "Calculated!", dimsData: dataCalcDims, selectedFrameIndex: 0 });
  };

  render = () => (
    <View style={[tw`flex border border-black items-center`, this.props.style]}>
      <Modal animationType="slide" transparent={true} visible={this.state.framePickerModalVisible}>
        <Button title="Close" onPress={() => this.setState({ framePickerModalVisible: false })} />
        <View style={tw`flex flex-1 w-full flex-row justify-center items-center shadow-lg p-4`}>
          {this.state.dimsData ? (
            <>
              <ImageCarousel
                uris={
                  this.state.dimsData
                    ? this.state.dimsData.data.frameIndices.map(
                        fIdx => `${GET_IMG_ENDPOINT}/bounded/${this.state.dimsData!.uid}/${fIdx}`,
                      )
                    : []
                }
                onSnapToItem={idx => {
                  this.setState({ selectedFrameIndex: idx });
                  if (this.state.dimsData && this.props.onSelectedFrameIndexChange) {
                    this.props.onSelectedFrameIndexChange(idx);
                  }
                }}
                style={tw`w-1/2 h-full`}
              />
              <View style={tw`flex flex-1 h-[192px]`}>
                <Image
                  source={{
                    uri: `${GET_IMG_ENDPOINT}/bounded/${this.state.dimsData.uid}/${
                      this.state.dimsData.data.frameIndices[this.state.selectedFrameIndex]
                    }`,
                  }}
                  style={tw`w-full h-full`}
                />
              </View>
            </>
          ) : (
            <Text>Data not found. Please try again.</Text>
          )}
        </View>
      </Modal>
      <View style={[tw`w-full justify-center items-center border border-b bg-black`]}>
        <Text style={tw`font-bold text-lg text-white`}>{this.props.title}</Text>
      </View>
      <View style={[tw`flex flex-1 w-full flex-row justify-around items-center p-4`]}>
        <View>
          <Pressable onPress={async () => this.handleImageCellOption()}>
            <View style={[tw`w-48 h-48 border rounded-xl`, this.state.pickedImageInfo ? tw`` : tw`border-dashed`]}>
              {this.state.pickedImageInfo !== null ? (
                <Image
                  source={{
                    uri:
                      this.state.dimsData && this.state.selectedFrameIndex < this.state.dimsData.data.boundeds.length
                        ? `${GET_IMG_ENDPOINT}/bounded/${this.state.dimsData.uid}/${
                            this.state.dimsData.data.frameIndices[this.state.selectedFrameIndex]
                          }`
                        : this.state.pickedImageInfo.uri,
                  }}
                  style={tw`h-full rounded-xl`}
                />
              ) : (
                <View style={tw`flex flex-1 justify-center items-center`}>
                  <Text style={tw`text-2xl font-bold`}>+</Text>
                  <Text>Tap here to select an image!</Text>
                </View>
              )}
            </View>
          </Pressable>
          <Text>Status: {this.state.status}</Text>
        </View>
        <View>
          {this.state.dimsData && this.state.selectedFrameIndex < this.state.dimsData.data.dimensions.length ? (
            <>
              <Text>
                Width: {this.state.dimsData.data.dimensions[this.state.selectedFrameIndex].width.toFixed(2)} in.
              </Text>
              <Text>
                Height: {this.state.dimsData.data.dimensions[this.state.selectedFrameIndex].height.toFixed(2)} in.
              </Text>
            </>
          ) : (
            <>
              <Text>Width: N/A</Text>
              <Text>Height: N/A</Text>
            </>
          )}
        </View>
        <View style={tw`max-w-lg h-full flex flex-col justify-around`}>
          <Button
            title="Reset image"
            disabled={this.state.pickedImageInfo === null}
            onPress={() => this.handleResetImage()}
          />
          <Button
            title="Measure dimensions"
            disabled={this.state.pickedImageInfo === null}
            onPress={async () => this.handleMeasure()}
          />
          <Button title="Debug" onPress={async () => this.handleDebugButtonPress()} />
        </View>
      </View>
    </View>
  );
}

export default SimpleImageUploadPanel;

import React from "react";
import { Camera, CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import tw from "@/lib/tailwind";
import { CameraType } from "expo-camera/build/Camera.types";

export interface Props {
  style?: StyleProp<ViewStyle>;
}

export interface State {
  hasCameraPermission: boolean;
  hasMediaLibraryPermission: boolean;
  type: CameraType;
  isPreview: boolean;
  takenPhoto: CameraCapturedPicture | null;
  pickedPhoto: ImagePicker.ImagePickerResult | null;
}

export class SimpleCamera extends React.Component<Props, State> {
  camera: Camera | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasCameraPermission: false,
      hasMediaLibraryPermission: false,
      type: Camera.Constants.Type.back,
      isPreview: false,
      takenPhoto: null,
      pickedPhoto: null,
    };
  }

  async requestCameraPermission(): Promise<void> {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });
  }

  async requestMediaLibraryPermission(): Promise<void> {
    const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
    this.setState({ hasMediaLibraryPermission: accessPrivileges !== "none" });
  }

  async componentDidMount(): Promise<void> {
    if (this.state.hasCameraPermission === false) await this.requestCameraPermission();
  }

  handleCameraType = (): void => {
    const { type } = this.state;

    this.setState({
      type: type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back,
    });
  };

  takePicture = async (): Promise<void> => {
    if (this.camera != null) {
      const photo = await this.camera.takePictureAsync();
      this.setState({ takenPhoto: photo });
    }
  };

  pausePreview = (): void => {
    if (this.camera != null) {
      this.camera.pausePreview();
      this.setState({ isPreview: true });
    }
  };

  resumePreview = (): void => {
    if (this.camera != null) {
      this.camera.resumePreview();
      this.setState({ isPreview: false });
    }
  };

  handleSnap = async (): Promise<void> => {
    if (this.camera != null) {
      const photo = await this.camera.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: true,
      });
      const source = photo.base64;
      if (source) {
        this.pausePreview();
        this.setState({ takenPhoto: photo });
      }
    }
  };

  handleReturn = async (): Promise<void> => {
    if (this.camera != null) {
      this.resumePreview();
    }
  };

  handleSaveImage = async (): Promise<void> => {
    if (this.state.takenPhoto != null) {
      if (this.state.hasMediaLibraryPermission === false) await this.requestMediaLibraryPermission();
      if (this.state.hasMediaLibraryPermission === true)
        await MediaLibrary.saveToLibraryAsync(this.state.takenPhoto.uri);
    }
  };

  pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
    });
    if (result.cancelled === false) {
      this.setState({ pickedPhoto: result });
    }
  };

  render(): React.ReactNode {
    const { hasCameraPermission } = this.state;
    return (
      <View style={this.props.style}>
        {hasCameraPermission === false ? (
          <View style={tw`flex flex-1 flex-col items-center justify-center`}>
            <Text>No access to camera</Text>
          </View>
        ) : (
          <Camera
            style={tw`flex flex-1`}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={tw`flex flex-1 flex-row`}>
              <View style={tw`flex flex-1 flex-row self-end justify-between m-10`}>
                {this.state.isPreview ? (
                  <>
                    <TouchableOpacity
                      style={tw`self-end items-center bg-transparent p-3`}
                      onPress={async () => this.handleReturn()}
                    >
                      <MaterialCommunityIcons name="camera-rear-variant" style={tw`text-white text-4xl`} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`self-end items-center bg-transparent p-3`}
                      onPress={async () => this.handleSaveImage()}
                    >
                      <MaterialCommunityIcons name="content-save" style={tw`text-white text-4xl`} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={tw`self-end items-center bg-transparent p-3`}
                      onPress={async () => this.pickImage()}
                    >
                      <Ionicons name="ios-images" style={tw`text-white text-4xl`} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`self-end items-center bg-transparent p-3`}
                      onPress={async () => this.handleSnap()}
                    >
                      <FontAwesome name="camera" style={tw`text-white text-4xl`} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`self-end items-center bg-transparent p-3`}
                      onPress={() => this.handleCameraType()}
                    >
                      <MaterialCommunityIcons name="camera-switch" style={tw`text-white text-4xl`} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Camera>
        )}
      </View>
    );
  }
}

export default SimpleCamera;

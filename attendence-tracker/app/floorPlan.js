import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync, configureNotifications } from "../utils/notificationUtils";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function floorPlan() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureNotifications();
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log("Notification token registered:", token);
      }
    })();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    return () => subscription.remove();
  }, []);

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", {
      uri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post("https://yourserver.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponseData(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Image source={require("./assets/home-bg.jpeg")} style={styles.heroImage} />
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>RoomScape</Text>
          <Text style={styles.heroSubtitle}>Scan your room, design in AR, and get AI-driven interior suggestions.</Text>
          <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
            <Text style={styles.captureButtonText}>Capture Room</Text>
          </TouchableOpacity>
        </View>
      </View>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
      {responseData && <Text style={styles.responseText}>{responseData.message}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heroSection: {
    position: "relative",
    height: 350,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  heroContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  heroSubtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  captureButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  captureButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    width: "90%",
    height: 200,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
  responseText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

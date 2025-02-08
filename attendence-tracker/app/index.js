import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync, configureNotifications } from "../utils/notificationUtils";

export default function Home() {
  const router = useRouter();

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

    return () => subscription.remove();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image source={require("./assets/home-bg.jpeg")} style={styles.heroImage} />
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>RoomScape</Text>
          <Text style={styles.heroSubtitle}>
            Scan your room, design in AR, and get AI-driven interior suggestions.
          </Text>
        </View>
      </View>

      {/* Feature Section */}
      <View style={styles.featureSection}>
        <Text style={styles.featureTitle}>Explore Features</Text>
        <View style={styles.featureList}>
          <FeatureCard
            title="Create Floor Plans"
            description="Scan your space and generate accurate floor plans in seconds."
            image={require("./assets/home-bg.jpeg")}
            onPress={() => router.push("/floorPlan")}
          />
          <FeatureCard
            title="Render Furniture in AR"
            description="Visualize furniture in your space using augmented reality."
            image={require("./assets/home-bg.jpeg")}
            onPress={() => router.push("./SubjectList")}
          />
          <FeatureCard
            title="AI Design Suggestions"
            description="Get AI-driven recommendations for optimizing your interior."
            image={require("./assets/home-bg.jpeg")}
            onPress={() => router.push("/ai-suggestions")}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const FeatureCard = ({ title, description, image, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={image} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heroSection: {
    position: "relative",
    height: 300,
    width: "100%",
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
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  featureSection: {
    padding: 20,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  featureList: {
    gap: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

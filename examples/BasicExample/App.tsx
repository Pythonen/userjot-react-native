import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  UserJot,
  UserJotFeedback,
  UserJotRoadmap,
  UserJotChangelog,
} from "userjot-react-native";

// Replace with your own project ID from https://userjot.com
const PROJECT_ID = "PROJECT_ID";

type VisibleWidget = "feedback" | "roadmap" | "changelog" | null;

export default function App() {
  const [visibleWidget, setVisibleWidget] = useState<VisibleWidget>(null);

  useEffect(() => {
    // 1. Initialize the SDK with your project ID
    UserJot.setup(PROJECT_ID);

    // 2. Optionally identify the current user
    UserJot.identify({
      id: "user_123",
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Smith",
    });
  }, []);

  const close = () => setVisibleWidget(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>UserJot Example</Text>
        <Text style={styles.subtitle}>Tap a button below to open a widget</Text>

        <View style={styles.buttons}>
          <Button
            label="Feedback"
            onPress={() => setVisibleWidget("feedback")}
          />
          <Button label="Roadmap" onPress={() => setVisibleWidget("roadmap")} />
          <Button
            label="Changelog"
            onPress={() => setVisibleWidget("changelog")}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => UserJot.logout()}
        >
          <Text style={styles.logoutText}>Logout User</Text>
        </TouchableOpacity>
      </View>

      {/* Widget modals — only one is visible at a time */}
      <UserJotFeedback
        visible={visibleWidget === "feedback"}
        board="feature-requests"
        onClose={close}
      />
      <UserJotRoadmap visible={visibleWidget === "roadmap"} onClose={close} />
      <UserJotChangelog
        visible={visibleWidget === "changelog"}
        onClose={close}
      />
    </SafeAreaView>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 32,
  },
  buttons: {
    width: "100%",
    gap: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 10,
  },
  logoutText: {
    color: "#dc3545",
    fontSize: 15,
  },
});

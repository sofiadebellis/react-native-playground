import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [isImageVisible, setIsImageVisible] = useState(true);

  const toggleImage = () => {
    setIsImageVisible(!isImageVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>Sofia De Bellis</Text>
          {isImageVisible && (
            <Image
              style={styles.image}
              source={require("./assets/photo.png")}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={toggleImage}>
          <Text style={styles.buttonText}>
            {isImageVisible ? "Hide Image" : "Show Image"}
          </Text>
        </TouchableOpacity>
        <View style={styles.factsContainer}>
          <Text style={styles.factTitle}>5 Fun Facts About Me</Text>
          <Text style={styles.fact}>
            1. I love coding 💻 and solving complex problems creatively!
          </Text>
          <Text style={styles.fact}>
            2. I've traveled to 🇯🇵, 🇻🇳 and 🇸🇬 this year.
          </Text>
          <Text style={styles.fact}>
            3. I enjoy reading Japanese fiction 📖 in my free time.
          </Text>
          <Text style={styles.fact}>4. It’s a bug 🥲</Text>
          <Text style={styles.fact}>5. No, it’s a ✨fEAtUre✨</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0eff6",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0eff6",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#b8b8fe",
  },
  button: {
    backgroundColor: "#b8b8fe",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#262626",
    fontSize: 18,
    fontWeight: "bold",
  },
  factsContainer: {
    backgroundColor: "#b8b8fe",
    padding: 20,
    borderRadius: 10,
    gap: 30,
  },
  factTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 10,
    textAlign: "center",
  },
  fact: {
    fontSize: 18,
    color: "#262626",
    marginBottom: 8,
  },
});

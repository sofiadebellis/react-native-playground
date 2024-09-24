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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleImage = () => {
    setIsImageVisible(!isImageVisible);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <SafeAreaView
      style={isDarkMode ? styles.safeAreaDark : styles.safeAreaLight}
    >
      <ScrollView
        style={isDarkMode ? styles.containerDark : styles.containerLight}
      >
        <View style={styles.header}>
          <Text style={isDarkMode ? styles.nameDark : styles.nameLight}>
            Sofia De Bellis
          </Text>
          {isImageVisible && (
            <Image
              style={styles.image}
              source={require("./assets/photo.png")}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleImage}>
            <Text style={styles.buttonText}>
              {isImageVisible ? "Hide Image" : "Show Image"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleDarkMode}>
            <Text style={styles.buttonText}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={
            isDarkMode ? styles.factsContainerDark : styles.factsContainerLight
          }
        >
          <Text
            style={isDarkMode ? styles.factTitleDark : styles.factTitleLight}
          >
            5 Fun Facts About Me
          </Text>
          <Text style={isDarkMode ? styles.factDark : styles.factLight}>
            1. I love coding 💻 and solving complex problems creatively!
          </Text>
          <Text style={isDarkMode ? styles.factDark : styles.factLight}>
            2. I've traveled to 🇯🇵, 🇻🇳 and 🇸🇬 this year.
          </Text>
          <Text style={isDarkMode ? styles.factDark : styles.factLight}>
            3. I enjoy reading Japanese fiction 📖 in my free time.
          </Text>
          <Text style={isDarkMode ? styles.factDark : styles.factLight}>
            4. It’s a bug 🥲
          </Text>
          <Text style={isDarkMode ? styles.factDark : styles.factLight}>
            5. No, it’s a ✨fEAtUre✨
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaLight: {
    flex: 1,
    backgroundColor: "#f0eff6",
  },
  safeAreaDark: {
    flex: 1,
    backgroundColor: "#121212",
  },
  containerLight: {
    flex: 1,
    backgroundColor: "#f0eff6",
    padding: 20,
  },
  containerDark: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameLight: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 10,
  },
  nameDark: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f0eff6",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#b8b8fe",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#b8b8fe",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#262626",
    fontSize: 18,
    fontWeight: "bold",
  },
  factsContainerLight: {
    backgroundColor: "#b8b8fe",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  factsContainerDark: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  factTitleLight: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 30,
    textAlign: "center",
  },
  factTitleDark: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f0eff6",
    marginBottom: 30,
    textAlign: "center",
  },
  factLight: {
    fontSize: 18,
    color: "#262626",
    marginBottom: 30,
  },
  factDark: {
    fontSize: 18,
    color: "#f0eff6",
    marginBottom: 30,
  },
});

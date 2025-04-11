import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function LogInScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(name: string, value: string) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        console.log("User ID:", data.user_id);
        router.push("/(tabs)/home");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Network error, please try again.");
    }
  }

    return (
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Moosement</Text>
        <Image
          style={styles.image}
          source={require("../../assets/images/Moosement 2.png")}
        />
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(value) => handleChange("email", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(value) => handleChange("password", value)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign In </Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Don't have an account yet?{" "}
          <Text style={styles.link} onPress={() => router.push("/auth/signup")}>
            Sign Up
          </Text>
        </Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
      backgroundColor: "#f8f9fa",
    },
    mainTitle: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#472B01",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#140E90",
    },
    input: {
      width: "100%",
      height: 40,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: "#fff",
    },
    button: {
      backgroundColor: "#140E90",
      paddingVertical: 10,
      width: "100%",
      borderRadius: 25,
      alignItems: "center",
    },
    image: {
      width: 225,
      height: 175,
      marginBottom: 50,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    footerText: {
      marginTop: 15,
      fontSize: 14,
    },
    link: {
      color: "#EC4701",
      fontWeight: "bold",
    },
  });


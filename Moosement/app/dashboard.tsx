import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState(""); // get from backend when integrated

  // Simulate fetching user data
  useEffect(() => {
    setUsername("John Doe"); // Replace with API call to get user data
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good afternoon, {username}</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/Moosement 2.png")}
            style={styles.profileIcon}
            //onPress={() => navigation.navigate("Profile")}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Team Announcements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardLarge}
          //onPress={() => navigation.navigate("Challenges")}
        >
          <Text style={styles.cardText}>Today's Challenges</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity style={styles.cardSmall}>
            <Text style={styles.cardText}>Streak Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardSmall}>
            <Text style={styles.cardText}>Team Ranking</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.card}
          //onPress={() => navigation.navigate("Leaderboard")}
        >
          <Text style={styles.cardText}>Leaderboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  content: {
    alignItems: "center",
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#F2F0F0",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardLarge: {
    width: "100%",
    paddingVertical: 40,
    backgroundColor: "#F2F0F0",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardSmall: {
    width: "48%",
    paddingVertical: 20,
    backgroundColor: "#F2F0F0",
    borderRadius: 10,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

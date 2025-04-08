import { Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

interface Challenge {
  name: string;
  description: string;
  points: number;
  category: string;
}

const mockChallenges = [
  {
    name: "Morning Walk",
    description: "Take a 10-minute walk before starting your work day",
    points: 20,
    category: "CARDIO",
  },
];

export default function HomeScreen() {
  const [firstChallenge, setFirstChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    // Simulate async fetch
    const loadMockChallenge = async () => {
      // Add a delay to mimic loading
      await new Promise((resolve) => setTimeout(resolve, 300));
      setFirstChallenge(mockChallenges[0]); // Set the first one
    };

    loadMockChallenge();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/Moosement 2.png")}
      />
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello there,<Text style={styles.name}> Nicky!</Text>
        </Text>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Team Annoucements</Text>
        </TouchableOpacity>

        <View style={styles.cardBlock}>
          <Text style={styles.label}>Daily Challenge</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.replace("/challenges")}
          >
            {firstChallenge ? (
              <View style={styles.challengeRow}>
                {/* Challenge description */}
                <View style={styles.description}>
                  <Text style={styles.cardText}>{firstChallenge.name}</Text>
                  <Text style={styles.challengeDescription}>
                    {firstChallenge.description}
                  </Text>
                </View>

                {/* Challenge points */}
                <View style={styles.points}>
                  <Text style={styles.challengePoints}>
                    {firstChallenge.points} pts
                  </Text>
                </View>
              </View>
            ) : (
              <Text>Loading...</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.cardBlockHalf}>
            <Text style={styles.label}>Streaks</Text>
            <TouchableOpacity
              style={styles.smallCard}
              onPress={() => router.replace("/activity")}
            >
              <View style={styles.streakContainer}>
                <Text style={styles.streak}>3</Text>
                <Text style={styles.streakLabel}>days in a row</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardBlockHalf}>
            <Text style={styles.label}>Rewards</Text>
            <TouchableOpacity
              style={styles.smallCard}
              onPress={() => router.replace("/rewards")}
            />
          </View>
        </View>

        <View style={styles.cardBlock}>
          <Text style={styles.label}>Leaderboard</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.replace("/leaderboard")}
          />
        </View>
      </View>

      {/*Possible Bottom Navigation? */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#472B01",
    backgroundColor: "#f8f9fa",
    paddingBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#472B01",
  },
  profileIcon: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#F0ECEC",
    padding: 20,
    borderRadius: 10,
    height: 100,
    marginBottom: 15,
  },
  image: {
    marginTop: 20,
    width: 160,
    height: 125,
    marginBottom: 20,
    resizeMode: "contain",
  },
  smallCard: {
    backgroundColor: "#F0ECEC",
    padding: 20,
    borderRadius: 10,
    height: 80,
    width: 170,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#030A36",
  },
  challengeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  description: {
    width: "70%",
    paddingRight: 10,
    backgroundColor: "#F0ECEC",
  },
  points: {
    width: "30%",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#F0ECEC",
  },
  challengeDescription: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
  challengePoints: {
    fontWeight: "600",
    fontSize: 25,
    color: "#030A36",
  },
  streakContainer: {
    flexDirection: "row",  
    justifyContent: "center",  
    alignItems: "center", 
    padding: 5,
    backgroundColor: "#F0ECEC",
    borderRadius: 10,
  },
  streak: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#030A36",
    marginTop: -10,
  },
  streakLabel: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  cardBlock: {
    marginBottom: 15,
  },
  cardBlockHalf: {
    width: "48%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#030A36",
    backgroundColor: "#f8f9fa",
  },
});

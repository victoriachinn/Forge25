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

interface Reward {
  id: number;
  name: string;
  points: number;
  redeemed: boolean;
}

const mockChallenges = [
  {
    name: "Morning Walk",
    description: "Take a 10-minute walk before starting your work day",
    points: 20,
    category: "CARDIO",
  },
];

const mockRewards = [
  {
    id: 1,
    name: "Free Lunch Voucher",
    points: 150,
    redeemed: false,
  },
];

export default function HomeScreen() {
  const [firstChallenge, setFirstChallenge] = useState<Challenge | null>(null);
  const [firstReward, setFirstReward] = useState<Reward | null>(null);

  useEffect(() => {
    const loadMockChallenge = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setFirstChallenge(mockChallenges[0]); // Set the first one
    };

    loadMockChallenge();
  }, []);

  useEffect(() => {
    const loadMockChallenge = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setFirstReward(mockRewards[0]); // Set the first one
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

        <View style={styles.cardBlock}>
          <Text style={styles.label}>Leaderboard</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.replace("/leaderboard")}
          />
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
                <Text style={styles.streakLabel}>days walking</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardBlockHalf}>
            <Text style={styles.label}>Rewards</Text>
            <TouchableOpacity
              style={styles.smallCard}
              onPress={() => router.replace("/rewards")}
            >
              {firstReward ? (
                <View style={styles.challengeRow}>
                  {/* Reward name and points */}
                  <View style={styles.description}>
                    <Text style={styles.cardText}>{firstReward.name}</Text>
                    <Text style={styles.challengeDescription}>
                      {firstReward.points}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text>Loading...</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#472B01",
    backgroundColor: "#f8f9fa",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#472B01",
  },
  profileIcon: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f8f9fa",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    height: 100,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  image: {
    marginTop: 20,
    width: 160,
    height: 125,
    marginBottom: 20,
    resizeMode: "contain",
  },
  smallCard: {
    padding: 16,
    borderRadius: 12,
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
    gap: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#030A36",
  },
  challengeRow: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  description: {
    width: "70%",
    paddingRight: 10,
    backgroundColor: "#fff",
  },
  points: {
    width: "30%",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
  rewardCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  rewardImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "600",
  },
  rewardPoints: {
    fontSize: 14,
    color: "#777",
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
    width: "100%",
    marginRight: 20,
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

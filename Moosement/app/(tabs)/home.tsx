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

interface LeaderboardEntry {
  teamName: string;
  points: number;
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

const mockLeaderboard: LeaderboardEntry[] = [
  { teamName: "Team Moose", points: 520 },
  { teamName: "Trail Blazers", points: 470 },
  { teamName: "Step Squad", points: 430 },
];

export default function HomeScreen() {
  const [firstChallenge, setFirstChallenge] = useState<Challenge | null>(null);
  const [firstReward, setFirstReward] = useState<Reward | null>(null);
  const [topTeams, setTopTeams] = useState<LeaderboardEntry[]>([]);

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

  useEffect(() => {
    const loadMockLeaderboard = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setTopTeams(mockLeaderboard.slice(0, 3)); // Only top 3
    };

    loadMockLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/Moosement 2.png")}
      />
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello there,<Text style={styles.name}> John Doe!</Text>
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
          >
            {topTeams.length > 0 ? (
              topTeams.map((team, index) => (
                <View key={index} style={styles.leaderboardRow}>
                  <Text style={styles.leaderboardTeam}>
                    {["①", "②", "③"][index]}
                    {"  "}
                    {team.teamName}
                  </Text>
                  <Text style={styles.leaderboardPoints}>
                    {team.points} pts
                  </Text>
                </View>
              ))
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
                <View style={styles.rewardCard}>
                  <Image
                    source={require("../../assets/images/rewards-icon.png")}
                    style={styles.rewardImage}
                  />
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardName}>{firstReward.name}</Text>
                    <Text style={styles.rewardPoints}>
                      {firstReward.points} pts
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
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#472B01",
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
    marginTop: 10,
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
    color: "#140E90",
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
    color: "#EC4701",
    marginTop: -10,
  },
  streakLabel: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    width: "100%",
  },
  rewardImage: {
    width: 30,
    height: 40,
    marginLeft: -15,
    marginRight: 20,
    borderRadius: 8,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#030A36",
  },
  rewardPoints: {
    fontSize: 14,
    color: "#777",
  },
  leaderboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  leaderboardTeam: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EC4701", 
    flex: 1,
    marginRight: 10, 
  },
  leaderboardPoints: {
    fontSize: 14,
    color: "#777", 
    textAlign: "right",
    width: 60,
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
    color: "#472B01",
    backgroundColor: "#fff",
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

interface Reward {
  name: string;
  points_required: number;
  redeemed?: boolean;
}


// Updated with your actual user ID
const USER_ID = "67fc62f0aa6e488a22503e9a";
const API_URL = "http://127.0.0.1:5000/api";
const RewardsPage: React.FC = () => {
  const router = useRouter();
  const [rewardList, setRewardList] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  useEffect(() => {
    // Fetch both rewards and user points when component mounts
    console.log("Fetching data from:", `${API_URL}/rewards/rewards and ${API_URL}/users/points?user_id=${USER_ID}`);
    
    Promise.all([
      fetch(`${API_URL}/rewards/rewards`),
      fetch(`${API_URL}/users/points?user_id=${USER_ID}`)
    ])
      .then(async ([rewardsResponse, pointsResponse]) => {
        console.log("Rewards status:", rewardsResponse.status);
        console.log("Points status:", pointsResponse.status);
        
        // Process rewards response even if points response fails
        const rewardsData = await rewardsResponse.json();
        console.log("Rewards data:", JSON.stringify(rewardsData));
        setRewardList(rewardsData.rewards || []);
        
        // If points response failed, try to get error details
        if (!pointsResponse.ok) {
          const errorText = await pointsResponse.text();
          console.error("Points API error:", pointsResponse.status, errorText);
          
          // Continue with default values
          setUserPoints(0);
          setRedeemedRewards([]);
          return;
        }
        
        // If points response is OK, process it
        const pointsData = await pointsResponse.json();
        console.log("Points data:", JSON.stringify(pointsData));
        
        setUserPoints(pointsData.total_points || 0);
        
        // Process redeemed rewards safely
        try {
          if (pointsData.redeemed_rewards && Array.isArray(pointsData.redeemed_rewards)) {
            console.log("Redeemed rewards structure:", JSON.stringify(pointsData.redeemed_rewards, null, 2));
            
            const redeemed = pointsData.redeemed_rewards
              .filter((r) => r && typeof r === 'object' && r.reward_name) 
              .map((r) => r.reward_name);
            
            console.log("Extracted reward names:", redeemed);
            setRedeemedRewards(redeemed);
          } else {
            console.log("No valid redeemed_rewards found in response");
            setRedeemedRewards([]);
          }
        } catch (err) {
          console.error("Error processing redeemed rewards:", err);
          setRedeemedRewards([]);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        // Set default values on error
        setRewardList([]);
        setUserPoints(0);
        setRedeemedRewards([]);
        Alert.alert("Error", "Failed to load rewards data");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRedeem = (reward: Reward) => {
    if (redeemedRewards.includes(reward.name) || reward.points_required > userPoints) {
      return;
    }
    
    setLoading(true);
    console.log("Redeeming reward:", reward.name);
    
    fetch(`${API_URL}/rewards/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: USER_ID,
        reward_name: reward.name
      }),
    })
      .then(response => {
        console.log("Redeem response status:", response.status);
        if (!response.ok) {
          return response.text().then(text => { 
            console.error("Error response:", text);
            try {
              const err = JSON.parse(text);
              throw new Error(err.error || 'Failed to redeem reward');
            } catch (e) {
              throw new Error('Failed to redeem reward');
            }
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Redeem success:", data);
        // Update user points with the returned remaining points
        setUserPoints(data.remaining_points);
        
        // Mark this reward as redeemed
        setRedeemedRewards(prev => [...prev, reward.name]);
        
        Alert.alert("Success", `You have successfully redeemed ${reward.name}!`);
      })
      .catch(error => {
        console.error("Error redeeming reward:", error);
        Alert.alert("Error", error.message);
      })
      .finally(() => setLoading(false));
  };

  // Check if a reward is redeemed
  const isRewardRedeemed = (rewardName: string) => {
    return redeemedRewards.includes(rewardName);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#140E90" />
        <Text>Loading rewards...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      contentContainerStyle={{
        ...styles.container,
        paddingBottom: 50, // gives room to scroll
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>Rewards</Text>
      <Image
        style={styles.image}
        source={require("../../assets/images/Moosement 2.png")}
      />
      <Text style={styles.pointLineText}>You have 
        <Text style={styles.pointsText}> {userPoints} </Text>
      points!</Text>

      {rewardList.length === 0 ? (
        <Text style={styles.noRewardsText}>No rewards available at the moment.</Text>
      ) : (
        rewardList.map((reward, index) => (
          <View key={index} style={styles.rewardCard}>
            <Image source={require('../../assets/images/rewards-icon.png')} style={styles.rewardImage} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>{reward.name}</Text>
              <Text style={styles.rewardPoints}>{reward.points_required} pts</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.redeemButton,
                {
                  backgroundColor:
                    isRewardRedeemed(reward.name) || userPoints < reward.points_required ? '#ccc' : '#4CAF50',
                },
              ]}
              disabled={isRewardRedeemed(reward.name) || userPoints < reward.points_required}
              onPress={() => handleRedeem(reward)}
            >
              <Text style={styles.redeemText}>
                {isRewardRedeemed(reward.name) ? 'Redeemed' : 'Redeem'}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    paddingTop:75

  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    color: "#472B01",
    textAlign: "center",
  },
  image: {
    width: 225,
    height: 175,
    marginBottom: 20,
    justifyContent: "center",
  },
  pointLineText: {
    fontSize: 20,
    fontWeight: "medium",

    marginBottom: 20,
    color: "#140E90",
    textAlign: "center",
  },
  pointsText: {
    fontSize: 25,
    fontWeight: "bold",

    marginBottom: 20,
    color: "#140E90",
    textAlign: "center",
  },
  noRewardsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  rewardCard: {
    backgroundColor: "#fff",
    padding: 16,
    width: 350,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
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
  rewardImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
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
  redeemButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  redeemText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: '#140E90',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RewardsPage;

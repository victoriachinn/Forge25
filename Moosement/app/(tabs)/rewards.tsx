import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Reward {
  id: number;
  name: string;
  points: number;
  image: string;
  redeemed: boolean;
}

const rewards: Reward[] = [
  { id: 1, name: '1 PTO Day', points: 100, image: 'https://via.placeholder.com/100', redeemed: false },
  { id: 2, name: 'Gift Card', points: 200, image: 'https://via.placeholder.com/100', redeemed: true },
  { id: 3, name: 'T-Shirt', points: 150, image: 'https://via.placeholder.com/100', redeemed: false },
];

const userPoints = 250;

const RewardsPage: React.FC = () => {
  const handleRedeem = (reward: Reward) => {
    reward.redeemed = true;
    console.log(`Redeemed reward with ID: ${reward.id}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rewards</Text>
      <Text style={styles.pointsText}>You have {userPoints} points</Text>

      {rewards.map(reward => (
        <View key={reward.id} style={styles.rewardCard}>
          <Image source={{ uri: reward.image }} style={styles.rewardImage} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>{reward.name}</Text>
            <Text style={styles.rewardPoints}>{reward.points} pts</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.redeemButton,
              {
                backgroundColor:
                  reward.redeemed || userPoints < reward.points ? '#ccc' : '#4CAF50',
              },
            ]}
            disabled={reward.redeemed || userPoints < reward.points}
            onPress={() => handleRedeem(reward)}
          >
            <Text style={styles.redeemText}>
              {reward.redeemed ? 'Redeemed' : 'Redeem'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#472B01',
  },
  pointsText: {
    fontSize:20,
    marginBottom: 20,
    color: '#140E90',
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  rewardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
  },
  rewardPoints: {
    fontSize: 14,
    color: '#777',
  },
  redeemButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  redeemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RewardsPage;

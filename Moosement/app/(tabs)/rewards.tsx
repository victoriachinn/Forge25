import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Reward {
  id: number;
  name: string;
  points: number;
  redeemed: boolean;
}

const rewards: Reward[] = [
  { id: 1, name: 'Free Lunch Voucher', points: 150, redeemed: false },
  { id: 2, name: 'Late Start Pass', points: 200, redeemed: false },
  { id: 3, name: 'Company T-Shirt', points: 300, redeemed: false },
  { id: 4, name: 'Extra PTO Day', points: 500, redeemed: false },
  { id: 5, name: 'Gift Card', points: 200, redeemed: true },
];

const userPoints = 400;

const RewardsPage: React.FC = () => {
  const [rewardList, setRewardList] = useState<Reward[]>(rewards);
  const [points, setPoints] = useState<number>(userPoints);

  const handleRedeem = (reward: Reward) => {
    if (reward.redeemed || reward.points > points) return;
    setRewardList(prev =>
      prev.map(r =>
        r.id === reward.id ? { ...r, redeemed: true } : r
      )
    );
    setPoints(prev => prev - reward.points);
    console.log(`Redeemed reward with ID: ${reward.id}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.image} 
        source={require('../../assets/images/Moosement 2.png')} 
      />
      <Text style={styles.title}>Rewards</Text>
      <Text style={styles.pointLineText}>You have 
      <span style={styles.pointsText}> {points} </span>points!</Text>

      {rewardList.map(reward => (
        <View key={reward.id} style={styles.rewardCard}>
          <Image source={require('../../assets/images/rewards-icon.png')} style={styles.rewardImage} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>{reward.name}</Text>
            <Text style={styles.rewardPoints}>{reward.points} pts</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.redeemButton,
              {
                backgroundColor:
                  reward.redeemed || points < reward.points ? '#ccc' : '#4CAF50',
              },
            ]}
            disabled={reward.redeemed || points < reward.points}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f8f9fa',
    paddingTop: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#472B01',
  },
  image: {
    width: 225,
    height: 175,
    marginBottom: 50,
    justifyContent: 'center'
  },
  pointLineText: {
    fontSize:20,
    fontWeight: 'medium',
    marginBottom: 20,
    color: '#140E90',
    textAlign: 'center',
  },
  pointsText: {
    fontSize:25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#140E90',
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: '#f0eceb',
    padding: 5,
    width: 350,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
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

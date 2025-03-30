import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Leaderboard() {
  const router = useRouter();
  const [leaderboardData] = useState([
    { id: 'Team 1', name: 'Office Offenders', score: 150 },
    { id: 'Team 2', name: 'The Staples', score: 120 },
    { id: 'Team 3', name: 'Dream Team', score: 100 },
    { id: 'Team 4', name: 'Silly Gooses and Mooses', score: 90 },
    { id: 'Team 5', name: 'The Franchise', score: 85 },
  ]);

  return (
    <View style={styles.container}>
      <Image
              style={styles.image} 
              source={require('../assets/images/Moosement 2.png')} 
            />
      <Text style={styles.mainTitle}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
    paddingBottom: 50
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#472B01',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 225,
    height: 175,
    marginBottom: 50,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#140E90',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EC4701',
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

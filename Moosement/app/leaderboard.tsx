import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function Leaderboard() {
  const router = useRouter();
  type LeaderboardEntry = {
    id: string;
    name: string;
    score: number;
  };
  const [leaderboardData, setLeaderboardData] =useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);


  const API_URL = "http://localhost:5000/";
  // if I need to change to IP address of my mac run:
  //ipconfig getifaddr en0
  // replace local host with returned address
  useEffect(() => {
    fetch('${API_URL}/api/team/leaderboard')
      .then(response => response.json())
      .then(data => {
        const formatted = data.leaderboard.map((team: { team_id: string; total_team_points: number })=> ({
          id: team.team_id,
          name: team.team_id,
          score: team.total_team_points,
        }));
        setLeaderboardData(formatted);
      })
      .catch(error => {
        console.error("Error fetching leaderboard:", error);
      })
      .finally(() => setLoading(false));
  }, []);
  
  return (
    <View style={styles.container}>
      <Image
              style={styles.image} 
              source={require('../assets/images/Moosement 2.png')} 
            />
      <Text style={styles.mainTitle}>Leaderboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#140E90" />
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>{index + 1}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.score}>{item.score}</Text>
            </View>
          )}
        />
      )}

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

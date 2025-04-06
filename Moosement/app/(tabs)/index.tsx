import { Button,Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Image
              style={styles.image} 
              source={require('../../assets/images/Moosement 2.png')} 
            />
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello there,<Text style={styles.name}> Nicky!</Text></Text>
      </View>
      
      {/* Content Section */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.card} >
          <Text style={styles.cardText}>ANNOUNCEMENTS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card} onPress={() => router.replace('/challenges')}>
          <Text style={styles.cardText}>DAILY CHALLENGES</Text>
        </TouchableOpacity>
        
        <View style={styles.row}>
          <TouchableOpacity style={styles.smallCard} onPress={() => router.replace('/activity')}>
            <Text style={styles.cardText}>STREAKS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallCard} onPress={() => router.replace('/rewards')}>
            <Text style={styles.cardText}>REWARDS</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.card} onPress={() => router.replace('/leaderboard')}>
          <Text style={styles.cardText}>LEADERBOARD</Text>
        </TouchableOpacity>
      </View>
      
      {/*Possible Bottom Navigation? */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#472B01',
    backgroundColor: '#f8f9fa',
    paddingBottom: 10
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#472B01'

  },
  profileIcon: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',

  },
  card: {
    backgroundColor: '#F0ECEC',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#140E90'
  },
  image: {
    marginTop: 20,
    width: 225,
    height: 175,
    marginBottom: 30,
  },
  smallCard: {
    backgroundColor: '#F0ECEC',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    borderWidth: 2,
    borderColor: '#140E90'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#030A36'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

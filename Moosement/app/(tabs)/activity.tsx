import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';

declare module 'react-native-calendars' {
  export interface DateObject {
    day: number;
    month: number;
    year: number;
    timestamp: number;
    dateString: string;
  }
}

type Challenge = {
  _id: string;
  date: string; // ISO format like "2025-02-01"
  activity: string;
  icon: string;
  streak: number;
};

export default function Activity() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<Record<string, { marked: boolean; dotColor: string }>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Challenge | null>(null);

  const fetchChallenges = async () => {
    try {
      const userId = "67fc133a9de9b74b88dfbee8"
      if (!userId) throw new Error('User ID not found');
      const res = await axios.get(`http://10.110.4.222:5000/user/${userId}/challenges`);
      const fetched = res.data.challenges;

      const marked: Record<string, { marked: boolean; dotColor: string }> = {};
      fetched.forEach((c: Challenge) => {
        marked[c.date] = { marked: true, dotColor: '#EC4701' };
      });

      setChallenges(fetched);
      setMarkedDates(marked);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Image style={styles.image} source={require('../../assets/images/Moosement 2.png')} />

      <Text style={styles.mainTitle}>Activity</Text>

      <View style={styles.calendar}>
        <Text style={styles.calendarMonth}>Feb 2025</Text>
        <Calendar
          current={'2025-02-01'}
          onDayPress={(day: DateObject) => {
            setSelectedDate(day.dateString);
            const activity = challenges.find(ch => ch.date === day.dateString);
            setSelectedActivity(activity || null);
          }}
          markedDates={markedDates}
          theme={{
            calendarBackground: '#e6e1dc',
            textSectionTitleColor: '#472B01',
            todayTextColor: '#EC4701',
            dayTextColor: '#000',
            arrowColor: '#472B01',
            monthTextColor: '#472B01',
            selectedDayBackgroundColor: '#140E90',
            selectedDayTextColor: '#ffffff',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={{ borderRadius: 12, overflow: 'hidden' }}
        />
        <View style={styles.calendarPlaceholder}>
          <FontAwesome5 name="walking" size={18} />
          <Text style={{ marginLeft: 6 }}>Marked Dates = Completed Activities</Text>
        </View>
      </View>

      {selectedDate && (
        <View style={[styles.streakCard, { backgroundColor: '#fff3e6' }]}>
          <Text style={styles.streakText}>Activity on {selectedDate}</Text>
          {selectedActivity ? (
            <>
              <Text style={styles.activityText}>{selectedActivity.activity}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${selectedActivity.streak * 20}%` }]} />
              </View>
            </>
          ) : (
            <Text style={styles.activityText}>No activity completed on this day.</Text>
          )}
        </View>
      )}

      <Text style={styles.subTitle}>Streaks</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#140E90" />
      ) : challenges.length === 0 ? (
        <Text>No completed challenges yet.</Text>
      ) : (
        challenges.map((challenge) => (
          <View key={challenge._id} style={styles.streakCard}>
            <FontAwesome5 name="fire" size={24} color="black" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.streakText}>{challenge.streak} day streak</Text>
              <Text style={styles.activityText}>{challenge.activity}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${challenge.streak * 20}%` }]} />
              </View>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 140,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#472B01',
    marginBottom: 20,
  },
  calendar: {
    width: '100%',
    backgroundColor: '#e6e1dc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  calendarPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  streakCard: {
    flexDirection: 'row',
    backgroundColor: '#e6e1dc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    backgroundColor: '#140E90',
  },
  button: {
    backgroundColor: '#140E90',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

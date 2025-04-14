import { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Calendar, DateObject } from "react-native-calendars"; // npx expo install react-native-calendars

declare module "react-native-calendars" {
  export interface DateObject {
    day: number; // Day of the month (1-31)
    month: number; // Month of the year (1-12)
    year: number; // Year (e.g., 2025)
    timestamp: number; // Unix timestamp representing the date
    dateString: string; // Date formatted as 'YYYY-MM-DD'
  }
}

export default function Activity() {
  const router = useRouter();

  const challenges = [
    { id: "1", date: "Feb 1", activity: "Walking", icon: "walking", streak: 4 },
    { id: "2", date: "Feb 4", activity: "Yoga", icon: "spa", streak: 3 },
    { id: "3", date: "Feb 5", activity: "Cycling", icon: "biking", streak: 2 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.mainTitle}>Activity</Text>

      <View style={styles.calendar}>
        <Text style={styles.calendarMonth}>Feb 2025</Text>
        <Calendar
          current={"2025-02-01"}
          onDayPress={(day: DateObject) => {
            console.log("Pressed day:", day.dateString);
          }}
          markedDates={{
            "2025-02-01": { marked: true, dotColor: "#EC4701" },
            "2025-02-04": { marked: true, dotColor: "#EC4701" },
            "2025-02-05": { marked: true, dotColor: "#EC4701" },
          }}
          theme={{
            calendarBackground: "#fff",
            textSectionTitleColor: "#472B01",
            todayTextColor: "#EC4701",
            dayTextColor: "#000",
            arrowColor: "#472B01",
            monthTextColor: "#472B01",
            selectedDayBackgroundColor: "#140E90",
            selectedDayTextColor: "#ffffff",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={{
            borderRadius: 12,
            overflow: "hidden",
          }}
        />
        <View style={styles.calendarPlaceholder}>
          <FontAwesome5 name="walking" size={18} />
          <Text style={{ marginLeft: 6 }}>Sample Date Marked</Text>
        </View>
      </View>

      <Text style={styles.subTitle}>Streaks</Text>

      {challenges.map((challenge) => (
        <View key={challenge.id} style={styles.streakCard}>
          <FontAwesome5
            name="fire"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.streakText}>{challenge.streak} day streak</Text>
            <Text style={styles.activityText}>{challenge.activity}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${challenge.streak * 20}%` },
                ]}
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    marginTop: -10,
    paddingTop: 50,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingTop: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#472B01",
    textAlign: "center",
  },
  calendar: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
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
  calendarMonth: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  calendarPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  streakCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    alignItems: "center",
    width: "100%",
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
  streakText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    backgroundColor: "#140E90",
  },
  button: {
    backgroundColor: "#140E90",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

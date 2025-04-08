import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity, SectionList, Alert } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

interface Challenge {
  _id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  completed?: boolean;
}

// Replace with actual user authentication
const MOCK_USER_ID = 'abcd';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.moosement.com/api'  // Production API (Replace with actual API)
  : 'http://localhost:5000/api';     // Local development API

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const primaryColor = '#140E90'; // Main blue color used throughout the app

  useEffect(() => {
    // Fetch challenges from API
    fetchChallenges();
  }, []);

  // Fetch challenges from the backend
  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges`);
      
      if (response.ok) {
        let data;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : [];
          
          // Backend might return { challenges: [...] } or just the array
          const challengesData = Array.isArray(data) ? data : 
                                 data.challenges ? data.challenges : [];
          
          setChallenges(challengesData);
        } catch (parseError) {
          console.log('Error parsing challenges response:', parseError);
          // Fall back to mock data if parsing fails
          setMockChallenges();
        }
      } else {
        console.log('Failed to fetch challenges, status:', response.status);
        // Fall back to mock data if API call fails
        setMockChallenges();
      }
    } catch (error) {
      console.log('Error fetching challenges:', error);
      // Fall back to mock data if API call fails
      setMockChallenges();
    } finally {
      setLoading(false);
    }
  };

  // Set mock challenges as fallback
  const setMockChallenges = () => {
    const mockChallenges: Challenge[] = [
      {
        _id: '1',
        name: 'Morning Walk',
        description: 'Take a 10-minute walk before starting your work day',
        points: 20,
        category: 'Cardio',
        completed: false
      },
      {
        _id: '2',
        name: 'Desk Stretches',
        description: 'Do 5 minutes of stretching at your desk',
        points: 15,
        category: 'Flexibility',
        completed: false
      },
      {
        _id: '3',
        name: 'Stair Challenge',
        description: 'Use stairs instead of elevator for the day',
        points: 25,
        category: 'Cardio',
        completed: false
      },
      {
        _id: '4',
        name: 'Water Break',
        description: 'Drink 8 glasses of water throughout the day',
        points: 15,
        category: 'Wellness',
        completed: false
      },
      {
        _id: '5',
        name: 'Lunch Walk',
        description: 'Take a 15-minute walk during your lunch break',
        points: 20,
        category: 'Cardio',
        completed: false
      }
    ];
    
    setChallenges(mockChallenges);
  };

  // Toggle challenge completion function
  const toggleChallengeCompletion = async (challengeId: string, currentlyCompleted: boolean) => {
    // Add to processing state
    setProcessingIds(prev => [...prev, challengeId]);
    
    try {
      // Update local state immediately for better UX
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, completed: !currentlyCompleted } 
            : challenge
        )
      );

      if (!currentlyCompleted) {
        // COMPLETE THE CHALLENGE
        try {
          const apiUrl = `${API_BASE_URL}/challenges/complete`;
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: MOCK_USER_ID,
              challenge_id: challengeId,
            }),
          }).catch(error => {
            // Silently handle network errors when backend isn't available
            console.log('Network error (expected during development):', error.message);
            return null;
          });
          
          if (response && response.ok) {
            let result;
            try {
              const text = await response.text();
              result = text ? JSON.parse(text) : {};
              console.log('Challenge completed successfully:', result);
            } catch (parseError) {
              console.log('Error parsing JSON response:', parseError);
            }
          } else if (response) {
            let errorData = {};
            try {
              const text = await response.text();
              errorData = text ? JSON.parse(text) : {};
            } catch (parseError) {
              console.log('Error parsing JSON error response');
            }
            
            console.log('Error completing challenge:', errorData);
            
            // Even with API error, keep UI state updated for better experience
            if (errorData && typeof errorData === 'object' && 'error' in errorData) {
              console.log('Challenge was already completed today');
            }
          }
        } catch (error) {
          console.log('Error in challenge completion');
        }
      } else {
        // UNDO THE CHALLENGE COMPLETION
        try {
          const apiUrl = `${API_BASE_URL}/challenges/undo`;
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: MOCK_USER_ID,
              challenge_id: challengeId,
            }),
          }).catch(error => {
            console.log('Network error (expected during development):', error.message);
            return null;
          });
          
          if (response && response.ok) {
            let result;
            try {
              const text = await response.text();
              result = text ? JSON.parse(text) : {};
              console.log('Challenge completion undone successfully:', result);
            } catch (parseError) {
              console.log('Error parsing JSON response');
            }
          } else if (response) {
            console.log('Error undoing challenge completion');
          }
        } catch (error) {
          console.log('Error undoing challenge completion');
        }
      }
    } catch (error) {
      console.log('Error toggling challenge:', error);
      // Show a more informative message during development
      Alert.alert(
        'Update Status', 
        'Challenge status updated locally. Server sync may have failed.'
      );
    } finally {
      // Remove from processing
      setProcessingIds(prev => prev.filter(id => id !== challengeId));
    }
  };

  const renderChallenge = ({ item }: { item: Challenge }) => {
    const isProcessing = processingIds.includes(item._id);
    
    return (
      <View style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeName}>{item.name}</Text>
          <Text style={styles.challengePoints}>{item.points} pts</Text>
        </View>
        <Text style={styles.challengeDescription}>{item.description}</Text>
        <View style={styles.challengeFooter}>
          <Text style={styles.challengeCategory}>{item.category}</Text>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => toggleChallengeCompletion(item._id, item.completed || false)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={primaryColor} style={styles.checkbox} />
            ) : item.completed ? (
              <View style={[styles.checkbox, { backgroundColor: primaryColor }]}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </View>
            ) : (
              <View style={[styles.checkboxEmpty, { borderColor: primaryColor }]} />
            )}
            <Text style={[styles.checkboxText, { color: primaryColor }]}>
              {item.completed ? 'Completed' : 'Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  // Prepare data for sectioned list
  const pendingChallenges = challenges.filter(challenge => !challenge.completed);
  const completedChallenges = challenges.filter(challenge => challenge.completed);
  
  // Create sections array with logic for empty pending challenges
  const sections = [
    { 
      title: "Today's Challenges", 
      data: pendingChallenges.length > 0 ? pendingChallenges : ['completed_all'] 
    },
    { 
      title: 'Completed Challenges', 
      data: completedChallenges 
    }
  ];

  // Only show the "Completed Challenges" section if there are completed challenges
  const filteredSections = completedChallenges.length > 0 
    ? sections 
    : [sections[0]];

  // Custom render function to handle both challenge items and the "all completed" message
  const renderItem = ({ item, section }: { item: Challenge | string, section: { title: string } }) => {
    // If this is our special "completed_all" placeholder, render the congratulations message
    if (item === 'completed_all') {
      return (
        <View style={styles.allCompletedContainer}>
          <Ionicons name="checkmark-circle" size={50} color={primaryColor} style={styles.allCompletedIcon} />
          <Text style={styles.allCompletedText}>
            Nice work! You've completed all of today's challenges.
          </Text>
        </View>
      );
    }
    
    // Otherwise render a normal challenge
    return renderChallenge({ item: item as Challenge });
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => typeof item === 'string' ? item : item._id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  allCompletedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  allCompletedText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 12,
    fontWeight: '500',
  },
  allCompletedIcon: {
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 20,
    color: '#472B01',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  challengeCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  challengePoints: {
    fontSize: 16,
    fontWeight: '500',
    color: '#140E90',
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  challengeCategory: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 
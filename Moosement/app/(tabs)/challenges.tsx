import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity, SectionList, Alert, Modal, Image, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// ---------- Constants ----------
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.moosement.com/api'  // Production API
  : 'http://localhost:5000/api';     // Development API

const MOCK_USER_ID = 'abcd';
const difficultyLabels = ['', 'Easy', 'Moderate', 'Challenging', 'Hard', 'Expert'];

// ---------- Types ----------
interface Challenge {
  _id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  completed?: boolean;
  difficulty?: number;
  verificationPhoto?: string;
}

// ---------- Utility Functions ----------
const calculateDifficulty = (points: number): number => {
  const minPoints = 10;
  const maxPoints = 50;
  const normalizedPoints = Math.max(minPoints, Math.min(maxPoints, points));
  return 1 + Math.floor((normalizedPoints - minPoints) / ((maxPoints - minPoints) / 4));
};

const getDifficultyColor = (rating: number = 1): string => {
  switch(rating) {
    case 1: return '#8F8CD9'; // Lightest blue
    case 2: return '#6762C8'; // Light blue
    case 3: return '#3F3AB7'; // Medium blue
    case 4: return '#2921A3'; // Dark blue
    case 5: return '#140E90'; // Darkest blue
    default: return '#8F8CD9';
  }
};

export default function ChallengesScreen() {
  // ---------- State ----------
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  // ---------- Animation Refs ----------
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value for background overlay
  const slideAnim = useRef(new Animated.Value(100)).current; // Initial position for modal content
  
  // ---------- Theme ----------
  const colorScheme = useColorScheme();
  const primaryColor = '#140E90'; // Main blue color used throughout the app

  // ---------- Animation Effects ----------
  useEffect(() => {
    if (photoModalVisible) {
      // Parallel animations for fade in and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Parallel animations for fade out and slide down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [photoModalVisible, fadeAnim, slideAnim]);

  // ---------- Initial Setup ----------
  useEffect(() => {
    fetchChallenges();
    requestPermissions();
  }, []);

  // ---------- Permission Handling ----------
  const requestPermissions = async () => {
    const [cameraPermission, photoPermission] = await Promise.all([
      ImagePicker.requestCameraPermissionsAsync(),
      ImagePicker.requestMediaLibraryPermissionsAsync()
    ]);
    
    if (cameraPermission.status !== 'granted' || photoPermission.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Sorry, we need camera and photo library permissions to verify your challenges.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // ---------- Data Fetching ----------
  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges`);
      
      if (response.ok) {
        try {
          const text = await response.text();
          const data = text ? JSON.parse(text) : [];
          const challengesData = Array.isArray(data) ? data : data.challenges ? data.challenges : [];
          setChallenges(processChallenges(challengesData));
        } catch (parseError) {
          console.log('Error parsing challenges response:', parseError);
          setMockChallenges();
        }
      } else {
        console.log('Failed to fetch challenges, status:', response.status);
        setMockChallenges();
      }
    } catch (error) {
      console.log('Error fetching challenges:', error);
      setMockChallenges();
    } finally {
      setLoading(false);
    }
  };

  const processChallenges = (challengesData: Challenge[]): Challenge[] => {
    return challengesData.map(challenge => ({
      ...challenge,
      difficulty: calculateDifficulty(challenge.points)
    }));
  };

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
    
    setChallenges(processChallenges(mockChallenges));
  };

  // ---------- Challenge Action Handlers ----------
  const handleCompletePress = (challenge: Challenge) => {
    openPhotoModal({...challenge, completed: false}, null);
  };
  
  const toggleChallengeCompletion = async (challengeId: string, currentlyCompleted: boolean, verificationPhoto?: string) => {
    setProcessingIds(prev => [...prev, challengeId]);
    
    try {
      // Update local state immediately for better UX
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, completed: !currentlyCompleted, verificationPhoto } 
            : challenge
        )
      );

      // API call - for non-mocked implementation
      const endpoint = !currentlyCompleted ? '/challenges/complete' : '/challenges/undo';
      const requestBody: any = {
        user_id: MOCK_USER_ID,
        challenge_id: challengeId,
      };
      
      if (!currentlyCompleted && verificationPhoto) {
        requestBody.verification_photo = verificationPhoto;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }).catch(error => {
          console.log('Network error (expected during development):', error.message);
          return null;
        });
        
        if (response && response.ok) {
          console.log('Challenge status updated successfully');
        }
      } catch (error) {
        console.log(`Error ${!currentlyCompleted ? 'completing' : 'undoing'} challenge`);
      }
    } catch (error) {
      console.log('Error toggling challenge:', error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== challengeId));
    }
  };

  // ---------- Photo Handling ----------
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      
      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      
      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo');
    }
  };
  
  const submitChallengeWithPhoto = async () => {
    if (!selectedChallenge || !photoUri) {
      Alert.alert('Error', 'Please provide a verification photo');
      return;
    }
    
    setPhotoModalVisible(false);
    await toggleChallengeCompletion(selectedChallenge._id, false, photoUri);
  };

  // ---------- Modal Handlers ----------
  const openPhotoModal = (challenge: Challenge, photo: string | null = null) => {
    setSelectedChallenge(challenge);
    setPhotoUri(photo);
    setPhotoModalVisible(true);
  };

  const closePhotoModal = () => {
    // Fade out animation will start automatically due to useEffect
    setPhotoModalVisible(false);
  };

  // ---------- Render Functions ----------
  const renderChallenge = ({ item }: { item: Challenge }) => {
    const isProcessing = processingIds.includes(item._id);
    const difficultyLabel = difficultyLabels[item.difficulty || 1];
    const difficultyColor = getDifficultyColor(item.difficulty);
    
    return (
      <View style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.challengeName}>{item.name}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.difficultyText}>{difficultyLabel}</Text>
            </View>
          </View>
          <Text style={styles.challengePoints}>{item.points} pts</Text>
        </View>
        <Text style={styles.challengeDescription}>{item.description}</Text>
        <View style={styles.challengeFooter}>
          <Text style={styles.challengeCategory}>{item.category}</Text>
          {item.completed ? (
            <View style={styles.completedContainer}>
              <Ionicons name="checkmark-circle" size={18} color={primaryColor} style={styles.completedIcon} />
              <Text style={[styles.completedText, { color: primaryColor }]}>Completed</Text>
              {item.verificationPhoto && (
                <TouchableOpacity 
                  style={styles.viewPhotoButton}
                  onPress={() => openPhotoModal(item, item.verificationPhoto || null)}
                >
                  <Text style={styles.viewPhotoText}>View Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.completeButton, { backgroundColor: primaryColor }]}
              onPress={() => handleCompletePress(item)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.completeButtonText}>Complete</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderItem = ({ item, section }: { item: Challenge | string, section: { title: string } }) => {
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
    
    return renderChallenge({ item: item as Challenge });
  };

  // ---------- Loading State ----------
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  // ---------- SectionList Data Preparation ----------
  const pendingChallenges = challenges.filter(challenge => !challenge.completed);
  const completedChallenges = challenges.filter(challenge => challenge.completed);
  
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

  const filteredSections = completedChallenges.length > 0 
    ? sections 
    : [sections[0]];

  // ---------- Main UI Rendering ----------
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
        contentInset={{ bottom: 70 }}
        contentOffset={{ x: 0, y: 0 }}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustContentInsets={true}
      />

      {/* Photo Verification Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={photoModalVisible}
        onRequestClose={closePhotoModal}
        statusBarTranslucent={true}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            {selectedChallenge?.completed ? (
              // View mode for completed challenges
              <>
                <Text style={styles.modalTitle}>Verification Photo</Text>
                <View style={styles.photoPreviewContainer}>
                  {photoUri && <Image source={{ uri: photoUri }} style={styles.photoPreview} />}
                </View>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={closePhotoModal}
                >
                  <Text style={styles.modalCancelText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Submission mode for new challenges
              <>
                <Text style={styles.modalTitle}>
                  {photoUri ? 'Confirm Photo' : selectedChallenge?.name}
                </Text>
                
                {photoUri ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                    <Text style={styles.warningText}>
                      You won't be able to change this photo once you submit the challenge.
                    </Text>
                    <TouchableOpacity 
                      style={styles.changePhotoButton}
                      onPress={() => setPhotoUri(null)}
                    >
                      <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.modalInstructions}>
                    Take or upload a photo to verify you've completed this challenge.
                  </Text>
                )}
                
                <View style={styles.modalButtons}>
                  {!photoUri && (
                    <>
                      <TouchableOpacity 
                        style={[styles.modalButton, { backgroundColor: primaryColor }]}
                        onPress={takePhoto}
                      >
                        <Ionicons name="camera" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.modalButtonText}>Take Photo</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.modalButton, { backgroundColor: primaryColor }]}
                        onPress={pickPhoto}
                      >
                        <Ionicons name="images" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.modalButtonText}>Choose Photo</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {photoUri && (
                    <TouchableOpacity 
                      style={[styles.modalButton, { backgroundColor: primaryColor }]}
                      onPress={submitChallengeWithPhoto}
                    >
                      <Text style={styles.modalButtonText}>Submit Challenge</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.modalCancelButton}
                    onPress={closePhotoModal}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 0,
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
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 12,
    color: '#140E90',
  },
  listContainer: {
    paddingBottom: 100,
  },
  challengeCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
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
    flex: 1,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  completedIcon: {
    marginRight: 4,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  viewPhotoButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#140E90',
    borderRadius: 6,
    marginLeft: 8,
  },
  viewPhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#140E90',
  },
  completeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#140E90',
    textAlign: 'center',
  },
  photoPreviewContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#140E90',
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#140E90',
    textAlign: 'center',
  },
  modalInstructions: {
    fontSize: 15,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    marginTop: 16,
    flexDirection: 'column',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonIcon: {
    marginRight: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalCancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
  },
  warningText: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 
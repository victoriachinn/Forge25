import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/Themed';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { ScrollViewBase } from 'react-native';
export const modal = true;


export default function ModalScreen() {
  const [displayName, setDisplayName] = useState('Edit Display Name');
  const [username, setUsername] = useState('Edit Username');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLeaveTeam = () => {
    Alert.alert(
      'Are you sure?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => alert('You have left the team.') }
      ]
    );
  };

  const handleSave = () => {
    Alert.alert(
      'Save Changes?',
      'Do you want to save your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.goBack() } // Exits the page
      ]
    );
  };

  return (    
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.header}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={pickImage}>
          <Image 
            source={profileImage ? { uri: profileImage } : require('../assets/images/Moosement 2.png')} 
            style={styles.profileImage} 
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.editProfilePictureText}>Edit Image</Text>
        </TouchableOpacity>
      
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Name" 
        />
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username" 
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password" 
          secureTextEntry
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="johndoe@johndoe.com" 
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.leaveTeamButton} onPress={handleLeaveTeam}>
          <Text style={styles.leaveTeamButtonText}>Leave Team</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton}  onPress={() => router.replace("/auth/login")}>
          <Text style={styles.leaveTeamButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#140E90',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    width: '100%',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'left',
  },
  editProfileText: {
    fontSize: 24, 
    color: '#140E90',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 20,
  },  
  leaveTeamButton: {
    backgroundColor: '#EC4701', 
    width: '100%',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#140E90', 
    width: '100%',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  leaveTeamButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editProfilePictureText: {
    marginTop: 2,
    fontSize: 16,
    color: '#140E90',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});

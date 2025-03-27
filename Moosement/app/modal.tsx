import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/Themed';
import { useState } from 'react';

export default function ModalScreen() {
  const [displayName, setDisplayName] = useState('John Doe');
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
    // Show confirmation popup for leaving the team
    Alert.alert(
      "Are you sure?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            // Handle the leave team logic here
            alert('You have left the team.');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
      <Text style={styles.editProfileText}>Edit Profile</Text>

        <TouchableOpacity onPress={pickImage}>
          <Image 
            source={profileImage ? { uri: profileImage } : require('/Users/victoriachin/Desktop/Forge25/Moosement/assets/images/Moosement 2.png')} 
            style={styles.profileImage} 
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* "Edit Profile Picture" clickable text */}
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

        {/* Leave Team Button */}
        <TouchableOpacity style={styles.leaveTeamButton} onPress={handleLeaveTeam}>
          <Text style={styles.leaveTeamButtonText}>Leave Team</Text>
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
    paddingBottom: 50
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
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  editProfileText: {
    fontSize: 30, 
    color: '#140E90',
    fontWeight: 'bold',
    width: '100%', 
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,  // This makes the image circular
    //marginBottom: ,
    resizeMode: 'contain',
    borderWidth: 1,    // Adjust the width of the border (outline)
    borderColor: '#000', // Set the color of the outline (black here)
  },  
  leaveTeamButton: {
    backgroundColor: '#EC4701', 
    width: '100%',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 70,
  },
  leaveTeamButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editProfilePictureText: {
    marginTop: 2,
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});

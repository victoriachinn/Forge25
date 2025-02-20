import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

export default function ModalScreen() {
  const [username, setUsername] = useState('JohnDoe');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] =useState<string | null>(null);

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
  return (

    
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
      <Image source={profileImage ? { uri: profileImage } : require('/Users/kayvanmosharaf/Forge25/Moosement/assets/images/favicon.png')} style={styles.profileImage} />
      </TouchableOpacity>
      
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 100,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

import { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function JoinTeamScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    teamCode: '',
  });

  function handleChange(name: string, value: string) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit() {
  }

  return (
    <View style={styles.container}>
    <Text style={styles.mainTitle}>Moosement</Text>
      <Image
        style={styles.image} 
        source={require('../assets/images/Moosement 2.png')} 
      />
      <Text style={styles.title}>Welcome to Moosement!</Text>
      <Text style={styles.normalText}>Join or create a team to get started.</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Team Code" 
        onChangeText={(value) => handleChange('teamCode', value)}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Join Team</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Don't have a team to join?{' '}
        {/* TODO: Will re-route to create team page once it is created */}
        <Text style={styles.link} onPress={() => router.replace('/login')} >Create Team</Text>
      </Text>
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
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#472B01',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#140E90',
  },
  normalText: {
    fontSize:15,
    marginBottom: 20,
    color: '#140E90',
  },
  image: {
    width: 225,
    height: 175,
    marginBottom: 50,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#140E90',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 15,
    fontSize: 14,
  },
  link: {
    color: '#EC4701',
    fontWeight: 'bold',
  },
});

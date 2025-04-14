import { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  function handleChange(name: string, value: string) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    try {

      const response = await fetch('http://127.0.0.1:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName, 
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        alert('User registered successfully!');
        console.log("got it")
        router.replace('/(tabs)/home'); 
      } else {
        console.log(data.error)

        alert(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.log('Error:', error);
      alert('Failed to connect to the server.');
    }
  }
  

  return (
    <View style={styles.container}>
    <Text style={styles.mainTitle}>Moosement</Text>
      <Image
        style={styles.image} 
        source={require('../../assets/images/Moosement 2.png')} 
      />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        onChangeText={(value) => handleChange('fullName', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address" 
        onChangeText={(value) => handleChange('email', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        onChangeText={(value) => handleChange('password', value)}
      />
      <TouchableOpacity style={styles.button}  onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Already have an account?{' '}

        <Text style={styles.link} onPress={() => router.replace('/auth/login')} >Sign In</Text>      </Text>
    </View>
  );
}


SignupScreen.options = {
  headerShown: false,
};

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
  image: {
    width: 225,
    height: 175,
    marginBottom: 50,
  },
  input: {
    width: '100%',
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

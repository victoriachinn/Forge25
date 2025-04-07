import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function CreateTeamScreen() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('Silly Mooses');
  const [teamPrivacy, setTeamPrivacy] = useState('Private');
  const [teamDescription, setTeamDescription] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Moosement</Text>
      <Image
        style={styles.image}
        source={require("../assets/images/Moosement 2.png")}
      />
      <Text style={styles.title}>Create Your Team</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Team name" 
        onChangeText={setTeamName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Team privacy" 
        onChangeText={setTeamPrivacy}
      />
      <TextInput 
        style={styles.longerInput}
        multiline={true}
        placeholder="Team description (optional)" 
        onChangeText={setTeamDescription}
      />
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Team</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f8f9fa",
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#472B01",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#140E90",
  },
  normalText: {
    fontSize: 15,
    marginBottom: 20,
    color: '#140E90',
    textAlign: 'center',
    flex: 1,
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
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  longerInput: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 0,
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: "#140E90",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 15,
    fontSize: 14,
  },
  link: {
    color: "#EC4701",
    fontWeight: "bold",
  },
  teamAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 20,
  },  
  editImageText: {
    marginTop: 2,
    fontSize: 16,
    color: '#140E90',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});

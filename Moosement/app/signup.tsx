import { View, Text, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';


export default function SignupScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
      <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input}
              secureTextEntry
            />

      <Text style={styles.label}>Username</Text>
            <TextInput 
              style={styles.input}
              secureTextEntry
            />

    <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input}
              secureTextEntry
            />
      {/* Replace this button with actual signup logic */}
      <Button title="Continue to App" onPress={() => router.replace('/(tabs)')} />
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
    marginHorizontal: 20,
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


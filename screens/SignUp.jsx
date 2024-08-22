import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert';
import { FIREBASE_AUTH } from '../firebaseConfigs/firebaseConfig';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();

  const db = getFirestore();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const backgroundSignUpRequest = async (email, password, firstName, lastName) => {
    try {
      await setDoc(doc(db, 'signupRequests', email), {
        firstName,
        lastName,
        email,
        password,
        status: 'pending'
      });
      console.log('Sign up request saved in Firestore for:', email);
      setSuccessMessage('Please wait for the admin to confirm your account.');
    } catch (error) {
      console.error('Sign up request failed:', error.message);
      showAlert('Sign up request failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    if (!validateEmail(email)) {
      showAlert('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      showAlert('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Passwords do not match.');
      return;
    }

    setLoading(true);

    await backgroundSignUpRequest(email, password, firstName, lastName);

    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={text => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={text => setLastName(text)}
          value={lastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size='large' color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={navigateToLogin} style={styles.linkButton}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
      {successMessage ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}
      <CustomAlert
        visible={alertVisible}
        title="Sign Up Error"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2029',
  },
  section: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#2b2e38',
    borderRadius: 6,
    width: '90%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffeba7',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#c4c3ca',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#c4c3ca',
  },
  button: {
    backgroundColor: '#ffeba7',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  link: {
    color: '#ffeba7',
    textAlign: 'center',
  },
  linkButton: {
    marginBottom: 10,
  },
  successContainer: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 6,
    marginTop: 20,
  },
  successText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfigs/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();

  const auth = FIREBASE_AUTH;

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length > 0; // Password must not be empty
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'The email address is badly formatted.';
      case 'auth/user-disabled':
        return 'The user corresponding to the given email has been disabled.';
      case 'auth/user-not-found':
        return 'There is no user corresponding to the given email.';
      case 'auth/wrong-password':
        return 'The password is invalid for the given email.';
      default:
        return 'An unknown error occurred.';
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const signIn = async () => {
    if (!validateEmail(email)) {
      showAlert('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      showAlert('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      showAlert(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToPasswordReset = () => {
    navigation.navigate('PasswordResetScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Log In</Text>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9a9a9a"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9a9a9a"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator size='large' color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={navigateToSignUp}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={navigateToPasswordReset}>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <CustomAlert
        visible={alertVisible}
        title="Sign In Error"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default Login;

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
});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../firebaseConfigs/firebaseConfig';
import CustomAlert from '../components/CustomAlert';

const YouScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  
  const [email, setEmail] = useState(user ? user.email : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (alertVisible && alertTitle === 'Success') {
      const timer = setTimeout(() => {
        setAlertVisible(false);
        navigation.navigate('Home');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alertVisible, alertTitle, navigation]);

  const handleUpdate = async () => {
    if (!user) {
      setAlertTitle('Error');
      setAlertMessage('No user is currently signed in.');
      setAlertVisible(true);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAlertTitle('Error');
      setAlertMessage('New passwords do not match.');
      setAlertVisible(true);
      return;
    }

    setUpdating(true);
    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      console.log("User reauthenticated");

      // Update the user's email
      if (email && email !== user.email) {
        await updateEmail(user, email);
        console.log("User email updated");
      }

      // Update the user's password
      if (newPassword) {
        await updatePassword(user, newPassword);
        console.log("User password updated");
      }

      setAlertTitle('Success');
      setAlertMessage('Your details have been updated.');
      setAlertVisible(true);
    } catch (error) {
      console.log("Update failed: ", error);
      setAlertTitle('Update failed');
      setAlertMessage(error.message);
      setAlertVisible(true);
    } finally {
      setUpdating(false);
    }
  };

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#c4c3ca"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        placeholderTextColor="#c4c3ca"
        secureTextEntry={!showPasswords}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#c4c3ca"
        secureTextEntry={!showPasswords}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#c4c3ca"
        secureTextEntry={!showPasswords}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
      <TouchableOpacity onPress={toggleShowPasswords} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</Text>
      </TouchableOpacity>
      {updating ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      )}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default YouScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2029',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2029',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffeba7',
  },
  input: {
    height: 40,
    borderColor: '#c4c3ca',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#c4c3ca',
    width: '100%',
  },
  button: {
    backgroundColor: '#ffeba7',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleButtonText: {
    color: '#ffeba7',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

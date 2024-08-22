import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfigs/firebaseConfig';

const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const auth = FIREBASE_AUTH;
    const user = auth.currentUser;

    if (user) {
      setUserName(user.displayName || 'User');
    } else {
      navigation.navigate('Login');
    }
  }, []);

  const handleFaceRegister = () => {
    navigation.navigate('CameraScreen');
  };

  const handleManagePeople = () => {
    navigation.navigate('DataBaseModifier');
  };

  const handleLogout = () => {
    const auth = FIREBASE_AUTH;
    auth.signOut().then(() => {
      navigation.navigate('Login');
    }).catch((error) => {
      console.log('Logout error:', error);
    });
  };

  const handleRaspberryPi = () => {
    navigation.navigate('RaspberryPi');
  };

  const handleYou = () => {
    navigation.navigate('YouScreen');
  };

  const renderButton = (iconName, label, onPress, backgroundColor) => (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Icon name={iconName} size={40} color="#ffeba7" />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to SAFYE, {userName}</Text>
      <View style={styles.grid}>
        {renderButton('user', 'You', handleYou, '#dc3545')}
        {renderButton('camera', 'Add Face', handleFaceRegister, '#007bff')}
        {renderButton('users', 'Manage People', handleManagePeople, '#28a745')}
        {renderButton('video-camera', 'Camera Screen', handleRaspberryPi, '#17a2b8')}
        {renderButton('sign-out', 'Logout', handleLogout, '#6c757d')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#ffeba7',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: width * 0.35,
    height: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffeba7',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

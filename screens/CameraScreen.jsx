import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Animated, Easing } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');
const cameraHeight = width * (3 / 2.5);

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [images, setImages] = useState([]);
  const [stage, setStage] = useState(0);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [arrowAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [checkmarkAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const directions = [
    null, 
    'straight',
    'right',
    'left',
    'up',
    null 
  ];

  useEffect(() => {
    (async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Permis pentru cameră",
          message: "Această aplicație necesită permisiunea pentru a folosi camera",
          buttonNeutral: "Întreabă mai târziu",
          buttonNegative: "Anulează",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permisiunea pentru cameră acordată");
        setHasPermission(true);
      } else {
        console.log("Permisiunea pentru cameră respinsă");
        setHasPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (stage > 0 && stage < 5) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(arrowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [stage, arrowAnim]);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
    }
  }, [isLoading, rotateAnim]);

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleStart = () => {
    if (name.trim().length === 0) {
      setAlertMessage('Enter a valid name');
      setAlertVisible(true);
      return;
    }
    setShowCheckmark(true); 
    setTimeout(() => setStage(1), 1000); 
  };

  const sendDataToServer = async (imagesToSend) => {
    const formData = new FormData();
    formData.append('name', name);

    imagesToSend.forEach((imageUri, index) => {
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `image${index + 1}.jpg`
      });
    });

    try {
      setIsLoading(true);
      const response = await fetch('http://192.168.31.107:8005/add_face', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = await response.json();
      console.log("Server response:", data);
      setShowCheckmark(true); // Show checkmark after successful upload
      setIsLoading(false);
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => navigation.navigate('Home'), 2000); // Navigate to home screen after 2 seconds
      });
    } catch (error) {
      console.error("Fetch error", error);
      setAlertMessage('An error occurred while sending data to the server');
      setAlertVisible(true);
      setIsLoading(false);
    }
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current) {
      setAlertMessage("Camera not ready");
      setAlertVisible(true);
      return;
    }

    if (name.trim().length === 0) {
      setAlertMessage('Enter a valid name');
      setAlertVisible(true);
      return;
    }

    const options = { quality: 0.5, base64: false };
    const photo = await cameraRef.current.takePictureAsync(options);

    if (photo) {
      const newImages = [...images, photo.uri];
      console.log('Imagini după adăugare:', newImages);
      setImages(newImages);
      const nextStage = stage + 1;
      setStage(nextStage);

      if (newImages.length === 4) {
        setStage(5);
        sendDataToServer(newImages); 
      }
    }
  };

  const renderIcon = () => {
    const direction = directions[stage];
    let iconName;

    if (direction === 'straight') {
      return (
        <Animated.View style={{ opacity: arrowAnim }}>
          <Icon name="user-circle" size={100} color="green" />
        </Animated.View>
      );
    }

    switch (direction) {
      case 'up':
        iconName = 'arrow-up';
        break;
      case 'right':
        iconName = 'arrow-right';
        break;
      case 'left':
        iconName = 'arrow-left';
        break;
      default:
        return null;
    }

    return (
      <Animated.View style={{ opacity: arrowAnim }}>
        <Icon name={iconName} size={50} color="green" />
      </Animated.View>
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#fff" /></View>;
  }

  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {stage === 0 ? (
        <View>
          <TextInput
            style={styles.input}
            onChangeText={handleNameChange}
            value={name}
            placeholder="Enter your name"
            placeholderTextColor="#ffffff"
          />
          {showCheckmark && <Icon name="check-circle" size={30} color="green" style={styles.checkmark} />}
        </View>
      ) : null}
      {stage > 0 && stage < 5 && (
        <RNCamera
          style={[styles.camera, { height: cameraHeight }]}
          ref={cameraRef}
          type={RNCamera.Constants.Type.front}
        />
      )}
      {stage > 0 && stage < 5 && renderIcon()}
      <Text style={styles.instructions}></Text>
      {stage === 0 ? (
        <TouchableOpacity style={[styles.button, styles.goldButton]} onPress={handleStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      ) : (
        stage < 5 && (
          <TouchableOpacity style={[styles.button, styles.goldButton]} onPress={handleTakePicture} disabled={isLoading}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
        )
      )}
      {isLoading && (
        <Animated.View style={[styles.loadingContainer, { transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]}>
          <Icon name="spinner" size={50} color="green" />
        </Animated.View>
      )}
      {showCheckmark && !isLoading && stage === 5 && (
        <Animated.View style={[styles.checkmarkContainer, { opacity: checkmarkAnim }]}>
          <Icon name="check-circle" size={100} color="green" />
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{name}</Text>
          </View>
          <Text style={styles.successText}>Face added successfully!</Text>
        </Animated.View>
      )}
      <CustomAlert
        visible={alertVisible}
        title="Error"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
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
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    color: 'white',
    width: '80%',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#2b2e38',
  },
  nameContainer: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#2b2e38',
  },
  nameText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  camera: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    padding: 20,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  goldButton: {
    backgroundColor: '#ffeba7',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  instructions: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'green',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  successText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import HomeScreen from './screens/Home';
import DataBaseModifier from './screens/DataBaseModifier';
import RaspberryPi from './screens/RaspberryPi';
import YouScreen from './screens/YouScreen';
import CameraScreen from './screens/CameraScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DataBaseModifier" component={DataBaseModifier} options={{ headerShown: false }} />
        <Stack.Screen name="RaspberryPi" component={RaspberryPi} options={{ headerShown: false }} />
        <Stack.Screen name="YouScreen" component={YouScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

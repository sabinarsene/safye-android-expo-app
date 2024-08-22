import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const RaspberryPi = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'http://192.168.31.83:5000/video_feed' }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

export default RaspberryPi;


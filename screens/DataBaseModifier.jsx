import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { database } from '../firebaseConfigs/firebaseConfigF';
import { ref, onValue, remove } from "firebase/database";

const DataBaseModifier = () => {
  const [faces, setFaces] = useState({});

  const loadFaces = () => {
    const facesRef = ref(database, 'faces');
    onValue(facesRef, (snapshot) => {
      const data = snapshot.val();
      setFaces(data || {});
    });
  };

  const deleteFace = (faceKey) => {
    const faceRef = ref(database, `faces/${faceKey}`);
    remove(faceRef)
      .then(() => console.log(`Fața ${faceKey} a fost ștearsă cu succes.`))
      .catch((error) => console.error('Ștergerea a eșuat: ', error.message));
  };

  useEffect(() => {
    loadFaces();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Added People</Text>
      <View style={styles.listContainer}>
        {Object.keys(faces).map((key) => (
          <View key={key} style={styles.faceRow}>
            <Text style={styles.faceText}>{key}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFace(key)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2029',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffeba7',
    textAlign: 'center',
    marginTop: 50,
    marginVertical: 10, 
  },
  listContainer: {
    padding: 10,
    marginTop: 10, 
  },
  faceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#2b2e38',
    borderRadius: 6,
  },
  faceText: {
    flex: 1,
    fontSize: 16,
    color: '#ffeba7',
  },
  deleteButton: {
    backgroundColor: '#ffeba7',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default DataBaseModifier;

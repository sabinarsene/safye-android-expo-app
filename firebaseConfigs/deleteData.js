const admin = require('firebase-admin');

// Inițializează aplicația Firebase
// Inițializează aplicația Firebase
const serviceAccount = require('./faces-46608-firebase-adminsdk-5rmhs-1e5078e6a0.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://faces-46608-default-rtdb.europe-west1.firebasedatabase.app' // Adaugă URL-ul bazei de date Firebase Realtime
});

// Referință către baza de date
const db = admin.database();
const ref = db.ref('/');

// Funcție pentru a șterge conținutul din baza de date unul câte unul
const deleteDataOneByOne = async () => {
  try {
    await deleteNodes(ref);
    console.log('Toate datele au fost șterse cu succes.');
  } catch (error) {
    console.error('Ștergerea datelor a eșuat:', error);
  }
};

// Funcție recursivă pentru a șterge nodurile unul câte unul
const deleteNodes = async (ref) => {
  const snapshot = await ref.once('value');
  const data = snapshot.val();
  
  // Verificăm dacă nodul are sub-noduri
  if (data !== null && typeof data === 'object') {
    // Iterăm prin fiecare sub-nod și apelăm recursiv funcția de ștergere pentru sub-nodurile respective
    for (const key in data) {
      const childRef = ref.child(key);
      await deleteNodes(childRef);
    }
  }

  // Ștergem nodul curent
  await ref.remove();
  console.log('Nod șters:', ref.toString());
};

// Apelăm funcția pentru ștergerea datelor unul câte unul
deleteDataOneByOne();

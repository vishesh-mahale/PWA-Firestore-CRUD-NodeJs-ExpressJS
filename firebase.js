// firebase.js
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'pwa-app-1234.firebaseapp.com' // Replace with your Firestore project URL
});


module.exports = {
     db : admin.firestore(),
     messaging : admin.messaging()
};
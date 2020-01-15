//const {Firestore} = require('@google-cloud/firestore');
const admin = require("firebase-admin");

// Create a new client
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GOOGLE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_FIREBASE_PRIVATE_KEY
  })
});

module.exports = admin.firestore();

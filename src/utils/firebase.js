const admin = require('firebase-admin');

const { FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL } =
  process.env;

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL
  })
});

module.exports = admin;

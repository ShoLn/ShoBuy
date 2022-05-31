import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: "shobuy-bc47c.firebaseapp.com",
    projectId: "shobuy-bc47c",
    storageBucket: "shobuy-bc47c.appspot.com",
    messagingSenderId: "549526707759",
    appId: process.env.appId,
};

// init firebase

firebase.initializeApp(firebaseConfig);

// init services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const FieldValue = firebase.firestore.FieldValue

// timestamp
const timestamp = firebase.firestore.Timestamp

export { db, auth, storage, timestamp, FieldValue };

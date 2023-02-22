
import firebase from 'firebase'
//import * as firebase from 'firebase/app'
import firestore from 'firebase/firestore'
import storage from 'firebase/storage'


// Kode firebase auth dari firebase

const firebaseConfig = {
  apiKey: "AIzaSyC3kepvlnG6eAZSVP77GdMtU5eA4HVXQek",
  authDomain: "manage-urlmyid.firebaseapp.com",
  databaseURL: "https://manage-urlmyid.firebaseio.com",
  projectId: "manage-urlmyid",
  storageBucket: "manage-urlmyid.appspot.com",
  messagingSenderId: "514797177668",
  appId: "1:514797177668:web:89f68ef4674f305b1a6511"
};


  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  export default firebaseApp.firestore()
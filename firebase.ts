import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyACtmdD2qYyveQo8EVQz-jEx-QyrqPdEDs",
    authDomain: "whatsappc-clone-nextjs.firebaseapp.com",
    projectId: "whatsappc-clone-nextjs",
    storageBucket: "whatsappc-clone-nextjs.appspot.com",
    messagingSenderId: "519188282313",
    appId: "1:519188282313:web:ac7a4eaaee0058fe848618",
    measurementId: "G-1JLRNT9B27",
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {db, auth, provider}
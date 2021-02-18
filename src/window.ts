import firebase from "firebase/app";
import "firebase/database";

declare global {
    interface Window {
        database: firebase.database.Database
    }
}

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAidX-yDk7v46uQIlzLtMioRjv0fqR1c5k",
    authDomain: "wgbewerbertool.firebaseapp.com",
    databaseURL: "https://wgbewerbertool-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "wgbewerbertool",
    storageBucket: "wgbewerbertool.appspot.com",
    messagingSenderId: "1064412118007",
    appId: "1:1064412118007:web:cb35a60dc489203fbd0cf2",
    measurementId: "G-GLTLXJ15TX"
};

firebase.initializeApp(firebaseConfig);

window.database = firebase.database();

export default window;
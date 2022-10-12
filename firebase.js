// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

import { displayMilestones } from '/JavaScript/mytimeline/timeline.js';

let currentUserId = '';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-JBGr121PYbNNn0M0FrbCOTWxkXYutEA",
  authDomain: "mylestonesapp.firebaseapp.com",
  projectId: "mylestonesapp",
  storageBucket: "mylestonesapp.appspot.com",
  messagingSenderId: "1059392742967",
  appId: "1:1059392742967:web:252a8e86b5d612fb3e01b2",
  measurementId: "G-7T2JT0XL59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// ---------- LOGIN WITH EMAIL AND PASSWORD ----------

$('#login-submit').click(submitLogin);

function submitLogin()
{
  let loginForm = $('#login-form');
  loginForm.validate();

  if (loginForm.valid()) {

    signInWithEmailAndPassword(auth, $('#login-email').val(), $('#login-password').val())
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      $('#shader').css({'display': 'none'});
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('ERROR: ' + errorMessage);
    });
  }
}

// ---------- REGISTER WITH EMAIL AND PASSWORD ----------

$('#register-submit').click(submitRegister);

function submitRegister()
{
  let registerForm = $('#register-form');
  registerForm.validate();

  if ($('#register-password').val() != $('#register-confirm').val()) {
    alert('Your passwords did not match. Please try again');
    return;
  }

  if (registerForm.valid()) {
    
    createUserWithEmailAndPassword(auth, $('#register-email').val(), $('#register-password').val())
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      $('#shader').css({'display': 'none'});
      initializeUser(user.uid);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('ERROR: ' + errorMessage);
    });
  }
}

// ---------- SIGN OUT ----------

$('#logout-button').click(logoutUser);

function logoutUser() {
  signOut(auth).then(() => {
    // User signed out
  }).catch((error) => {
    alert('ERROR: ' + error);
  });
}

// ---------- ON AUTH STATE CHANGED ----------

function showUser()
{
  $('#login-button').css({'display': 'none'});
  $('#register-button').css({'display': 'none'});
  $('#profile-button').css({'display': 'block'});
  $('#logout-button').css({'display': 'flex'});
}

function showSignIn()
{
  $('#login-button').css({'display': 'flex'});
  $('#register-button').css({'display': 'flex'});
  $('#profile-button').css({'display': 'none'});
  $('#logout-button').css({'display': 'none'});
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    currentUserId = uid;
    displayMilestones();
    showUser();
    $('#milestones-no-login').css({'display': 'none'});
    // ...
  } else {
    // User is signed out
    // ...
    currentUserId = '';
    showSignIn();
    $('#milestones-no-login').css({'display': 'flex'});
    $('#milestones-empty').css({'display': 'none'});
  }
});

// ---------- CREATE USER ----------

function initializeUser(userId)
{
  setDoc(doc(db, "users", userId), 
  {
    milestones: [],
    categories: [{
      emoji: '🎉',
      title: 'Celebration'
    }, {
      emoji: '🎃',
      title: 'Holiday'
    }, {
      emoji: '🎪',
      title: 'Activity'
    }, {
      emoji: '🏫',
      title: 'School Related'
    }],
    uid: userId
  });
}

// ---------- GET USER DATA (MILESTONES & CATEGORIES) ----------

export async function getUserData()
{
  if (!currentUserId) return null;

  const docSnap = await getDoc(doc(db, "users", currentUserId));

  if (docSnap.exists()) {
    return docSnap.data();
  }

  else {
    // doc.data() will be undefined in this case
    console.log("ERROR: Couldn't find document");
    return null;
  }
}

// ---------- UPDATE MILESTONE ----------

export function updateMilestones(milestones)
{
  let newMilestones = [];

  milestones.forEach(element => {
    let newCategories = [];

    element.categories.forEach(category => {
      newCategories.push({
        title: category.title,
        emoji: category.emoji
      });
    });

    newMilestones.push({
      title: element.title,
      date: {
        month: element.date.month,
        day: element.date.day,
        year: element.date.year
      },
      categories: newCategories,
      description: element.description,
      imageSource: element.imageSource,
      layout: element.layout
    });
  });

  updateDoc(doc(db, "users", currentUserId), {
    milestones: newMilestones
  });
}

// ---------- UPDATE CATEGORIES ----------

export function updateCategories(categories)
{
  let newCategories = [];

  categories.forEach(category => {
    newCategories.push({
      emoji: category.emoji,
      title: category.title
    });
  });

  updateDoc(doc(db, "users", currentUserId), {
    categories: newCategories
  });
}
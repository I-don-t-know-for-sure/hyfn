// Scripts for firebase and firebase messaging

importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAy9NyvSJbcPFKxbokrqpWLhuvGkXZhu74",
  authDomain: "hyfn-4c283.firebaseapp.com",
  projectId: "hyfn-4c283",
  storageBucket: "hyfn-4c283.appspot.com",
  messagingSenderId: "191314016680",
  appId: "1:191314016680:web:83850cc132ed2b1c22059d",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

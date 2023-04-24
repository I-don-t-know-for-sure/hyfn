// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyABU1k2F8JNz8fh9J4rgjvkDPO4gPA4PC0",
  authDomain: "delivery-driver-d2f7d.firebaseapp.com",
  projectId: "delivery-driver-d2f7d",
  storageBucket: "delivery-driver-d2f7d.appspot.com",
  messagingSenderId: "325762176723",
  appId: "1:325762176723:web:3f7bfeff68347945f42626",
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

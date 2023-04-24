/// <reference lib="webworker" />

import { initializeApp } from "firebase/app";
import { precacheAndRoute } from "workbox-precaching";

// interface ServiceWorkerGlobalScope extends Window {
//   registration: ServiceWorkerRegistration;
//   skipWaiting: () => void;
//   __WB_MANIFEST: any;
// }

// Cast self as ServiceWorkerGlobalScope
const self = this as any as ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

/* self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyABU1k2F8JNz8fh9J4rgjvkDPO4gPA4PC0",
  authDomain: "delivery-driver-d2f7d.firebaseapp.com",
  projectId: "delivery-driver-d2f7d",
  storageBucket: "delivery-driver-d2f7d.appspot.com",
  messagingSenderId: "325762176723",
  appId: "1:325762176723:web:3f7bfeff68347945f42626",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener("notificationclick", (event: any) => {
  console.log("Notification click received: ", event);

  event.notification.close();

  // Add any custom URL handling logic here
}); */

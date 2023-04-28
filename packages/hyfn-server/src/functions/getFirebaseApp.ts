import admin from "firebase-admin";

let app: admin.app.App;

const firebaseApp = () => {
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env["clientEmail"],
        projectId: process.env["projectId"],
        privateKey: process.env["privateKey"],
      }),
    });
  }

  return app;
};

export default firebaseApp;

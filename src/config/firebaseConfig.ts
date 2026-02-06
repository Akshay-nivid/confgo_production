import * as admin from "firebase-admin";

// Load your service account key (downloaded from Firebase Console)
import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseAdmin = admin;

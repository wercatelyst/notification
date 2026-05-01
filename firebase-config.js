import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRuV8D4RWqzJimRU1jp4qNeEYuPap6TgQ",
  authDomain: "wercatelyst.firebaseapp.com",
  databaseURL: "https://wercatelyst-default-rtdb.firebaseio.com",
  projectId: "wercatelyst",
  storageBucket: "wercatelyst.firebasestorage.app",
  messagingSenderId: "842787144180",
  appId: "1:842787144180:web:a59fe2074377d34f1d79a1"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);

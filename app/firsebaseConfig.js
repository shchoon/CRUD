// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// 추가: Firebase Authentication 모듈 import
import { getAuth } from "firebase/auth";
// 추가: Cloud Firestore 모듈 import
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbKiTNsBhbvS28pjNSnLgVVObwvP_m6Zw",
  authDomain: "first-63a23.firebaseapp.com",
  projectId: "first-63a23",
  storageBucket: "first-63a23.firebasestorage.app",
  messagingSenderId: "309963597469",
  appId: "1:309963597469:web:78d81edfd591f1cc8ad674",
  measurementId: "G-KQRMS63DXQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// 추가: 인증 서비스 초기화
export const auth = getAuth(app);

// 추가: Cloud Firestore 서비스 초기화
export const db = getFirestore(app);

// 만약 Google Analytics를 사용한다면 주석 해제:
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);

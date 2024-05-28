import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBn4B63MLUxeVTtrT-wkg1jrhgpRHZhuXo',
  authDomain: 'custom-closet-app.firebaseapp.com',
  projectId: 'custom-closet-app',
  storageBucket: 'custom-closet-app.appspot.com',
  messagingSenderId: '333239918018',
  appId: '1:333239918018:web:b54dc75a9560bf4f3c8a5b',
  measurementId: 'G-SRE2GVJCBN',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

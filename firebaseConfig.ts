import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do seu app web Firebase, extraída da sua imagem.
const firebaseConfig = {
  apiKey: "AIzaSyAkW3DrCDWioxkCKUYCfpGiY05scybEg-M",
  authDomain: "catalogo-black-friday-4a936.firebaseapp.com",
  projectId: "catalogo-black-friday-4a936",
  storageBucket: "catalogo-black-friday-4a936.firebasestorage.app",
  messagingSenderId: "199259828401",
  appId: "1:199259828401:web:cdd78c62b8303e6cea7290"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Cloud Firestore e obtém uma referência para o serviço
export const db = getFirestore(app);

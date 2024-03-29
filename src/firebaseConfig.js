import * as firebase from 'firebase/app'

import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'

// firebase init goes here
const firebaseConfig = {
  apiKey: 'AIzaSyB1sq1qtIxIdJhFPBY0pzik_9EUWV6uQ4s',
  authDomain: 'wikivapia.firebaseapp.com',
  databaseURL: 'https://wikivapia.firebaseio.com',
  projectId: 'wikivapia',
  storageBucket: 'wikivapia.appspot.com',
  messagingSenderId: '520679833961',
  appId: '1:520679833961:web:ced8aec847beb39c543df8',
  measurementId: 'G-HGYBNQCS7V',
}
firebase.initializeApp(firebaseConfig)

// firebase utils
const db = firebase.firestore()
const st = firebase.storage()
const auth = firebase.auth()
const fb = firebase
db.enablePersistence()
  .then(() => {
    console.log('Offline support enabled')
  })
  .catch((err) => {
    console.log(err)
  })

export { db, auth, st, fb }

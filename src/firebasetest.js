const firebase = require('firebase')

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

firebase
  .firestore()
  .collection('Products')
  .get()
  .then((query) => {
    query.forEach((doc) => {
      doc.ref
        .update({
          sellers: [],
        })
        .then((v) => console.log(v))
    })
  })

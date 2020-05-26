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

async function main() {
  firebase
    .firestore()
    .collection('Products')
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().subType === undefined) {
          doc.ref.update({ subType: '' })
        }
      })
    })
}

main()

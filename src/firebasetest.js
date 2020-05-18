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
  let search = ''
  let query = await firebase
    .firestore()
    .collection('Products')
    .orderBy('model')
    .startAt(search)
    .endAt(search + '\uf8ff')

  let snapshot1 = await query.limit(5).get()
  let snapshot2 = await query
    .startAfter(snapshot1.docs[snapshot1.docs.length - 1])
    .limit(5)
    .get()
  snapshot1.docs.forEach((v) => {
    console.log(v.data().model)
  })
  snapshot2.docs.forEach((v) => {
    console.log(v.data().model)
  })
}

main()

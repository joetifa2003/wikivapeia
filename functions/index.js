const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.updateProductSellersData = functions.firestore
  .document('Products/{productID}')
  .onUpdate(async (snap, ctx) => {
    let before = snap.before.data()
    let after = snap.after.data()
    let updatedData = {}
    if (after.modelSRC.sort().toString() !== before.modelSRC.sort().toString())
      updatedData['modelSRC'] = after.modelSRC
    if (after.type !== before.type) updatedData['type'] = after.type
    if (after.subType !== before.type) updatedData['subType'] = after.subType
    if (Object.keys(updatedData).length !== 0) {
      admin.firestore().runTransaction((transaction) => {
        return transaction
          .get(
            admin
              .firestore()
              .collection('Sellers')
              .where('productID', '==', snap.after.id)
              .limit(1),
          )
          .then((sellers) => {
            for (const doc of sellers.docs) {
              transaction.update(doc.ref, updatedData)
            }
            return Promise.resolve(sellers.docs)
          })
      })
      //   let query = await admin
      //     .firestore()
      //     .collection('Sellers')
      //     .where('productID', '==', snap.after.id)
      //     .get()
      //   let res = await Promise.all(
      //     query.docs.map((doc) => doc.ref.update(updatedData)),
      //   )
      //   console.log(res)
      // }
    }
  })

exports.updateProductLastScore = functions.firestore
  .document('VoteSum/{productID}')
  .onWrite(async (snap, ctx) => {
    let prodctID = ctx.params.productID
    if (snap.after.exists) {
      let data = snap.after.data()
      const votersCount = data.votersCount
      let overall = 0
      for (const item of data.sum) {
        overall += item.value / (votersCount * data.sum.length)
      }
      let res = await admin
        .firestore()
        .collection('Products')
        .doc(prodctID)
        .update({
          lastScore: overall,
        })
      console.log(res)
      return res
    } else {
      let res = admin.firestore().collection('Products').doc(prodctID).update({
        lastScore: 0,
      })
      console.log(res)
      return res
    }
  })

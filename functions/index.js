const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.updateProductSellersData = functions
  .region('europe-west3')
  .firestore.document('Products/{productID}')
  .onUpdate(async (snap, ctx) => {
    let before = snap.before.data()
    let after = snap.after.data()
    let updatedData = {}
    if (after.modelSRC.sort().toString() !== before.modelSRC.sort().toString())
      updatedData['modelSRC'] = after.modelSRC
    if (after.type !== before.type) updatedData['type'] = after.type
    if (after.subType !== before.type) updatedData['subType'] = after.subType
    if (Object.keys(updatedData).length !== 0) {
      let sellerTransaction
      try {
        sellerTransaction = await admin
          .firestore()
          .runTransaction(async (transaction) => {
            let sellers = await transaction.get(
              admin
                .firestore()
                .collection('Sellers')
                .where('productID', '==', snap.after.id),
            )
            for (const doc of sellers.docs) {
              transaction.update(doc.ref, updatedData)
            }
            return Promise.resolve('Updated !')
          })
      } catch (e) {
        console.log(e)
      }
      console.log(sellerTransaction)
    }
  })

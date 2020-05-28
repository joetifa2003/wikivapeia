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
      let query = await admin
        .firestore()
        .collection('Sellers')
        .where('productID', '==', snap.after.id)
        .get()
      let res = await Promise.all(
        query.docs.map((doc) => doc.ref.update(updatedData)),
      )
      console.log(res)
    }
  })

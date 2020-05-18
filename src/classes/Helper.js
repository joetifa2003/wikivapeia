import { db } from '../firebaseConfig'

export default class Helper {
  constructor() {}
  /** @param {Array} ids
   * @param {string} collection */
  static async getDocumentsByID(collection, ids) {
    let refs = ids.map((v) => db.collection(collection).doc(v).get())
    let docs = await Promise.all(refs)
    return docs.map((v) => ({ id: v.id, ...v.data() }))
  }
}

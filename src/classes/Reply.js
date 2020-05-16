import differenceInSeconds from 'date-fns/differenceInSeconds'

/** @class Reply
 * @property {string} userID
 * @property {string} productID
 * @property {string} name
 * @property {string} value
 * @property {Date} date*/

export default class Reply {
  constructor(userID, productID, name, value, replyTo, quote, date) {
    this.userID = userID
    this.productID = productID
    this.name = name
    this.value = value
    this.replyTo = replyTo
    this.quote = quote
    this.date = date
  }

  get getReplyTime() {
    let date = this.date.toDate()
    let time = differenceInSeconds(new Date(), date)
    if (time < 60) {
      return 'Just now'
    } else if (time >= 60 && time < 60 * 60) {
      return (time / 60).toFixed(0) + 'm'
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      return (time / (60 * 60)).toFixed(0) + 'h'
    } else if (time >= 60 * 60 * 24 && time < 60 * 60 * 24 * 7) {
      return (time / (60 * 60 * 24)).toFixed(0) + 'd'
    } else {
      return (time / (60 * 60 * 24 * 7)).toFixed(0) + 'w'
    }
  }
}

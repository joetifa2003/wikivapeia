import differenceInSeconds from 'date-fns/differenceInSeconds'
import { plainToClass } from 'class-transformer'
import Reply from './Reply'

/** @class Comment
 * @property {string} userID
 * @property {string} productID
 * @property {string} name
 * @property {string} value
 * @property {Reply[]} replies
 * @property {Date} date*/

export default class Comment {
  constructor(userID, productID, name, value, replies, date) {
    this.userID = userID
    this.productID = productID
    this.name = name
    this.value = value
    this.replies = replies
    this.date = date
  }

  /** @returns {Reply[]} */
  getReplies(showReplies) {
    let replies = plainToClass(Reply, this.replies)
    if (showReplies) {
      return replies
    } else {
      if (replies.length !== 0) {
        return [replies.slice(-1)[0]]
      } else {
        return replies
      }
    }
  }

  get getCommentTime() {
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

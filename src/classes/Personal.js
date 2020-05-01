import User from './User'

export default class Personal extends User {
  constructor(type, name, email, country, city, number, gender, birthday) {
    super(type, name, email, country, city, number)
    this.gender = gender
    this.birthday = birthday
  }
}

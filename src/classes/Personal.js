import User from './User'

export default class Personal extends User {
  constructor(type, name, email, country, region, number, gender, birthday) {
    super(type, name, email, country, region)
    this.number = number
    this.gender = gender
    this.birthday = birthday
  }
}

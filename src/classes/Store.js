import User from './User'

export default class Store extends User {
  constructor(type, name, email, country, city, number, address, img) {
    super(type, name, email, country, city, number)
    this.address = address
    this.img = img
  }
}

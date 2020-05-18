import User from './User'

export default class Store extends User {
  constructor(
    type,
    name,
    about,
    email,
    country,
    currency,
    region,
    countryCode,
    branches,
    img,
    banners,
    busType,
    username,
    webUrl,
    facebookUrl,
    facebookPageID,
  ) {
    super(type, name, email, country, region)
    this.currency = currency
    this.about = about
    this.countryCode = countryCode
    this.branches = branches
    this.img = img
    this.banners = banners
    this.username = username
    this.webUrl = webUrl
    this.facebookUrl = facebookUrl
    this.facebookPageID = facebookPageID
    this.busType = busType
  }
}

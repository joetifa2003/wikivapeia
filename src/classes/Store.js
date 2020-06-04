import Personal from './Personal'

export default class Store extends Personal {
  constructor(
    type,
    name,
    number,
    gender,
    birthday,
    storeName,
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
    super(type, name, email, country, region, number, gender, birthday)
    this.storeName = storeName
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

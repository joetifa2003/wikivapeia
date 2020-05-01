/**
 * @typedef {Object} ProductImage
 * @type {Object}
 * @property {string} image
 */

export default class Product {
  constructor(
    type,
    company,
    model,
    desc,
    images,
    features,
    specs,
    lastScore,
    approved,
    sellers,
    date,
  ) {
    this.type = type
    this.company = company
    this.model = model
    this.desc = desc
    this.images = images
    this.features = features
    this.specs = specs
    this.lastScore = lastScore
    this.approved = approved
    this.sellers = sellers
    this.date = date
  }

  /**
   * @param {boolean} hasCompany
   * @returns {string}
   */
  titleBuilder(hasCompany) {
    const getSpecByName = (name) => {
      let query = this.specs.filter((v) => v.name === name)[0]
      return query ? query.value : ''
    }
    let specType = getSpecByName('Type')
    if (this.type === 'Mod') {
      let powerOutput = getSpecByName('Power output') + 'W'
      let tc = getSpecByName('TC') === 'Yes' ? ' TC ' : ''
      let squonk = getSpecByName('Squonk') === 'Yes' ? ' Squonk ' : ''
      let mechanical = getSpecByName('Mechanical') === 'Yes' ? 'Mechanical' : ''
      return `${hasCompany ? this.company + ' ' : ''}${
        this.model ? this.model : ''
      } ${powerOutput ? powerOutput : ''}${tc ? tc : ''}${
        squonk ? squonk : ''
      }${mechanical ? mechanical : ''} ${specType ? specType : ''} ${
        this.type ? this.type : ''
      }`.toUpperCase()
    } else {
      let category = getSpecByName('Category')
      let coil = getSpecByName('Coil building')
      return `${hasCompany ? this.company + ' ' : ''}${
        this.model ? this.model : ''
      } ${category ? category : ''} ${specType ? specType : ''} ${
        coil ? coil : ''
      }`.toUpperCase()
    }
  }

  /**
   * @returns {Array<ProductImage>}
   */
  get productImages() {
    return this.images.filter((v) => v.type === 'product')
  }

  /**
   * @returns {Array<ProductImage>}
   */
  get facebookImages() {
    return this.images.filter((v) => v.type === 'facebook')
  }

  /**
   * @returns {string}
   */
  get getCompany() {
    return this.company.toUpperCase()
  }

  /**
   * @returns {number}
   */
  get getLastScore() {
    return this.lastScore.toFixed(2)
  }
}

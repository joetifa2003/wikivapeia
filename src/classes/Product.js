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
    if (this.type === 'Mod') {
      let specType = getSpecByName('Type')
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
    } else if (this.type === 'Atomizer') {
      let specType = getSpecByName('Type')
      let category = getSpecByName('Category')
      let coil = getSpecByName('Coil building')
      return `${hasCompany ? this.company + ' ' : ''}${
        this.model ? this.model : ''
      } ${category ? category : ''} ${specType ? specType : ''} ${
        coil ? coil : ''
      }`.toUpperCase()
    } else if (this.type === 'Pod system') {
      let watOut = getSpecByName('Wattage output')
      if (watOut !== '') {
        watOut = watOut + 'W'
      }
      let cartType = getSpecByName('Cartridge type').includes('Rebuildable')
        ? 'Rebuildable'
        : ''
      return `${hasCompany ? this.company + ' ' : ''}${
        this.model
      } ${watOut} ${cartType} Pod system`.toUpperCase()
    } else {
      let DLMTL = getSpecByName('DL/MTL')
      let flavors = getSpecByName('Flavors')
      return `${hasCompany ? this.company + ' ' : ''}${
        this.model
      } ${flavors} ${DLMTL} E-Liquid`.toUpperCase()
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

  static getFeatures(specs) {
    let features = []
    specs
      .filter((v) => v.isFeature === true)
      .forEach((feature) => {
        if (typeof feature.value === 'string') {
          if (feature.value === 'Yes') {
            features.push(feature.name)
          } else if (feature.value !== 'No' && feature.value !== '') {
            if (feature.unit) {
              features.push(feature.value + feature.unit)
            } else {
              features.push(feature.value)
            }
          }
        } else {
          if (feature.value.length !== 0) {
            Array.prototype.push.apply(features, feature.value)
          }
        }
      })
    return features
  }
}

export default class {
  /**
   * Represents a Validation.
   * @constructor
   * @param {object} validator - validator object.
   */
  constructor (rules, data) {
    this._temp = rules.map((x) => {
      if (data[Object.keys(x)]) {
        x[Object.keys(x)].value = data[Object.keys(x)]
      }
    })

    console.log(rules)

    this._data = data

    this._validate(rules)
  }

  /**
   * Represents a Object.
   * @formatData
   * @param {}
   */
  formatData () {
    return this._temp.valueOf().map(() => {
      // Creation de data
    })
  }

  /**
   * Represents a Validator.
   * @validate
   * @param {object} validator - validator object.
   */
  _validate (rules) {
    rules.map((x) => {
      if (typeof x[Object.keys(x)].value !== x[Object.keys(x)].type.toString()) {
        throw new Error(`${Object.keys(x).toString()} must be a ${x[Object.keys(x)].type.toString()}`)
      }
    })
  }
}

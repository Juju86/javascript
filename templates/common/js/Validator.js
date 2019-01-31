const _validate = Symbol('_validate')
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

    this._data = data

    this[_validate](rules)
  }

  /**
   * Represents a Validator.
   * @validate
   * @param {object} validator - validator object.
   */
  [_validate] (rules) {
    rules.map((x) => {
      if (typeof x[Object.keys(x)].value !== x[Object.keys(x)].type.toString()) {
        throw new Error(`${Object.keys(x).toString()} must be a ${x[Object.keys(x)].type.toString()}`)
      }
    })
  }
}

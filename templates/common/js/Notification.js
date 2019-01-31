import Validator from './Validator'
import Tools from './Tools'
import 'promise-polyfill/src/polyfill'
const _init = Symbol('_init')
const _generateTemplate = Symbol('_generateTemplate')
const _generateToken = Symbol('_generateToken')
const _open = Symbol('_open')
const _close = Symbol('_close')
const _timer = Symbol('_timer')

class Notification extends Validator {
  /**
   * Represents a Notification.
   * @constructor
   * @param {object} data - data.
   */
  constructor (data) {
    // Expected data
    // TODO : mattre un champs require et faire un type shema
    const validator = [
      {
        'theme': {
          'type': 'string',
          'value': 'Success'
        }
      },
      {
        'message': {
          'type': 'string',
          'value': null
        }
      },
      {
        'dom': {
          'type': 'string',
          'value': null
        }
      },
      {
        'dismissible': {
          'type': 'boolean',
          'value': null
        }
      },
      {
        'icon': {
          'type': 'string',
          'value': null
        }
      },
      {
        'onDismissed': {
          'type': 'function',
          'value': null
        }
      },
      {
        'onOpen': {
          'type': 'function',
          'value': null
        }
      },
      {
        'onOpened': {
          'type': 'function',
          'value': null
        }
      },
      {
        'onClose': {
          'type': 'function',
          'value': null
        }
      },
      {
        'onClosed': {
          'type': 'function',
          'value': null
        }
      }
    ]

    super(validator, data)

    console.log(Tools._formatData())

    console.log(validator, data)

    this._container = document.createElement('div')
    this._notification = document.createElement('div')
    this._token = this[_generateToken](5)
    this[_timer] = null

    this[_init]()
  }

  /**
   * Represents a Initialization.
   * @init
   * @param {}
   */
  [_init] () {
    if (document.querySelector('[role="notifications-container"]') === null) {
      this._container.setAttribute('role', 'notifications-container')
      this._container.id = 'notifications_' + this._token
      this._container.className = 'fixed-top'
      document.body.appendChild(this._container)
    } else {
      this._container = document.querySelector('[role="notifications-container"]')
    }
  }

  /**
   * Represents a Html template.
   * @_template
   * @param {}
   */
  [_generateTemplate] () {
    return `
      <div class="alert bg-${this._data.theme} alert-dismissible show fade mb-0 p-0 border-0" role="alert">
        <div class="d-flex">
          <div class="h-100 py-4 px-5 bg-${this._data.theme}-dark"><i class="text-white alert-heading ${this._data.icon}"></i></div>
            <p class="text-white mb-0 px-5 align-self-center">${this._data.message}</p>
          </div>
        <div class="progress" style="height: 5px;">
          <div class="progress-bar bg-${this._data.theme}-dark" role="progressbar" aria-valuenow="0" aria-valuemin="0"aria-valuemax="100"></div>
        </div>
        <button type="button" class="close text-white-50">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `
  }

  /**
   * Represents a Token.
   * @_generateToken
   * @param {number} length
   */
  [_generateToken] (length) {
    let timestamp = +new Date()

    let _getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    let ts = timestamp.toString()
    let parts = ts.split('').reverse()
    let token = ''

    for (let i = 0; i < length; ++i) {
      let index = _getRandomInt(0, parts.length - 1)
      token += parts[index]
    }
    return token
  }

  /**
   * Represents Notifying.
   * @notify
   * @param {}
   */
  notify () {
    if (document.querySelector('[role="notifications-container"]') !== null) {
      this[_open]()
        .then(() => {
          this._notification.addEventListener('click', (e) => {
            this[_close](e)
          })
        })
        .then(() => {
          let width = 1
          this[_timer] = setInterval(() => {
            if (width >= 100) {
              this[_close]()
            } else {
              width++
              this._notification.querySelector('.progress-bar').style.width = width + '%'
            }
          }, 30000 * 0.01)
          this._data.onOpened(this)
        })
    }
  }

  /**
   * Represents Opening.
   * @open
   * @param {}
   */
  [_open] () {
    return new Promise((resolve, reject) => {
      this._notification.setAttribute('rel', 'notification_' + this._container.id.split('_')[1])
      this._notification.id = 'notification_' + this[_generateToken](5)
      this._notification.className = 'notification'
      this._notification.innerHTML = this[_generateTemplate]()

      this._container.appendChild(this._notification)
      this._data.onOpen(this)
      resolve()
    })
  }

  /**
   * Represents Closing.
   * @close
   * @param {}
   */
  [_close] (e) {
    this._data.onClose(this)
    if (typeof e === 'object') {
      this._data.onDismissed(this, e)
    }
    clearInterval(this[_timer])
    this._notification.remove()
    this._data.onClosed(this)
  }
}

export default Notification

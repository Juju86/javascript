// SCSS
import './../scss/app.scss'
// JS
import $ from 'jquery'

import Notification from '../../common/js/Notification'

import 'bootstrap/js/dist/alert'
import 'bootstrap/js/dist/button'
import 'bootstrap/js/dist/carousel'
import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/modal'
import 'bootstrap/js/dist/popover'
import 'bootstrap/js/dist/scrollspy'
import 'bootstrap/js/dist/tab'
import 'bootstrap/js/dist/tooltip'
import 'bootstrap/js/dist/util'

// FICHIERS
import './../../common/images/logo.svg'

// VARIABLES
window.Notification = Notification
window.$ = $
window.jQuery = $

let options = {
  theme: 'success',
  message: 'Hello world !',
  dismissible: true,
  icon: 'fas fa-2x fa-check',
  onDismissed: function (i, e) {
    console.log(i, e)
  },
  onOpen: function (i) {
    console.log(i)
  },
  onOpened: function (i) {
    console.log(i)
  },
  onClose: function (i) {
    console.log(i)
  },
  onClosed: function (i) {
    console.log(i)
  }
}

let notif = new Notification(options)
notif.notify()

window.notif = notif

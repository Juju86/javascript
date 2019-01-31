// SCSS
import './../scss/app.scss'
// JS
import Notification from '../../common/js/Notification'

// FICHIERS
import './../../common/images/logo.svg'

// VARIABLES
window.Notification = Notification

let options = {
  theme: 'success',
  message: 'Hello world !',
  dom: 'mid',
  dismissible: true,
  icon: 'fas fa-2x fa-check',
  onDismissed: function (i, e) {
  },
  onOpen: function (i) {
  },
  onOpened: function (i) {
  },
  onClose: function (i) {
  },
  onClosed: function (i) {
  }
}

let notif = new Notification(options)
notif.notify()

// AMD Pattern
/*
window.b = {
  chien: function () {
    console.log('Vivre')
  }
};

(function (root, factory) {
  console.log('1')
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['b'], factory)
  } else {
    console.log(root)
    // Browser globals
    root.amdWeb = factory(root.b)
    console.log('5')
  }
}(typeof self !== 'undefined' ? self : this, function (b) {
  // console.log(b)
  return {
    b: b,
    ultra: function () {
      console.log('Livre')
    }
  }
}))
console.log(amdWeb)
*/

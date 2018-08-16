import SessionManager from './SessionManager'
import SessionInput from './session-input.vue'
import mixin from './mixin'

function install(Vue, options) {
  var manager = new SessionManager(options);

  Vue.$session = manager
  Vue.prototype.$session = manager

  Vue.component(options.sessionInputName || 'session-input', SessionInput)
  Vue.mixin(mixin)

  window.onunload = () => manager.exit
}

export default install
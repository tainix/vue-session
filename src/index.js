import SessionManager from './SessionManager'
import SessionInput from './session-input.vue'
import Mix from './mix'

function install(Vue, options) {
	var manager = new SessionManager(options);

	Vue.$session = manager
	Vue.prototype.$session = manager


	Vue.component(options.sessionInputName || 'session-input', SessionInput)
}

export default install

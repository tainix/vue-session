import Session from './Session'
import SessionInput from './session-input.vue'

function install(Vue, options) {
	const session = new Session(options || {})

	Vue.$session = session
	Vue.prototype.$session = session

	return session
}

export {
	install,
	Session,
	SessionInput
}

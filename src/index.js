import Session from './Session'
import SessionInput from './session-input.vue'

let installed

function install(Vue, options) {
	if(installed) {
		return
	}

	installed = true
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
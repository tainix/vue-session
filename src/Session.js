const NAME_TOKEN = 'token'
const NAME_EXPIRE = 'expire'
const NAME_REQUEST = 'request'

class Session {

	constructor(config = {}) {
		this.id = config.id || Date.now();
		this.namespace = 'session'
		this.expire = 1000 * 60 * 30
		this.storage = config.storage || window.sessionStorage

		this.checkFn = config.check
		this.tologinFn = config.tologin
		this.loginFn = config.login
		this.logoutFn = config.logout

		this.tokenParamName = config.tokenParamName || 'x-auth-token'
	}

	wrapKey(key) {
		return this.namespace + '-' + key
		//		return `${ns}-${id}-${key}`
	}

	getToken() {
		return this.token || this.storage.getItem(this.wrapKey(NAME_TOKEN))
	}

	setToken(t) {
		if(!!t) {
			this.token = t
			this.storage.setItem(this.wrapKey(NAME_TOKEN), t)
		}
	}

	getRequest() {
		return this.storage.getItem(this.wrapKey(NAME_REQUEST))
	}

	setRequest(uri) {
		this.storage.setItem(this.wrapKey(NAME_REQUEST), uri)
	}

	removeRequest() {
		let uri = this.getRequest()
		uri && this.storage.removeItem(this.wrapKey(NAME_REQUEST))
		return uri
	}

	toLoginOrContinue(to, from, next, loginPage) {
		this.check()
			.then(next)
			.catch(() => {
				this.setRequest(to.fullPath)

				if(loginPage) {
					next(loginPage)
				} else if(this.tologinFn) {
					this.tologinFn(to, from, next, this)
				}
			})
	}

	check() {
		const t = this.getToken()

		if(!!t && this.checkFn) {
			return this.checkFn(t, this).catch(this.clear)
		}

		return !!t ? Promise.resolve() : Promise.reject()
	}

	login(t) {
		this.setToken(t)

		return Promise.resolve(this.removeRequest())
	}

	logout() {
		const token = this.getToken()
		this.clear()

		if(this.logoutFn) {
			return this.logoutFn(token, this)
		} else {
			return Promise.resolve()
		}
	}

	clear() {
		this.token = null

		this.storage.removeItem(this.wrapKey(NAME_TOKEN))
		this.storage.removeItem(this.wrapKey(NAME_EXPIRE))
		this.storage.removeItem(this.wrapKey(NAME_REQUEST))
	}

	stamp(uri) {
		const hasQuery = uri.indexOf('?') !== -1
		return uri + (hasQuery ? '&' : '?') + this.tokenParamName + '=' + this.getToken()
	}

	getTokenMap() {
		let obj = {}
		obj[this.tokenParamName] = this.getToken()
		return obj
	}

}

export default Session
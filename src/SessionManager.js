import Session from './Session'

const namespace = 'tainix/vue-session'

var options = {
  tokenParamName: '',
  storage: null,
  loginPage: null,
  fnCheck: null,
  fnTologin: null,
  fnLogin: null,
  fnLogout: null
}

var storage = window.sessionStorage
var sessions = []
var current = 0

function load() {
  var item = storage.getItem(namespace)
  if(item) {
    JSON.parse(item).forEach(s => {
      var session = new Session(s)
      saveSession(session, true)
    })
  }

  console.debug('session data loaded')
}

function store() {
  if(sessions.length) {
    storage.setItem(namespace, JSON.stringify(sessions))
  }

  console.debug('session data stored')
}

function saveSession(session, create) {
  if(create) {
    sessions.push(session)
  } else {
    sessions.splice(current, 1, session)
  }

  return Promise.resolve(session)
}

class SessionManager {

  constructor(config) {
    options = config

    load()
  }

  switchSession(index) {
    if(index && index < sessions.length) {
      current = index
    }
  }

  getSession(create, index = current) {
    if(index < sessions.length) {
      return sessions[index]
    }

    if(create) {
      var session = new Session(options)
      saveSession(session)
      return session
    }

    return null
  }

  getToken() {
    var session = this.getSession()
    if(session) {
      return session.token
    }

    return null
  }

  toLoginOrContinue(to, from, next) {
    this.check().then(next).catch(() => {
      var session = this.getSession(true)
      session.saveRequest(to.fullPath)

      if(options.loginPage) {
        next(options.loginPage)
      } else if(options.tologinFn) {
        options.tologinFn(to, from, next)
      }
    })
  }

  check() {
    var token = this.getToken()

    if(token && options.checkFn) {
      return options.checkFn(token).catch(this.logout)
    }

    return Promise.reject()
  }

  login(resp) {
    let token = resp.headers[options.tokenParamName]

    var session = this.getSession(true)
    session.saveToken(token)

    return session.removeRequest()
  }

  logout() {
    var token = this.getToken()

    saveSession(null)

    if(token && options.logoutFn) {
      return options.logoutFn(token)
    }

    return Promise.resolve()
  }

  stampUri(uri) {
    var t = this.getToken()
    return uri + ((uri.indexOf('?') !== -1) ? '&' : '?') + options.tokenParamName + '=' + t
  }

  stampHeader(headers) {
    var t = this.getToken()
    headers[options.tokenParamName] = t
  }

  exit() {
    store()
  }

}

export default SessionManager
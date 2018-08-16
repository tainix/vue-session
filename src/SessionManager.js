import Session from './Session'

const namespace = '_session'

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
      return Promise.resolve(sessions[index])
    }

    if(create) {
      var session = new Session(options)
      return saveSession(session)
    }

    return Promise.reject()
  }

  getToken() {
    return this.getSession().then(session => session.getToken())
  }

  toLoginOrContinue(to, from, next) {
    this.check().then(next).catch(() => {
      this.getSession(true).then(session => session.saveRequest(to.fullPath))

      if(options.loginPage) {
        next(options.loginPage)
      } else if(options.tologinFn) {
        options.tologinFn(to, from, next)
      }
    })
  }

  check() {
    return this.getToken().then(token => options.checkFn(token).catch(this.logout))
  }

  login(resp) {
    let token = resp.headers[options.tokenParamName]
    return this.getSession(true).then(session => {
      session.saveToken(token)
      return session.removeRequest()
    })
  }

  logout() {
    return this.getToken.then(token => {
      saveSession(null)

      if(options.logoutFn) {
        return options.logoutFn(token)
      } else {
        return Promise.resolve()
      }
    })
  }

  stampUri(uri) {
    return this.getToken().then(t => uri + ((uri.indexOf('?') !== -1) ? '&' : '?') + options.tokenParamName + '=' + t)
  }

  stampHeader(headers) {
    return this.getToken().then(t => headers[options.tokenParamName] = t)
  }

  exit() {
    store()
  }

}

export default SessionManager
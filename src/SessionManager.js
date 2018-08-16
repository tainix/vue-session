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

var storage
var sessions = []
var current = 0

function load() {

  console.debug('session data loaded')
}

function store() {

  console.debug('session data stored')
}

function createSession(uri) {
  return new Session(options, uri)
}

function saveSession(session) {
  sessions.push(session)
  return Promise.resolve()
}

function getSession(index = current) {
  if (index < sessions.length) {
    return Promise.resolve(sessions[index])
  }
  return Promise.reject()
}

function putSession(session, index = current) {
  sessions.splice(index, 1, session)
  return Promise.resolve()
}

class SessionManager {

  constructor(config) {
    options = config

    load()
  }

  switchSession(index) {
    if (index && index < sessions.length) {
      current = index
    }
  }

  getToken() {
    return getSession().then(session => session.getToken)
  }

  toLoginOrContinue(to, from, next, loginPage) {
    this.check()
      .then(next)
      .catch(() => {
        var session = createSession(to.fullPath)
        putSession(session)

        if (loginPage) {
          next(loginPage)
        } else if (options.tologinFn) {
          options.tologinFn(to, from, next)
        }
      })
  }

  check() {
    return this.getToken()
      .then(token => options.checkFn(token).catch(this.logout))
  }

  login(resp) {
    let token = resp.headers[options.tokenParamName]
    return getSession().then(session => {
      session.saveToken(token)
      return session.removeRequest()
    })
  }

  logout() {
    return this.getToken
      .then(token => {
        putSession(null)

        if (options.logoutFn) {
          return options.logoutFn(token)
        } else {
          return Promise.resolve()
        }
      })
  }

  stamp(uri) {
    const hasQuery = uri.indexOf('?') !== -1
    return uri + (hasQuery ? '&' : '?') + options.tokenParamName + '=' + getSession().getToken()
  }

  exit() {
    store()
  }

}

export default SessionManager

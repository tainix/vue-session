import merge from "lodash/merge"

import Session from './Session'

const namespace = 'tainix/vue-session'

var options = {
  tokenParamName: 'session',
  storage: window.sessionStorage,
  loginPage: '/login',
  fnCheck: null,
  fnTologin: null,
  fnLogout: null
}

var sessions = []
var current = 0

class SessionManager {

  constructor(config) {
    merge(this, options, config)

    this.load()
  }

  load() {
    var item = this.storage.getItem(namespace)
    if(item) {
      JSON.parse(item).forEach(s => {
        var session = new Session(s)
        this.saveSession(session, true)
      })
    }

    console.debug('session data loaded')
  }

  saveSession(session, create) {
    if(create) {
      sessions.push(session)
    } else {
      sessions.splice(current, 1, session)
    }

    return Promise.resolve(session)
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
      var session = new Session(this)
      this.saveSession(session)
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

      if(this.tologinFn) {
        this.tologinFn(to, from, next)
      } else if(this.loginPage) {
        next(this.loginPage)
      }
    })
  }

  check() {
    var token = this.getToken()

    if(token && this.checkFn) {
      return this.checkFn(token).catch(this.logout)
    }

    return Promise.reject()
  }

  login(resp) {
    let token = resp.headers[this.tokenParamName]

    var session = this.getSession(true)
    session.saveToken(token)

    return session.removeRequest()
  }

  stampUri(uri) {
    var t = this.getToken()
    return t ? uri + ((uri.indexOf('?') !== -1) ? '&' : '?') + this.tokenParamName + '=' + t : uri
  }

  stampHeader(headers) {
    var t = this.getToken()
    if(t) {
      headers[this.tokenParamName] = t
    }
  }

  logout() {
    var token = this.getToken()

    this.saveSession(null)

    if(token && this.logoutFn) {
      return this.logoutFn(token)
    }

    return Promise.resolve()
  }

  exit() {
    if(sessions.length) {
      this.storage.setItem(namespace, JSON.stringify(sessions))
    }

    console.debug('session data stored')
  }

}

export default SessionManager
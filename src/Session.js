class Session {

  constructor(data = {}) {
    this.saveToken(data.token)
    this.saveRequest(data.uri)
  }

  getToken() {
    return Promise.resolve(this.token)
  }

  saveToken(token) {
    this.token = token
    return Promise.resolve()
  }

  saveRequest(uri) {
    this.savedRequest = uri
    return Promise.resolve()
  }

  removeRequest() {
    let uri = this.savedRequest
    this.savedRequest = null
    return Promise.resolve(uri)
  }

  clear() {
    this.token = null
    this.savedRequest = null
    return Promise.resolve()
  }

}

export default Session
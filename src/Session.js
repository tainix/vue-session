
class Session {

    constructor(config = {}, uri) {
        this.saveRequest(uri)
    }

    getToken() {
        return this.token
    }

    saveToken(token) {
        this.token = token
    }

    saveRequest(uri) {
        this.savedRequest = uri
    }

    removeRequest() {
        let uri = this.savedRequest
        this.savedRequest = null
        return uri
    }

    clear() {
        this.token = null
        this.savedRequest = null
    }

}

export default Session
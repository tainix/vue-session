
class MemoryStorage {

    constructor(config = {}, uri) {
        this.setRequest(uri)
    }

    getToken() {
        return this.token
    }

    setToken(token) {
        this.token = token
    }

    getRequest() {
        return this.savedRequest
    }

    setRequest(uri) {
        this.savedRequest = uri
    }

    removeRequest() {
        let uri = this.getRequest()
        this.savedRequest = null
        return uri
    }

    clear() {
        this.token = null
        this.savedRequest = null
    }

}

export default MemoryStorage
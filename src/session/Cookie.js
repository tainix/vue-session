import Cookies from 'js-cookie'

const NAME_TOKEN = 'token'
const NAME_URI = 'uri'

class CookieStorage {

    constructor(config = {}, uri) {
        this.setRequest(uri)
    }

    getToken() {
        return Cookies.get(NAME_TOKEN)
    }

    setToken(token) {
        Cookies.set(NAME_TOKEN, token)
    }

    getRequest() {
        return Cookies.get(NAME_URI)
    }

    setRequest(uri) {
        Cookies.set(NAME_URI, token)
    }

    removeRequest() {
        let uri = this.getRequest()
        Cookies.remove(NAME_URI, token)
        return uri
    }

    clear() {
        Cookies.remove(NAME_TOKEN, token)
        Cookies.remove(NAME_URI, token)
    }

}

export default CookieStorage
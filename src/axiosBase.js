export class AxiosBase {
 
    constructor ( xhrConfig ) {
        this.xhrConfig = xhrConfig
    }

    get config () {
        const { baseURL, timeout, apiToken } = this.xhrConfig
        return {
            baseURL,
            timeout,
            headers: this.headers( apiToken )
        }
    }

    set headers ( token ) {
        return { 'Authorization': `Bearer ${token}` }
    }

}
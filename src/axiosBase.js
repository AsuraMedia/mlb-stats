export class AxiosBase {
 
    constructor ( xhrConfig ) {
        this.xhrConfig      = xhrConfig
        this.axiosConfig    = this.config
    }

    get config () {
        const { baseURL, timeout, apiToken } = this.xhrConfig
        return {
            baseURL,
            timeout,
            headers: this.setHeaders( apiToken )
        }
    }

    setHeaders ( token ) {
        return { 'Authorization': `Bearer ${token}` }
    }

}
import { HttpClient } from './httpClient';
import { config, endpoints } from './xmlStatsApiConfig'

export class XmlStatsService {

    constructor () {
        this.http = new HttpClient( config )
    }

    getEvents ( date ) {
        const eventsUrl = endpoints.eventsUrl(date, 'mlb')
        return this.http.get( eventsUrl )
    }

    getBoxCore ( eventId ) {
        const boxCoreUrl = endpoints.boxCoreUrl(eventId)
        return this.http.get( boxCoreUrl )
    }

}

export default new XmlStatsService()
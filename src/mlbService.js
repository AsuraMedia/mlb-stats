import { HttpClient } from './httpClient';
import { config, endpoints } from './mlbApiConfig'

export class MlbService {

    constructor () {
        this.http = new HttpClient( config )
    }

    getGameLogs ( { playerId, season } ) {
        const gameLogsUrl = endpoints.gameLogsUrl( playerId, season )
        return this.http.get( gameLogsUrl )
    }

    getSchedule ( date ) {
        const scheduleUrl = endpoints.scheduleUrl( date )
        return this.http.get( scheduleUrl )
    }

    getXml ( xmlPath ) {
        const xmlUrl = endpoints.xmlUrl( xmlPath )
        return this.http.get( xmlUrl )
    }

    getAdvantZoneStats ( playerInfo ) {
        const avantUrl = endpoints.avantZoneStatsUrl( playerInfo )
        return this.http.get( avantUrl )
    }

    getAdvantPitchBreakdownStats ( playerInfo ) {
        const avantUrl = endpoints.avantPitchBreakdownStatsUrl( playerInfo )
        return this.http.get( avantUrl )
    }

}

export default new MlbService()
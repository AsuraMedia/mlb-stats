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

}

export default new MlbService()
import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'

const mlbService = new MlbService()
mlbService.getGameLogs( { playerId: 514888, season: 2017 } )
    .then((res) => {
        console.log('GAME LOGS ------>', JSON.stringify(res))
    })

const xmlStats = new XmlStatsService()
xmlStats.getEvents( 20130531 )
    .then((res) => {
        console.log('EVENTS -------> ', JSON.stringify(res))
    })
import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'

// const xmlStatsService = new XmlStatsService()
// xmlStatsService.getEvents(20170906)
//     .then((res) => {
//         console.log('EVENTS -------> ', JSON.stringify(res))
//     })

// const xmlStatsService = new XmlStatsService()
// xmlStatsService.getBoxCore('20170906-texas-rangers-at-atlanta-braves')
//     .then((res) => {
//         console.log('BOX CORE -------> ', JSON.stringify(res))
//     })

const mlbService = new MlbService()
const date = { year: '2017', month: '06', day: '06' }
mlbService.getSchedule( date )
    .then((res) => {
        console.log('SCHEDULE ------>', JSON.stringify(res))
    })


//mlb schedule
{ gameday: "2017_09_06_texmlb_atlmlb_1" }

//xmlstatsapi events by id
{ event_id: "20170906-texas-rangers-at-atlanta-braves" }
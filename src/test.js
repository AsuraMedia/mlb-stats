import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'
import { MlbMapReducer } from './mlbMapReducer';

const mapReducer = new MlbMapReducer()
mapReducer
    .mapSchedule()
    .then( ( res ) => res )


//mlb schedule
{ gameday: "2017_09_06_texmlb_atlmlb_1" }

//xmlstatsapi events by id
{ event_id: "20170906-texas-rangers-at-atlanta-braves" }
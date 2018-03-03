import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'
import mlbMapReducer, { MlbMapReducer } from './mlbMapReducer';
import { MlbScheduleTask } from './mlbScheduleTask';

//xml test here
const mlbScheduleTask = new MlbScheduleTask()
mlbScheduleTask.getXmlData()
    .then( ( result ) => {
        result
    } )

//mlb schedule
{ gameday: "2017_09_06_texmlb_atlmlb_1" }

//xmlstatsapi events by id
{ event_id: "20170906-texas-rangers-at-atlanta-braves" }
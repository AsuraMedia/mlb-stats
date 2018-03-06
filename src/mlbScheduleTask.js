import * as Rx from 'rxjs';
import { MlbMapReducer } from './mlbMapReducer';
import { config } from './mlbApiConfig';

export class MlbScheduleTask {

    constructor () {

    }

    getXmlData () {

        const mapReducer = new MlbMapReducer()
        const date = { year: '2017', month: '05', day: '13' }

        return mapReducer.mapSchedule( date )
            .then( ( scheduleResult ) => {
                return scheduleResult.map( ( schedule ) => {
                    return {
                        xmlUrl: `${schedule.path}`
                    }
                } )
            } )

    }

}

export default new MlbScheduleTask()
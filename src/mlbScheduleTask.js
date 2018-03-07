import * as Rx from 'rxjs';
import { MlbMapReducer } from './mlbMapReducer';
import { config } from './mlbApiConfig';

const moment = require('moment');

export class MlbScheduleTask {

    constructor () {

    }

    getXmlData ( days ) {

        const mapReducer = new MlbMapReducer()

        Rx.Observable.from( days ).zip(
            Rx.Observable.interval(1000), ( day ) => {

                console.log( 'MONTH ------------------>', day.format("dddd, MMMM Do YYYY, h:mm:ss a") )
                
            })
            .subscribe()

        // return mapReducer.mapSchedule( date )
        //     .then( ( scheduleResult ) => {
        //         return scheduleResult.map( ( schedule ) => {
        //             return {
        //                 date: date,
        //                 xmlUrl: `${schedule.path}`
        //             }
        //         } )
        //     } )

    }

    getDaysArrayByMonth( date ) {
        var momentDate = moment(`${date.year}-${date.month}`, "YYYY-MM")
        var daysInMonth = momentDate.daysInMonth();
        var arrDays = [];
      
        while(daysInMonth) {
          var current = moment(`${date.year}-${date.month}`, "YYYY-MM").date(daysInMonth);
          arrDays.push(current);
          daysInMonth--;
        }

        return arrDays;
      }

}

export default new MlbScheduleTask()
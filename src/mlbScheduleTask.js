//@flow
import * as Rx from 'rxjs';
import { MlbMapReducer } from './mlbMapReducer';
import { config } from './mlbApiConfig';
import { Moment } from 'moment';

const moment = require( 'moment' );

export class MlbScheduleTask {

    constructor () {

    }

    getXmlUrls ( days ) {

        const mapReducer = new MlbMapReducer()

        return Rx.Observable.from( days ).zip(
            Rx.Observable.interval( 5000 ), ( momentDay: Moment ) => {
                return { 
                    year: momentDay.format( 'YYYY' ), 
                    month: momentDay.format( 'MM' ), 
                    day: momentDay.format( 'DD' ) 
                }
            } )
            .map(( date ) => {
                return Rx.Observable.fromPromise(
                    mapReducer.mapSchedule( date )
                        .then( ( scheduleResult ) => {
                            return scheduleResult.map( ( schedule ) => {
                                return {
                                    date: date,
                                    xmlUrl: `${schedule.path}`
                                }
                            } )
                        } )
                )
            })
            .concatAll()



    }

    getDaysArrayByMonth ( date ) {
        var momentDate = moment( `${date.year}-${date.month}`, "YYYY-MM" )
        var daysInMonth = momentDate.daysInMonth();
        var arrDays = [];

        while ( daysInMonth ) {
            var current = moment( `${date.year}-${date.month}`, "YYYY-MM" ).date( daysInMonth );
            arrDays.push( current );
            daysInMonth--;
        }

        return arrDays;
    }

}

export default new MlbScheduleTask()
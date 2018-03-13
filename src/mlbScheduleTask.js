//@flow
import * as Rx from 'rxjs';
import { MlbService } from './mlbService';
import { MlbMapReducer } from './mlbMapReducer';
import { config } from './mlbApiConfig';
import { Moment } from 'moment';

const moment = require( 'moment' );
const fs = require( 'file-system' );

export class MlbScheduleTask {

    constructor () {

    }

    getByDate ( date ) {

        const mlbService = new MlbService();
        const days = this.getDaysArrayByMonth(date);

        this.getXmlUrls(days)
          .map(result => {
            return result;
          })
          .subscribe(urlList => {
              if ( urlList.length ) { 
            Rx.Observable.from(urlList)
              .zip(Rx.Observable.interval(12000), url => {
                mlbService.getXml(url.xmlUrl).then(response => {
                  if (response.status !== 200) {
                    //
                  } else {
                    const xml = response.data;
                    const fileName = url.xmlUrl.split("/").pop();
                    fs.writeFile(`./xml/${date.year}_${date.month}/${fileName}.xml`, xml, err => {
                      console.log("Saved file xml ---> ", fileName);
                    });
                  }
                });
              })
              .subscribe();
            }
          });

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
                            if ( !scheduleResult.length ) {
                                return []
                            }
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
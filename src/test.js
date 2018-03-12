import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'
import mlbMapReducer, { MlbMapReducer } from './mlbMapReducer';
import { MlbScheduleTask } from './mlbScheduleTask';
import {
    Inning,
    InningHeader,
    AtBat,
    AtBatHeader,
    Pitch,
    PitchHeader,
    Runner,
    RunnerHeader,
    Top
} from './xmlDataTypes'

import { EventRow } from './eventTypes';
import { mode } from './math';

import * as Rx from 'rxjs';

const fs = require( 'file-system' );

//xml test here

let eventDataSet: Array<EventRow> = [];
let inningsArray: Array<Inning> = [];
let pitchesDataPerAtBat = {};

const xmlFiles = fs.fs.readdirSync( './xml' ).filter( file => file.indexOf( 'DS' ) === -1 )

xmlFiles.forEach( ( xmlPath ) => {

    const xml = fs.fs.readFileSync( `./xml/${xmlPath}`, { encoding: "utf8" } )

    const parseString = require( 'xml2js' ).parseString
    parseString( xml, ( err, result ) => {
        inningsArray = result.game.inning;
    } );

    const calculateAvgPitchVelocity = ( pitchType, pitchesDataPerAtBat ) => {
        let count = 0;
        let totalSum = 0;
        for ( let key in pitchesDataPerAtBat ) {
            count += pitchesDataPerAtBat[key][pitchType + 'count'];
            totalSum += pitchesDataPerAtBat[key][pitchType + 'speedTotal'];
        }
        return totalSum / count
    }

    const calculateAvgPitchZone = ( pitchType, pitchesDataPerAtBat ) => {
        let zones = []
        for ( let key in pitchesDataPerAtBat ) {
            zones = zones.concat( pitchesDataPerAtBat[key][pitchType + 'zones'] )
        }
        return mode( zones )
    }

    inningsArray.forEach( ( inning: Inning ) => {
        inning.top.forEach( ( topHalf ) => {

            if ( inning.$.next === 'N' ) {
                return
            }

            topHalf.atbat.forEach( ( atbat, abIndex ) => {

                if ( atbat.po ) {
                    return
                }

                atbat.pitch.forEach( ( pitch ) => {

                    if ( !pitchesDataPerAtBat[atbat.$.play_guid] ) {
                        pitchesDataPerAtBat[atbat.$.play_guid] = {
                            FFcount: 0,
                            FFspeedTotal: 0,
                            FScount: 0,
                            FSspeedTotal: 0,
                            FCcount: 0,
                            FCspeedTotal: 0,
                            INcount: 0,
                            INspeedTotal: 0,
                            POcount: 0,
                            POspeedTotal: 0,
                            FTcount: 0,
                            FTspeedTotal: 0,
                            CHcount: 0,
                            CHspeedTotal: 0,
                            CUcount: 0,
                            CUspeedTotal: 0,
                            SLcount: 0,
                            SLspeedTotal: 0,
                            KCcount: 0,
                            KCspeedTotal: 0,
                            SIcount: 0,
                            SIspeedTotal: 0,
                            FFzones: [],
                            FSzones: [],
                            FCzones: [],
                            FTzones: [],
                            INzones: [],
                            POzones: [],
                            CHzones: [],
                            CUzones: [],
                            SLzones: [],
                            KCzones: [],
                            SIzones: []
                        };
                    }

                    if ( pitch.$.pitch_type ) {

                        // Average pitch speed
                        pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'count']++
                        pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'speedTotal'] += Math.round( parseFloat( pitch.$.start_speed ) )
                        // Average pitch zone
                        pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'zones'].push( pitch.$.zone )

                    }

                } )
                eventDataSet.push( {
                    inningNo: inning.$.num,
                    opponent: inning.$.home_team,
                    isHome: false,
                    batterHeight: atbat.$.b_height,
                    batterHand: atbat.$.stand,
                    pitcherHand: atbat.$.p_throws,
                    homeTeamRuns: atbat.$.home_team_runs,
                    awayTeamRuns: atbat.$.away_team_runs,
                    runnersOn: atbat.runner ? atbat.runner.length : 0,
                    avgFFspeed: calculateAvgPitchVelocity( 'FF', pitchesDataPerAtBat ),
                    avgFFzone: calculateAvgPitchZone( 'FF', pitchesDataPerAtBat ),
                    event: atbat.$.event
                } )
            } )
        } )
    } )

    console.log('EVENT DATA SET --------------------> ', eventDataSet )
    const json2csv = require('json-2-csv')

} )





    // const mlbService = new MlbService()
    // const mlbScheduleTask = new MlbScheduleTask()

    // const date = { year: '2016', month: '04' }

    // const days = mlbScheduleTask.getDaysArrayByMonth( date );

    // mlbScheduleTask.getXmlUrls( days )
    //     .map( ( result ) => {
    //         return result
    //     } )
    //     .subscribe( ( urlList ) => {
    //         Rx.Observable.from( urlList ).zip(
    //             Rx.Observable.interval( 12000 ), ( url ) => {
    //                 mlbService.getXml( url.xmlUrl )
    //                     .then( ( response ) => {
    //                         if ( response.status !== 200 ) {
    //                             //
    //                         } else {
    //                             const xml = response.data
    //                             const fileName = url.xmlUrl.split('/').pop();
    //                             fs.writeFile(`./xml/${fileName}.xml`, xml, err => {
    //                                 console.log('Saved file xml ---> ', fileName);
    //                             });
    //                         }
    //                     } )
    //             } )
    //             .subscribe()
    //     } )

    // mlbScheduleTask.getXmlData( date )
    //     .then((urlList) => { 
    //         console.log(urlList)
    //     })



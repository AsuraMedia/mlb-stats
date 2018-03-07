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

 import { EventRow } from './eventTypes'
 import { mode } from './math'

//xml test here
// const mlbService = new MlbService()
// const mlbScheduleTask = new MlbScheduleTask()
// mlbScheduleTask.getXmlData()
//     .then((urlList) => {

//         const url = urlList[1].xmlUrl
//         mlbService.getXml(url)
//             .then((response) => {
//                 if (response.status !== 200) {
//                     //
//                 } else {

//                     const fs = require('file-system');

//                     let eventDataSet: Array<EventRow> = [];
//                     let inningsArray: Array<Inning> = [];
//                     let pitchesDataPerAtBat = {};

//                     const parseString = require('xml2js').parseString
//                     parseString(response.data, (err, result) => {
//                         inningsArray = result.game.inning;
//                     });

//                     const calculateAvgPitchVelocity = ( pitchType, pitchesDataPerAtBat ) => {
//                         let count = 0;
//                         let totalSum = 0;
//                         for ( let key in pitchesDataPerAtBat ) {
//                             count += pitchesDataPerAtBat[key][pitchType+'count'];
//                             totalSum += pitchesDataPerAtBat[key][pitchType+'speedTotal'];
//                         }
//                         return totalSum / count
//                     }

//                     const calculateAvgPitchZone = ( pitchType, pitchesDataPerAtBat ) => {
//                         let zones = []
//                         for ( let key in pitchesDataPerAtBat ) {
//                            zones = zones.concat( pitchesDataPerAtBat[key][pitchType+'zones'] )
//                         }
//                         return mode( zones )
//                     }

//                     inningsArray.forEach( ( inning: Inning ) => {
//                         inning.top.forEach( ( topHalf ) => {
//                             topHalf.atbat.forEach( ( atbat, abIndex ) => {
//                                 atbat.pitch.forEach( ( pitch ) => {

//                                     console.log(pitch.$.pitch_type)
                                    
//                                     if ( !pitchesDataPerAtBat[atbat.$.play_guid] ) {
//                                         pitchesDataPerAtBat[atbat.$.play_guid] = { 
//                                             FFcount: 0, 
//                                             FFspeedTotal: 0,
//                                             FTcount: 0,
//                                             FTspeedTotal: 0,
//                                             CHcount: 0,
//                                             CHspeedTotal: 0,
//                                             CUcount: 0,
//                                             CUspeedTotal: 0,
//                                             SLcount: 0,
//                                             SLspeedTotal: 0,
//                                             KCcount: 0,
//                                             KCspeedTotal: 0,
//                                             SIcount: 0,
//                                             SIspeedTotal: 0,
//                                             FFzones: [],
//                                             FTzones: [],
//                                             CHzones: [],
//                                             CUzones: [],
//                                             SLzones: [],
//                                             KCzones: [],
//                                             SIzones: []
//                                         };
//                                     }

//                                     // Average pitch speed
//                                     pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type+'count']++
//                                     pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type+'speedTotal'] += Math.round(parseFloat(pitch.$.start_speed))

//                                     // Average pitch zone
//                                     pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type+'zones'].push(pitch.$.zone)
                                    
//                                 } )
//                                 eventDataSet.push({
//                                     inningNo: inning.$.num,
//                                     opponent: inning.$.home_team,
//                                     isHome: false,
//                                     batterHeight: atbat.$.b_height,
//                                     batterHand: atbat.$.stand,
//                                     pitcherHand: atbat.$.p_throws,
//                                     homeTeamRuns: atbat.$.home_team_runs,
//                                     awayTeamRuns: atbat.$.away_team_runs,
//                                     runnersOn: atbat.runner ? atbat.runner.length : 0,
//                                     avgFFspeed: calculateAvgPitchVelocity( 'FF', pitchesDataPerAtBat ),
//                                     avgFFzone: calculateAvgPitchZone( 'FF', pitchesDataPerAtBat ),
//                                     event: atbat.$.event
//                                 })
//                             } )
//                         })
//                     })
                    
//                     console.log( 'DATA SET ------->', JSON.stringify( eventDataSet ) )
    //             }
    //         })

    // })

    const mlbService = new MlbService()
    const mlbScheduleTask = new MlbScheduleTask()

    const date = { year: '2017', month: '05' }

    const days = mlbScheduleTask.getDaysArrayByMonth( date );
    mlbScheduleTask.getXmlData( days )

    // mlbScheduleTask.getXmlData( date )
    //     .then((urlList) => { 

    //         console.log(urlList)



    //         // mlbService.getXml(url)
    //         //     .then((response) => {
    //         //         if (response.status !== 200) {
    //         //             //
    //         //         } else { 
    //         //             //
    //         //         }
    //         //     })

    //     })

    // const fs = require('file-system');
    // fs.writeFile("xmlTest.xml", xml, err => {
    //     console.log(err);
    // });

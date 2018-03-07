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

//xml test here
const mlbService = new MlbService()
const mlbScheduleTask = new MlbScheduleTask()
mlbScheduleTask.getXmlData()
    .then((urlList) => {

        const url = urlList[1].xmlUrl
        mlbService.getXml(url)
            .then((response) => {
                if (response.status !== 200) {
                    //
                } else {

                    const fs = require('file-system');

                    let eventRow: EventRow = {};
                    let inningsArray: Array<Inning> = [];

                    const parseString = require('xml2js').parseString
                    parseString(response.data, (err, result) => {
                        inningsArray = result.game.inning;
                    });

                    inningsArray.forEach( ( inning: Inning ) => {
                        inning.top.forEach( ( topHalf ) => {
                            topHalf.atbat.forEach( ( atbat ) => {
                                atbat.pitch.forEach( ( pitch ) => {
                                    console.log( 'PITCH ----> ', pitch )
                                } )
                            } )
                        })
                    })
                    

                    // fs.writeFile('innings.json', JSON.stringify(inningsArray), (err) => {
                    //     console.log(err)
                    // })

                    // const converter = require('json-2-csv');
                    // const options = {
                    //     checkSchemaDifferences: false
                    // }

                    // converter.json2csv(inningsArray, (err, csv) => {
                    //     console.log(csv)
                    //     fs.writeFile('test.csv', csv, (err) => {
                    //         console.log(err)
                    //     })
                    // }, options )
                }
            })

    })


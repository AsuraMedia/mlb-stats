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
import { json2csv } from 'json-2-csv';
const parseString = require( 'xml2js' ).parseString

const mlbScheduleTask = new MlbScheduleTask();

const date = { year: "2016", month: "04" };
const datePath = `${date.year}_${date.month}`;

//mlbScheduleTask.getByDate( date );

//xml test here

let eventDataSet: Array<EventRow> = [];

const xmlFiles = fs.fs.readdirSync( `./xml/${datePath}` ).filter( file => file.indexOf( 'DS' ) === -1 )
//const list = [].concat(xmlFiles.pop())

for ( let xmlFilesIndex in xmlFiles ) {

    let inningsArray: Array<Inning> = [];
    let pitchesDataPerAtBat = {};
    const xmlPath = xmlFiles[xmlFilesIndex]
    const xml = fs.fs.readFileSync( `./xml/${datePath}/${xmlPath.replace('._', '')}`, {
        encoding: "utf8" 
    } )

    parseString( xml, ( err, result ) => {
        inningsArray = result.game.inning
    } );

    const normalizeBatterHeight = ( height: string ) => {
        const hList = height.split('-')
        const feet = parseInt(hList[0])
        const inches = parseInt(hList[1])
        const totalInches = ( feet * 12 ) + inches
        return totalInches / 100
    }

    const calculateAvgPitchVelocity = ( pitchType, pitchesDataPerAtBat ) => {
        let count = 0;
        let totalSum = 0;
        for ( let key in pitchesDataPerAtBat ) {
            count += pitchesDataPerAtBat[key][pitchType + 'count'];
            totalSum += pitchesDataPerAtBat[key][pitchType + 'speedTotal'];
        }
        return count === 0 ? parseInt(0).toFixed(2) : parseFloat(totalSum / count).toFixed(2)
    }

    const calculateAvgPitchZone = ( zonesDictionary ) => {
        let maxValue = { key: 0, value: 0 }
        for ( let key in zonesDictionary ) {
            if ( zonesDictionary[key] > maxValue.value ) {
                maxValue = {
                    key: key,
                    value: zonesDictionary[key]
                }
            }
        }
        return maxValue.key
    }

    for ( let inningsArrayIndex in inningsArray ) {
        const inning = inningsArray[inningsArrayIndex]
        /**
         * Top of 
         * the inning
         */
        for ( let topIndex in inning.top ) {
            if ( inning.$.next === 'Y' ) {
                const topHalf = inning.top[topIndex]
                for ( let atbatIndex in topHalf.atbat) {
                    let zonesDictionary = {};
                    const atbat = topHalf.atbat[atbatIndex]
                    if ( atbat.pitch && atbat.pitch[0].$.pitch_type ) {
                        for ( let pitchIndex in atbat.pitch ) {
                            const pitch = atbat.pitch[pitchIndex]
                                if ( !pitchesDataPerAtBat[atbat.$.play_guid] ) {
                                    pitchesDataPerAtBat[atbat.$.play_guid] = {
                                        FFcount: 0,
                                        FFspeedTotal: 0,
                                        FAcount: 0,
                                        FAspeedTotal: 0,
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
                                        SIspeedTotal: 0
                                    };
                                }
                                if ( pitch.$.pitch_type ) {

                                    // Average pitch speed
                                    pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'count']++
                                    pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'speedTotal'] += Math.round( parseFloat( pitch.$.start_speed ) )
                                    // Average pitch zone
                                    if ( zonesDictionary[pitch.$.zone] === undefined ) {
                                        zonesDictionary[pitch.$.zone] = 1
                                    } else {
                                        zonesDictionary[pitch.$.zone]++
                                    }

                                }
                        }
                        eventDataSet.push( {
                            inningNo: inning.$.num,
                            ana: inning.$.home_team === 'ana' ? 1 : 0,
                            lan: inning.$.home_team === 'lan' ? 1 : 0,
                            bos: inning.$.home_team === 'bos' ? 1 : 0,
                            tor: inning.$.home_team === 'tor' ? 1 : 0,
                            cha: inning.$.home_team === 'cha' ? 1 : 0,
                            sdn: inning.$.home_team === 'sdn' ? 1 : 0,
                            cle: inning.$.home_team === 'cle' ? 1 : 0,
                            tex: inning.$.home_team === 'tex' ? 1 : 0,
                            col: inning.$.home_team === 'col' ? 1 : 0,
                            sea: inning.$.home_team === 'sea' ? 1 : 0,
                            kca: inning.$.home_team === 'kca' ? 1 : 0,
                            ari: inning.$.home_team === 'ari' ? 1 : 0,
                            mil: inning.$.home_team === 'mil' ? 1 : 0,
                            hou: inning.$.home_team === 'hou' ? 1 : 0,
                            nya: inning.$.home_team === 'nya' ? 1 : 0,
                            mia: inning.$.home_team === 'mia' ? 1 : 0,
                            nyn: inning.$.home_team === 'nyn' ? 1 : 0,
                            chn: inning.$.home_team === 'chn' ? 1 : 0,
                            oak: inning.$.home_team === 'oak' ? 1 : 0,
                            sfn: inning.$.home_team === 'sfn' ? 1 : 0,
                            tba: inning.$.home_team === 'tba' ? 1 : 0,
                            atl: inning.$.home_team === 'atl' ? 1 : 0,
                            min: inning.$.home_team === 'min' ? 1 : 0,
                            was: inning.$.home_team === 'was' ? 1 : 0,
                            phi: inning.$.home_team === 'phi' ? 1 : 0,
                            cin: inning.$.home_team === 'cin' ? 1 : 0,
                            det: inning.$.home_team === 'det' ? 1 : 0,
                            pit: inning.$.home_team === 'pit' ? 1 : 0,
                            bal: inning.$.home_team === 'bal' ? 1 : 0,
                            sln: inning.$.home_team === 'sln' ? 1 : 0,
                            isHome: false,
                            batterHeight: normalizeBatterHeight( atbat.$.b_height ),
                            batterHand: atbat.$.stand === 'R' ? 1 : 0,
                            pitcherHand: atbat.$.p_throws === 'R' ? 1 : 0,
                            homeTeamRuns: parseInt(atbat.$.home_team_runs),
                            awayTeamRuns: parseInt(atbat.$.away_team_runs),
                            runnersOn: atbat.runner ? atbat.runner.length : 0,
                            avgFTspeed: calculateAvgPitchVelocity( 'FT', pitchesDataPerAtBat ),
                            avgZone: calculateAvgPitchZone( zonesDictionary ),
                            Lineout: atbat.$.event === 'Lineout' ? 1 : 0,
                            Single: atbat.$.event === 'Single' ? 1 : 0,
                            Double: atbat.$.event === 'Double' ? 1 : 0,
                            Triple: atbat.$.event === 'Triple' ? 1 : 0,
                            Flyout: atbat.$.event === 'Flyout' ? 1 : 0,
                            Single: atbat.$.event === 'Single' ? 1 : 0,
                            HomeRun: atbat.$.event === 'Home Run' ? 1 : 0,
                            Strikeout: atbat.$.event === 'Strikeout' ? 1 : 0,
                            Groundout: atbat.$.event === 'Groundout' ? 1 : 0,
                            GroundedIntoDP: atbat.$.event === 'Grounded Into DP' ? 1 : 0,
                            HitByPitch: atbat.$.event === 'Hit By Pitch' ? 1 : 0,
                            SacFly: atbat.$.event === 'Sac Fly' ? 1 : 0,
                            Walk: atbat.$.event === 'Walk' ? 1 : 0,
                            Forceout: atbat.$.event === 'Forceout' ? 1 : 0,
                            SacBunt: atbat.$.event === 'Sac Bunt' ? 1 : 0,
                            PopOut: atbat.$.event === 'Pop Out' ? 1 : 0,
                            FieldError: atbat.$.event === 'Field Error' ? 1 : 0,
                            RunnerOut: atbat.$.event === 'Runner Out' ? 1 : 0,
                            IntentWalk: atbat.$.event === 'Intent Walk' ? 1 : 0,
                            DoublePlay: atbat.$.event === 'Double Play' ? 1 : 0,
                            FieldersChoiceOut: atbat.$.event === 'Fielders Choice Out' ? 1 : 0
                        } )
                    }
                }
            }
        }

        /**
         * Bottom of 
         * the inning
         */
        for ( let bottomIndex in inning.bottom ) {
            if ( inning.$.next === 'Y' ) {
                const bottomHalf = inning.bottom[bottomIndex]
                for ( let atbatIndex in bottomHalf.atbat) {
                    let zonesDictionary = {};
                    const atbat = bottomHalf.atbat[atbatIndex]
                    if ( atbat.pitch && atbat.pitch[0].$.pitch_type ) {
                        for ( let pitchIndex in atbat.pitch ) {
                            const pitch = atbat.pitch[pitchIndex]
                                if ( !pitchesDataPerAtBat[atbat.$.play_guid] ) {
                                    pitchesDataPerAtBat[atbat.$.play_guid] = {
                                        FFcount: 0,
                                        FFspeedTotal: 0,
                                        FAcount: 0,
                                        FAspeedTotal: 0,
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
                                        SIspeedTotal: 0
                                    };
                                }
                                if ( pitch.$.pitch_type ) {

                                    // Average pitch speed
                                    pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'count']++
                                    pitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'speedTotal'] += Math.round( parseFloat( pitch.$.start_speed ) )
                                    // Average pitch zone
                                    if ( zonesDictionary[pitch.$.zone] === undefined ) {
                                        zonesDictionary[pitch.$.zone] = 1
                                    } else {
                                        zonesDictionary[pitch.$.zone]++
                                    }

                                }
                        }
                        eventDataSet.push( {
                            inningNo: inning.$.num,
                            ana: inning.$.away_team === 'ana' ? 1 : 0,
                            lan: inning.$.away_team === 'lan' ? 1 : 0,
                            bos: inning.$.away_team === 'bos' ? 1 : 0,
                            tor: inning.$.away_team === 'tor' ? 1 : 0,
                            cha: inning.$.away_team === 'cha' ? 1 : 0,
                            sdn: inning.$.away_team === 'sdn' ? 1 : 0,
                            cle: inning.$.away_team === 'cle' ? 1 : 0,
                            tex: inning.$.away_team === 'tex' ? 1 : 0,
                            col: inning.$.away_team === 'col' ? 1 : 0,
                            sea: inning.$.away_team === 'sea' ? 1 : 0,
                            kca: inning.$.away_team === 'kca' ? 1 : 0,
                            ari: inning.$.away_team === 'ari' ? 1 : 0,
                            mil: inning.$.away_team === 'mil' ? 1 : 0,
                            hou: inning.$.away_team === 'hou' ? 1 : 0,
                            nya: inning.$.away_team === 'nya' ? 1 : 0,
                            mia: inning.$.away_team === 'mia' ? 1 : 0,
                            nyn: inning.$.away_team === 'nyn' ? 1 : 0,
                            chn: inning.$.away_team === 'chn' ? 1 : 0,
                            oak: inning.$.away_team === 'oak' ? 1 : 0,
                            sfn: inning.$.away_team === 'sfn' ? 1 : 0,
                            tba: inning.$.away_team === 'tba' ? 1 : 0,
                            atl: inning.$.away_team === 'atl' ? 1 : 0,
                            min: inning.$.away_team === 'min' ? 1 : 0,
                            was: inning.$.away_team === 'was' ? 1 : 0,
                            phi: inning.$.away_team === 'phi' ? 1 : 0,
                            cin: inning.$.away_team === 'cin' ? 1 : 0,
                            det: inning.$.away_team === 'det' ? 1 : 0,
                            pit: inning.$.away_team === 'pit' ? 1 : 0,
                            bal: inning.$.away_team === 'bal' ? 1 : 0,
                            sln: inning.$.away_team === 'sln' ? 1 : 0,
                            isHome: true,
                            batterHeight: normalizeBatterHeight( atbat.$.b_height ),
                            batterHand: atbat.$.stand === 'R' ? 1 : 0,
                            pitcherHand: atbat.$.p_throws === 'R' ? 1 : 0,
                            homeTeamRuns: parseInt(atbat.$.home_team_runs),
                            awayTeamRuns: parseInt(atbat.$.away_team_runs),
                            runnersOn: atbat.runner ? atbat.runner.length : 0,
                            avgFTspeed: calculateAvgPitchVelocity( 'FT', pitchesDataPerAtBat ),
                            avgZone: calculateAvgPitchZone( zonesDictionary ),
                            Lineout: atbat.$.event === 'Lineout' ? 1 : 0,
                            Single: atbat.$.event === 'Single' ? 1 : 0,
                            Double: atbat.$.event === 'Double' ? 1 : 0,
                            Triple: atbat.$.event === 'Triple' ? 1 : 0,
                            Flyout: atbat.$.event === 'Flyout' ? 1 : 0,
                            Single: atbat.$.event === 'Single' ? 1 : 0,
                            HomeRun: atbat.$.event === 'Home Run' ? 1 : 0,
                            Strikeout: atbat.$.event === 'Strikeout' ? 1 : 0,
                            Groundout: atbat.$.event === 'Groundout' ? 1 : 0,
                            GroundedIntoDP: atbat.$.event === 'Grounded Into DP' ? 1 : 0,
                            HitByPitch: atbat.$.event === 'Hit By Pitch' ? 1 : 0,
                            SacFly: atbat.$.event === 'Sac Fly' ? 1 : 0,
                            Walk: atbat.$.event === 'Walk' ? 1 : 0,
                            Forceout: atbat.$.event === 'Forceout' ? 1 : 0,
                            SacBunt: atbat.$.event === 'Sac Bunt' ? 1 : 0,
                            PopOut: atbat.$.event === 'Pop Out' ? 1 : 0,
                            FieldError: atbat.$.event === 'Field Error' ? 1 : 0,
                            RunnerOut: atbat.$.event === 'Runner Out' ? 1 : 0,
                            IntentWalk: atbat.$.event === 'Intent Walk' ? 1 : 0,
                            DoublePlay: atbat.$.event === 'Double Play' ? 1 : 0,
                            FieldersChoiceOut: atbat.$.event === 'Fielders Choice Out' ? 1 : 0
                        } )
                    }
                }
            }
        }
    }
    console.log( ' EVENT DATA SET ----------> ', eventDataSet )
}

    console.log( '*** ---------------- DONE ---------------*** ' )

    json2csv(eventDataSet, (err, csv) => {
      console.log("CSV ---------------> ", csv);
      fs.writeFile(`./${date.year}_${date.month}.csv`, csv, err => {
        console.log("Saved file csv ---> ", "dataSet1.csv");
      });
    });



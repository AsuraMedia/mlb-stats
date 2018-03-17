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

import { pitchesTypeModel } from './pitchesTypeModel'
import { calculateEventDataSet } from './calculateEventDataSet'
import { EventRow } from './eventTypes';
import { json2csv } from 'json-2-csv';

const fs = require( 'file-system' );
const parseString = require( 'xml2js' ).parseString
const date = { year: "2016", month: "04" };
const datePath = `${date.year}_${date.month}`;

let eventDataSet: Array<EventRow> = [];
let allPitchers: [ string ] = {};
let allBatters: [ string ] = {};

const xmlFiles = fs.fs.readdirSync( `./xml/${datePath}` ).filter( file => file.indexOf( 'DS' ) === -1 )

export const transformXml = () => {
    for ( let xmlFilesIndex in xmlFiles ) {
    
        let inningsArray: Array<Inning> = [];
        let topPitchesDataPerAtBat = {};
        let bottomPitchesDataPerAtBat = {};
    
        const xmlPath = xmlFiles[xmlFilesIndex]
        const xml = fs.fs.readFileSync( `./xml/${datePath}/${xmlPath.replace('._', '')}`, {
            encoding: "utf8" 
        } )
    
        parseString( xml, ( err, result ) => {
            inningsArray = result.game.inning
        } );
    
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
    
                        // Fill players dictionary
                        if ( !allBatters[atbat.$.batter] ){
                            allBatters[atbat.$.batter] = atbatIndex
                        }
    
                        if ( !allPitchers[atbat.$.pitcher] ){
                            allPitchers[atbat.$.pitcher] = atbatIndex
                        }
    
                        if ( atbat.pitch && atbat.pitch[0].$.pitch_type ) {
                            for ( let pitchIndex in atbat.pitch ) {
                                const pitch = atbat.pitch[pitchIndex]
                                    if ( !topPitchesDataPerAtBat[atbat.$.play_guid] ) {
                                        topPitchesDataPerAtBat[atbat.$.play_guid] = pitchesTypeModel
                                    }
                                    if ( pitch.$.pitch_type ) {
    
                                        // Average pitch speed
                                        topPitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'count']++
                                        topPitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'speedTotal'] += Math.round( parseFloat( pitch.$.start_speed ) )
                                        // Average pitch zone
                                        if ( zonesDictionary[pitch.$.zone] === undefined ) {
                                            zonesDictionary[pitch.$.zone] = 1
                                        } else {
                                            zonesDictionary[pitch.$.zone]++
                                        }
    
                                    }
                            }
                            eventDataSet.push( calculateEventDataSet(
                                inning,
                                false,
                                atbat,
                                topPitchesDataPerAtBat,
                                zonesDictionary
                            ) )
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
    
                        // Fill players dictionary
                        if ( !allBatters[atbat.$.batter] ){
                            allBatters[atbat.$.batter] = atbatIndex
                        }
    
                        if ( !allPitchers[atbat.$.pitcher] ){
                            allPitchers[atbat.$.pitcher] = atbatIndex
                        }
    
                        if ( atbat.pitch && atbat.pitch[0].$.pitch_type ) {
                            for ( let pitchIndex in atbat.pitch ) {
                                const pitch = atbat.pitch[pitchIndex]
                                    if ( !bottomPitchesDataPerAtBat[atbat.$.play_guid] ) {
                                        bottomPitchesDataPerAtBat[atbat.$.play_guid] = pitchesTypeModel
                                    }
                                    if ( pitch.$.pitch_type ) {
    
                                        // Average pitch speed
                                        bottomPitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'count']++
                                        bottomPitchesDataPerAtBat[atbat.$.play_guid][pitch.$.pitch_type + 'speedTotal'] += Math.round( parseFloat( pitch.$.start_speed ) )
                                        // Average pitch zone
                                        if ( zonesDictionary[pitch.$.zone] === undefined ) {
                                            zonesDictionary[pitch.$.zone] = 1
                                        } else {
                                            zonesDictionary[pitch.$.zone]++
                                        }
    
                                    }
                            }
                            eventDataSet.push( calculateEventDataSet(
                                inning,
                                true,
                                atbat,
                                topPitchesDataPerAtBat,
                                zonesDictionary
                            ) )
                        }
                    }
                }
            }
        }
        console.log( ' EVENT DATA SET ----------> ', eventDataSet )
    }
    
        console.log( '*** --- Pitchers --- *** ', allPitchers )
        console.log( '*** --- Batters --- *** ', allBatters )
    
        //Save players baseballadvantstats
    
        console.log( '*** ---------------- DONE ---------------*** ' )
}
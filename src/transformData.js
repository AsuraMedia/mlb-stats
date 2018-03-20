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

//libs
import * as Rx from 'rxjs';
import { json2csv } from 'json-2-csv';

import { pitchesTypeModel } from './pitchesTypeModel'
import { calculateEventDataSet } from './calculateEventDataSet'
import { EventRow } from './eventTypes';
import { MlbService } from './mlbService';
import { SavantService } from './savantService';
import { DateType } from './types';

const fs = require( 'file-system' );
const parseString = require( 'xml2js' ).parseString

let eventDataSet: Array<EventRow> = [];
let playersIds: { batterIds: Array<string>, pitcherIds: Array<string> };

export const transformXml = ( date: DateType ) => {

  const savantService = new SavantService( date );
  const datePath = `${date.year}_${date.month}`;
  const xmlFiles = fs.fs.readdirSync( `./xml/${datePath}` ).filter( file => file.indexOf( 'DS' ) === -1 )

  for (let xmlFilesIndex in xmlFiles) {

    let inningsArray: Array<Inning> = [];
    let topPitchesDataPerAtBat = {};
    let bottomPitchesDataPerAtBat = {};

    const xmlPath = xmlFiles[xmlFilesIndex];
    const xml = fs.fs.readFileSync(
      `./xml/${datePath}/${xmlPath.replace("._", "")}`,
      {
        encoding: "utf8"
      }
    );

    parseString(xml, (err, result) => {
      inningsArray = result.game.inning;
    });

    for (let inningsArrayIndex in inningsArray) {
      const inning = inningsArray[inningsArrayIndex];
      
      //top of the inning 
      for (let topIndex in inning.top) {
        if (inning.$.next === "Y") {
          const topHalf = inning.top[topIndex];
          for (let atbatIndex in topHalf.atbat) {
            let zonesDictionary = {};
            const atbat = topHalf.atbat[atbatIndex];

            // Fill players dictionary
            playersIds = savantService.fillPlayersIds( atbat )

            if (atbat.pitch && atbat.pitch[0].$.pitch_type) {
              for (let pitchIndex in atbat.pitch) {
                const pitch = atbat.pitch[pitchIndex];
                if (!topPitchesDataPerAtBat[atbat.$.play_guid]) {
                  topPitchesDataPerAtBat[atbat.$.play_guid] = pitchesTypeModel;
                }
                if (pitch.$.pitch_type) {
                  // Average pitch speed
                  topPitchesDataPerAtBat[atbat.$.play_guid][
                    pitch.$.pitch_type + "count"
                  ]++;
                  topPitchesDataPerAtBat[atbat.$.play_guid][
                    pitch.$.pitch_type + "speedTotal"
                  ] += Math.round(parseFloat(pitch.$.start_speed));
                  // Average pitch zone
                  if (zonesDictionary[pitch.$.zone] === undefined) {
                    zonesDictionary[pitch.$.zone] = 1;
                  } else {
                    zonesDictionary[pitch.$.zone]++;
                  }
                }
              }
              eventDataSet.push(
                calculateEventDataSet(
                  date,
                  inning,
                  false,
                  atbat,
                  topPitchesDataPerAtBat,
                  zonesDictionary
                )
              );
            }
          }
        }
      }

      //bottom of the inning
      for (let bottomIndex in inning.bottom) {
        if (inning.$.next === "Y") {
          const bottomHalf = inning.bottom[bottomIndex];
          for (let atbatIndex in bottomHalf.atbat) {
            let zonesDictionary = {};
            const atbat = bottomHalf.atbat[atbatIndex];

            // Fill players dictionary
            playersIds = savantService.fillPlayersIds( atbat )

            if (atbat.pitch && atbat.pitch[0].$.pitch_type) {
              for (let pitchIndex in atbat.pitch) {
                const pitch = atbat.pitch[pitchIndex];
                if (!bottomPitchesDataPerAtBat[atbat.$.play_guid]) {
                  bottomPitchesDataPerAtBat[
                    atbat.$.play_guid
                  ] = pitchesTypeModel;
                }
                if (pitch.$.pitch_type) {
                  // Average pitch speed
                  bottomPitchesDataPerAtBat[atbat.$.play_guid][
                    pitch.$.pitch_type + "count"
                  ]++;
                  bottomPitchesDataPerAtBat[atbat.$.play_guid][
                    pitch.$.pitch_type + "speedTotal"
                  ] += Math.round(parseFloat(pitch.$.start_speed));
                  // Average pitch zone
                  if (zonesDictionary[pitch.$.zone] === undefined) {
                    zonesDictionary[pitch.$.zone] = 1;
                  } else {
                    zonesDictionary[pitch.$.zone]++;
                  }
                }
              }
              eventDataSet.push(
                calculateEventDataSet(
                  date,
                  inning,
                  true,
                  atbat,
                  bottomPitchesDataPerAtBat,
                  zonesDictionary
                )
              );
            }
          }
        }
      }
    }
    console.log(" EVENT DATA SET ----------> ", eventDataSet);
  }

  console.log( 'COLS --------------------------->', Object.keys( eventDataSet[0] ).length )

  // json2csv(eventDataSet, (err, csv) => {
  //   console.log("CSV ---------------> ", csv);
  //   fs.writeFile(`./${date.year}_${date.month}.csv`, csv, err => {
  //     console.log("Saved file csv ---> ", `./${date.year}_${date.month}_v2.csv`);
  //   });
  // });

  //get player ids and save them
  //savantService.saveFiles( date );

  //get all players savant data
  //savantService.savePlayersZoneData( date ).subscribe()

};
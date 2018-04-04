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
} from "./xmlDataTypes";

import { isEmpty, areEmpty } from './utils'

//libs
import * as Rx from "rxjs";
import { json2csv } from "json-2-csv";

import { pitchesTypeModel } from "./pitchesTypeModel";
import { calculateEventDataSet } from "./calculateEventDataSet";
import { EventRow } from "./eventTypes";
import { MlbService } from "./mlbService";
import { SavantService } from "./savantService";
import { DateType } from "./types";

const fs = require("file-system");
const parseString = require("xml2js").parseString;

let csvDataSet: Array<EventRow> = [];
let eventDataSet: Array<EventRow> = [];
let playersIds: { batterIds: Array<string>, pitcherIds: Array<string> };

let eventsAfterHr = [];
const EVENT_COUNTER_LIMIT = 3;

const mapEventPitch = (event:PitchHeader): PitchHeader => {
  return {
    x: event.x,
    y: event.y,
    zone: event.zone,
    pfx_x: event.pfx_x,
    pfx_z: event.pfx_z,
    end_speed: event.end_speed,
    ax: event.ax,
    ay: event.ay,
    az: event.az,
    break_length: event.break_length,
    break_angle: event.break_angle,
    spin_rate: event.spin_rate
  }
}

export const transformXml = (date: DateType) => {
  const savantService = new SavantService(date);
  const datePath = `${date.year}_${date.month}`;
  const xmlFiles = fs.fs
    .readdirSync(`./xml/${datePath}`)
    .filter(file => file.indexOf("DS") === -1);

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
      inningsArray = err ? [] : result.game.inning
    });

    for (let inningsArrayIndex in inningsArray) {
      const inning = inningsArray[inningsArrayIndex];

      //top of the inning
      for (let topIndex in inning.top) {
        if (inning.$.next === "Y") {
          const topHalf = inning.top[topIndex];

          let wasHomeRun = false;
          let eventCounter = 0;

          for (let atbatIndex in topHalf.atbat) {

            let eventPitch = {};
            let zonesDictionary = {};
            const atbat = topHalf.atbat[atbatIndex];

            if ( atbat.$.event === 'Home Run' ) {
              wasHomeRun = true
            }

            if ( wasHomeRun ) {
              eventCounter++
              if ( eventCounter === EVENT_COUNTER_LIMIT ) {
                eventsAfterHr.push( atbat )
              } else if ( eventCounter > EVENT_COUNTER_LIMIT ) {
                eventCounter = 0
                wasHomeRun = false
              }
            }


                // Fill players dictionary
            playersIds = savantService.fillPlayersIds(atbat, date);

            if (atbat.pitch && atbat.pitch[0].$.pitch_type) {
              for (let pitchIndex in atbat.pitch) {
                const pitch = atbat.pitch[pitchIndex];
                if (!topPitchesDataPerAtBat[atbat.$.play_guid]) {
                  topPitchesDataPerAtBat[atbat.$.play_guid] = pitchesTypeModel;
                }
                if (pitch.$.pitch_type) {
                  eventPitch = mapEventPitch(atbat.pitch[atbat.pitch.length - 1].$)
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

              const keys = Object.keys(eventPitch)

              if (!areEmpty(eventPitch)){
                eventDataSet.push(
                  calculateEventDataSet(
                    date,
                    inning.$.num,
                    inning.$.home_team,
                    false,
                    atbat,
                    topPitchesDataPerAtBat,
                    zonesDictionary,
                    eventPitch
                  )
                );
              }
            }
          }
        }
      }

      //bottom of the inning
      for (let bottomIndex in inning.bottom) {
        if (inning.$.next === "Y") {
          const bottomHalf = inning.bottom[bottomIndex];

          let wasHomeRun = false;
          let eventCounter = 0;
          
          for (let atbatIndex in bottomHalf.atbat) {
            let eventPitch: PitchHeader = {};
            let zonesDictionary = {};
            const atbat = bottomHalf.atbat[atbatIndex];

            if ( atbat.$.event === 'Home Run' ) {
              wasHomeRun = true
            }

            if ( wasHomeRun ) {
              eventCounter++
              if ( eventCounter === EVENT_COUNTER_LIMIT ) {
                eventsAfterHr.push( atbat )
              } else if ( eventCounter > EVENT_COUNTER_LIMIT ) {
                eventCounter = 0
                wasHomeRun = false
              }
            }

            // Fill players dictionary
            playersIds = savantService.fillPlayersIds(atbat, date);

            if (atbat.pitch && atbat.pitch[0].$.pitch_type) {
              for (let pitchIndex in atbat.pitch) {
                const pitch = atbat.pitch[pitchIndex];
                if (!bottomPitchesDataPerAtBat[atbat.$.play_guid]) {
                  bottomPitchesDataPerAtBat[
                    atbat.$.play_guid
                  ] = pitchesTypeModel;
                }
                if (pitch.$.pitch_type) {
                  eventPitch = mapEventPitch(atbat.pitch[atbat.pitch.length - 1].$)
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

              if ( !areEmpty(eventPitch) ){
                eventDataSet.push(
                  calculateEventDataSet(
                    date,
                    inning.$.num,
                    inning.$.away_team,
                    true,
                    atbat,
                    bottomPitchesDataPerAtBat,
                    zonesDictionary,
                    eventPitch
                  )
                );
              }
            }
          }
        }
      }
    }
    console.log(" EVENT DATA SET ----------> ", eventDataSet.length);
  }

  const fileName = `${date.year}_${date.month}_eventsAfterHr.json`;
    fs.writeFile(`./${fileName}`, JSON.stringify(eventsAfterHr), err => {
      console.log("Saved file json ---> ", `./${fileName}`);
    });

  // const fileName = `${date.year}_${date.month}_2.2.json`;
  //   fs.writeFile(`./${fileName}`, JSON.stringify(eventDataSet), err => {
  //     console.log("Saved file json ---> ", `./${fileName}`);
  //   });
};

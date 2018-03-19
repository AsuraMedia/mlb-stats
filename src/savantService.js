import { HttpClient } from "./httpClient";
import { config, endpoints } from "./mlbApiConfig";
import { AtBatHeader, AtBat } from "./xmlDataTypes";
import { DateType } from "./types";
import * as _ from 'lodash'

//libs
import * as Rx from 'rxjs';
import { MlbService } from "./mlbService";

const fs = require( 'file-system' );
const mlbService = new MlbService();

export class SavantService {
  constructor() {
    this.http = new HttpClient(config);
  }

  getPlayerIds ( date: DateType ) {
    let json = {};
    try {
        json = fs.fs.readFileSync( `./json/${date.year}/playerIds.json`, {
            encoding: "utf8" 
        });
    } catch (err) {
        return {
            pitcherIds: {},
            batterIds: {}
        }
    }
    return JSON.parse(json)
  }

  fillPlayersIds( atbat: AtBat ) {

    //check for existing ids
    if (!this.playerIds) {
        this.playerIds = this.getPlayerIds();
    }
    
    //fill player ids
    if (!this.playerIds.batterIds[atbat.$.batter]) {
        this.playerIds.batterIds[atbat.$.batter] = 0;
    }
    
    if (!this.playerIds.pitcherIds[atbat.$.pitcher]) {
        this.playerIds.pitcherIds[atbat.$.pitcher] = 0;
    }
    
    //return player ids
    return {
        batterIds: Object.keys(this.playerIds.batterIds),
        pitcherIds: Object.keys(this.playerIds.pitcherIds)
    }

  }

  saveFiles ( date ) {
    fs.writeFileSync(`./json/${date.year}/playerIds.json`, JSON.stringify(this.playerIds));
    console.log("Saved playerIds json file ---> ", this.playerIds );
  }

  savePlayersZoneData ( date: DateType ) {

    const pitcherIds = Object.keys(this.playerIds.pitcherIds)
    const batterIds = Object.keys(this.playerIds.batterIds)
    const allPlayers = pitcherIds.concat(batterIds)

    const existingIds = fs.fs.readdirSync( `./json/${date.year}` )
        .filter( x => x.indexOf('playerIds.json') === -1 )
        .map( x => x.replace('_zone.json', '') )

    return Rx.Observable.from(allPlayers)
        .zip(Rx.Observable.interval(5000), (pitcherId: string) => {
            return { playerId: pitcherId, playerType: "pitcher", season: date.year };
        })
        .map((playerInfo: any) => {
            return Rx.Observable.fromPromise(
                mlbService
                .getAdvantZoneStats(playerInfo)
                .then(result => {
                    fs.writeFile(
                        `./json/${date.year}/${playerInfo.playerId}_zone.json`, 
                        JSON.stringify(result.data), 
                        err => {
                            console.log("Saved playerIds json file ---> ", this.playerIds );
                        }
                    );
                    console.log("SAVED PLAYER ZONE DATA -----> ", result.data);
                }));
        }).concatAll();
  }
  
}

export default new SavantService();

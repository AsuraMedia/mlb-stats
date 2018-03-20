import { HttpClient } from "./httpClient";
import { config, endpoints } from "./mlbApiConfig";
import { AtBatHeader, AtBat } from "./xmlDataTypes";
import { DateType } from "./types";
import * as _ from 'lodash'

//libs
import * as Rx from 'rxjs';
import { MlbService } from "./mlbService";
import { mapObjToArray } from "./utils";

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
        this.playerIds.batterIds[atbat.$.batter] = {
            id: atbat.$.batter,
            playerType: 'batter'
        }
    }
    
    if (!this.playerIds.pitcherIds[atbat.$.pitcher]) {
        this.playerIds.pitcherIds[atbat.$.pitcher] = {
            id: atbat.$.pitcher,
            playerType: 'pitcher'
        }
    }
    
    //return player ids
    return this.playerIds

  }

  saveFiles ( date ) {
    fs.writeFileSync(`./json/${date.year}/playerIds.json`, JSON.stringify(this.playerIds));
    console.log("Saved playerIds json file ---> ", this.playerIds );
  }

  savePlayersZoneData ( date: DateType ) {

    const allPlayers = mapObjToArray( this.playerIds.pitcherIds )
    const existingIds = 
        fs.fs.readdirSync( `./json/${date.year}` )
            .filter( x => x.indexOf('playerIds.json') === -1 )
            .map( x => x.replace('_zone.json', '') )

    return Rx.Observable.from(allPlayers)
        .zip(Rx.Observable.interval(1000), ( item: { id: string, value: { id: string, playerType: string } }) => {
            return { playerId: item.id, playerType: item.value.playerType, season: date.year };
        })
        .map((playerInfo) => {
            return Rx.Observable.fromPromise(
                mlbService
                .getAdvantPitchBreakdownStats(playerInfo)
                .then(result => {
                    fs.writeFile(
                        `./json/${playerInfo.season}/${playerInfo.playerId}_${playerInfo.playerType}_pitchbreakdown.json`, 
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

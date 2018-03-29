import { HttpClient } from "./httpClient";
import { config, endpoints } from "./mlbApiConfig";
import { AtBatHeader, AtBat } from "./xmlDataTypes";
import { DateType, PlayerItemType } from "./types";
import * as _ from 'lodash'

//libs
import * as Rx from 'rxjs';
import { MlbService } from "./mlbService";
import { mapObjToArray } from "./utils";
import { retry } from "rxjs/operators";

const fs = require( 'file-system' );
const mlbService = new MlbService();

export class SavantService {
  constructor() {
    this.http = new HttpClient(config);
    this.playerIds = {
        pitcherIds: {},
        batterIds: {}
    }
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

  fillPlayersIds( atbat: AtBat, date: DateType ) {
    
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

    const batters = mapObjToArray( this.playerIds.batterIds );
    const pitchers = mapObjToArray( this.playerIds.pitcherIds );

    const allPlayers: PlayerItemType[] = pitchers.concat( batters );

    const existingPlayers: PlayerItemType[] = 
        fs.fs.readdirSync( `./json/${date.year}` )
            .filter( x => x.indexOf('playerIds.json') === -1 )
            .map( ( id: string ) => {

                const splittedId = id.split( '_' )

                if ( splittedId.length === 3 ) {
                    return {
                        id: splittedId[0],
                        value: { id: splittedId[0], playerType: splittedId[1] }
                    }
                } else if ( splittedId.length === 4 ) {
                    return {
                        id: splittedId[0],
                        value: { id: splittedId[0], playerType: splittedId[2] }
                    }
                }

            } )

    const remainingPlayers = _.differenceBy( allPlayers, _.uniqBy(existingPlayers, 'id'), 'id' );

    return Rx.Observable.from( remainingPlayers )
        .zip(Rx.Observable.interval(1000), ( item: PlayerItemType ) => {
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
                    console.log("SAVED PLAYER PITCH DATA -----> ", result.data);
                    return playerInfo
                }))
                .map(() => {
                    return Rx.Observable.fromPromise(
                        mlbService
                        .getAdvantZoneStats(playerInfo)
                        .then(result => {
                            fs.writeFile(
                                `./json/${playerInfo.season}/${playerInfo.playerId}_${playerInfo.playerType}_batter_zone.json`, 
                                JSON.stringify(result.data), 
                                err => {
                                    console.log("Saved playerIds json file ---> ", this.playerIds );
                                }
                            );
                            console.log("SAVED PLAYER ZONE DATA -----> ", result.data);
                        }));
                })
        })
        .concatAll();
  }
  
}

export default new SavantService();

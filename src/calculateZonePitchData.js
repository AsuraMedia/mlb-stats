//libs
import * as _ from 'lodash'
const fs = require( 'file-system' );

//types
import { DateType, ZoneData } from "./types";

let globalZoneData: Array<ZoneData> = [];
const zones = ['1','2','3','4','5','6','7','8','9','11','12','13','14'];

const getZoneMetric = ( zone: string, name: string ) => {
    return globalZoneData.length ? 
    _.first( globalZoneData.filter(z => z.zone == zone) )[name] : 0
}

const getZoneData = ( playerType: string ) => {

    let dynamicObject = {};
    const pType = _.startCase( playerType );

    zones.forEach( ( zone ) => {
        dynamicObject[pType + "Zone" + zone + "Pitches"] = getZoneMetric( zone, 'pitches' );
        dynamicObject[pType + "Zone" + zone + "Pa"] = getZoneMetric( zone, 'pa' );
        dynamicObject[pType + "Zone" + zone + "Slg"] = getZoneMetric( zone, 'slg' );
        dynamicObject[pType + "Zone" + zone + "Hits"] = getZoneMetric( zone, 'hits' );
        dynamicObject[pType + "Zone" + zone + "Whiffs"] = getZoneMetric( zone, 'whiffs' );
        dynamicObject[pType + "Zone" + zone + "So"] = getZoneMetric( zone, 'so' );
        dynamicObject[pType + "Zone" + zone + "Exit_velocity"] = getZoneMetric( zone, 'exit_velocity' );
        dynamicObject[pType + "Zone" + zone + "Spin_rate"] = getZoneMetric( zone, 'spin_rate' );
        dynamicObject[pType + "Zone" + zone + "Release_pos_x"] = getZoneMetric( zone, 'release_pos_x' );
        dynamicObject[pType + "Zone" + zone + "Release_pos_y"] = getZoneMetric( zone, 'release_pos_y' );
        dynamicObject[pType + "Zone" + zone + "Release_pos_z"] = getZoneMetric( zone, 'release_pos_z' );
        dynamicObject[pType + "Zone" + zone + "Pfx_x"] = getZoneMetric( zone, 'pfx_x' );
        dynamicObject[pType + "Zone" + zone + "Pfx_z"] = getZoneMetric( zone, 'pfx_z' );
    } )

    return dynamicObject;
}

const jsonSerializeData = ( date, playerId: string, playerType: string ): Array<ZoneData>  => {
    let json = {};
    try {
        json = fs.fs.readFileSync( `./json/${date.year}/${playerId}_${playerType}_zone.json`, {
            encoding: "utf8" 
        });
    } catch ( err ) {
        json = JSON.stringify([])
    }
    return JSON.parse( json );
}

export const calculateZoneData = ( date: DateType, playerId: string, playerType: string ) => {
    globalZoneData = jsonSerializeData( date, playerId, playerType );
    return getZoneData( playerType )
}
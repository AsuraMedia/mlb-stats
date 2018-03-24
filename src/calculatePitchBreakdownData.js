//libs
import * as _ from 'lodash'
const fs = require( 'file-system' );

//types
import { DateType, PitchBreakdownData } from "./types";

let globalPitchData = {};
const pitchTypes = ['FF','FT','FA','FS','FO','FC','CH','CU','SL','KC','KN','SC','SI'];

const getPitchMetric = ( pitchType: string, name: string, id: string ) => {
    const data = _.first( globalPitchData[id].filter( data => data.pitch_type == pitchType) )
    if ( !data ) {
        return 0
    }
    return data[name]
}

const getPitchData = ( playerType: string, id: string ) => {

    let dynamicObject = {};
    const pType = _.startCase( playerType );

    pitchTypes.forEach( ( type ) => {
        dynamicObject[pType + "PitchBreakdown" + type + "Pitches"] = getPitchMetric( type, 'pitches', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Pa"] = getPitchMetric( type, 'pa', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Ba"] = getPitchMetric( type, 'ba', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Slg"] = getPitchMetric( type, 'slg', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Hits"] = getPitchMetric( type, 'hits', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Whiffs"] = getPitchMetric( type, 'whiffs', id );
        dynamicObject[pType + "PitchBreakdown" + type + "So"] = getPitchMetric( type, 'so', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Exit_velocity"] = getPitchMetric( type, 'exit_velocity', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Spin_rate"] = getPitchMetric( type, 'spin_rate', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Release_pos_x"] = getPitchMetric( type, 'release_pos_x', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Release_pos_y"] = getPitchMetric( type, 'release_pos_y', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Release_pos_z"] = getPitchMetric( type, 'release_pos_z', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Pfx_x"] = getPitchMetric( type, 'pfx_x', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Pfx_z"] = getPitchMetric( type, 'pfx_z', id );
    } )

    return dynamicObject;
}

const jsonSerializeData = ( date, playerId: string, playerType: string ): Array<PitchBreakdownData>  => {
    let json = {};
    if ( globalPitchData.length ) {
        return globalPitchData
    }
    try {
        json = fs.fs.readFileSync( `./json/${date.year}/${playerId}_${playerType}_pitchbreakdown.json`, {
            encoding: "utf8" 
        });
    } catch ( err ) {
        json = JSON.stringify([])
    }
    return JSON.parse( json );
}

export const calculatePitchData = ( date: DateType, playerId: string, playerType: string ) => {
    if ( !globalPitchData[playerId] ) {
        globalPitchData[playerId] = jsonSerializeData( date, playerId, playerType );
    }
    return getPitchData( playerType, playerId )
}
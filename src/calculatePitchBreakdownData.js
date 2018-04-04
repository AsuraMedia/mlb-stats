import { isEmpty } from './utils'

//libs
import * as _ from 'lodash'
const fs = require( 'file-system' );

//types
import { DateType, PitchBreakdownData } from "./types";

let globalPitchData = {};
const pitchTypes = ['FF','FT','FA','FS','FO','FC','CH','CU','SL','KC','KN','SC','SI'];

const getPitchMetric = ( pitchType: string, name: string, id: string ) => {
    if (!globalPitchData[id].filter){
        return 0
    }
    const data = _.first( globalPitchData[id].filter( data => data.pitch_type == pitchType) )
    if ( !data ) {
        return 0
    }
    return !isEmpty(data[name]) ? data[name] : 0
}

const getPitchData = ( playerType: string, id: string ) => {

    let dynamicObject = {};
    const pType = _.startCase( playerType );

    pitchTypes.forEach( ( type ) => {
        dynamicObject[pType + "PitchBreakdown" + type + "Ba"] = getPitchMetric( type, 'ba', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Pitches"] = getPitchMetric( type, 'pitches', id );
        dynamicObject[pType + "PitchBreakdown" + type + "LaunchAngle"] = getPitchMetric( type, 'launch_angle', id );
        dynamicObject[pType + "PitchBreakdown" + type + "Exit_velocity"] = getPitchMetric( type, 'exit_velocity', id );
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
    return json == 'undefined' ? JSON.stringify([]) : JSON.parse( json )
}

export const calculatePitchData = ( date: DateType, playerId: string, playerType: string ) => {
    if ( !globalPitchData[playerId] ) {
        globalPitchData[playerId] = jsonSerializeData( date, playerId, playerType );
    }
    return getPitchData( playerType, playerId )
}
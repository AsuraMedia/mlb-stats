import * as _ from 'lodash';
import { PitchHeader } from "./xmlDataTypes";

export const mapObjToArray = ( object: Object<T>, mapToObject: boolen ): Array<T> => {
    return Object.keys( object )
        .map(( key ) => {
            return { id: key, value: object[key] }
        })
}

export const isEmpty = (val) => {
    if ( val && typeof val == "object" ) {
        return Object.keys(val).length === 0
    }
    return val === "" || val === undefined 
        || val === null || val === "undefined" || val === "null"
}

export const areEmpty = (object) => {
    const keys = _.pickBy(object, _.identity);
    return Object.keys(keys).length < 12
}
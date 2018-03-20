export const mapObjToArray = ( object: Object<T> ): Array<T> => {
    return Object.keys( object )
        .map(( key ) => {
            return { id: key, value: object[key] }
        })
}
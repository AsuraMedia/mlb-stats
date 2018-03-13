import { MlbService } from './mlbService';
import * as Rx from 'rxjs';
import pick from 'lodash.pick';

export class MlbMapReducer {

    constructor() {
        this.mlbService = new MlbService()
    }

    mapSchedule( date ) {
        return this.mlbService
            .getSchedule(date)
            .catch(err => err)
            .then(( response ) => {
                const gamesArray = response.data.data.games.game
                if ( !gamesArray || !gamesArray.length ) {
                    return []
                }
                return gamesArray.map(( game ) => {
                    return {
                        id: game.game_pk,
                        path: `${game.game_data_directory}`
                    }
                })
            })
    }

}

export default new MlbMapReducer()
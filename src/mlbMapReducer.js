import { MlbService } from './mlbService';
import * as Rx from 'rxjs';
import pick from 'lodash.pick';

export class MlbMapReducer {

    constructor() {
        this.mlbService = new MlbService()
    }

    mapSchedule() {
        const date = { year: '2017', month: '05', day: '13' }
        return this.mlbService
            .getSchedule(date)
            .catch(err => err)
            .then(({ data }) => {
                
                const gamesArray = data.games.game

                Rx.Observable.from(gamesArray).zip(
                    Rx.Observable.interval(1000), (game) => {

                        const gameData = pick( game, [
                            'game_pk',
                            'game_data_directory'
                         ] )
                    
                        console.log( gameData )
                        return gameData
                    })
                    .subscribe()

            })
    }

}

export default new MlbMapReducer()
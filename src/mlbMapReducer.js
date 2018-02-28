import { MlbService } from './mlbService';

import * as Rx from 'rxjs'

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
                        console.log('GAME------------------------------>', game)
                        return game
                    })
                    .subscribe()

            })
    }

}

export default new MlbMapReducer()
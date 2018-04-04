import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'
import mlbMapReducer, { MlbMapReducer } from './mlbMapReducer';
import { MlbScheduleTask } from './mlbScheduleTask';
import { transformXml } from './transformData'
import { DateType } from './types';
import { calculateZoneData } from './calculateZonePitchData';
import { json2csv } from "json-2-csv";
import * as _ from 'lodash';
import { HttpClient } from './httpClient'

const fs = require("file-system");
const bsplit = require('buffer-split');
    
    // Read xml files and transform the data
    const date: DateType = { year: "2016", month: "04", day: "01" };
    
    //const mlbScheduleTask = new MlbScheduleTask();
    //mlbScheduleTask.getByDate( date );

    //transformXml( date );

    function subStrAfterChars(str, ch, side) {
        let pos = str.indexOf(ch) + 1
        return side === "a"? str.slice(0,pos) : str.slice(pos);
    }

    const http = new HttpClient( 'https://baseballsavant.mlb.com' );
    http.get( 'https://baseballsavant.mlb.com/daily_matchups?date=2018-04-02' )
        .then(result => {
            const str = result.data;
            const json: string = subStrAfterChars( str, `[{`, 'b' )
            const lastIndex = json.lastIndexOf(`}]`)
            const jsonResult = json.substring(0, lastIndex)
            const finalJson = `[${jsonResult}}]`
            console.log(finalJson)
        })

    


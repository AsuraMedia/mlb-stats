import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'
import mlbMapReducer, { MlbMapReducer } from './mlbMapReducer';
import { MlbScheduleTask } from './mlbScheduleTask';
import { transformXml } from './transformData'
import { DateType } from './types';
import { calculateZoneData } from './calculateZonePitchData';
import { json2csv } from "json-2-csv";
import * as _ from 'lodash';

const fs = require("file-system");
const bsplit = require('buffer-split');
    
    // Read xml files and transform the data
    const date: DateType = { year: "2016", month: "09", day: "01" };
    
    //const mlbScheduleTask = new MlbScheduleTask();
    //mlbScheduleTask.getByDate( date );

    transformXml( date );

    


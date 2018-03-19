import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'
import mlbMapReducer, { MlbMapReducer } from './mlbMapReducer';
import { MlbScheduleTask } from './mlbScheduleTask';
import { transformXml } from './transformData'
import { DateType } from './types';
    
    // Read xml files and transform the data
    const date: DateType = { year: "2016", month: "04", day: "01" };
    transformXml( date );



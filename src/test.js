import { MlbService } from './mlbService'
import { XmlStatsService } from './xmlStatsService'
import mlbMapReducer, { MlbMapReducer } from './mlbMapReducer';
import { MlbScheduleTask } from './mlbScheduleTask';

import { transformXml } from './transformData'
    
    // Read xml files and 
    // transform the data
    transformXml();

    // json2csv(eventDataSet, (err, csv) => {
    //   console.log("CSV ---------------> ", csv);
    //   fs.writeFile(`./${date.year}_${date.month}.csv`, csv, err => {
    //     console.log("Saved file csv ---> ", `./${date.year}_${date.month}.csv`);
    //   });
    // });



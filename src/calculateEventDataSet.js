import { calculateZoneData } from './calculateZonePitchData'
import { AtBat } from './xmlDataTypes';
import { DateType } from './types';
import * as _ from 'lodash';

const normalizeBatterHeight = ( height: string ) => {
    const hList = height.split('-')
    const feet = parseInt(hList[0])
    const inches = parseInt(hList[1])
    const totalInches = ( feet * 12 ) + inches
    return totalInches / 100
}

const calculateAvgPitchVelocity = ( pitchType, pitchesDataPerAtBat ) => {
    let count = 0;
    let totalSum = 0;
    for ( let key in pitchesDataPerAtBat ) {
        count += pitchesDataPerAtBat[key][pitchType + 'count'];
        totalSum += pitchesDataPerAtBat[key][pitchType + 'speedTotal'];
    }
    return count === 0 ? parseInt(0).toFixed(2) : parseFloat(totalSum / count).toFixed(2)
}

const calculateAvgPitchZone = ( zonesDictionary ) => {
    let maxValue = { key: 0, value: 0 }
    for ( let key in zonesDictionary ) {
        if ( zonesDictionary[key] > maxValue.value ) {
            maxValue = {
                key: key,
                value: zonesDictionary[key]
            }
        }
    }
    return maxValue.key
}

export const calculateEventDataSet = ( date: DateType,
    inning, 
    isHome,
    atbat: AtBat, 
    pitchesDataPerAtBat, 
    zonesDictionary 
) => {

    const firstSet = {
        inningNo : inning.$.num,
        ana : inning.$.home_team === 'ana' ? 1 : 0,
        lan : inning.$.home_team === 'lan' ? 1 : 0,
        bos : inning.$.home_team === 'bos' ? 1 : 0,
        tor : inning.$.home_team === 'tor' ? 1 : 0,
        cha : inning.$.home_team === 'cha' ? 1 : 0,
        sdn : inning.$.home_team === 'sdn' ? 1 : 0,
        cle : inning.$.home_team === 'cle' ? 1 : 0,
        tex : inning.$.home_team === 'tex' ? 1 : 0,
        col : inning.$.home_team === 'col' ? 1 : 0,
        sea : inning.$.home_team === 'sea' ? 1 : 0,
        kca : inning.$.home_team === 'kca' ? 1 : 0,
        ari : inning.$.home_team === 'ari' ? 1 : 0,
        mil : inning.$.home_team === 'mil' ? 1 : 0,
        hou : inning.$.home_team === 'hou' ? 1 : 0,
        nya : inning.$.home_team === 'nya' ? 1 : 0,
        mia : inning.$.home_team === 'mia' ? 1 : 0,
        nyn : inning.$.home_team === 'nyn' ? 1 : 0,
        chn : inning.$.home_team === 'chn' ? 1 : 0,
        oak : inning.$.home_team === 'oak' ? 1 : 0,
        sfn : inning.$.home_team === 'sfn' ? 1 : 0,
        tba : inning.$.home_team === 'tba' ? 1 : 0,
        atl : inning.$.home_team === 'atl' ? 1 : 0,
        min : inning.$.home_team === 'min' ? 1 : 0,
        was : inning.$.home_team === 'was' ? 1 : 0,
        phi : inning.$.home_team === 'phi' ? 1 : 0,
        cin : inning.$.home_team === 'cin' ? 1 : 0,
        det : inning.$.home_team === 'det' ? 1 : 0,
        pit : inning.$.home_team === 'pit' ? 1 : 0,
        bal : inning.$.home_team === 'bal' ? 1 : 0,
        sln : inning.$.home_team === 'sln' ? 1 : 0,
        isHome : isHome,
        batterHeight : normalizeBatterHeight( atbat.$.b_height ),
        batterHand : atbat.$.stand === 'R' ? 1 : 0,
        pitcherHand : atbat.$.p_throws === 'R' ? 1 : 0,
        homeTeamRuns : parseInt(atbat.$.home_team_runs),
        awayTeamRuns : parseInt(atbat.$.away_team_runs),
        runnersOn : atbat.runner ? atbat.runner.length : 0,
        avgFFspeed : calculateAvgPitchVelocity( 'FF', pitchesDataPerAtBat ),
        avgFTspeed : calculateAvgPitchVelocity( 'FT', pitchesDataPerAtBat ),
        avgFAspeed : calculateAvgPitchVelocity( 'FA', pitchesDataPerAtBat ),
        avgFSspeed : calculateAvgPitchVelocity( 'FS', pitchesDataPerAtBat ),
        avgFOspeed : calculateAvgPitchVelocity( 'FO', pitchesDataPerAtBat ),
        avgFCspeed : calculateAvgPitchVelocity( 'FC', pitchesDataPerAtBat ),
        avgCHspeed : calculateAvgPitchVelocity( 'CH', pitchesDataPerAtBat ),
        avgCUspeed : calculateAvgPitchVelocity( 'CU', pitchesDataPerAtBat ),
        avgSLspeed : calculateAvgPitchVelocity( 'SL', pitchesDataPerAtBat ),
        avgKCspeed : calculateAvgPitchVelocity( 'KC', pitchesDataPerAtBat ),
        avgKNspeed : calculateAvgPitchVelocity( 'KN', pitchesDataPerAtBat ),
        avgSCspeed : calculateAvgPitchVelocity( 'SC', pitchesDataPerAtBat ),
        avgSIspeed : calculateAvgPitchVelocity( 'SI', pitchesDataPerAtBat ),
        avgZone : calculateAvgPitchZone( zonesDictionary ),
        Lineout : atbat.$.event === 'Lineout' ? 1 : 0,
        Single : atbat.$.event === 'Single' ? 1 : 0,
        Double : atbat.$.event === 'Double' ? 1 : 0,
        Triple : atbat.$.event === 'Triple' ? 1 : 0,
        Flyout : atbat.$.event === 'Flyout' ? 1 : 0,
        Single : atbat.$.event === 'Single' ? 1 : 0,
        HomeRun : atbat.$.event === 'Home Run' ? 1 : 0,
        Strikeout : atbat.$.event === 'Strikeout' ? 1 : 0,
        Groundout : atbat.$.event === 'Groundout' ? 1 : 0,
        GroundedIntoDP : atbat.$.event === 'Grounded Into DP' ? 1 : 0,
        HitByPitch : atbat.$.event === 'Hit By Pitch' ? 1 : 0,
        SacFly : atbat.$.event === 'Sac Fly' ? 1 : 0,
        Walk : atbat.$.event === 'Walk' ? 1 : 0,
        Forceout : atbat.$.event === 'Forceout' ? 1 : 0,
        SacBunt : atbat.$.event === 'Sac Bunt' ? 1 : 0,
        PopOut : atbat.$.event === 'Pop Out' ? 1 : 0,
        FieldError : atbat.$.event === 'Field Error' ? 1 : 0,
        RunnerOut : atbat.$.event === 'Runner Out' ? 1 : 0,
        IntentWalk : atbat.$.event === 'Intent Walk' ? 1 : 0,
        DoublePlay : atbat.$.event === 'Double Play' ? 1 : 0,
        FieldersChoiceOut : atbat.$.event === 'Fielders Choice Out' ? 1 : 0
    }

    const secondSet = calculateZoneData( date, atbat.$.pitcher, 'pitcher' );
    const thirdSet = calculateZoneData( date, atbat.$.batter, 'batter' );
    const finalResultSet = _.assign( new Object(), firstSet, secondSet, thirdSet );
    
    return finalResultSet;
}
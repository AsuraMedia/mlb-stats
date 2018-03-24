import { AtBat, PitchHeader } from './xmlDataTypes';
import { DateType } from './types';
import * as _ from 'lodash';
import { calculateZoneData } from './calculateZonePitchData';
import { calculatePitchData } from './calculatePitchBreakdownData';

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
    inningNo,
    team,
    isHome,
    atbat: AtBat, 
    pitchesDataPerAtBat, 
    zonesDictionary,
    eventPitch: PitchHeader
) => {

    const firstSet = {
        inningNo : inningNo,
        ana : team === 'ana' ? 1 : 0,
        lan : team === 'lan' ? 1 : 0,
        bos : team === 'bos' ? 1 : 0,
        tor : team === 'tor' ? 1 : 0,
        cha : team === 'cha' ? 1 : 0,
        sdn : team === 'sdn' ? 1 : 0,
        cle : team === 'cle' ? 1 : 0,
        tex : team === 'tex' ? 1 : 0,
        col : team === 'col' ? 1 : 0,
        sea : team === 'sea' ? 1 : 0,
        kca : team === 'kca' ? 1 : 0,
        ari : team === 'ari' ? 1 : 0,
        mil : team === 'mil' ? 1 : 0,
        hou : team === 'hou' ? 1 : 0,
        nya : team === 'nya' ? 1 : 0,
        mia : team === 'mia' ? 1 : 0,
        nyn : team === 'nyn' ? 1 : 0,
        chn : team === 'chn' ? 1 : 0,
        oak : team === 'oak' ? 1 : 0,
        sfn : team === 'sfn' ? 1 : 0,
        tba : team === 'tba' ? 1 : 0,
        atl : team === 'atl' ? 1 : 0,
        min : team === 'min' ? 1 : 0,
        was : team === 'was' ? 1 : 0,
        phi : team === 'phi' ? 1 : 0,
        cin : team === 'cin' ? 1 : 0,
        det : team === 'det' ? 1 : 0,
        pit : team === 'pit' ? 1 : 0,
        bal : team === 'bal' ? 1 : 0,
        sln : team === 'sln' ? 1 : 0,
        isHome : isHome,
        batterHeight : normalizeBatterHeight( atbat.$.b_height ),
        batterHand : atbat.$.stand === 'R' ? 1 : 0,
        pitcherHand : atbat.$.p_throws === 'R' ? 1 : 0,
        homeTeamRuns : parseInt(atbat.$.home_team_runs),
        awayTeamRuns : parseInt(atbat.$.away_team_runs),
        runnersOn : atbat.runner ? atbat.runner.length : 0,
        balls: atbat.$.b,
        strikes: atbat.$.s,
        outs: atbat.$.o,
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
        eventZone : eventPitch.zone,
        eventPfxX : eventPitch.pfx_x,
        eventPfxZ : eventPitch.pfx_z,
        eventEndSpeed : eventPitch.end_speed,
        eventAx : eventPitch.ax,
        eventAy : eventPitch.ay,
        eventAz : eventPitch.az,
        eventBreakLength : eventPitch.break_length,
        eventBreakAngle : eventPitch.break_angle,
        eventSpinRate : eventPitch.spin_rate,
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

    // pitch zone data set
    const secondSet = calculateZoneData( date, atbat.$.pitcher, 'pitcher' );
    const thirdSet = calculateZoneData( date, atbat.$.batter, 'batter' );

    // pitch breakdown data set
    const fourthSet = calculatePitchData( date, atbat.$.pitcher, 'pitcher' );
    const fifthSet = calculatePitchData( date, atbat.$.batter, 'batter' );

    // combine all data set props
    const finalResultSet = _.assign( new Object(), 
        firstSet, 
        secondSet, 
        thirdSet,
        fourthSet,
        fifthSet 
    );
    
    return finalResultSet;
}
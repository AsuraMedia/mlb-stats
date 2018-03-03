export const config = {
    baseURL: `http://gd.mlb.com`,
    lookUpBaseUrl: 'http://lookup-service-prod.mlb.com/json/named.sport_hitting_game_log_composed.bam?game_type=%27R%27&league_list_id=%27mlb_hist%27'
}

export const endpoints = {
    gameLogsUrl: (playerId, season) => {
        return `${config.lookUpBaseUrl}&player_id=${playerId}&season=${season}&sit_code=%271%27`
    },
    scheduleUrl: ({ year, month, day }) => {
        return `${config.baseURL}/components/game/mlb/year_${year}/month_${month}/day_${day}/master_scoreboard.json`
    },
    xmlUrl: ( xmlPath ) => {
        return `${config.baseURL}${xmlPath}/inning/inning_all.xml`
    }
}
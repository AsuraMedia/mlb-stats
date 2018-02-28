export const config = {
    baseURL: `http://gd.mlb.com/components/game/mlb`,
    lookUpBaseUrl: 'http://lookup-service-prod.mlb.com/json/named.sport_hitting_game_log_composed.bam?game_type=%27R%27&league_list_id=%27mlb_hist%27'
}

export const endpoints = {
    gameLogsUrl: (playerId, season) => {
        return `${config.lookUpBaseUrl}&player_id=${playerId}&season=${season}&sit_code=%271%27`
    },
    scheduleUrl: ({ year, month, day }) => {
        return `${config.baseURL}/year_${year}/month_${month}/day_${day}/master_scoreboard.json`
    }
}
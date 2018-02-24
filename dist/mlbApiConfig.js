'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = exports.config = {
    baseURL: 'http://lookup-service-prod.mlb.com/json/named.sport_hitting_game_log_composed.bam?game_type=%27R%27&league_list_id=%27mlb_hist%27'
};

var endpoints = exports.endpoints = {
    gameLogsUrl: function gameLogsUrl(playerId, season) {
        return config.baseURL + '&player_id=' + playerId + '&season=' + season + '&sit_code=%271%27';
    }
};
//# sourceMappingURL=mlbApiConfig.js.map
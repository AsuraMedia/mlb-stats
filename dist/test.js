'use strict';

var _mlbService = require('./mlbService');

var _xmlStatsService = require('./xmlStatsService');

var mlbService = new _mlbService.MlbService();
mlbService.getGameLogs({ playerId: 514888, season: 2017 }).then(function (res) {
    console.log('GAME LOGS ------>', JSON.stringify(res));
});

var xmlStats = new _xmlStatsService.XmlStatsService();
xmlStats.getEvents(20130531).then(function (res) {
    console.log('EVENTS -------> ', JSON.stringify(res));
});
//# sourceMappingURL=test.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = exports.config = {
    baseURL: 'https://erikberg.com',
    apiToken: '895aca12-fa39-4870-9c26-3fdfc3f8d6ba',
    timeout: 2000
};

var endpoints = exports.endpoints = {
    eventsUrl: function eventsUrl(date, sport) {
        return config.baseURL + '/events.json?date=' + date + '&sport=' + sport;
    }
};
//# sourceMappingURL=xmlStatsApiConfig.js.map
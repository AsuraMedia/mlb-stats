'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.XmlStatsService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpClient = require('./httpClient');

var _xmlStatsApiConfig = require('./xmlStatsApiConfig');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XmlStatsService = exports.XmlStatsService = function () {
    function XmlStatsService() {
        _classCallCheck(this, XmlStatsService);

        this.http = new _httpClient.HttpClient(_xmlStatsApiConfig.config);
    }

    _createClass(XmlStatsService, [{
        key: 'getEvents',
        value: function getEvents(date) {
            var eventsUrl = _xmlStatsApiConfig.endpoints.eventsUrl(date, 'mlb');
            return this.http.get(eventsUrl);
        }
    }]);

    return XmlStatsService;
}();

exports.default = new XmlStatsService();
//# sourceMappingURL=xmlStatsService.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MlbService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpClient = require('./httpClient');

var _mlbApiConfig = require('./mlbApiConfig');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MlbService = exports.MlbService = function () {
    function MlbService() {
        _classCallCheck(this, MlbService);

        this.http = new _httpClient.HttpClient(_mlbApiConfig.config);
    }

    _createClass(MlbService, [{
        key: 'getGameLogs',
        value: function getGameLogs(_ref) {
            var playerId = _ref.playerId,
                season = _ref.season;

            var gameLogsUrl = _mlbApiConfig.endpoints.gameLogsUrl(playerId, season);
            return this.http.get(gameLogsUrl);
        }
    }]);

    return MlbService;
}();

exports.default = new MlbService();
//# sourceMappingURL=mlbService.js.map
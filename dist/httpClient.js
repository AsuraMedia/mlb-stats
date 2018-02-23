'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HttpClient = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _axiosBase = require('./axiosBase');

var _xmlStatsApiConfig = require('./xmlStatsApiConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpClient = exports.HttpClient = function (_AxiosBase) {
    _inherits(HttpClient, _AxiosBase);

    function HttpClient() {
        _classCallCheck(this, HttpClient);

        var _this = _possibleConstructorReturn(this, (HttpClient.__proto__ || Object.getPrototypeOf(HttpClient)).call(this, _xmlStatsApiConfig.config));

        _this.instance = _axios2.default.create(_this.axiosConfig);

        return _this;
    }

    return HttpClient;
}(_axiosBase.AxiosBase);

new HttpClient();
//# sourceMappingURL=httpClient.js.map
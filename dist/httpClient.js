'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HttpClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _axiosBase = require('./axiosBase');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpClient = exports.HttpClient = function (_AxiosBase) {
    _inherits(HttpClient, _AxiosBase);

    function HttpClient(config) {
        _classCallCheck(this, HttpClient);

        var _this = _possibleConstructorReturn(this, (HttpClient.__proto__ || Object.getPrototypeOf(HttpClient)).call(this, config));

        _this.instance = _axios2.default.create(_this.axiosConfig);
        return _this;
    }

    _createClass(HttpClient, [{
        key: 'get',
        value: function get(url) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.instance.get(url, params).catch(function (err) {
                return err;
            }).then(function (res) {
                return res.data;
            });
        }
    }]);

    return HttpClient;
}(_axiosBase.AxiosBase);
//# sourceMappingURL=httpClient.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

/** @class JSONReader implements I/O with .json files */
var JSONReader =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @param {string} jsonPath Path to needed .json file
   */
  function JSONReader(jsonPath) {
    _classCallCheck(this, JSONReader);

    _jsonPath.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _jsonPath, jsonPath);

    var rowData = _fs["default"].readFileSync(jsonPath);

    Object.assign(this, JSON.parse(rowData));
  }
  /**
   * Saves the data existing data and given data
   *
   * @param {Object} data
   */


  _createClass(JSONReader, [{
    key: "save",
    value: function save() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      try {
        Object.assign(this, data);

        _fs["default"].writeFileSync(_classPrivateFieldGet(this, _jsonPath), JSON.stringify(this, undefined, 2));

        return true;
      } catch (_unused) {
        return false;
      }
    }
  }]);

  return JSONReader;
}();

exports["default"] = JSONReader;

var _jsonPath = new WeakMap();
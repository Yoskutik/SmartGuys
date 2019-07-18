"use strict";

var _db = _interopRequireDefault(require("./db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var childBase, groupBase, paymentBase, annualPaymentBase;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          childBase = new _db["default"]('child');
          groupBase = new _db["default"]('group');
          paymentBase = new _db["default"]('payment');
          annualPaymentBase = new _db["default"]('annual_payment');
          _context.next = 6;
          return groupBase.add({
            fio: 'Алеева Алина',
            parent_1_fio: 'Татьяна',
            parent_1_tel: '+7('
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

function randStr(length) {
  var result = '';
  var characters = 'йцукенгшщзхфывапролдячсмитьбю';
  result += characters.charAt(Math.floor(Math.random() * characters.length)).toUpperCase();

  for (var i = 0; i < length - 1; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function createFio() {
  return "".concat(randStr(10), " ").concat(randStr(5), " ").concat(randStr(10));
}

function timeIsValid(time) {
  var _time$match = time.match(/\d{1,2}/g),
      _time$match2 = _slicedToArray(_time$match, 4),
      hh0 = _time$match2[0],
      mm0 = _time$match2[1],
      hh1 = _time$match2[2],
      mm1 = _time$match2[3];

  var hh = new Date().getHours();
  var mm = new Date().getMinutes();
  if (hh < parseInt(hh0)) return false;
  if (hh === parseInt(hh0) && mm < parseInt(mm0)) return false;
  if (hh > parseInt(hh1)) return false;
  return !(hh === parseInt(hh1) && mm > parseInt(mm1));
}
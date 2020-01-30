"use strict";

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _compression = _interopRequireDefault(require("compression"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("./bin/db"));

var _nodeJsZip = require("nodeJs-zip");

var _request = _interopRequireDefault(require("request"));

var _path = _interopRequireDefault(require("path"));

var _opn = _interopRequireDefault(require("opn"));

var _md = _interopRequireDefault(require("md5"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { if (i % 2) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } else { Object.defineProperties(target, Object.getOwnPropertyDescriptors(arguments[i])); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var address = '127.0.0.1';
var port = 80;
var app = (0, _express["default"])();
var childTable = new _db["default"]('child');
var teacherTable = new _db["default"]('teacher');
var paymentTable = new _db["default"]('payment');
var vacationTable = new _db["default"]('vacation');
var scheduleTable = new _db["default"]('schedule');
var attendanceTable = new _db["default"]('attendance');
var annualPaymentTable = new _db["default"]('annual_payment');

function log(_x) {
  return _log.apply(this, arguments);
} // Requisites


function _log() {
  _log = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee24(message) {
    var _toISOString$match, _toISOString$match2, yyyy, mm, dd, _toString$match, _toString$match2, h, m;

    return regeneratorRuntime.wrap(function _callee24$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _toISOString$match = new Date().toISOString().match(/\d+/g), _toISOString$match2 = _slicedToArray(_toISOString$match, 3), yyyy = _toISOString$match2[0], mm = _toISOString$match2[1], dd = _toISOString$match2[2];
            _toString$match = new Date().toString().match(/\d+/g), _toString$match2 = _slicedToArray(_toString$match, 4), h = _toString$match2[2], m = _toString$match2[3];
            console.log("[".concat(dd, ".").concat(mm, ".").concat(yyyy, " ").concat(h, ":").concat(m, "] ").concat(message));

          case 3:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee24);
  }));
  return _log.apply(this, arguments);
}

var ITN, PSRN, prices;

(function () {
  var lines = _fs["default"].readFileSync('./Юридические реквизиты.txt', 'utf-8').split('\n');

  ITN = lines[0].replace('ИНН: ', '');
  PSRN = lines[1].replace('ОГРН: ', '');
  lines = _fs["default"].readFileSync('./Цены.txt', 'utf-8').split('\n');
  prices = {
    group: parseInt(lines[0].match(/\d+/)[0]),
    mental_arifm_1: parseInt(lines[1].match(/\d+/g)[1]),
    mental_arifm_2: parseInt(lines[2].match(/\d+/g)[1]),
    english: parseInt(lines[3].match(/\d+/)[0]),
    painting: parseInt(lines[4].match(/\d+/)[0]),
    fee: parseInt(lines[5].match(/\d+/)[0]),
    books: parseInt(lines[6].match(/\d+/)[0]),
    books_3: parseInt(lines[7].match(/\d+/g)[1]),
    defectologist: parseInt(lines[8].match(/\d+/)[0]),
    logopedist: parseInt(lines[9].match(/\d+/)[0]),
    psychologist: parseInt(lines[10].match(/\d+/)[0])
  };
})(); //version


var version, lastUpdateAt;

(function () {
  var lines = _fs["default"].readFileSync('./version.txt', 'utf-8').split('\n');

  version = lines[0].replace('current version: ', '');
  lastUpdateAt = lines[1].replace('last update: ', '');
})(); // Attendance daily table update


function updateDayAttendance() {
  return _updateDayAttendance.apply(this, arguments);
}

function _updateDayAttendance() {
  _updateDayAttendance = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee25() {
    var attend, schedule, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, row;

    return regeneratorRuntime.wrap(function _callee25$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _context26.next = 2;
            return attendanceTable.get({
              where: "time = '".concat(getTime(), "'")
            });

          case 2:
            attend = _context26.sent;

            if (attend) {
              _context26.next = 33;
              break;
            }

            _context26.next = 6;
            return scheduleTable.getAll({
              where: "weekday = ".concat(new Date().getDay() - 1)
            });

          case 6:
            schedule = _context26.sent;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context26.prev = 10;
            _iterator3 = schedule[Symbol.iterator]();

          case 12:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context26.next = 19;
              break;
            }

            row = _step3.value;
            _context26.next = 16;
            return attendanceTable.add({
              time: getTime(),
              type: 0,
              lesson_type: row.type,
              child_id: row.child_id
            });

          case 16:
            _iteratorNormalCompletion3 = true;
            _context26.next = 12;
            break;

          case 19:
            _context26.next = 25;
            break;

          case 21:
            _context26.prev = 21;
            _context26.t0 = _context26["catch"](10);
            _didIteratorError3 = true;
            _iteratorError3 = _context26.t0;

          case 25:
            _context26.prev = 25;
            _context26.prev = 26;

            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }

          case 28:
            _context26.prev = 28;

            if (!_didIteratorError3) {
              _context26.next = 31;
              break;
            }

            throw _iteratorError3;

          case 31:
            return _context26.finish(28);

          case 32:
            return _context26.finish(25);

          case 33:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee25, null, [[10, 21, 25, 33], [26,, 28, 32]]);
  }));
  return _updateDayAttendance.apply(this, arguments);
}

updateDayAttendance();
setInterval(updateDayAttendance, 2 * 60 * 60 * 1000); // Backups

function backup() {
  return _backup.apply(this, arguments);
}

function _backup() {
  _backup = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee26() {
    var dir, files, date, options;
    return regeneratorRuntime.wrap(function _callee26$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            dir = _path["default"].join(require('os').homedir(), '.smartGuys');

            if (!_fs["default"].existsSync(dir)) {
              _fs["default"].mkdirSync(dir);
            }

            files = _fs["default"].readdirSync(dir);
            date = new Date(getTime());
            files.forEach(function (file) {
              var time = file.replace('.zip', '');

              if (date - new Date(time) > 7 * 24 * 60 * 60 * 1000) {
                _fs["default"].unlinkSync(_path["default"].join(dir, file));
              }
            });
            (0, _nodeJsZip.zip)("".concat(_os["default"].homedir(), "/\u0423\u043C\u043D\u0438\u043A\u0438 \u0438 \u0443\u043C\u043D\u0438\u0446\u044B/db.db"), {
              name: getTime(),
              dir: dir
            });
            options = {
              method: 'POST',
              uri: 'https://myinspire-ph.ru/api/smartguys.php',
              formData: {
                database: _fs["default"].createReadStream(_path["default"].join(require('os').homedir(), '.smartGuys', "".concat(getTime(), ".zip"))),
                hidden: (0, _md["default"])("".concat(getTime(), "qwertyuiop"))
              },
              data: {
                hidden: (0, _md["default"])("".concat(getTime(), "qwertyuiop"))
              }
            };
            _context27.next = 9;
            return (0, _request["default"])(options, function (err, res, body) {
              if (!err) console.log(res.body);
            });

          case 9:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee26);
  }));
  return _backup.apply(this, arguments);
}

backup();
setInterval(backup, 2 * 60 * 60 * 1000);
app.use((0, _compression["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
app.use((0, _cookieParser["default"])());
app.set('view engine', '.ejs');
app.set('views', __dirname);
app.use(function (req, res, next) {
  if (req.cookies.version !== version || res.cookie.lastUpdateAt !== lastUpdateAt) {
    res.cookie('version', version, {
      path: '/'
    });
    res.cookie('lastUpdateAt', lastUpdateAt, {
      path: '/'
    });
  }

  if (req.method === 'GET' && !req.url.match(/\/.+\..+$/) && !req.cookies.admin) {
    res.render('login/index.ejs');
  } else {
    next();
  }
});
app.get('/',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var childrenDict, teachersDict, teachers, childIds, schedules, i;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            childrenDict = {};
            _context.next = 3;
            return childTable.getAll({
              columns: 'id, fio, birthday'
            });

          case 3:
            _context.t0 = function (c) {
              var _c$birthday$match$map = c.birthday.match(/\d+/g).map(function (v) {
                return parseInt(v);
              }),
                  _c$birthday$match$map2 = _slicedToArray(_c$birthday$match$map, 3),
                  dd = _c$birthday$match$map2[0],
                  mm = _c$birthday$match$map2[1],
                  yyyy = _c$birthday$match$map2[2];

              var birthday = new Date("".concat(months[mm - 1], " ").concat(dd, " ").concat(yyyy));
              childrenDict[c.id] = {
                fio: c.fio,
                id: c.id,
                years: new Date().getFullYear() - birthday.getFullYear()
              };
            };

            _context.sent.forEach(_context.t0);

            teachersDict = {};
            _context.next = 8;
            return teacherTable.getAll({
              columns: 'id, fio'
            });

          case 8:
            _context.t1 = function (t) {
              return teachersDict[t.id] = t.fio;
            };

            _context.sent.forEach(_context.t1);

            teachers = {};
            childIds = [];
            _context.next = 14;
            return scheduleTable.getAll({
              where: "weekday = ".concat(new Date().getDay() - 1),
              order: 'time'
            });

          case 14:
            schedules = _context.sent;
            _context.t2 = regeneratorRuntime.keys(schedules);

          case 16:
            if ((_context.t3 = _context.t2()).done) {
              _context.next = 35;
              break;
            }

            i = _context.t3.value;

            if (schedules[i].time.validFor(new Date())) {
              _context.next = 20;
              break;
            }

            return _context.abrupt("continue", 16);

          case 20:
            if (typeof teachers[teachersDict[schedules[i].teacher_id]] === 'undefined') {
              teachers[teachersDict[schedules[i].teacher_id]] = [];
            }

            _context.t4 = teachers[teachersDict[schedules[i].teacher_id]];
            _context.t5 = _objectSpread;
            _context.t6 = {};
            _context.t7 = childrenDict[schedules[i].child_id];
            _context.t8 = schedules[i].time;
            _context.t9 = schedules[i].type;
            _context.next = 29;
            return attendanceTable.get({
              where: "child_id = ".concat(schedules[i].child_id, " \n                    AND time = '").concat(getTime(), "'\n                    AND lesson_type = ").concat(schedules[i].type)
            });

          case 29:
            _context.t10 = _context.sent;
            _context.t11 = {
              time: _context.t8,
              lesson_type: _context.t9,
              attendance: _context.t10
            };
            _context.t12 = (0, _context.t5)(_context.t6, _context.t7, _context.t11);

            _context.t4.push.call(_context.t4, _context.t12);

            _context.next = 16;
            break;

          case 35:
            res.render('home/index.ejs', {
              teachers: teachers
            });

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/children/',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.render('children/index.ejs');

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
app.get('/schedule/',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var childrenDict, teachersDict, schedule, _loop, i;

    return regeneratorRuntime.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            childrenDict = {};
            _context4.next = 3;
            return childTable.getAll({
              columns: 'id, fio, birthday'
            });

          case 3:
            _context4.t0 = function (c) {
              var _c$birthday$match$map3 = c.birthday.match(/\d+/g).map(function (v) {
                return parseInt(v);
              }),
                  _c$birthday$match$map4 = _slicedToArray(_c$birthday$match$map3, 3),
                  dd = _c$birthday$match$map4[0],
                  mm = _c$birthday$match$map4[1],
                  yyyy = _c$birthday$match$map4[2];

              var birthday = new Date("".concat(months[mm - 1], " ").concat(dd, " ").concat(yyyy));
              childrenDict[c.id] = {
                fio: c.fio,
                id: c.id,
                years: new Date().getFullYear() - birthday.getFullYear()
              };
            };

            _context4.sent.forEach(_context4.t0);

            teachersDict = {};
            _context4.next = 8;
            return teacherTable.getAll({
              columns: 'id, fio'
            });

          case 8:
            _context4.t1 = function (t) {
              return teachersDict[t.id] = t.fio;
            };

            _context4.sent.forEach(_context4.t1);

            schedule = {
              children: [[], [], [], [], [], [], []],
              teachers: [[], [], [], [], [], [], []]
            };
            _loop =
            /*#__PURE__*/
            regeneratorRuntime.mark(function _loop(i) {
              var tmp, j, children, tmp0, k, attendance;
              return regeneratorRuntime.wrap(function _loop$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return scheduleTable.getAll({
                        where: "weekday = ".concat(i),
                        order: 'time'
                      });

                    case 2:
                      _context3.t0 = function (row) {
                        schedule.children[i].push({
                          fio: childrenDict[row.child_id].fio,
                          time: row.time,
                          id: row.child_id
                        });
                      };

                      _context3.sent.forEach(_context3.t0);

                      _context3.next = 6;
                      return scheduleTable.getAll({
                        distinct: true,
                        columns: 'time, teacher_id',
                        where: "weekday = ".concat(i),
                        order: 'time'
                      });

                    case 6:
                      tmp = _context3.sent;
                      _context3.t1 = regeneratorRuntime.keys(tmp);

                    case 8:
                      if ((_context3.t2 = _context3.t1()).done) {
                        _context3.next = 29;
                        break;
                      }

                      j = _context3.t2.value;
                      children = [];
                      _context3.next = 13;
                      return scheduleTable.getAll({
                        where: "weekday = ".concat(i, " \n                    AND time = '").concat(tmp[j].time, "' \n                    AND teacher_id = ").concat(tmp[j].teacher_id),
                        order: 'time'
                      });

                    case 13:
                      tmp0 = _context3.sent;
                      _context3.t3 = regeneratorRuntime.keys(tmp0);

                    case 15:
                      if ((_context3.t4 = _context3.t3()).done) {
                        _context3.next = 26;
                        break;
                      }

                      k = _context3.t4.value;
                      _context3.next = 19;
                      return attendanceTable.get({
                        where: "child_id = ".concat(tmp0[k].child_id, " \n                            AND time = '").concat(getTime(i), "'\n                            AND lesson_type = ").concat(tmp0[k].type)
                      });

                    case 19:
                      _context3.t5 = _context3.sent;

                      if (_context3.t5) {
                        _context3.next = 22;
                        break;
                      }

                      _context3.t5 = {
                        type: 0
                      };

                    case 22:
                      attendance = _context3.t5;
                      children.push(_objectSpread({}, childrenDict[tmp0[k].child_id], {
                        attendance: attendance,
                        lesson_type: tmp0[k].type
                      }));
                      _context3.next = 15;
                      break;

                    case 26:
                      schedule.teachers[i].push({
                        fio: teachersDict[tmp[j].teacher_id],
                        time: tmp[j].time,
                        children: children
                      });
                      _context3.next = 8;
                      break;

                    case 29:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _loop);
            });
            _context4.t2 = regeneratorRuntime.keys(weekdays);

          case 13:
            if ((_context4.t3 = _context4.t2()).done) {
              _context4.next = 18;
              break;
            }

            i = _context4.t3.value;
            return _context4.delegateYield(_loop(i), "t4", 16);

          case 16:
            _context4.next = 13;
            break;

          case 18:
            res.render('schedule/index.ejs', {
              schedule: schedule
            });

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());
app.get('/child/',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var schedule, child, i;
    return regeneratorRuntime.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return scheduleTable.getAll({
              where: "child_id = ".concat(req.query.id),
              order: 'weekday'
            });

          case 2:
            schedule = _context5.sent;
            _context5.next = 5;
            return childTable.get({
              where: "id = ".concat(req.query.id)
            });

          case 5:
            child = _context5.sent;
            _context5.t0 = regeneratorRuntime.keys(schedule);

          case 7:
            if ((_context5.t1 = _context5.t0()).done) {
              _context5.next = 14;
              break;
            }

            i = _context5.t1.value;
            _context5.next = 11;
            return teacherTable.get({
              where: "id = ".concat(schedule[i].teacher_id)
            });

          case 11:
            schedule[i].teacher = _context5.sent;
            _context5.next = 7;
            break;

          case 14:
            _context5.t2 = res;
            _context5.t3 = child;
            _context5.t4 = schedule;
            _context5.next = 19;
            return attendanceTable.getAll({
              where: "child_id = ".concat(req.query.id),
              order: 'time DESC'
            });

          case 19:
            _context5.t5 = _context5.sent;
            _context5.next = 22;
            return vacationTable.get({
              where: "child_id = ".concat(req.query.id, " AND period LIKE '%").concat(new Date().getFullYear(), "%'")
            });

          case 22:
            _context5.t6 = _context5.sent;
            _context5.next = 25;
            return paymentTable.getAll({
              where: "child_id = ".concat(req.query.id),
              order: 'time DESC, id DESC'
            });

          case 25:
            _context5.t7 = _context5.sent;
            _context5.t8 = {
              child: _context5.t3,
              schedule: _context5.t4,
              attendance: _context5.t5,
              vacation: _context5.t6,
              payment: _context5.t7
            };

            _context5.t2.render.call(_context5.t2, 'child/index.ejs', _context5.t8);

          case 28:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());
app.get('/payment/',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var m, year;
    return regeneratorRuntime.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            m = new Date().getMonth() + 1;
            year = new Date().getFullYear();
            _context6.t0 = res;
            _context6.next = 5;
            return childTable.get({
              where: "id = ".concat(req.query.id)
            });

          case 5:
            _context6.t1 = _context6.sent;
            _context6.next = 8;
            return attendanceTable.getAll({
              where: "child_id = ".concat(req.query.id, " \n                AND time LIKE '").concat(m === 1 ? year - 1 : year, "-").concat(m === 1 ? 12 : m - 1 > 9 ? m - 1 : '0' + (m - 1), "%' \n                AND lesson_type < 6")
            });

          case 8:
            _context6.t2 = _context6.sent;
            _context6.next = 11;
            return annualPaymentTable.getAll({
              where: "child_id = ".concat(req.query.id, " AND time LIKE '").concat(year, "%'")
            });

          case 11:
            _context6.t3 = _context6.sent;
            _context6.next = 14;
            return paymentTable.getAll({
              where: "child_id = ".concat(req.query.id, " AND time LIKE '").concat(year, "-").concat(m > 9 ? m : '0' + m, "%'")
            });

          case 14:
            _context6.t4 = _context6.sent;
            _context6.t5 = prices;
            _context6.t6 = {
              child: _context6.t1,
              attendance: _context6.t2,
              annual: _context6.t3,
              payment: _context6.t4,
              prices: _context6.t5
            };

            _context6.t0.render.call(_context6.t0, 'payment/index.ejs', _context6.t6);

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}());
app.get('/payment/voucher/',
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res) {
    return regeneratorRuntime.wrap(function _callee6$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            res.render('payment/voucher.ejs', {
              query: req.query,
              prices: prices,
              ITN: ITN,
              PSRN: PSRN
            });

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}());
app.get('/login/',
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(req, res) {
    return regeneratorRuntime.wrap(function _callee7$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            res.render('login/index.ejs');

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}());
app.get('/teachers/',
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(req, res) {
    return regeneratorRuntime.wrap(function _callee8$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.t0 = res;
            _context9.next = 3;
            return teacherTable.getAll();

          case 3:
            _context9.t1 = _context9.sent;
            _context9.t2 = {
              teachers: _context9.t1
            };

            _context9.t0.render.call(_context9.t0, 'teachers/index.ejs', _context9.t2);

          case 6:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}());
app.get('/teachers/schedule/',
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(req, res) {
    var childrenDict, schedule, i, sch, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, row;

    return regeneratorRuntime.wrap(function _callee9$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            childrenDict = {};
            _context10.next = 3;
            return childTable.getAll({
              columns: 'id, fio, birthday'
            });

          case 3:
            _context10.t0 = function (c) {
              var _c$birthday$match$map5 = c.birthday.match(/\d+/g).map(function (v) {
                return parseInt(v);
              }),
                  _c$birthday$match$map6 = _slicedToArray(_c$birthday$match$map5, 3),
                  dd = _c$birthday$match$map6[0],
                  mm = _c$birthday$match$map6[1],
                  yyyy = _c$birthday$match$map6[2];

              var birthday = new Date("".concat(months[mm - 1], " ").concat(dd, " ").concat(yyyy));
              childrenDict[c.id] = {
                fio: c.fio,
                id: c.id,
                years: new Date().getFullYear() - birthday.getFullYear()
              };
            };

            _context10.sent.forEach(_context10.t0);

            schedule = [];
            i = 0;

          case 7:
            if (!(i < 7)) {
              _context10.next = 34;
              break;
            }

            _context10.next = 10;
            return scheduleTable.getAll({
              where: "teacher_id = ".concat(req.query.id, " AND weekday = ").concat(i),
              order: 'time'
            });

          case 10:
            sch = _context10.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context10.prev = 14;

            for (_iterator = sch[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              row = _step.value;
              row.child = childrenDict[row.child_id];
            }

            _context10.next = 22;
            break;

          case 18:
            _context10.prev = 18;
            _context10.t1 = _context10["catch"](14);
            _didIteratorError = true;
            _iteratorError = _context10.t1;

          case 22:
            _context10.prev = 22;
            _context10.prev = 23;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 25:
            _context10.prev = 25;

            if (!_didIteratorError) {
              _context10.next = 28;
              break;
            }

            throw _iteratorError;

          case 28:
            return _context10.finish(25);

          case 29:
            return _context10.finish(22);

          case 30:
            schedule.push({
              day: weekdays[i],
              schedule: sch
            });

          case 31:
            i++;
            _context10.next = 7;
            break;

          case 34:
            _context10.t2 = res;
            _context10.t3 = schedule;
            _context10.next = 38;
            return teacherTable.get({
              where: "id = ".concat(req.query.id)
            });

          case 38:
            _context10.t4 = _context10.sent.fio;
            _context10.t5 = {
              schedule: _context10.t3,
              fio: _context10.t4
            };

            _context10.t2.render.call(_context10.t2, 'teachers/schedule.ejs', _context10.t5);

          case 41:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee9, null, [[14, 18, 22, 30], [23,, 25, 29]]);
  }));

  return function (_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}());
app.get('/payment/report/',
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(req, res) {
    var payments, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, row;

    return regeneratorRuntime.wrap(function _callee10$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return paymentTable.getAll({
              where: "time LIKE '".concat(getTime(), "%'")
            });

          case 2:
            payments = _context11.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context11.prev = 6;
            _iterator2 = payments[Symbol.iterator]();

          case 8:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context11.next = 16;
              break;
            }

            row = _step2.value;
            _context11.next = 12;
            return childTable.get({
              where: "id = ".concat(row.child_id)
            });

          case 12:
            row.child = _context11.sent;

          case 13:
            _iteratorNormalCompletion2 = true;
            _context11.next = 8;
            break;

          case 16:
            _context11.next = 22;
            break;

          case 18:
            _context11.prev = 18;
            _context11.t0 = _context11["catch"](6);
            _didIteratorError2 = true;
            _iteratorError2 = _context11.t0;

          case 22:
            _context11.prev = 22;
            _context11.prev = 23;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 25:
            _context11.prev = 25;

            if (!_didIteratorError2) {
              _context11.next = 28;
              break;
            }

            throw _iteratorError2;

          case 28:
            return _context11.finish(25);

          case 29:
            return _context11.finish(22);

          case 30:
            res.render('payment/report/index.ejs', {
              payments: payments
            });

          case 31:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee10, null, [[6, 18, 22, 30], [23,, 25, 29]]);
  }));

  return function (_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}());
app.post('/api/addChild',
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(req, res) {
    var child_id, i;
    return regeneratorRuntime.wrap(function _callee11$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return childTable.add(req.body.child);

          case 2:
            child_id = _context12.sent;
            _context12.t0 = regeneratorRuntime.keys(req.body.schedule);

          case 4:
            if ((_context12.t1 = _context12.t0()).done) {
              _context12.next = 10;
              break;
            }

            i = _context12.t1.value;
            _context12.next = 8;
            return scheduleTable.add(_objectSpread({}, req.body.schedule[i], {
              child_id: child_id
            }));

          case 8:
            _context12.next = 4;
            break;

          case 10:
            log("\u0420\u0435\u0431\u0451\u043D\u043E\u043A ".concat(req.body.child.fio, " \u0431\u044B\u043B \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443."));
            res.json({
              status: 'OK'
            });

          case 12:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}());
app.post('/api/addTeacher',
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(req, res) {
    return regeneratorRuntime.wrap(function _callee12$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            log("\u0423\u0447\u0438\u0442\u0435\u043B\u044C ".concat(req.body.fio, " \u0431\u044B\u043B \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443."));
            _context13.t0 = res;
            _context13.next = 4;
            return teacherTable.add(req.body);

          case 4:
            _context13.t1 = _context13.sent;
            _context13.t2 = {
              id: _context13.t1
            };

            _context13.t0.json.call(_context13.t0, _context13.t2);

          case 7:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x24, _x25) {
    return _ref12.apply(this, arguments);
  };
}());
app.post('/api/getTeacher',
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(req, res) {
    return regeneratorRuntime.wrap(function _callee13$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.t0 = res;
            _context14.next = 3;
            return teacherTable.getAll({
              where: "fio LIKE '%".concat(req.body.fio, "%'"),
              order: 'fio'
            });

          case 3:
            _context14.t1 = _context14.sent;

            _context14.t0.json.call(_context14.t0, _context14.t1);

          case 5:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x26, _x27) {
    return _ref13.apply(this, arguments);
  };
}());
app.post('/api/getChild',
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(req, res) {
    return regeneratorRuntime.wrap(function _callee14$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.t0 = res;
            _context15.next = 3;
            return childTable.getAll({
              where: "fio LIKE '%".concat(req.body.fio, "%'"),
              order: 'fio'
            });

          case 3:
            _context15.t1 = _context15.sent;

            _context15.t0.json.call(_context15.t0, _context15.t1);

          case 5:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x28, _x29) {
    return _ref14.apply(this, arguments);
  };
}());
app.post('/api/updateChild',
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(req, res) {
    var b, i;
    return regeneratorRuntime.wrap(function _callee15$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return childTable.update({
              where: "id = ".concat(req.body.id),
              val: req.body.child
            });

          case 2:
            b = _context16.sent;
            _context16.next = 5;
            return scheduleTable.remove({
              where: "child_id = ".concat(req.body.id)
            });

          case 5:
            _context16.t0 = regeneratorRuntime.keys(req.body.schedule);

          case 6:
            if ((_context16.t1 = _context16.t0()).done) {
              _context16.next = 12;
              break;
            }

            i = _context16.t1.value;
            _context16.next = 10;
            return scheduleTable.add(Object.assign(req.body.schedule[i], {
              child_id: req.body.id
            }));

          case 10:
            _context16.next = 6;
            break;

          case 12:
            log("\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E ".concat(req.body.child.fio, " \u0431\u044B\u043B\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430."));
            res.json({
              status: b ? 'OK' : 'ERROR'
            });

          case 14:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x30, _x31) {
    return _ref15.apply(this, arguments);
  };
}());
app.post('/api/removeChild',
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(req, res) {
    return regeneratorRuntime.wrap(function _callee16$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return childTable.remove({
              where: "id = ".concat(req.body.id)
            });

          case 2:
            _context17.next = 4;
            return scheduleTable.remove({
              where: "child_id = ".concat(req.body.id)
            });

          case 4:
            log("\u0420\u0435\u0431\u0451\u043D\u043E\u043A ".concat(req.body.fio, " \u0431\u044B\u043B \u0443\u0434\u0430\u043B\u0435\u043D \u0438\u0437 \u0441\u0438\u0441\u0442\u0435\u043C\u044B."));
            res.sendStatus(200);

          case 6:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x32, _x33) {
    return _ref16.apply(this, arguments);
  };
}());
app.post('/api/updateTeacher',
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(req, res) {
    return regeneratorRuntime.wrap(function _callee17$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return teacherTable.update({
              val: {
                fio: req.body.fio
              },
              where: "id = ".concat(req.body.id)
            });

          case 2:
            log("\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E ".concat(req.body.fio, " \u0431\u044B\u043B\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430."));
            res.json({
              status: 'OK'
            });

          case 4:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x34, _x35) {
    return _ref17.apply(this, arguments);
  };
}());
app.post('/api/removeTeacher',
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(req, res) {
    return regeneratorRuntime.wrap(function _callee18$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return teacherTable.remove({
              where: "id = ".concat(req.body.id)
            });

          case 2:
            _context19.next = 4;
            return scheduleTable.remove({
              where: "teacher_id = ".concat(req.body.id)
            });

          case 4:
            log("\u0423\u0447\u0438\u0442\u0435\u043B\u044C ".concat(req.body.fio, " \u0431\u044B\u043B \u0443\u0434\u0430\u043B\u0435\u043D \u0438\u0437 \u0441\u0438\u0441\u0442\u0435\u043C\u044B."));
            res.json({
              status: 'OK'
            });

          case 6:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x36, _x37) {
    return _ref18.apply(this, arguments);
  };
}());
app.post('/api/addAttendance',
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19(req, res) {
    var i;
    return regeneratorRuntime.wrap(function _callee19$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.t0 = regeneratorRuntime.keys(req.body.attendance);

          case 1:
            if ((_context20.t1 = _context20.t0()).done) {
              _context20.next = 11;
              break;
            }

            i = _context20.t1.value;

            if (!(req.body.attendance[i].time === undefined)) {
              _context20.next = 5;
              break;
            }

            return _context20.abrupt("continue", 1);

          case 5:
            _context20.next = 7;
            return attendanceTable.remove({
              where: "child_id = ".concat(req.body.attendance[i].child_id, " \n                AND time = '").concat(req.body.attendance[i].time, "'\n                AND lesson_type = ").concat(req.body.attendance[i].lesson_type)
            });

          case 7:
            _context20.next = 9;
            return attendanceTable.add(req.body.attendance[i]);

          case 9:
            _context20.next = 1;
            break;

          case 11:
            if (req.body.attendance) {
              log("\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u043F\u043E\u0441\u0435\u0449\u0430\u0435\u043C\u043E\u0441\u0442\u0438. \u0412\u0441\u0435\u0433\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E ".concat(req.body.attendance.length, " \u0441\u0442\u0440\u043E\u043A."));
            }

            res.json({
              status: 'OK'
            });

          case 13:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x38, _x39) {
    return _ref19.apply(this, arguments);
  };
}());
app.post('/api/removeAttendance',
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(req, res) {
    var i;
    return regeneratorRuntime.wrap(function _callee20$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.t0 = regeneratorRuntime.keys(req.body.ids);

          case 1:
            if ((_context21.t1 = _context21.t0()).done) {
              _context21.next = 7;
              break;
            }

            i = _context21.t1.value;
            _context21.next = 5;
            return attendanceTable.remove({
              where: "id = ".concat(req.body.ids[i])
            });

          case 5:
            _context21.next = 1;
            break;

          case 7:
            if (req.body.ids) {
              log("\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u043F\u043E\u0441\u0435\u0449\u0430\u0435\u043C\u043E\u0441\u0442\u0438. \u0412\u0441\u0435\u0433\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u043E ".concat(req.body.ids.length, " \u0441\u0442\u0440\u043E\u043A."));
            }

            res.json({
              status: 'OK'
            });

          case 9:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee20);
  }));

  return function (_x40, _x41) {
    return _ref20.apply(this, arguments);
  };
}());
app.post('/api/payAnnual',
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21(req, res) {
    var child_id, child, annual, forWhat;
    return regeneratorRuntime.wrap(function _callee21$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            child_id = req.body.child_id;
            _context22.next = 3;
            return childTable.get({
              where: "id = ".concat(child_id)
            });

          case 3:
            child = _context22.sent;
            _context22.next = 6;
            return annualPaymentTable.get({
              where: "child_id = ".concat(child_id, " AND time LIKE '").concat(new Date().getFullYear(), "%'")
            });

          case 6:
            annual = _context22.sent;

            if (!annual) {
              _context22.next = 14;
              break;
            }

            delete req.body.child_id;
            delete req.body.time;
            _context22.next = 12;
            return annualPaymentTable.update({
              val: req.body,
              where: "child_id = ".concat(child_id, " AND time LIKE '").concat(new Date().getFullYear(), "%'")
            });

          case 12:
            _context22.next = 16;
            break;

          case 14:
            _context22.next = 16;
            return annualPaymentTable.add(req.body);

          case 16:
            forWhat = "".concat(req.body.fee ? "Ежегодный взнос" : "") + "".concat(req.body.book ? (req.body.fee ? ", " : "") + "Пособие" : "") + "".concat(req.body.fee_3 ? (req.body.fee || req.body.book ? ", " : "") + "Пособие_3" : "");
            log("\u041F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0430 \u043E\u043F\u043B\u0430\u0442\u0430 \u0437\u0430 ".concat(forWhat, " \u043E\u0442 ").concat(child.fio, "."));
            res.sendStatus(200);

          case 19:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee21);
  }));

  return function (_x42, _x43) {
    return _ref21.apply(this, arguments);
  };
}());
app.post('/api/pay',
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee22(req, res) {
    var child;
    return regeneratorRuntime.wrap(function _callee22$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return childTable.get({
              where: "id = ".concat(req.body.child_id)
            });

          case 2:
            child = _context23.sent;
            _context23.next = 5;
            return paymentTable.add(_objectSpread({}, req.body, {
              admin: req.cookies.admin
            }));

          case 5:
            log("\u041F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0430 \u043E\u043F\u043B\u0430\u0442\u0430 \u043D\u0430 \u0441\u0443\u043C\u043C\u0443 ".concat(req.body.amount, "\u0440 \u043E\u0442 ").concat(child.fio, " \u043F\u043E ").concat(req.body.type === '0' ? "безналичному" : "наличному", " \u0440\u0430\u0441\u0447\u0435\u0442\u0443."));
            res.sendStatus(200);

          case 7:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee22);
  }));

  return function (_x44, _x45) {
    return _ref22.apply(this, arguments);
  };
}());
app.post('/api/addVacation',
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23(req, res) {
    var child;
    return regeneratorRuntime.wrap(function _callee23$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return childTable.get({
              where: "id = ".concat(req.body.child_id)
            });

          case 2:
            child = _context24.sent;
            _context24.next = 5;
            return vacationTable.remove({
              where: "child_id = ".concat(req.body.child_id)
            });

          case 5:
            _context24.next = 7;
            return vacationTable.add(req.body);

          case 7:
            res.sendStatus(200);

          case 8:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee23);
  }));

  return function (_x46, _x47) {
    return _ref23.apply(this, arguments);
  };
}());
app.use(function (request, response) {
  var url = request.url;
  if (_fs["default"].existsSync(__dirname + url)) response.sendFile(__dirname + url);else {
    response.status(404).send('<b>Файл не найден</b>');
  }
});
app.listen(port, address, function () {
  console.clear();
  console.log('Добро пожаловать в Умники и Умницы. Администрирование!');
  console.log('К сайту можно обратиться по ссылкам:');
  console.log('  - http://127.0.0.1 -');
  console.log('  - http://localhost -');
  console.log();
  (0, _opn["default"])('http://localhost');
});

String.prototype.validFor = function (date) {
  var _this$match = this.match(/\d{1,2}/g),
      _this$match2 = _slicedToArray(_this$match, 4),
      hh0 = _this$match2[0],
      mm0 = _this$match2[1],
      hh1 = _this$match2[2],
      mm1 = _this$match2[3];

  var hh = new Date().getHours();
  var mm = new Date().getMinutes();
  if (hh < parseInt(hh0)) return false;
  if (hh === parseInt(hh0) && mm < parseInt(mm0)) return false;
  if (hh > parseInt(hh1)) return false;
  return !(hh === parseInt(hh1) && mm > parseInt(mm1));
};

function getTime(w) {
  var date = new Date();

  if (w !== undefined) {
    w = parseInt(w);
    date.setTime(date.getTime() + (1 + w - date.getDay()) * 24 * 60 * 60 * 1000);
  }

  var m = date.getMonth() + 1;
  var d = date.getDate();
  return "".concat(date.getFullYear(), "-").concat(m > 9 ? m : '0' + m, "-").concat(d > 9 ? d : '0' + d);
}
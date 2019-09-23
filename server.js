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
var annualPaymentTable = new _db["default"]('annual_payment'); // Requisites

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
})(); // Attendance daily table update


function updateDayAttendance() {
  return _updateDayAttendance.apply(this, arguments);
}

function _updateDayAttendance() {
  _updateDayAttendance = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee24() {
    var attend, schedule, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, row;

    return regeneratorRuntime.wrap(function _callee24$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.next = 2;
            return attendanceTable.get({
              where: "time = '".concat(getTime(), "'")
            });

          case 2:
            attend = _context25.sent;

            if (attend) {
              _context25.next = 33;
              break;
            }

            _context25.next = 6;
            return scheduleTable.getAll({
              where: "weekday = ".concat(new Date().getDay() - 1)
            });

          case 6:
            schedule = _context25.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context25.prev = 10;
            _iterator2 = schedule[Symbol.iterator]();

          case 12:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context25.next = 19;
              break;
            }

            row = _step2.value;
            _context25.next = 16;
            return attendanceTable.add({
              time: getTime(),
              type: 0,
              lesson_type: row.type,
              child_id: row.child_id
            });

          case 16:
            _iteratorNormalCompletion2 = true;
            _context25.next = 12;
            break;

          case 19:
            _context25.next = 25;
            break;

          case 21:
            _context25.prev = 21;
            _context25.t0 = _context25["catch"](10);
            _didIteratorError2 = true;
            _iteratorError2 = _context25.t0;

          case 25:
            _context25.prev = 25;
            _context25.prev = 26;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 28:
            _context25.prev = 28;

            if (!_didIteratorError2) {
              _context25.next = 31;
              break;
            }

            throw _iteratorError2;

          case 31:
            return _context25.finish(28);

          case 32:
            return _context25.finish(25);

          case 33:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee24, null, [[10, 21, 25, 33], [26,, 28, 32]]);
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
  regeneratorRuntime.mark(function _callee25() {
    var dir, files, date, options;
    return regeneratorRuntime.wrap(function _callee25$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
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
            (0, _nodeJsZip.zip)(_path["default"].join(__dirname, 'db.db'), {
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
            _context26.next = 9;
            return (0, _request["default"])(options, function (err, res, body) {
              if (!err) console.log(res.body);
            });

          case 9:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee25);
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
  if (req.method === 'GET' && !req.url.match(/\/.+\..+$/) && !req.cookies.admin && !req.url.match(/\/?new_admin=.+/)) {
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
    var childrenDict, teachersDict, teachers, childIds, schedules, i, expires;
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
            if (req.query.new_admin) {
              expires = new Date();
              expires.setHours(0);
              expires.setMinutes(0);
              expires.setSeconds(0);
              expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
              res.cookie('admin', req.query.new_admin, {
                expires: expires,
                path: '/'
              });
            }

            res.render('home/index.ejs', {
              admin: req.query.new_admin || req.cookies.admin,
              teachers: teachers
            });

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
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
            res.render('children/index.ejs', {
              admin: req.cookies.admin
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
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
              admin: req.cookies.admin,
              schedule: schedule
            });

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
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
            _context5.t3 = req.cookies.admin;
            _context5.t4 = child;
            _context5.t5 = schedule;
            _context5.next = 20;
            return attendanceTable.getAll({
              where: "child_id = ".concat(req.query.id),
              order: 'time DESC'
            });

          case 20:
            _context5.t6 = _context5.sent;
            _context5.next = 23;
            return vacationTable.get({
              where: "child_id = ".concat(req.query.id, " AND period LIKE '%").concat(new Date().getFullYear(), "%'")
            });

          case 23:
            _context5.t7 = _context5.sent;
            _context5.next = 26;
            return paymentTable.getAll({
              where: "child_id = ".concat(req.query.id),
              order: 'time DESC, id DESC'
            });

          case 26:
            _context5.t8 = _context5.sent;
            _context5.t9 = {
              admin: _context5.t3,
              child: _context5.t4,
              schedule: _context5.t5,
              attendance: _context5.t6,
              vacation: _context5.t7,
              payment: _context5.t8
            };

            _context5.t2.render.call(_context5.t2, 'child/index.ejs', _context5.t9);

          case 29:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
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
            _context6.t1 = req.cookies.admin;
            _context6.next = 6;
            return childTable.get({
              where: "id = ".concat(req.query.id)
            });

          case 6:
            _context6.t2 = _context6.sent;
            _context6.next = 9;
            return attendanceTable.getAll({
              where: "child_id = ".concat(req.query.id, " \n                AND time LIKE '").concat(m === 1 ? year - 1 : year, "-").concat(m === 1 ? 12 : m > 9 ? m : '0' + m, "%' \n                AND lesson_type < 6")
            });

          case 9:
            _context6.t3 = _context6.sent;
            _context6.next = 12;
            return annualPaymentTable.getAll({
              where: "child_id = ".concat(req.query.id, " AND time LIKE '").concat(year, "%'")
            });

          case 12:
            _context6.t4 = _context6.sent;
            _context6.next = 15;
            return paymentTable.getAll({
              where: "child_id = ".concat(req.query.id, " AND time LIKE '").concat(year, "-").concat(m > 9 ? m : '0' + m, "%'")
            });

          case 15:
            _context6.t5 = _context6.sent;
            _context6.t6 = prices;
            _context6.t7 = {
              admin: _context6.t1,
              child: _context6.t2,
              attendance: _context6.t3,
              annual: _context6.t4,
              payment: _context6.t5,
              prices: _context6.t6
            };

            _context6.t0.render.call(_context6.t0, 'payment/index.ejs', _context6.t7);

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
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
              PSRN: PSRN,
              admin: req.cookies.admin
            });

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
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

  return function (_x13, _x14) {
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
            _context9.t1 = req.cookies.admin;
            _context9.next = 4;
            return teacherTable.getAll();

          case 4:
            _context9.t2 = _context9.sent;
            _context9.t3 = {
              admin: _context9.t1,
              teachers: _context9.t2
            };

            _context9.t0.render.call(_context9.t0, 'teachers/index.ejs', _context9.t3);

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15, _x16) {
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
            _context10.t3 = req.cookies.admin;
            _context10.t4 = schedule;
            _context10.next = 39;
            return teacherTable.get({
              where: "id = ".concat(req.query.id)
            });

          case 39:
            _context10.t5 = _context10.sent.fio;
            _context10.t6 = {
              admin: _context10.t3,
              schedule: _context10.t4,
              fio: _context10.t5
            };

            _context10.t2.render.call(_context10.t2, 'teachers/schedule.ejs', _context10.t6);

          case 42:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee9, null, [[14, 18, 22, 30], [23,, 25, 29]]);
  }));

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
app.post('/api/addChild',
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(req, res) {
    var child_id, i;
    return regeneratorRuntime.wrap(function _callee10$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return childTable.add(req.body.child);

          case 2:
            child_id = _context11.sent;
            _context11.t0 = regeneratorRuntime.keys(req.body.schedule);

          case 4:
            if ((_context11.t1 = _context11.t0()).done) {
              _context11.next = 10;
              break;
            }

            i = _context11.t1.value;
            _context11.next = 8;
            return scheduleTable.add(_objectSpread({}, req.body.schedule[i], {
              child_id: child_id
            }));

          case 8:
            _context11.next = 4;
            break;

          case 10:
            res.json({
              status: 'OK'
            });

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
app.post('/api/addTeacher',
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(req, res) {
    return regeneratorRuntime.wrap(function _callee11$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.t0 = res;
            _context12.next = 3;
            return teacherTable.add(req.body);

          case 3:
            _context12.t1 = _context12.sent;
            _context12.t2 = {
              id: _context12.t1
            };

            _context12.t0.json.call(_context12.t0, _context12.t2);

          case 6:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}());
app.post('/api/getTeacher',
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(req, res) {
    return regeneratorRuntime.wrap(function _callee12$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.t0 = res;
            _context13.next = 3;
            return teacherTable.getAll({
              where: "fio LIKE '%".concat(req.body.fio, "%'"),
              order: 'fio'
            });

          case 3:
            _context13.t1 = _context13.sent;

            _context13.t0.json.call(_context13.t0, _context13.t1);

          case 5:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}());
app.post('/api/getChild',
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
            return childTable.getAll({
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

  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}());
app.post('/api/updateChild',
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(req, res) {
    var b, i;
    return regeneratorRuntime.wrap(function _callee14$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return childTable.update({
              where: "id = ".concat(req.body.id),
              val: req.body.child
            });

          case 2:
            b = _context15.sent;
            _context15.next = 5;
            return scheduleTable.remove({
              where: "child_id = ".concat(req.body.id)
            });

          case 5:
            _context15.t0 = regeneratorRuntime.keys(req.body.schedule);

          case 6:
            if ((_context15.t1 = _context15.t0()).done) {
              _context15.next = 12;
              break;
            }

            i = _context15.t1.value;
            _context15.next = 10;
            return scheduleTable.add(Object.assign(req.body.schedule[i], {
              child_id: req.body.id
            }));

          case 10:
            _context15.next = 6;
            break;

          case 12:
            res.json({
              status: b ? 'OK' : 'ERROR'
            });

          case 13:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}());
app.post('/api/removeChild',
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(req, res) {
    return regeneratorRuntime.wrap(function _callee15$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return childTable.remove({
              where: "id = ".concat(req.body.id)
            });

          case 2:
            _context16.next = 4;
            return scheduleTable.remove({
              where: "child_id = ".concat(req.body.id)
            });

          case 4:
            res.sendStatus(200);

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}());
app.post('/api/updateTeacher',
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
            return teacherTable.update({
              val: {
                fio: req.body.fio
              },
              where: "id = ".concat(req.body.id)
            });

          case 2:
            res.json({
              status: 'OK'
            });

          case 3:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}());
app.post('/api/removeTeacher',
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
            return teacherTable.remove({
              where: "id = ".concat(req.body.id)
            });

          case 2:
            _context18.next = 4;
            return scheduleTable.remove({
              where: "teacher_id = ".concat(req.body.id)
            });

          case 4:
            res.json({
              status: 'OK'
            });

          case 5:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}());
app.post('/api/addAttendance',
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(req, res) {
    var i;
    return regeneratorRuntime.wrap(function _callee18$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.t0 = regeneratorRuntime.keys(req.body.attendance);

          case 1:
            if ((_context19.t1 = _context19.t0()).done) {
              _context19.next = 9;
              break;
            }

            i = _context19.t1.value;
            _context19.next = 5;
            return attendanceTable.remove({
              where: "child_id = ".concat(req.body.attendance[i].child_id, " \n                AND time = '").concat(req.body.attendance[i].time, "'\n                AND lesson_type = ").concat(req.body.attendance[i].lesson_type)
            });

          case 5:
            _context19.next = 7;
            return attendanceTable.add(req.body.attendance[i]);

          case 7:
            _context19.next = 1;
            break;

          case 9:
            res.json({
              status: 'OK'
            });

          case 10:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x35, _x36) {
    return _ref18.apply(this, arguments);
  };
}());
app.post('/api/removeAttendance',
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
            _context20.t0 = regeneratorRuntime.keys(req.body.ids);

          case 1:
            if ((_context20.t1 = _context20.t0()).done) {
              _context20.next = 7;
              break;
            }

            i = _context20.t1.value;
            _context20.next = 5;
            return attendanceTable.remove({
              where: "id = ".concat(req.body.ids[i])
            });

          case 5:
            _context20.next = 1;
            break;

          case 7:
            res.json({
              status: 'OK'
            });

          case 8:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x37, _x38) {
    return _ref19.apply(this, arguments);
  };
}());
app.post('/api/payAnnual',
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(req, res) {
    var child_id, annual;
    return regeneratorRuntime.wrap(function _callee20$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            child_id = req.body.child_id;
            _context21.next = 3;
            return annualPaymentTable.get({
              where: "child_id = ".concat(child_id, " AND time LIKE '").concat(new Date().getFullYear(), "%'")
            });

          case 3:
            annual = _context21.sent;

            if (!annual) {
              _context21.next = 11;
              break;
            }

            delete req.body.child_id;
            delete req.body.time;
            _context21.next = 9;
            return annualPaymentTable.update({
              val: req.body,
              where: "child_id = ".concat(child_id, " AND time LIKE '").concat(new Date().getFullYear(), "%'")
            });

          case 9:
            _context21.next = 13;
            break;

          case 11:
            _context21.next = 13;
            return annualPaymentTable.add(req.body);

          case 13:
            res.sendStatus(200);

          case 14:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee20);
  }));

  return function (_x39, _x40) {
    return _ref20.apply(this, arguments);
  };
}());
app.post('/api/pay',
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21(req, res) {
    return regeneratorRuntime.wrap(function _callee21$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return paymentTable.add(req.body);

          case 2:
            res.sendStatus(200);

          case 3:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee21);
  }));

  return function (_x41, _x42) {
    return _ref21.apply(this, arguments);
  };
}());
app.post('/api/addVacation',
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee22(req, res) {
    return regeneratorRuntime.wrap(function _callee22$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return vacationTable.remove({
              where: "child_id = ".concat(req.body.child_id)
            });

          case 2:
            _context23.next = 4;
            return vacationTable.add(req.body);

          case 4:
            res.sendStatus(200);

          case 5:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee22);
  }));

  return function (_x43, _x44) {
    return _ref22.apply(this, arguments);
  };
}());
app.post('/api/getTodayPayment',
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23(req, res) {
    var m, y, d, nonCash, cash;
    return regeneratorRuntime.wrap(function _callee23$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            m = new Date().getMonth() + 1;
            m = m > 9 ? m : '0' + m;
            y = new Date().getFullYear();
            d = new Date().getDate();
            d = d > 9 ? d : '0' + d;
            nonCash = 0;
            _context24.next = 8;
            return paymentTable.getAll({
              where: "type = 0 AND time LIKE '".concat(y, "-").concat(m, "-").concat(d, "'")
            });

          case 8:
            _context24.t0 = function (row) {
              nonCash += row.amount;
            };

            _context24.sent.forEach(_context24.t0);

            cash = 0;
            _context24.next = 13;
            return paymentTable.getAll({
              where: "type = 1 AND time LIKE '".concat(y, "-").concat(m, "-").concat(d, "'")
            });

          case 13:
            _context24.t1 = function (row) {
              cash += row.amount;
            };

            _context24.sent.forEach(_context24.t1);

            res.json({
              nonCash: nonCash,
              cash: cash
            });

          case 16:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee23);
  }));

  return function (_x45, _x46) {
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
  console.log();
  console.log();
  console.log('\t\x1b[1m\x1b[36mДобро пожаловать в \x1b[4mУмники и Умницы. Администрирование\x1b[0m\x1b[1m\x1b[36m!\x1b[0m');
  console.log('\t\x1b[1m\x1b[36mК сайту можно обратиться по ссылке:\x1b[0m');
  console.log('\t\x1b[1m\x1b[36m - \x1b[4mhttp://127.0.0.1\x1b[0m \x1b[1m\x1b[36m-\x1b[0m');
  console.log();
  console.log();
  (0, _opn["default"])('http://127.0.0.1/');
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
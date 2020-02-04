"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("@babel/polyfill");

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var sqlite3 = require('sqlite3').verbose();

var TableError =
/*#__PURE__*/
function (_Error) {
  _inherits(TableError, _Error);

  function TableError(props) {
    _classCallCheck(this, TableError);

    return _possibleConstructorReturn(this, _getPrototypeOf(TableError).call(this, props));
  }

  return TableError;
}(_wrapNativeSuper(Error));

var Table =
/*#__PURE__*/
function () {
  function Table(table) {
    var _this = this;

    _classCallCheck(this, Table);

    _table.set(this, {
      writable: true,
      value: void 0
    });

    _tableInfo.set(this, {
      writable: true,
      value: {}
    });

    _classPrivateFieldSet(this, _table, table);

    _classStaticPrivateFieldSpecGet(this.constructor, Table, _db).all("PRAGMA table_info(".concat(table, ")"), [], function (err, rows) {
      if (err) {
        console.error(err);
      } else {
        rows.forEach(function (row) {
          _classPrivateFieldGet(_this, _tableInfo)[row.name] = row.type;
        });
      }
    });
  }

  _createClass(Table, [{
    key: "add",
    value: function () {
      var _add = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var fields,
            _loop,
            column,
            columns,
            value,
            key,
            sql,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fields = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};

                if (!Object.keys(_classPrivateFieldGet(this, _tableInfo)).length) {
                  _context2.next = 9;
                  break;
                }

                _loop =
                /*#__PURE__*/
                regeneratorRuntime.mark(function _loop(column) {
                  var type;
                  return regeneratorRuntime.wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (Object.keys(_classPrivateFieldGet(_this2, _tableInfo)).includes(column)) {
                            _context.next = 5;
                            break;
                          }

                          type = 'varchar(64)';

                          if (typeof fields[column] === 'number') {
                            type = 'int';
                          } else if (typeof fields[column] === 'boolean') {
                            type = 'boolean';
                          }

                          _context.next = 5;
                          return new Promise(function (resolve) {
                            _classStaticPrivateFieldSpecGet(_this2.constructor, Table, _db).run("alter table ".concat(_classPrivateFieldGet(_this2, _table), " add ").concat(column, " ").concat(type), function (err) {
                              if (err) console.error(err);
                              resolve();
                            });
                          });

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _loop);
                });
                _context2.t0 = regeneratorRuntime.keys(fields);

              case 4:
                if ((_context2.t1 = _context2.t0()).done) {
                  _context2.next = 9;
                  break;
                }

                column = _context2.t1.value;
                return _context2.delegateYield(_loop(column), "t2", 7);

              case 7:
                _context2.next = 4;
                break;

              case 9:
                columns = '';
                value = '';

                for (key in fields) {
                  columns += "'".concat(key, "', ");
                  if (typeof fields[key] === 'number') value += "".concat(fields[key], ", ");else value += "\"".concat(fields[key], "\", ");
                }

                columns = columns.substring(0, columns.length - 2);
                value = value.substring(0, value.length - 2);
                sql = "INSERT INTO '".concat(_classPrivateFieldGet(this, _table), "'(").concat(columns, ") VALUES (").concat(value, ");");
                return _context2.abrupt("return", new Promise(function (resolve) {
                  _classStaticPrivateFieldSpecGet(_this2.constructor, Table, _db).run(sql, [], function (err) {
                    if (err) {
                      console.error(sql);
                      console.error(err);
                      resolve(-1);
                    }

                    _classStaticPrivateFieldSpecGet(_this2.constructor, Table, _db).get("select max(id) from ".concat(_classPrivateFieldGet(_this2, _table)), [], function (err, row) {
                      resolve(parseInt(row['max(id)']));
                    });
                  });
                }));

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      function add() {
        return _add.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: "get",
    value: function get() {
      var _this3 = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          columns = _ref.columns,
          _ref$where = _ref.where,
          where = _ref$where === void 0 ? '' : _ref$where;

      var sql = "SELECT ".concat(columns ? columns : '*', " FROM '").concat(_classPrivateFieldGet(this, _table), "' ").concat(where ? "WHERE ".concat(where) : '');
      return new Promise(function (resolve) {
        _classStaticPrivateFieldSpecGet(_this3.constructor, Table, _db).get(sql, [], function (err, rows) {
          return resolve(rows);
        });
      });
    }
  }, {
    key: "getAll",
    value: function getAll() {
      var _this4 = this;

      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          columns = _ref2.columns,
          _ref2$where = _ref2.where,
          where = _ref2$where === void 0 ? '' : _ref2$where,
          _ref2$order = _ref2.order,
          order = _ref2$order === void 0 ? '' : _ref2$order,
          _ref2$distinct = _ref2.distinct,
          distinct = _ref2$distinct === void 0 ? false : _ref2$distinct;

      var sql = "SELECT ".concat(distinct ? 'DISTINCT' : '', " ").concat(columns ? columns : '*', "\n            FROM '").concat(_classPrivateFieldGet(this, _table), "' \n            ").concat(where ? "WHERE ".concat(where) : '', " \n            ").concat(order ? "ORDER BY ".concat(order) : '');
      return new Promise(function (resolve) {
        _classStaticPrivateFieldSpecGet(_this4.constructor, Table, _db).all(sql, [], function (err, rows) {
          return resolve(rows);
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _this5 = this;

      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$val = _ref3.val,
          val = _ref3$val === void 0 ? {} : _ref3$val,
          _ref3$where = _ref3.where,
          where = _ref3$where === void 0 ? '' : _ref3$where;

      if (!val) throw new TableError('Field "val" is required');
      if (!where) throw new TableError('Field "where" is required');
      var sql,
          set = [];

      for (var key in val) {
        set.push("".concat(key, " = ").concat(typeof val[key] === 'number' ? val[key] : "'".concat(val[key], "'")));
      }

      sql = "UPDATE '".concat(_classPrivateFieldGet(this, _table), "' SET ").concat(set.join(','), " WHERE ").concat(where);
      return new Promise(function (resolve) {
        _classStaticPrivateFieldSpecGet(_this5.constructor, Table, _db).run(sql, [], function (err) {
          return resolve(!err);
        });
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this6 = this;

      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$where = _ref4.where,
          where = _ref4$where === void 0 ? '' : _ref4$where;

      if (!where) throw new TableError('Field "where" is required');
      var sql = "DELETE FROM '".concat(_classPrivateFieldGet(this, _table), "' WHERE ").concat(where);
      return new Promise(function (resolve) {
        _classStaticPrivateFieldSpecGet(_this6.constructor, Table, _db).run(sql, [], function (err) {
          return resolve(!err);
        });
      });
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      var _this7 = this;

      var sql = "DELETE FROM '".concat(_classPrivateFieldGet(this, _table), "'");
      return new Promise(function (resolve) {
        _classStaticPrivateFieldSpecGet(_this7.constructor, Table, _db).run(sql, [], function (err) {
          return resolve(!err);
        });
      });
    }
  }], [{
    key: "close",
    value: function close() {
      this.constructor.close();
    }
  }]);

  return Table;
}();

exports["default"] = Table;

var _table = new WeakMap();

var _tableInfo = new WeakMap();

var _db = {
  writable: true,
  value: new sqlite3.Database("".concat(_os["default"].homedir(), "/\u0423\u043C\u043D\u0438\u043A\u0438 \u0438 \u0443\u043C\u043D\u0438\u0446\u044B/db.db"), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
};
//# sourceMappingURL=db.js.map
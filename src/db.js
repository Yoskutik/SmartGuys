import '@babel/polyfill';
import os from 'os';
const sqlite3 = require('sqlite3').verbose();

class TableError extends Error {
    constructor(props) {super(props);}
}

export default class Table {
    static #db = new sqlite3.Database(`${os.homedir()}/Умники и умницы/db.db`,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    #table;
    #tableInfo = {};

    constructor(table) {
        this.#table = table;

        this.constructor.#db.all(`PRAGMA table_info(${table})`, [], (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                rows.forEach(row => {
                   this.#tableInfo[row.name] = row.type;
                });
            }
        });
    }

    async add(fields = {}) {
        if (Object.keys(this.#tableInfo).length) {
            for (let column in fields) {
                if (!Object.keys(this.#tableInfo).includes(column)) {
                    let type = 'varchar(64)';
                    if (typeof fields[column] === 'number') {
                        type = 'int';
                    } else if (typeof fields[column] === 'boolean') {
                        type = 'boolean';
                    }
                    await new Promise(resolve => {
                        this.constructor.#db.run(`alter table ${this.#table} add ${column} ${type}`, err => {
                            if (err) console.error(err);
                            resolve();
                        });
                    });
                }
            }
        }

        let columns = '';
        let value = '';
        for (let key in fields) {
            columns += `'${key}', `;
            if (typeof fields[key] === 'number')
                value += `${fields[key]}, `;
            else
                value += `"${fields[key]}", `;
        }
        columns = columns.substring(0, columns.length - 2);
        value = value.substring(0, value.length - 2);
        const sql = `INSERT INTO '${this.#table}'(${columns}) VALUES (${value});`;
        return new Promise(resolve => {
            this.constructor.#db.run(sql, [], err => {
                if (err) {
                    console.error(sql);
                    console.error(err);
                    resolve(-1);
                }
                this.constructor.#db.get(`select max(id) from ${this.#table}`, [], (err, row) => {
                    resolve(parseInt(row['max(id)']));
                });
            });
        });
    }

    get({columns, where = ''} = {}) {
        const sql = `SELECT ${columns ? columns : '*'} FROM '${this.#table}' ${where ? `WHERE ${where}` : ''}`;
        return new Promise(resolve => {
            this.constructor.#db.get(sql, [], (err, rows) => resolve(rows));
        });
    }

    getAll({columns, where = '', order = '', distinct = false} = {}) {
        const sql = `SELECT ${distinct ? 'DISTINCT' : ''} ${columns ? columns : '*'}
            FROM '${this.#table}' 
            ${where ? `WHERE ${where}` : ''} 
            ${order ? `ORDER BY ${order}` : ''}`;
        return new Promise(resolve => {
            this.constructor.#db.all(sql, [], (err, rows) => resolve(rows));
        });
    }

    update({val = {}, where = ''} = {}) {
        if (!val) throw new TableError('Field "val" is required');
        if (!where) throw new TableError('Field "where" is required');
        let sql, set = [];
        for (let key in val)
            set.push(`${key} = ${typeof val[key] === 'number' ? val[key] : `'${val[key]}'`}`);
        sql = `UPDATE '${this.#table}' SET ${set.join(',')} WHERE ${where}`;
        return new Promise(resolve => {
            this.constructor.#db.run(sql, [], err => resolve(!err));
        });
    }

    remove({where = ''} = {}) {
        if (!where) throw new TableError('Field "where" is required');
        const sql = `DELETE FROM '${this.#table}' WHERE ${where}`;
        return new Promise(resolve => {
            this.constructor.#db.run(sql, [], err => resolve(!err));
        })
    }

    removeAll() {
        const sql = `DELETE FROM '${this.#table}'`;
        return new Promise(resolve => {
            this.constructor.#db.run(sql, [], err => resolve(!err));
        });
    }

    static close() {
        this.constructor.close();
    }
}
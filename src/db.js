import '@babel/polyfill';
import os from 'os';
const sqlite3 = require('sqlite3').verbose();

class TableError extends Error {
    constructor(props) {super(props);}
}

export default class Table {
    static #db = new sqlite3.Database(`${os.homedir()}/Умники и умницы/db.db`,  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    #table;

    constructor(table) {
        this.#table = table;
    }

    add(fields = {}) {
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
            Table.#db.run(sql, [], err => {
                if (err) {
                    console.log(sql);
                    console.log(err);
                    resolve(-1);
                }
                Table.#db.get(`select max(id) from ${this.#table}`, [], (err, row) => {
                    resolve(parseInt(row['max(id)']));
                });
            });
        });
    }

    get({columns, where = ''} = {}) {
        const sql = `SELECT ${columns ? columns : '*'} FROM '${this.#table}' ${where ? `WHERE ${where}` : ''}`;
        return new Promise(resolve => {
            Table.#db.get(sql, [], (err, rows) => resolve(rows));
        });
    }

    getAll({columns, where = '', order = '', distinct = false} = {}) {
        const sql = `SELECT ${distinct ? 'DISTINCT' : ''} ${columns ? columns : '*'}
            FROM '${this.#table}' 
            ${where ? `WHERE ${where}` : ''} 
            ${order ? `ORDER BY ${order}` : ''}`;
        return new Promise(resolve => {
            Table.#db.all(sql, [], (err, rows) => resolve(rows));
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
            Table.#db.run(sql, [], err => resolve(!err));
        });
    }

    remove({where = ''} = {}) {
        if (!where) throw new TableError('Field "where" is required');
        const sql = `DELETE FROM '${this.#table}' WHERE ${where}`;
        return new Promise(resolve => {
            Table.#db.run(sql, [], err => resolve(!err));
        })
    }

    removeAll() {
        const sql = `DELETE FROM '${this.#table}'`;
        return new Promise(resolve => {
            Table.#db.run(sql, [], err => resolve(!err));
        });
    }

    static close() {
        Table.close();
    }
}
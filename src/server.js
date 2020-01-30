import cookieParser from 'cookie-parser';
import compression from 'compression';
import bodyParser from 'body-parser';
import express from 'express';
import Table from './bin/db';
import { zip } from 'nodeJs-zip';
import request from 'request';
import path from 'path';
import opn from 'opn';
import md5 from 'md5';
import fs from 'fs';
import os from "os";

const weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const address = '127.0.0.1';
const port = 80;
const app = express();

let childTable = new Table('child');
let teacherTable = new Table('teacher');
let paymentTable = new Table('payment');
let vacationTable = new Table('vacation');
let scheduleTable = new Table('schedule');
let attendanceTable = new Table('attendance');
let annualPaymentTable = new Table('annual_payment');

async function log(message) {
    let [yyyy, mm, dd] = new Date().toISOString().match(/\d+/g);
    let [, , h, m] = new Date().toString().match(/\d+/g);
    console.log(`[${dd}.${mm}.${yyyy} ${h}:${m}] ${message}`);
}

// Requisites
let ITN, PSRN, prices;
(() => {
    let lines = fs.readFileSync('./Юридические реквизиты.txt', 'utf-8').split('\n');
    ITN = lines[0].replace('ИНН: ', '');
    PSRN = lines[1].replace('ОГРН: ', '');
    lines = fs.readFileSync('./Цены.txt', 'utf-8').split('\n');
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
        psychologist: parseInt(lines[10].match(/\d+/)[0]),
    }
})();

//version
let version, lastUpdateAt;
(() => {
    let lines = fs.readFileSync('./version.txt', 'utf-8').split('\n');
    version = lines[0].replace('current version: ', '');
    lastUpdateAt = lines[1].replace('last update: ', '');
})();

// Attendance daily table update
async function updateDayAttendance() {
    let attend = await attendanceTable.get({
        where: `time = '${getTime()}'`
    });
    if (!attend) {
        let schedule = await scheduleTable.getAll({
            where: `weekday = ${new Date().getDay() - 1}`,
        });
        for (const row of schedule) {
            await attendanceTable.add({
                time: getTime(),
                type: 0,
                lesson_type: row.type,
                child_id: row.child_id,
            });
        }
    }
}
updateDayAttendance();
setInterval(updateDayAttendance, 2 * 60 * 60 * 1000);

// Backups
async function backup() {
    const dir = path.join(require('os').homedir(), '.smartGuys');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let files = fs.readdirSync(dir);
    let date = new Date(getTime());

    files.forEach(file => {
        let time = file.replace('.zip', '');
        if (date - new Date(time) > 7 * 24 * 60 * 60 * 1000) {
            fs.unlinkSync(path.join(dir, file));
        }
    });

    zip(`${os.homedir()}/Умники и умницы/db.db`, {
        name: getTime(),
        dir,
    });

    const options = {
        method: 'POST',
        uri: 'https://myinspire-ph.ru/api/smartguys.php',
        formData: {
            database: fs.createReadStream(path.join(require('os').homedir(), '.smartGuys', `${getTime()}.zip`)),
            hidden: md5(`${getTime()}qwertyuiop`),
        },
        data: {
            hidden: md5(`${getTime()}qwertyuiop`),
        },
    };

    await request(options, (err, res, body) => {
        if (!err) console.log(res.body);
    });
}
backup();
setInterval(backup, 2 * 60 * 60 * 1000);

app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', '.ejs');
app.set('views', __dirname);

app.use((req, res, next) => {
    if (req.cookies.version !== version || res.cookie.lastUpdateAt !== lastUpdateAt) {
        res.cookie('version', version, {path: '/'});
        res.cookie('lastUpdateAt', lastUpdateAt, {path: '/'});
    }

    if (req.method === 'GET'
            && !req.url.match(/\/.+\..+$/)
            && !req.cookies.admin) {
        res.render('login/index.ejs');
    } else {
        next();
    }
});

app.get('/',                    async (req, res) => {
    let childrenDict = {};
    (await childTable.getAll({columns: 'id, fio, birthday'}))
        .forEach(c => {
            let [dd, mm, yyyy] = c.birthday.match(/\d+/g).map(v => parseInt(v));
            let birthday = new Date(`${months[mm-1]} ${dd} ${yyyy}`);
            childrenDict[c.id] = {
                fio: c.fio,
                id: c.id,
                years: new Date().getFullYear() - birthday.getFullYear(),
            };
        });

    let teachersDict = {};
    (await teacherTable.getAll({columns: 'id, fio'}))
        .forEach(t => teachersDict[t.id] = t.fio);

    let teachers = {};
    let childIds = [];
    let schedules = await scheduleTable.getAll({
        where: `weekday = ${new Date().getDay() - 1}`,
        order: 'time'
    });
    for (let i in schedules) {
        if (!schedules[i].time.validFor(new Date())) continue;
        if (typeof teachers[teachersDict[schedules[i].teacher_id]] === 'undefined') {
            teachers[teachersDict[schedules[i].teacher_id]] = [];
        }
        teachers[teachersDict[schedules[i].teacher_id]].push({
            ...childrenDict[schedules[i].child_id],
            time: schedules[i].time,
            lesson_type: schedules[i].type,
            attendance: await attendanceTable.get({
                where: `child_id = ${schedules[i].child_id} 
                    AND time = '${getTime()}'
                    AND lesson_type = ${schedules[i].type}`,
            }),
        });
    }

    res.render('home/index.ejs', { teachers });
});
app.get('/children/',           async (req, res) => {
    res.render('children/index.ejs');
});
app.get('/schedule/',           async (req, res) => {
    let childrenDict = {};
    (await childTable.getAll({columns: 'id, fio, birthday'}))
        .forEach(c => {
            let [dd, mm, yyyy] = c.birthday.match(/\d+/g).map(v => parseInt(v));
            let birthday = new Date(`${months[mm-1]} ${dd} ${yyyy}`);
            childrenDict[c.id] = {
                fio: c.fio,
                id: c.id,
                years: new Date().getFullYear() - birthday.getFullYear(),
            };
        });

    let teachersDict = {};
    (await teacherTable.getAll({columns: 'id, fio'}))
        .forEach(t => teachersDict[t.id] = t.fio);

    let schedule = {
        children: [[], [], [], [], [], [], []],
        teachers: [[], [], [], [], [], [], []],
    };
    for (let i in weekdays) {
        (await scheduleTable.getAll({
            where: `weekday = ${i}`,
            order: 'time',
        })).forEach(row => {
            schedule.children[i].push({
                fio: childrenDict[row.child_id].fio,
                time: row.time,
                id: row.child_id,
            });
        });

        // forEach is forbidden
        let tmp = await scheduleTable.getAll({
            distinct: true,
            columns: 'time, teacher_id',
            where: `weekday = ${i}`,
            order: 'time',
        });
        for (let j in tmp) {
            let children = [];
            let tmp0 = await scheduleTable.getAll({
                where: `weekday = ${i} 
                    AND time = '${tmp[j].time}' 
                    AND teacher_id = ${tmp[j].teacher_id}`,
                order: 'time',
            });
            for (let k in tmp0) {
                let attendance =
                    await attendanceTable.get({
                        where: `child_id = ${tmp0[k].child_id} 
                            AND time = '${getTime(i)}'
                            AND lesson_type = ${tmp0[k].type}`
                    }) || {
                        type: 0
                    };
                children.push({
                    ...childrenDict[tmp0[k].child_id],
                    attendance,
                    lesson_type: tmp0[k].type,
                });
            }
            schedule.teachers[i].push({
                fio: teachersDict[tmp[j].teacher_id],
                time: tmp[j].time,
                children,
            });
        }
    }

    res.render('schedule/index.ejs', { schedule });
});
app.get('/child/',              async (req, res) => {
    let schedule = await scheduleTable.getAll({where: `child_id = ${req.query.id}`, order: 'weekday'});
    let child =  await childTable.get({where: `id = ${req.query.id}`});
    for (let i in schedule) {
        schedule[i].teacher = await teacherTable.get({where: `id = ${schedule[i].teacher_id}`});
    }
    res.render('child/index.ejs', {
        child,
        schedule,
        attendance: await attendanceTable.getAll({
            where: `child_id = ${req.query.id}`,
            order: 'time DESC',
        }),
        vacation: await vacationTable.get({
            where: `child_id = ${req.query.id} AND period LIKE '%${new Date().getFullYear()}%'`,
        }),
        payment: await paymentTable.getAll({
            where: `child_id = ${req.query.id}`,
            order: 'time DESC, id DESC',
        })
    });
});
app.get('/payment/',            async (req, res) => {
    let m = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    res.render('payment/index.ejs', {
        child: await childTable.get({
            where: `id = ${req.query.id}`
        }),
        attendance: await attendanceTable.getAll({
            where: `child_id = ${req.query.id} 
                AND time LIKE '${m === 1 ? year - 1 : year}-${m === 1 ? 12 : m - 1 > 9 ? m - 1 : '0' + (m - 1)}%' 
                AND lesson_type < 6`,
        }),
        annual: await annualPaymentTable.getAll({
            where: `child_id = ${req.query.id} AND time LIKE '${year}%'`,
        }),
        payment: await paymentTable.getAll({
            where: `child_id = ${req.query.id} AND time LIKE '${year}-${m > 9 ? m : '0' + m}%'`,
        }),
        prices,
    });
});
app.get('/payment/voucher/',    async (req, res) => {
    res.render('payment/voucher.ejs', {
        query: req.query,
        prices,
        ITN,
        PSRN,
    })
});
app.get('/login/',              async (req, res) => {
    res.render('login/index.ejs');
});
app.get('/teachers/',           async (req, res) => {
    res.render('teachers/index.ejs', {
        teachers: await teacherTable.getAll(),
    })
});
app.get('/teachers/schedule/',  async (req, res) => {
    let childrenDict = {};
    (await childTable.getAll({columns: 'id, fio, birthday'}))
        .forEach(c => {
            let [dd, mm, yyyy] = c.birthday.match(/\d+/g).map(v => parseInt(v));
            let birthday = new Date(`${months[mm-1]} ${dd} ${yyyy}`);
            childrenDict[c.id] = {
                fio: c.fio,
                id: c.id,
                years: new Date().getFullYear() - birthday.getFullYear(),
            };
        });

    let schedule = [];
    for (let i = 0; i < 7; i++) {
        let sch = await scheduleTable.getAll({
            where: `teacher_id = ${req.query.id} AND weekday = ${i}`,
            order: 'time',
        });
        for (let row of sch) {
            row.child = childrenDict[row.child_id];
        }
        schedule.push({
            day: weekdays[i],
            schedule: sch,
        });
    }

    res.render('teachers/schedule.ejs', {
        schedule,
        fio: (await teacherTable.get({
            where: `id = ${req.query.id}`,
        })).fio,
    })
});
app.get('/payment/report/',     async (req, res) => {
    let payments = await paymentTable.getAll({
        where: `time LIKE '${getTime()}%'`
    });
    for (let row of payments) {
        row.child = await childTable.get({where: `id = ${row.child_id}`});
    }
    res.render('payment/report/index.ejs', { payments });
});

app.post('/api/addChild',           async (req, res) => {
    let child_id = await childTable.add(req.body.child);

    for (let i in req.body.schedule) {
        await scheduleTable.add({...req.body.schedule[i], child_id});
    }

    log(`Ребёнок ${req.body.child.fio} был добавлен в систему.`);
    res.json({status: 'OK'});
});
app.post('/api/addTeacher',         async (req, res) => {
    log(`Учитель ${req.body.fio} был добавлен в систему.`);
    res.json({id: await teacherTable.add(req.body)});
});
app.post('/api/getTeacher',         async (req, res) => {
    res.json(await teacherTable.getAll({where: `fio LIKE '%${req.body.fio}%'`, order: 'fio'}));
});
app.post('/api/getChild',           async (req, res) => {
    res.json(await childTable.getAll({where: `fio LIKE '%${req.body.fio}%'`, order: 'fio'}));
});
app.post('/api/updateChild',        async (req, res) => {
    let b = await childTable.update({
        where: `id = ${req.body.id}`,
        val: req.body.child,
    });
    await scheduleTable.remove({
        where: `child_id = ${req.body.id}`
    });
    for (let i in req.body.schedule) {
        await scheduleTable.add(Object.assign(req.body.schedule[i], {child_id: req.body.id}));
    }
    log(`Информация о ${req.body.child.fio} была обновлена.`);
    res.json({status: b ? 'OK' : 'ERROR'});
});
app.post('/api/removeChild',        async (req, res) => {
    await childTable.remove({
        where: `id = ${req.body.id}`,
    });
    await scheduleTable.remove({
        where: `child_id = ${req.body.id}`,
    });
    log(`Ребёнок ${req.body.fio} был удален из системы.`);
    res.sendStatus(200);
});
app.post('/api/updateTeacher',      async (req, res) => {
    await teacherTable.update({
        val: {fio: req.body.fio},
        where: `id = ${req.body.id}`,
    });
    log(`Информация о ${req.body.fio} была обновлена.`);
    res.json({status: 'OK'});
});
app.post('/api/removeTeacher',      async (req, res) => {
    await teacherTable.remove({
        where: `id = ${req.body.id}`
    });
    await scheduleTable.remove({
        where: `teacher_id = ${req.body.id}`
    });
    log(`Учитель ${req.body.fio} был удален из системы.`);
    res.json({status: 'OK'});
});
app.post('/api/addAttendance',      async (req, res) => {
    for (let i in req.body.attendance) {
        // ¯\_(ツ)_/¯ Это трогать нельзя
        if (req.body.attendance[i].time === undefined) continue;
        await attendanceTable.remove({
            where: `child_id = ${req.body.attendance[i].child_id} 
                AND time = '${req.body.attendance[i].time}'
                AND lesson_type = ${req.body.attendance[i].lesson_type}`,
        });
        await attendanceTable.add(req.body.attendance[i]);
    }
    if (req.body.attendance) {
        log(`Обновление таблицы посещаемости. Всего обновлено ${req.body.attendance.length} строк.`);
    }
    res.json({status: 'OK'});
});
app.post('/api/removeAttendance',   async (req, res) => {
    for (let i in req.body.ids) {
        await attendanceTable.remove({where: `id = ${req.body.ids[i]}`});
    }
    if (req.body.ids) {
        log(`Обновление таблицы посещаемости. Всего удалено ${req.body.ids.length} строк.`);
    }
    res.json({status: 'OK'});
});
app.post('/api/payAnnual',          async (req, res) => {
    let child_id = req.body.child_id;
    let child = await childTable.get({where: `id = ${child_id}`});
    let annual = await annualPaymentTable.get({
        where: `child_id = ${child_id} AND time LIKE '${new Date().getFullYear()}%'`
    });
    if (annual) {
        delete req.body.child_id;
        delete req.body.time;
        await annualPaymentTable.update({
            val: req.body,
            where: `child_id = ${child_id} AND time LIKE '${new Date().getFullYear()}%'`
        })
    } else {
        await annualPaymentTable.add(req.body);
    }
    let forWhat = `${req.body.fee ? "Ежегодный взнос" : ""}` +
        `${req.body.book ? (req.body.fee ? ", " : "") + "Пособие" : ""}` +
        `${req.body.fee_3 ? (req.body.fee || req.body.book ? ", " : "") + "Пособие_3" : ""}`;
    log(`Произведена оплата за ${forWhat} от ${child.fio}.`);
    res.sendStatus(200);
});
app.post('/api/pay',                async (req, res) => {
    let child = await childTable.get({where: `id = ${req.body.child_id}`});
    await paymentTable.add({
        ...(req.body),
        admin: req.cookies.admin,
    });
    log(`Произведена оплата на сумму ${req.body.amount}р от ${child.fio} по ${req.body.type === '0' ? "безналичному" : "наличному"} расчету.`);
    res.sendStatus(200);
});
app.post('/api/addVacation',        async (req, res) => {
    let child = await childTable.get({where: `id = ${req.body.child_id}`});
    await vacationTable.remove({
        where: `child_id = ${req.body.child_id}`,
    });
    await vacationTable.add(req.body);
    res.sendStatus(200);
});

app.use(function (request, response) {
    let url = request.url;
    if (fs.existsSync(__dirname + url))
        response.sendFile(__dirname + url);
    else {
        response.status(404).send('<b>Файл не найден</b>');
    }
});

app.listen(port, address, () => {
    console.clear();
    console.log('Добро пожаловать в Умники и Умницы. Администрирование!');
    console.log('К сайту можно обратиться по ссылкам:');
    console.log('  - http://127.0.0.1 -');
    console.log('  - http://localhost -');
    opn('http://localhost');
});

String.prototype.validFor = function (date) {
    let [hh0, mm0, hh1, mm1] = this.match(/\d{1,2}/g);
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    if (hh < parseInt(hh0))
        return false;
    if (hh === parseInt(hh0) && mm < parseInt(mm0))
        return false;
    if (hh > parseInt(hh1))
        return false;
    return !(hh === parseInt(hh1) && mm > parseInt(mm1));
};

function getTime(w) {
    let date = new Date();
    if (w !== undefined) {
        w = parseInt(w);
        date.setTime(date.getTime() + (1 + w - date.getDay()) * 24 * 60 * 60 * 1000);
    }
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return `${date.getFullYear()}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`;
}
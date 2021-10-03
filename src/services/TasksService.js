const Firebird = require('node-firebird');
const connection = require('../database');

// Helpers
const { getTimestamps, convertBufferArray } = require('../helpers/TasksHelpers');

// List all the tasks
const findAll = (req, res) => {
    Firebird.attach(connection, (err, db) => {
        if (err) console.log(err)

        db.query(`SELECT ID, NAME, DESCRIPTION, DONE, ACTIVE, CREATED_AT, UPDATED_AT
            FROM TASKS WHERE ACTIVE = true`, (err, result) => {
            if (err) {
                db.detach();
                res.status(400);

                return res.send(`\n${err.message}\n`);
            }

            const rows = [];
            result.forEach(row => {
                let tempObj = {};
                Object.keys(row).forEach(el => {
                    tempObj[el] = convertBufferArray(row[el]);
                });
                rows.push(tempObj);
            });

            res.status(200);

            return res.send(rows);
        });
    });
};

/**
 * Find only one task by his primary key.
 * @param   {any}  req
 * @param   {any}  res
 * @return  {object}
 */
const findOne = (req, res) => {
    const id = req.params.id;
    console.log(id);

    Firebird.attach(connection, (err, db) => {
        if (err) console.log(err)

        db.query(`SELECT ID, NAME, DESCRIPTION, DONE, ACTIVE, CREATED_AT, UPDATED_AT
        FROM TASKS WHERE ACTIVE = true AND ID = ?`, [id], (err, result) => {
            if (err) {
                db.detach();
                res.status(400);
                console.log(err)
                return res.send(`\n${err.message}\n`);
            }

            let task = {}
            result.forEach(row => {
                let tempObj = {};
                Object.keys(row).forEach(el => {
                    tempObj[el] = convertBufferArray(row[el]);
                });
                task = tempObj;
            });

            db.detach();

            return res.send(task);
        });
    });
}

/**
 * Insert a new task.
 * @param   {any}  req
 * @param   {any}  res
 * @return  {object}
 */
const insert = (req, res) => {
    const { NAME, DESCRIPTION } = req.body;
    const [CREATED_AT, UPDATED_AT] = getTimestamps();

    Firebird.attach(connection, (err, db) => {
        if (err) throw err;

        db.query('INSERT INTO TASKS (NAME, DESCRIPTION, CREATED_AT, UPDATED_AT) VALUES(?, ?, ?, ?)', [NAME, DESCRIPTION, CREATED_AT, UPDATED_AT], function (err, result) {
            if (err) {
                console.log(err);
            }

            db.detach();
            res.json({ 'status': 'Inserted' });
        });
    });
};

const update = (req, res) => {
    let id = req.params.id;
    let { name, description, done } = req.body;
    let [, updated_at] = getTimestamps();

    Firebird.attach(connection, (err, db) => {
        if (err) throw err;

        let payload = [name, description, `${done}`, updated_at, parseInt(id)];
        console.log('Payload: ', payload);

        db.query('UPDATE TASKS SET NAME=?, DESCRIPTION=?, DONE=? , UPDATED_AT=? WHERE ID=?', payload, function (err, result) {
            if (err) {
                console.log(err);
            }

            db.detach();
            res.json({ 'status': `Task number ${id} updated - ${updated_at}` });
        });
    });
};

const inactivate = (req, res) => {
    let id = req.params.id;
    let [, updated_at] = getTimestamps();

    Firebird.attach(connection, (err, db) => {
        if (err) throw err;

        let payload = [updated_at, parseInt(id)];

        db.query('UPDATE TASKS SET ACTIVE=false, UPDATED_AT=? WHERE ID=?', payload, function (err, result) {
            if (err) {
                console.log(err);
            }

            db.detach();

            res.json({ 'status': `Task number ${id} inactivated - ${updated_at}`});
        });
    });
};

const reActivate = (req, res) => {
    let id = req.params.id;
    let [, updated_at] = getTimestamps();

    Firebird.attach(connection, (err, db) => {
        if (err) throw err;

        let payload = [updated_at, parseInt(id)];

        db.query('UPDATE TASKS SET ACTIVE=true, UPDATED_AT=? WHERE ID=?', payload, function (err, result) {
            if (err) {
                console.log(err);
            }

            db.detach();

            res.json({ 'status': `Task number ${id} activated - ${updated_at}`});
        });
    });
};

module.exports = {
    findAll,
    findOne,
    insert,
    update,
    inactivate,
    reActivate
}
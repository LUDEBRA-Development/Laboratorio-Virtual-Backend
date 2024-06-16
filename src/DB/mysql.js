const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let connection; 

function conectionMysql(){
    connection = mysql.createConnection(dbconfig);
    connection.connect((err)=>{
        if(err){
            console.log(err)
            setTimeout(conectionMysql, 200);
        }else{
            console.log("database connection successful")
        }
    });
    connection.on('error', err =>{
        console.log(err);
        if(err.code === "PROTOCOL_CONNECTION_LOST"){
            conectionMysql();
        }else{
            throw err; 
        }
    }); 
}

conectionMysql(); 

function getAll(table){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table}`, (err, result)=>{
            return err ?  reject(err) :  resolve(result);
        })
    })
}

function add(table, data){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`,data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function update(table, data, conditions) {
    return new Promise((resolve, reject) => {
        const dataKeys = Object.keys(data);
        const dataValues = dataKeys.map(key => data[key]);
        const dataString = dataKeys.map(key => `${key} = ?`).join(', ');

        const conditionKeys = Object.keys(conditions);
        const conditionValues = conditionKeys.map(key => conditions[key]);
        const conditionString = conditionKeys.map(key => `${key} = ?`).join(' AND ');

        const query = `UPDATE ${table} SET ${dataString} WHERE ${conditionString}`;
        const values = [...dataValues, ...conditionValues];

        connection.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows > 0) {
                    resolve(result);
                } else {
                    const error = new Error('No se afectaron filas');
                    reject(error);
                }
            }
        });
    });
}

function query(table, conditions){
    return new Promise((resolve, reject)=>{
        const keys = Object.keys(conditions);
        const values = Object.values(conditions);
        const sql = `SELECT * FROM ${table} WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;

        connection.query(sql, values, (err, result)=>{
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    const error = new Error();
                    reject(error);
                }
            }
        });
    });
}

 



function getById(table, id){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE ?`, [id], (err, result)=>{
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    if(result.length ===1){
                        resolve(result[0]);
                    }else{
                        resolve(result);
                    }
                    
                } else {
                    const error = new Error();
                    reject(error);
                }
            }
        });
    });
}




function getUserInfo(sql, data){

    return new Promise((resolve, reject)=>{
        connection.query(sql, data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(result);
                } else {
                    const error = new Error();
                    reject(error);
                }
            }
        });
    });
}

async function exist(table, conditions) {
    return new Promise((resolve, reject) => {
        const conditionKeys = Object.keys(conditions);
        const conditionString = conditionKeys.map(key => `${key} = ?`).join(' AND ');

        const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${conditionString}`;
        const conditionValues = conditionKeys.map(key => conditions[key]);

        connection.query(query, conditionValues, (err, result) => {
            if (err) {
                reject(err);
            } else {
                const count = result[0].count;
                resolve(count > 0);
            }
        });
    });
}


function getJoin(query){
    return new Promise((resolve, reject)=>{
        connection.query(query, (err, result)=>{
            return err ?  reject(err) :  resolve(result);
        })
    })
}

function remove(table, data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT Statu FROM ?? WHERE ?', [table, data], (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                if (selectResult.length > 0 && selectResult[0].Statu === '2') {
                    const error = new Error('This item does not exist');
                    reject(error);
                } else {
                    connection.query('UPDATE ?? SET ? WHERE ?', [table, { Statu: 2 }, data], (updateErr, updateResult) => {
                        if (updateErr) {
                            reject(updateErr);
                        } else {
                            if (updateResult.affectedRows > 0) {
                                resolve(updateResult);
                            } else {
                                const error = new Error();
                                reject(error);
                            }
                        }
                    });
                }
            }
        });
    });
}


function removeDB(table, id){
    return new Promise((resolve, reject)=>{
        connection.query(`DELETE FROM ${table} WHERE ?`, [id], (err, result)=>{
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    if(result.length ===1){
                        resolve(result[0]);
                    }else{
                        resolve(result);
                    }

                } else {
                    const error = new Error();
                    reject(error);
                }
            }
        });
    });
}





module.exports = {
    getAll,
    getById,
    add,
    remove,
    query,
    update,
    getUserInfo,
    exist,
    getJoin,
    removeDB,
}
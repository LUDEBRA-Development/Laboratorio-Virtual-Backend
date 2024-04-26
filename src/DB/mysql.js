const mysql = require('mysql');
const config = require('../config');

/* const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    }
});

// Intentar ejecutar una consulta para verificar la conexión
knex.raw('SELECT 1')
    .then(() => {
        console.log('La conexión a la base de datos MySQL fue exitosa.');
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos MySQL:', error);
    });

 */

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
function getById(table, id){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE Identification = ?`, id, (err, result)=>{
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
function add(table, data){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ?`,[data, data], (err, result) => {
        return err ?  reject(err) :  resolve(result);
        });
    });
}
 


function remove(table, data) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM ?? WHERE ?', [table, data], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows > 0) {
                    resolve(result);
                } else {
                    const error = new Error();
                    reject(error);
                }
            }
        });
    });
}
function query(table, query){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE ?`, [query], (err, result)=>{
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
 

module.exports = {
    getAll,
    getById,
    add,
    remove,
    query,
}
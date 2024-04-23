const db = require ('../../DB/mysql')
const table = 'students'
function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, id);
}

function remove(body){
    return db.remove(table, body);
}

function add(body){
    return db.add(table, body);
}

module.exports ={
    getAll,
    getById,
    remove, 
    add, 
}
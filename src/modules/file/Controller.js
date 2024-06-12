const db = require ('../../DB/mysql');
const table = 'files';
function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, id);
}

function removeDB(id){
    return db.removeDB(table, {Id_task :id});
}

function add(data){
    return db.add(table, data);
}


module.exports ={
    removeDB,
    getAll,
    getById,
    add,
}




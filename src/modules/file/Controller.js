const db = require ('../../DB/mysql');
const table = 'files';
function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, id);
}

function deleteItemInDB(id){
    return db.deleteItemInDB(table, {Id_task :id});
}

function add(data){
    return db.add(table, data);
}


module.exports ={
    getAll,
    getById,
    add,
    deleteItemInDB,
}




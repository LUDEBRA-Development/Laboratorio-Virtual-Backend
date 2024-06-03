const db = require ('../../DB/mysql');
const table = 'files';
function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, id);
}

/* function remove(body){
    return db.remove(table, {Id_course :body.Id_course});
} */

function add(data){
    return db.add(table, data);
}

function update(body, id){
    const courseUser = {
        email_User: body.email_User,
        Id_course : body.Id_course
    }
    return db.update(table,courseUser,{email_User : email_User})
}
module.exports ={
    getAll,
    getById,
    add, 
    update,
}




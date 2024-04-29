const db = require ('../../DB/mysql')
const table = 'courses'
function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, id);
}

function remove(body){
    return db.remove(table, {Id_course :body.Id_course});
}

function add(body){
    const course = {
        Name : body.Name,
        Statu :  '1'
    }
    return db.add(table, course);
}
function update(body, id){
    const course = {
        Name: body.Name,
        Statu : body.Statu || '1'
    }
    return db.update(table,course,{Id_course : id})
}
module.exports ={
    getAll,
    getById,
    remove, 
    add, 
    update,
}
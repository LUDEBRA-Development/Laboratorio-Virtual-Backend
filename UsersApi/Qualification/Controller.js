const db = require ('../../DB/mysql');
const fileController = require('../file/Controller')
const coursesController = require ('../courses/cousesUsers/Controller')
const DBfile = require('../../DB/cloudFile/controller')
const table = 'tasks';


function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, {Id_task : id});
}

function add(body){
    if(body.Qualification){
              
     /*    const dataTaskUser = {
            Qualification_date: formattedDate,
            Feedback_comments: body.Feedback_comments || null,
            Qualification: body.Qualification,
        }
        await db.update('User_tasks',dataTaskUser, { Id_task: task.Id_task }) */
    }

}

async function update(body, id_task,file){
 

}

function remove(body){
    return db.remove(table, {Id_task :body.Id_task});
}
module.exports ={
    getAll,
    getById,
    add, 
    update,
    remove,
}




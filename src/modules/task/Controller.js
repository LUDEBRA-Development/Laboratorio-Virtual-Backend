const db = require ('../../DB/mysql');
const dbJoin = require ('../../DB/Joins')
const fileController = require('../file/Controller')
const coursesController = require ('../courses/cousesUsers/Controller')
const DBfile = require('../../DB/cloudFile/controller')
const Qualification = require('./Qualification/Controller')
const table = 'tasks';


function getAll(body){
    return dbJoin.getAllTask(body.email_User); 
}

function getByIdTask(id){
    return db.getById(table, {Id_task : id});
}
function getByIdCourse(id){
    return db.getById(table, {Id_course : id});
}
function add(body){
    const rolUser = body.rol; 
    if(rolUser==='2'){
        const fechaActual = new Date();
        const formattedDate = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
        if(formattedDate< body.Expiration_date){ 
            const data = {
                Id_simulador: body.Id_simulador,
                Id_course: body.Id_course,
                Name: body.Name,
                Descriptions: body.Descriptions || null,
                Creation_date : formattedDate, 
                Expiration_date : body.Expiration_date,
                statu :  '1'
            }
            return db.add(table, data);
        }else{
            throw new Error(); 
        }
    }else{
        throw new Error(); 
    }



}

async function update(body, id_task,file){
    let task;
    const rolUser = body.rol; 
    task = await getByIdTask(id_task);
    const conditions = {
        Id_course: task.Id_course,
        Email: body.email_User
    };
    const validateUser = await coursesController.query(conditions)
    if (validateUser) {
        if (rolUser === '2') {
            const fechaActual = new Date();
            const formattedDate = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
            const dataTask = {
                Name: body.Name || task.Name,
                Descriptions: body.Descriptions || task.Descriptions,
                Expiration_date: body.Expiration_date || task.Expiration_date
            }
            const dataQualification ={
                 Qualification : body.Qualification,
                 email_Users : body.email_Users, 
                 Id_task : task.Id_task
            }
            await db.update(table, dataTask, { Id_task: task.Id_task })
            if (file) {
                try {
                    await saveFile(file, task.Id_task, body.email_User);
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            if (rolUser === '3') {
                const fechaActual = new Date();
                const formattedDate = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
                const data = {
                    Delivery_date: formattedDate,
                    Comment: body.Comment || task.Comment || null
                }
                await db.update(table, data, { Id_task: task.Id_task });
                if (file) {
                    try {
                        await saveFile(file, task.Id_task, body.email_User);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
            else {
                throw new Error(); 
            }
        }
    } else {
        throw new Error();
    }

}
async function saveFile(file, Id_task, email_User){
    const cloudFile =  await DBfile.add(file)
    if(cloudFile){
        const dataFile = {
            Id_file : cloudFile.Id_file,
            Url_file : cloudFile.Url,
            Id_task : Id_task,
            email_User : email_User
         }
        await fileController.add(dataFile);
    }
}


function remove(body){
    return db.remove(table, {Id_task :body.Id_task});
}
module.exports ={
    getAll,
    getByIdTask,
    getByIdCourse,
    add, 
    update,
    remove,
}




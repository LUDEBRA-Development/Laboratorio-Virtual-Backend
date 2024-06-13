const db = require ('../../DB/mysql');
const dbJoin = require ('../../DB/Joins')
const fileController = require('../file/Controller')
const coursesController = require ('../courses/cousesUsers/Controller')
const DBfile = require('../../DB/cloudFile/controller')
const userTasks = require('../userTasks/Controller')
const table = 'tasks';


function getAll(body){
    return dbJoin.getAllTask(body.email_User); 
}

function getByIdTask(id){
    return db.getById(table, {Id_task : id});
}

async function getByIdCourse(id){
    try {
        const items = await db.getById(table, {Id_course : id});
        const itemsArray = Array.isArray(items) ? items : [items];
        if (itemsArray.length === 0) {
            throw {
                status: 404,
                message: "No tasks available for this course."
            };
        } else {
            return itemsArray
        }
    }catch(err){
        throw {
            status: 404,
            message: "No tasks available for this course."
        };
    }

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
        throw {
            status: 401,
            message: "Unauthorized: You do not have access to this resource."
        }; 
    }
}


async function update(body, id_task, file) {
    try {
        const { rol, email_User, Name, Descriptions, Expiration_date } = body;
l

        const conditions = {
            Id_course: task.Id_course,
            Email: email_User
        };
        const validateUser = await coursesController.exist(conditions);

        if (!validateUser) {
            throw {
                status: 401,
                message: "Unauthorized: You do not have access to this resource."
            };
        }

        if (rol !== '2') {
            throw {
                status: 401,
                message: "Unauthorized: You do not have access to this resource."
            };
        }

        const dataTask = {
            Name: Name || task.Name,
            Descriptions: Descriptions || task.Descriptions,
            Creation_date: task.Creation_date,
            Expiration_date: Expiration_date || task.Expiration_date
        };

       await  db.update(table, dataTask,conditions);
        if (file) {
            await saveFile(file, task.Id_task, email_User);
        }
    } catch (error) {
        throw error;
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


async function remove(id){
    await userTasks.removeDB(id);
    await DBfile.removeDB(id)
    await db.removeDB(table, {Id_task :id});
}




function validateDelivaryDate(Delivery_date, Expiration_date){
    if(Delivery_date <= Expiration_date){
        return true
    }
    return false
}

module.exports ={
    getAll,
    getByIdTask,
    getByIdCourse,
    add, 
    update,
    remove,
}




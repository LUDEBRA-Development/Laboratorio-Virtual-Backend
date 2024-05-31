const db = require ('../../DB/mysql');
const fileController = require('../file/Controller')
const coursesController = require ('../courses/cousesUsers/Controller')
const DBfile = require('../../DB/cloudinary/controller')
const table = 'tasks';
function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, {Id_task : id});
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


/*  asignada
    enviada
    calificada 
    vencida */

}

async function update(body, id_task,file){
    let task;
    const rolUser = body.rol; 
    if(rolUser==='2'){
        const fechaActual = new Date();
        const formattedDate = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
        task = await getById(id_task); 
        const data = {
            Name : body.Name || task.Name, 
            Descriptions : body.Descriptions || task.Descriptions,
            Expiration_date : body.Expiration_date || task.Expiration_date,
            Qualification_date : formattedDate,
            Feedback_comments : body.Feedback_comments || null,
            Qualification : body.Qualification, 
        }
        return db.update(table,data,{Id_task : id_task})
    }else{
        if(rolUser==='3'){
            task = await getById(id_task); 
            const fechaActual = new Date();
            const formattedDate = fechaActual.toISOString().slice(0, 19).replace('T', ' '); 
            const data = {
                Delivery_date: formattedDate,
                Comment : body.Comment || task.Comment || null
            }
            db.update(table,data,{Id_task : id_task});
            if(file){
                fileController.getById({email_User : body.email_User})
                .then(result=>{
                    if(id_task ==result.Id_task){
                         saveFile(file, id_task, task, body.email_User, result.Id_file); 
                    }else{
                        saveFile(file,id_task, task, body.email_User); 
                    }
                })
                .catch(err =>{
                    saveFile(file,id_task, task, body.email_User); 
                })
            }
        }
        else{
            throw new Error(); 
        }
    }
}
async function saveFile(file, Id_task, task, email_User,   Id_file){
    const folder = 'Documents';  
    let fileCloudinary=  await DBfile.update(file,folder ,Id_file)
     const dataFile = {
        Id_file : fileCloudinary.public_id,
        Url_file : fileCloudinary.url,
        Id_task : Id_task,
        email_User : email_User
    }
    const conditions = {
        Id_course: task.Id_course,
        Email: email_User
    };
    const validateUser = await coursesController.query(conditions)
    if(validateUser){
        fileController.add(dataFile); 
    } 
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



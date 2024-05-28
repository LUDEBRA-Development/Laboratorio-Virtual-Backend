const db = require ('../../DB/mysql');
const fileController = require('../file/Controller')
const coursesController = require ('../courses/cousesUsers/Controller')
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

async function update(body, id){
    let task;
    const rolUser = body.rol; 
    if(rolUser==='2'){
        const fechaActual = new Date();
        const formattedDate = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
        task = await getById(id); 
        const data = {
            Name : body.Name || task.Name, 
            Descriptions : body.Descriptions || task.Descriptions,
            Expiration_date : body.Expiration_date || task.Expiration_date,
            Qualification_date : formattedDate,
            Feedback_comments : body.Feedback_comments || null,
            Qualification : body.Qualification, 
        }
        return db.update(table,data,{Id_task : id})
    }else{
        if(rolUser==='3'){
            const fechaActual = new Date();
            const formattedDate = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
            const data = {
                Delivery_date: formattedDate,
            }
            db.update(table,data,{Id_task : id});
            const file = {
                Id_file : '123',
                Url_file : 'https:adad',
                Id_task : id,
                email_User : body.email_User
            }
            task = await getById(id); 
            const conditions = {
                Id_course: task.Id_course,
                Email: body.email_User
            };
            const validateUser = await coursesController.query(conditions)
            if(validateUser){
                fileController.add(file); 
            }
        }
        else{
            throw new Error(); 
        }
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




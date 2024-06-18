const db = require ('../../DB/mysql');
const table = 'User_tasks';
const taskController =  require('../task/Controller');

async function update(body, Email){
    try {
        const currentDate = new Date();
        const formatCurrentDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const condition = {
            email_Users : Email,
            ID_task : body.Id_task,
        }
        const exist = await db.exist(table,condition);
        const data = {}
        if (!exist) {
            data.email_Users = Email;
            data.Id_task = body.Id_task;
        }

        if (body.rol === '2') {
            data.qualification = body.qualification || null ;
            data.Qualification_date = formatCurrentDate;
            data.Feedback_comments = body.Feedback_comments || null;
            if (!validateNote(data.qualification)) {
                throw {
                    status: 400,
                    message: "Bad Request: The note must be in the range of 0 to 5."
                };
            }
        } else if (body.rol === '3') {
            let task = await taskController.getByIdTask(body.Id_task);
            data.Comment = body.Comment || null;
            data.Delivery_date = formatCurrentDate;
            if(!validateDelivaryDate(formatCurrentDate, task.Expiration_date)){
                throw {
                    status: 400,
                    message: "Bad Request: The note must be in the range of 0 to 5."
                };
            }
        }
        console.log("Data:      "+data);
        if (exist) {
            await db.update(table, data, condition);
        } else {
            await db.add(table, data);
        }

    }catch(err){
        throw  err;
    }
}

function removeDB(id){
    return db.removeDB(table, {Id_task :id});
}

function getByIdTask(body){
    return db.query(table, body);
}

function validateNote(note) {
    return note >= 0 && note <= 5;
}

function getAll(){
   return  db.getAll(table);
}


function validateDelivaryDate(Delivery_date, Expiration_date){
    return Delivery_date <= Expiration_date;

}
module.exports ={
    update,
    removeDB,
    getByIdTask,
    getAll,
}




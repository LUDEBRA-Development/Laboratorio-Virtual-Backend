const db = require ('../../../DB/mysql');
const table = 'User_tasks';


function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, {Id_task : id});
}

async function add(body){
     await db.add(table, body);

     /*    const dataTaskUser = {
            Qualification_date: formattedDate,
            Feedback_comments: body.Feedback_comments || null,
            Qualification: body.Qualification,
        }
        await db.update('User_tasks',dataTaskUser, { Id_task: task.Id_task }) */
}

async function update(body, Email){
    const data = {
        Qualification : body.Qualification
    }
    const condition = `email_Users = ${Email} AND Id_task = ${body.Id_task}`;
    await db.update(table, data, condition);
}

module.exports ={
    add, 
    update,
}




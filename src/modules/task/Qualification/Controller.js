const db = require ('../../../DB/mysql');
const table = 'User_tasks';

async function update(body){
    const condition = `email_Users = ${body.emailUser} AND Id_task = ${body.Id_task}`;
    const data = {
        Qualification : body.Qualification
    }
    const exist = await db.exist(table, condition);
    if(exist){
        await db.update(table, data, condition);
    }else{
        await db.add(table, body);
    }
}

function deleteItemInDB(id){
    return db.deleteItemInDB(table, {Id_task :id});
}
module.exports ={
    update,
    deleteItemInDB,
}




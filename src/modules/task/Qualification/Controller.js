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

module.exports ={
    update,
}




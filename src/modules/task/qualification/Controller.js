const db = require ('../../../DB/mysql');
const table = 'User_tasks';

async function update(body){
    try {
        const condition = `email_Users = '${body.email_User}' AND Id_task = '${body.Id_task}'`;
        const data = {
            qualification : body.qualification
        }
        if(valiateNote(data.qualification)){
             const exist = await db.exist(table, condition);
             if(exist){
                 await db.update(table, data, condition);
             }else{
                await db.add(table, body);
             }
        }else{
            throw {
                status: 400,
                message: "Bad Request: The note must be in the range of 0 to 5."
            };
        }

    }catch(err){
        throw  err;
    }

}

function deleteItemInDB(id){
    return db.deleteItemInDB(table, {Id_task :id});
}

function valiateNote(note) {
    if (note >= 0 && note <= 5) {
        return true;
    } else {
        return false;
    }
}

module.exports ={
    update,
    deleteItemInDB,
}




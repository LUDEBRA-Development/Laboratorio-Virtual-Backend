const db = require ('../../DB/mysql')
const auth = require('../auth/controller')
const table = 'Users'
function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, id);
}

function remove(body){
    return db.remove(table, body);
}

 async function add(body){ 
    const user = {
        First_Name: body.First_Name,
        Second_Name:body.Second_Name ,
        Email: body.Email
    }
    await db.add(table, user)
    const dateNow= new Date()
    const expirationDate = new Date(dateNow.getTime() + 3600000); // 1 hour

    if(body.Password || body.Email){
        await auth.add({
            email_User : body.Email,
            Creation_date : dateNow,
            Expiration_date : expirationDate,
            Password: body.Password
        })
    }
}

module.exports ={
    getAll,
    getById,
    remove, 
    add, 
}
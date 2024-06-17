const db = require ('../../DB/mysql')
const bcrypt = require("bcrypt"); 
const auth = require('../../authentication/index')
const table = 'access'


async function add(data){
    if(data){
        data.password =await bcrypt.hash(data.password.toString(), 5);  
    }
    return db.add(table, data);
}
function getById(id){
    return db.getById(table, {email_User : id});
}
async function update(data, condition){
    if(data){
        data.password =await bcrypt.hash(data.password.toString(), 5);  
    }
    return db.update(table, data, condition);
}

async function login(email, password){
    try {
        const user = await db.getById('Users',{Email : email});
        const access = await db.getById(table, {email_User : email});

        const data = {
            First_Name: user.First_Name,
            Last_Name : user.Second_Name,
            email_User: user.Email,
            Imagen : user.Profile_Picture,
            rol : access.rol
        }

        return bcrypt.compare(password, access.password)
            .then(result => {
                if (result) {
                    return auth.assignToken({...data})
                }
                throw {
                    status: 401,
                    message: "Invalid information."
                };
            })
            .catch(() => {
                throw {
                    status: 401,
                    message: "Invalid information."
                };
            })
    }catch(err){
        throw  err;
    }
}



module.exports ={
    add, 
    login, 
    update,
    getById,
}
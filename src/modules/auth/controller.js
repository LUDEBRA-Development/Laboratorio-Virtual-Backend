const db = require ('../../DB/mysql')
const bcrypt = require("bcrypt"); 
const auth = require('../../authentication/index')
const authMail = require('../authMail');
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
  //  if(authMail.validateMail(email)){ 
        const user = {
            email_User : email
        }
        const data = await db.query(table, user);

        return bcrypt.compare(password,data.password)
            .then(result =>{
                return auth.assignToken({...data})
            })
            .catch(err =>{
                throw new Error("Invalid information"); 
            })
/*     }else{
        throw new Error("Invalid information");
    } */
}



module.exports ={
    add, 
    login, 
    update,
    getById,
}
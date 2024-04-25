const db = require ('../../DB/mysql')
const bcrypt = require("bcrypt"); 
const auth = require('../../authentication/index')
const authMail = require('../authMail')
const table = 'access'


async function add(data){
    if(data){
        data.Password =await bcrypt.hash(data.Password.toString(), 5);  
    }
    return db.add(table, data);
}
async function login(email, password){
    if(authMail.validateMail(email)){
        const data = await db.query(table, {email_User : email});

        return bcrypt.compare(password,data.password)
            .then(result =>{
                return auth.assignToken({...data})
            })
            .catch(err =>{
                throw new Error("Invalid information"); 
            })
    }else{
        throw new Error("Invalid information");
    }
}



module.exports ={
    add, 
    login, 
}
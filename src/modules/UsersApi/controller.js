const db = require ('../../DB/mysql'); 
const auth = require('../auth/controller');
const authMail = require('../authMail'); 
const nodemailer = require('nodemailer');
const NodeCache = require("node-cache");
const table = 'Users'; 
const validationCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, id);
}

function remove(body){
    return db.remove(table, body);
}


async function generate(body){
    //if(authMail.validateMail(body.Email)){      
        const user = {
            Email: body.Email,
        }
        const validationCode = generateValidationCode();
        validationCache.set(user.Email, validationCode);
        await sendValidationEmail(user.Email,validationCode)
   // }
}
async function add(body){ 
   // if(authMail.validateMail(body.Email)){
        const user = {
            First_Name: body.First_Name,
            Second_Name:body.Second_Name ,
            Email: body.Email,
        }
        const cachedCode = validationCache.get(user.Email);
        if(body.validationCode === cachedCode && cachedCode){
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

/*     }else{
        throw new Error()
    } */
}

async function sendValidationEmail(email, validateCode) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'luisalbertovega@unicesar.edu.co', 
            pass: 'Luis1066348730' 
        }
    });
    const mailOptions = {
        from: 'luisalbertovega@unicesar.edu.co',
        to: email,
        subject: 'Código de validación',
        text: `Tu código de validación es: ${validateCode}`
    };
    await transporter.sendMail(mailOptions);
}

function generateValidationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); 
}
module.exports ={
    getAll,
    getById,
    remove, 
    add, 
    generate, 
}
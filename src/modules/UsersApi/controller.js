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
    //code teacher
        const user = {
            First_Name: body.First_Name,
            Second_Name:body.Second_Name ,
            Email: body.Email,
        }
        const rol = null; 
        const cachedCode = validationCache.get(user.Email);
        if(body.validationCode === cachedCode && cachedCode){
            await db.add(table, user)      
            if(body.Password || body.Email){
                codeTeacheDB= getCodeTeacher();
                if(body.CodeTeacher && (body.CodeTeacher==codeTeacheDB)){
                    rol = 3; 
                }else{
                    rol= 4; 
                }
                await auth.add({
                    email_User : body.Email,
                    password: body.Password,
                    rol: rol || 4, //ojo con esto
                    statu: body.statu || 1
                })
            }else{
                new Error(); 
            }
        }
        else{
            new Error(); 
        }
} 

async function update(body, Email, rolUser){
    const user = {
        First_Name: body.First_Name,
        Second_Name:body.Second_Name,
    };

    if(rolUser === '1'){ //ifAdmin
        const item = await auth.getById(Email); 
        const access = {
            email_User: body.Email || item[0].email_User,
            password : body.Password || item[0].password,
            rol : body.rol || item[0].rol,
            statu : body.statu || item[0].statu,
        };
            await db.update(table,user,{Email : Email});  
            if(body.Email || body.Password){
                await auth.update(access, {email_User : body.Email});
            }
    }else{
        if(body.First_Name || body.Second_Name){
            await db.update(table,user,{Email : Email});
        }
        const cachedCode = validationCache.get(body.Email);
        if((body.validationCode === cachedCode && cachedCode)){ //ifUserNormal
            const accessUser = {
                email_User: body.Email,
                password : body.Password,
                rol : item[0].rol,
                statu : item[0].statu,
            };
            await auth.update(accessUser, {email_User : access.email_User});
        }
    }
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
        subject: 'Te ayudamos a completar Tu Verificación',
        html: `
        <div>
            <p>Hola,</p>
            <p>Gracias por registrarte.</p>
            <p>Tu código de validación es: <strong>${validateCode}</strong></p>
            <p>Este código es necesario para completar el proceso de registro en nuestro sitio. Por favor, ingrésalo en la pagina web  para verificar tu correo electrónico y completar tu registro.</p>
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            <img src="http://imgfz.com/i/ClvOJ61.png" alt="Logo">
            <p>Saludos cordiales,<br>LUDEBRA LABS </p>
        </div>
    `       
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
    update,
}
const db = require ('../../DB/mysql'); 
const auth = require('../auth/controller');
const userCourse = require('../courses/cousesUsers/Controller')
const authMail = require('../authMail'); 
const nodemailer = require('nodemailer');
const fileOptions = require ('../../DB/cloudinary/controller')
const NodeCache = require("node-cache");
const table = 'Users'; 
const validationCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

function getAll(){
    return db.getAll(table);
}

function getById(id){
    return db.getById(table, {Email : id});
}

function remove(body){
    return db.remove(table, body);
}


async function generate(body){
    //if(authMail.validateMail(body.Email)){      
        console.log(body.Email)
        const user = {
            Email: body.Email,
        }
        const validationCode = await generateValidationCode();
        validationCache.set(user.Email, validationCode);
        const cachedCode = validationCache.get(user.Email);
        console.log(cachedCode);
        await sendValidationEmail(user.Email,validationCode)
   // }
}
async function add(body){ 
        const user = {
            First_Name: body.First_Name,
            Second_Name:body.Second_Name ,
            Email: body.Email,
            Profile_Picture : 'https://res.cloudinary.com/dxtvgcwyq/image/upload/v1716708743/nyh2tokpxdzmx30fbxxg.png',
            Id_Profile : null
        }      
        const cachedCode = validationCache.get(user.Email);  
       if(body.validationCode === cachedCode && cachedCode){

            await db.add(table, user)      
            if(body.Password && body.Email){
                await auth.add({
                    email_User : body.Email,
                    password: body.Password,
                    rol: body.rol, 
                    statu: body.statu || 1
                })
                if(body.code){
                    await userCourse.add({
                        Email : body.Email,
                        Id_course : body.Id_course
                    })
                }
            }else{
                new Error(); 
            } 
        }
        else{
            new Error(); 
        }
} 

async function update(body,file,Email){
    let rolUser =body.rol; 
    const users = await getById(Email); 
    const user = {
        First_Name: body.First_Name || users.First_Name,
        Second_Name:body.Second_Name || users.Second_Name,
        Email: users.Email,
        Profile_Picture : users.Profile_Picture,
        Id_Profile : users.Id_Profile 
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
        if(body.Email || body.password){
            const cachedCode = validationCache.get(body.Email);
            if((body.validationCode === cachedCode && cachedCode)){ //ifUserNormal
                const accessUser = {
                    email_User: body.Email,
                    password : body.Password,
                    rol : item[0].rol,
                    statu : item[0].statu,
                };
                user.Email = Email || users.Email; 
                await db.update(table,user, {Email : Email}); 
                await auth.update(accessUser, {email_User : access.email_User});
            }
        }
        if(body.First_Name || body.Second_Name){
            await db.update(table,user,{Email : Email});
        }
        if(file){
            let item; 
            const folderSave = 'profile picture'; 
            if(users.Id_Profile== null){ //add
                
                item = await fileOptions.add(file, folderSave); 
            }
            else{
                console.log('Upload------')
                item =  await fileOptions.update(file, folderSave, user.Id_Profile); 
            } 
            user.Profile_Picture= item.url; 
            user.Id_Profile= item.public_id; 
            await db.update(table,user,{Email : Email});
        }else{
            console.log("No file")
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
const db = require('./mysql'); 

function getCourse(Email){
    const sql = `
        SELECT c.Name,  c.Id_course
        FROM Users_courses us
        JOIN courses c ON c.Id_course = us.Id_course
        WHERE c.Statu = '1' AND us.Email = ?;
    `;
    return db.getUserInfo(sql, Email);
}

function getAllTask(Email){
    const sql1 = `
    SELECT c.Name AS Course, c.Id_course, t.Id_task,  t.Name
    FROM tasks  t
    JOIN Users_courses us ON  t.Id_course = us.Id_course
    JOIN courses c ON c.Id_course = t.Id_course
    WHERE us.Email = ?                               
    `;
    try{
        return db.getUserInfo(sql1, Email);
    }catch(err){
        return err;
    }
}

async function getFileTeacher(data){
    const sql= `
    select  f.email_User,f.Id_task, f.Url_file,ac.rol
    FROM tasks t
    JOIN files f on t.Id_task = f.Id_task
    JOIN access ac on ac.email_User = f.email_User
    where ac.rol = '2'
    `;

    try{
        return db.getJoin(sql);
    }catch(err){
        console.log(err);
        return null;
    }  
}

async function getFileStudent(data){
    const sql = `
    select  f.email_User,f.Id_task, f.Url_file,ac.rol  
    FROM tasks t 
    JOIN files f on t.Id_task = f.Id_task 
    JOIN access ac on ac.email_User = f.email_User
    WHERE ac.rol = '3' 
    `;

    try{
        return await db.getUserInfo(sql, data.Email);
    }catch(err){
        console.log(err);
        return null;
    }  
}





async function getTasksNoFile(data){
    const sql = `
    select  t.*
    FROM Users u                                                                        
    JOIN Users_courses uc ON uc.Email = u.Email                                         
    JOIN courses c ON uc.Id_course = c.Id_course                                        
    JOIN tasks t ON c.Id_course = t.Id_course                                           
    JOIN simulator s ON t.Id_simulador = s.Id_simulador                                 
    WHERE c.Statu = '1' AND u.Email = ?                               
    `;

    try{
        let item  = await db.getUserInfo(sql, data.Email);
        if(item){
            return item
        }
        return null;
    }catch(err){
        console.log(err);
        return null;
    }    
}

module.exports ={
    getCourse, 
    getFileStudent,
    getFileTeacher,
    getAllTask,
    getTasksNoFile,
}
const db = require('./mysql'); 

function getCourse(Email){
    const sql = `
        SELECT c.Name
        FROM Users_courses us
        JOIN courses c ON c.Id_course = us.Id_course
        WHERE c.Statu = '1' AND us.Email = ?;
    `;
    return db.getUserInfo(sql, Email);
}
function getTasks(data){
    const sql1 = `
    select  t.*, f.email_User,f.Id_file, f.Url_file,ac.rol  
    FROM tasks t 
    JOIN files f on t.Id_task = f.Id_task 
    JOIN access ac on ac.email_User = f.email_User
    WHERE t.Id_course = ? AND t.Id_task = ?
      AND f.email_User IN (
        ?,
        (
          SELECT ac.email_User
          FROM access ac
          JOIN Users_courses uc ON ac.email_User = uc.Email
          WHERE uc.Id_course = ? AND ac.rol = '2'
        )
      )
    `;

    const sql2 = `
    SELECT c.Name as Course, t.Name as Task, t.Descriptions, s.Name as Simulator, t.*   
    FROM Users u                                                                        
    JOIN Users_courses uc ON uc.Email = u.Email                                         
    JOIN courses c ON uc.Id_course = c.Id_course                                        
    JOIN tasks t ON c.Id_course = t.Id_course                                           
    JOIN simulator s ON t.Id_simulador = s.Id_simulador                                 
    WHERE c.Statu = '1' AND u.Email = ?                               
    `;
    try{
        return db.getUserInfo(sql1, [data.Id_course, data.Id_task, data.Email,data.Id_course ]);
    }catch(err){
        return db.getUserInfo(sql2, Email);
    }
    
}

module.exports ={
    getCourse, 
    getTasks,
}
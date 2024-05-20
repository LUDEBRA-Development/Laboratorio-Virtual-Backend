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
function getTasks(Email){
    const sql = `
        SELECT c.Name as Course, t.Name as Task, t.Descriptions, s.Name as Simulator
        FROM Users u
        JOIN Users_courses uc ON uc.Email = u.Email
        JOIN courses c ON uc.Id_course = c.Id_course
        JOIN tasks t ON c.Id_course = t.Id_course
        JOIN simulator s ON t.Id_simulador = s.Id_simulador
        WHERE c.Statu = '1' AND u.Email = ?;
    `;
    return db.getUserInfo(sql, Email);
}

module.exports ={
    getCourse, 
    getTasks,
}
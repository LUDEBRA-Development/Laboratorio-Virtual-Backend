const db = require ('../../DB/Joins'); 

function getCourse(Email){
    return db.getCourse(Email);
}
 async function getTasks(body){
    const tasks  = await db.getTasks(body);
    
     let filesByTask = {};

    tasks.forEach(task => {
        const taskId = task.Id_task;
    
        if (!filesByTask[taskId]) {
            filesByTask[taskId] = { ...task, files: [] };
        }
 
        filesByTask[taskId].files.push({
            email_User: task.email_User,
            Id_file: task.Id_file,
            Url_file: task.Url_file,
            rol: task.rol
        });
        

    }); 
    const modifiedItems = Object.values(filesByTask)[0];
    delete modifiedItems.email_User;
    delete modifiedItems.Id_file;
    delete modifiedItems.Url_file;
    delete modifiedItems.rol;
    return modifiedItems;
}


module.exports ={
    getCourse,
    getTasks,
}
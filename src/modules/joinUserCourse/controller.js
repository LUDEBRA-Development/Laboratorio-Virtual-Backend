const db = require ('../../DB/Joins'); 

function getCourse(body){
    return db.getCourse(body.Email);
}

 async function getTasks(body){
    const tasks  = await db.getTasks(body);
    const tasksNoFile = await db.getTasksNoFile(body);
    
    if (!Array.isArray(tasks)) {
        return tasks
    }else{
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

        tasksNoFile.forEach(task => {
            const taskId = task.Id_task;
            if (!filesByTask[taskId]) {
                filesByTask[taskId] = { ...task, files: [] };
            }
        });
        const modifiedItems = Object.values(filesByTask);
        modifiedItems.forEach(item => {
            delete item.email_User;
            delete item.Id_file;
            delete item.Url_file;
            delete item.rol;
        });


        return modifiedItems;
    }

}


module.exports ={
    getCourse,
    getTasks,
}
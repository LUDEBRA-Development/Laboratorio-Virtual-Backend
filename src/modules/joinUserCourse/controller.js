const db = require ('../../DB/Joins'); 
const files = require ('../../modules/file/Controller'); 
function getCourse(body){
    return db.getCourse(body.Email);
}

 async function getTasks(body){
    const FileTeacher  = await db.getFileTeacher(body);
    const FileStudent  = await db.getFileStudent(body);
    const tasksNoFile = await db.getTasksNoFile(body);
    let filesByTask = {};
        const combinedTasks = tasksNoFile.map(taskNoFile => {
            const taskWithFiles = {
                ...taskNoFile,
                files: []
            };
            FileTeacher.forEach(task => {
                if (task.Id_task === taskNoFile.Id_task) {
                    taskWithFiles.files.push({
                        email_User: task.email_User,
                        Id_task : task.Id_task,
                        Url_file: task.Url_file,
                        rol: task.rol,
                    });
                }
            });
            if(body.rol ==='2'){
                FileStudent.forEach(task => {
                    if (task.Id_task === taskNoFile.Id_task ) {
                        taskWithFiles.files.push({
                            email_User: task.email_User,
                            Id_task : task.Id_task,
                            Url_file: task.Url_file,
                            rol: task.rol,
                        });
                    }
                });
            }else{
                FileStudent.forEach(task => {
                    if (task.Id_task === taskNoFile.Id_task  && task.email_User === body.Email) {
                        taskWithFiles.files.push({
                            email_User: task.email_User,
                            Id_task : task.Id_task,
                            Url_file: task.Url_file,
                            rol: task.rol,
                        });
                    }
                });
            }
            return taskWithFiles;
        })

        return combinedTasks;
 }


       /*  tasks.forEach(task => {
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
        }); */


module.exports ={
    getCourse,
    getTasks,
}
const dbJoin = require ('../../DB/Joins');
const userTask = require('../userTasks/Controller')
const db = require ('../../DB/mysql');
const table = 'Users_courses'
function getCourse(body){
    return dbJoin.getCourse(body.Email);
}

async function getTasks(body) {
    const FileTeacher = await dbJoin.getFileTeacher(body);
    const FileStudent = await dbJoin.getFileStudent(body);
    const tasksNoFile = await dbJoin.getTasksNoFile(body);
    const userTaks = await userTask.getByIdTask({email_Users : body.Email});

    const combinedTasks = tasksNoFile.map(taskNoFile => {

        let taskToUpdate = tasksNoFile.find(task => task.Id_task === userTaks.Id_task);

        if (taskToUpdate) {
            Object.assign(taskToUpdate, userTaks);
        }

        const taskWithFiles = {
            ...taskNoFile,
            files: []
        };

        if (FileTeacher && Array.isArray(FileTeacher)) {
            FileTeacher.forEach(task => {
                if (task.Id_task === taskNoFile.Id_task) {
                    taskWithFiles.files.push({
                        email_User: task.email_User,
                        Id_task: task.Id_task,
                        Url_file: task.Url_file,
                        rol: task.rol,
                    });
                }
            });
        }

        if (body.rol === '2') {
            if (FileStudent && Array.isArray(FileStudent)) {
                FileStudent.forEach(task => {
                    if (task.Id_task === taskNoFile.Id_task) {
                        taskWithFiles.files.push({
                            email_User: task.email_User,
                            Id_task: task.Id_task,
                            Url_file: task.Url_file,
                            rol: task.rol,
                        });
                    }
                });
            }
        } else {
            if (FileStudent && Array.isArray(FileStudent)) {
                FileStudent.forEach(task => {
                    if (task.Id_task === taskNoFile.Id_task && task.email_User === body.Email) {
                        taskWithFiles.files.push({
                            email_User: task.email_User,
                            Id_task: task.Id_task,
                            Url_file: task.Url_file,
                            rol: task.rol,
                        });
                    }
                });
            }
        }

        return taskWithFiles;
    });

    return combinedTasks;
}


 function getUserCourse(body){
    return db.getById(table, {Id_course : body.Id_course});
 }
module.exports ={
    getCourse,
    getTasks,
    getUserCourse,
}
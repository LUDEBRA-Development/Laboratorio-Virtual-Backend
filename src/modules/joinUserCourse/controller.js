const db = require ('../../DB/Joins'); 

function getCourse(Email){
    return db.getCourse(Email);
}
function getTasks(Email){
    return db.getTasks(Email);
}


module.exports ={
    getCourse,
    getTasks,
}
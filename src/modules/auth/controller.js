const db = require ('../../DB/mysql')
const table = 'students'

function add(body){
    return db.add(table, body);
}



module.exports ={
    add, 
}
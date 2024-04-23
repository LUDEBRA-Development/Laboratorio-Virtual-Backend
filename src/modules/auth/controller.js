const db = require ('../../DB/mysql')
const table = 'access'

function add(data){
    return db.add(table, data);
}



module.exports ={
    add, 
}
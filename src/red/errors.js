const response = require('./response');

function errors(err, req, res, next){
    console.log('[error', err)
    const message = err.message || "Internal error";
    const status = err.status || 500; 

    response.error(req, res, message, status); 
}


module.exports = errors; 
const jsonWebToken = require("jsonwebtoken");
config = require('../config')
const secret = config.jwt.secret; 
const expirationtime = 3600
function assignToken(data){
    return jsonWebToken.sign(data,secret,{ expiresIn: expirationtime }); 
}

module.exports = {
    assignToken,
}
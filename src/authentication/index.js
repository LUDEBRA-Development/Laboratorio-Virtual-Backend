const jsonWebToken = require("jsonwebtoken");
config = require('../config')
const secret = config.jwt.secret; 
const expirationTime = 3600
function assignToken(data){
    return jsonWebToken.sign(data,secret,{ expiresIn: expirationTime });
}

function verifyToken(token){
    return jsonWebToken.verify(token,secret);
}

const tokenCheck = {
    confirmToken : (req)=>{
         return decodeHeader(req)
    }
}

function getToken(authorization){
    if(!authorization){
        return null; 
    }
    if(authorization.indexOf('Bearer')=== -1 ){
        throw new Error('Formato invalido');
    }
    return  authorization.replace('Bearer ', '') //return token
}

function decodeHeader(req){
    const authorization= req.headers.authorization || '';
    const token = getToken(authorization);
    if (!token) {
        return null;
    }
    if (verifyToken(token)) {
        return jsonWebToken.decode(token);
    }
    return null;
}
module.exports = {
    assignToken,
    tokenCheck,
}
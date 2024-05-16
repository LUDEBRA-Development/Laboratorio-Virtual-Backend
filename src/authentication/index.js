const jsonWebToken = require("jsonwebtoken");
config = require('../config')
const secret = config.jwt.secret; 
const expirationtime = 3600
function assignToken(data){
    return jsonWebToken.sign(data,secret,{ expiresIn: expirationtime }); 
}
function verifyToken(token){
    return jsonWebToken.verify(token,secret);
}

const tokenCheck = {
    confirmToken : (req)=>{
         return  decoded = decodeHeader(req)
    }
}

function getToken(authorization){
    if(!authorization){
        return null; 
    }
    if(authorization.indexOf('Bearer')=== -1 ){
        throw new Error('Formato invalido');
    }  

    let token = authorization.replace('Bearer ', '')
    return token;
}

function decodeHeader(req){
    const authorization= req.headers.authorization || '';
    const token = getToken(authorization);
    if (!token) {
        return null;
    }
    const verify = verifyToken(token); 
    const decode = jsonWebToken.decode(token);
    return decode; 
}



module.exports = {
    assignToken,
    tokenCheck,
}
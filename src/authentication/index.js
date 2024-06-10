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

    let token = authorization.replace('Bearer ', '')
    return token;
}

function decodeHeader(req){
    const authorization= req.headers.authorization || '';
    const token = getToken(authorization);
    if (!token) {
        return null;
    }
<<<<<<< HEAD

    if(verifyToken(token)){
        return jsonWebToken.decode(token);
    }

=======
    const verify = verifyToken(token); 
    const decode = jsonWebToken.decode(token);
    return decode; 
>>>>>>> parent of 5d9b283 (qudanna errors)
}



module.exports = {
    assignToken,
    tokenCheck,
}
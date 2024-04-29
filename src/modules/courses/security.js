const auth = require('../../authentication/index')
module.exports= function(){
    function middleware(req,res, next ){
        const decoded = auth.tokenCheck.confirmToken(req); 
        const userRole = decoded.rol;
        if(userRole === '1'){
            next()
        }else{
            const error = new Error('Unauthorized access');
            error.status = 403;
            next(error);
        }

    }
    return middleware
}
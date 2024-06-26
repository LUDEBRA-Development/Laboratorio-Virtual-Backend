const auth = require('../../authentication')
module.exports= function(){
    function middleware(req,res, next ){
        const decoded = auth.tokenCheck.confirmToken(req); 
        if(decoded){
            const userRole = decoded.rol;
            if(userRole ==='1' || userRole==='2' || userRole==='3'){
                req.body.rol = userRole;
                next()
            }else{
                const error = new Error('Unauthorized access');
                error.status = 403;
                next(error);
            }
        }else{
            throw new Error("Unauthorized access"); 
        }
    }
    return middleware
}
const auth = require('../../authentication/index')
module.exports= function(){
    function middleware(req,res, next ){
        try {
            const decoded = auth.tokenCheck.confirmToken(req); 
             if (decoded.rol === '1') { 
                next(); 
            } else {
                const error = new Error('Unauthorized access');
                error.statusCode = 403; 
                throw error;
            } 
        } catch (error) {
            next(error);
        } //aa
    }
    return middleware
}



const auth = require('../../authentication/index')
module.exports= function(){
    function middleware(req,res, next ){
        try {
            const decoded = auth.tokenCheck.confirmToken(req); 
            const userRole = decoded.rol;
            const userMailFromToken = decoded.email_User;
             if (decoded.rol === '1') { 
                req.decode = userRole; 
                next(); 
            } else {
                if (decoded.rol === '2' || decoded.rol === '3') { //is teacher
                    const userMailFromRequest = req.body.Email; 
                    if (userMailFromToken === userMailFromRequest) {
                        next();
                    } else {
                        const error = new Error('Unauthorized access');
                        error.status = 403;
                        next(error);
                    }


                }else{
                    const error = new Error('Unauthorized access');
                    error.statusCode = 403; 
                    throw error;
                }
            } 
        } catch (error) {
            next(error);
        } //aa
    }
    return middleware
}



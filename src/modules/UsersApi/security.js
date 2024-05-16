const auth = require('../../authentication/index');
module.exports= function(){
    function middleware(req,res, next ){
        try {
            const decoded = auth.tokenCheck.confirmToken(req); 
            if(decoded){
                const userRole = decoded.rol;
                const userMailFromToken = decoded.email_User;
                if (decoded.rol === '1') { 
                    req.decode = userRole; 
                    next(); 
                } else {
                    if (decoded.rol === '2' || decoded.rol === '3' || decoded.rol ==='4') {
                        const userMailFromRequest = req.body.Email; 
                        if (userMailFromToken === userMailFromRequest) {
                            req.decode = '0'
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
            }else{
                next(new Error("NO TOKEN")); 
            }
            
        } catch (error) {
            next(error);
        } //aa
    }
    return middleware
}



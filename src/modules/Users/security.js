const auth = require('../../authentication/index');
module.exports= function(){
    function middleware(req,res, next ){
        try {
            const decoded = auth.tokenCheck.confirmToken(req); 
            if(decoded){
                const userRole = decoded.rol;
                const userMailFromToken = decoded.email_User;
                const userMailFromRequest = req.params.id; 
                req.body.rol = userRole; 
                if (userRole === '1') { 
                    next(); 
                } else {
                    if (userRole !== '1') {
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
            }else{
                next(new Error("NO TOKEN")); 
            }
            
        } catch (error) {
            next(error);
        } //aa
    }
    return middleware
}



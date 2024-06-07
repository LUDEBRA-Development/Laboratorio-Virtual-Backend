const auth = require('../../authentication/index');
module.exports = function () {
    function middleware(req, res, next) {
        try {
            const decoded = auth.tokenCheck.confirmToken(req);
            console.log(decoded.rol)
            if (decoded) {
                const userRole = decoded.rol;
                const userMailFromToken = decoded.email_User;
                if (userRole === '1') {
                    req.decode = userRole;
                    next();
                } else {
                    if (decoded.rol === '2' || decoded.rol === '3') {
                        req.body.Email = userMailFromToken;
                        req.body.rol = userRole;
                        next();
                    } else {
                        const error = new Error('Unauthorized access');
                        error.statusCode = 403;
                        throw error;
                    }
                }
            } else {
                next(new Error("NO TOKEN"));
            }

        } catch (error) {
            next(error);
        }
    }
    return middleware
}



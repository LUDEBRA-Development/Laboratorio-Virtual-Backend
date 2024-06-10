const auth = require('../../authentication/index');
const course = require ('../courses/controller'); 
module.exports=  function(){
    async function middleware(req,res, next ){
        try {
            const decoded = auth.tokenCheck.confirmToken(req); 
            if(decoded){
                const userRole = decoded.rol;
                if (decoded.rol === '1') { 
                    req.decode = userRole; 
                    next(); 
                }
            }else{
                let body = req.body
                let rolUser = 0;
                if(body.code){
                    try{ 
                        const items =  await  course.getById({Code : body.code}); 
                        if(items.Code === body.code){
                           rolUser = 3; 
                           body.Id_course = items.Id_course
                        }else{
                            body.code=null; 
                            rolUser= 4; 
                        } 
                    }catch(err){
                        body.code=null; 
                        rolUser= 4; 
                    }

                }else{
                    rolUser = 4;
                }
                if(rolUser != 0){           
                    req.body = {
                        First_Name: body.First_Name,
                        Second_Name:body.Second_Name ,
                        Email: body.Email,
                        rol : rolUser, 
                        Id_course: body.Id_course,
                        Password: body.Password,
                        validationCode : body.validationCode,
                        code : body.code
                    }
                    next(); 
                }
            }
        } catch (error) {
            next(error);
        } 
    }
    return middleware
}

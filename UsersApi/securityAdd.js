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
                if(body.Id_course){
                    try{
                        const items =  await  course.getById(body.Id_course); 
                        if(items.Id_course === body.Id_course){
                           rolUser = 3; 
                        } 
                    }catch(err){
                        body.Id_course=undefined; 
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
                        Password: body.Password
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

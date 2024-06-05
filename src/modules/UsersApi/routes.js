const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./controller');
const security = require('./security');
const securityAdd = require ('./securityAdd'); 

routes.get('/', async (req, res, next)=>{
    try{
        const items = await controller.getAll();
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.get('/:id',security() , async (req, res, next)=>{
    try{
        const items = await controller.getById(req.params.id);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.put('/',security(), async (req, res, next)=>{
    try{
        await controller.remove(req.body);
        response.success(req, res, "item successfully removed", 200);
    }catch(err){
        next(err)
    }
})


routes.post('/generate', async (req, res, next)=>{
    try{
        const items = await controller.generate(req.body);
        response.success(req, res, "Operation completed successfully", 200);
    }catch(err){
        next(err)
    }
})
routes.post('/validate',securityAdd(),async (req, res, next)=>{
    try{
        const items = await controller.add(req.body);
        response.success(req, res, "Operation completed successfully", 200);
    }catch(err){
        next(err)
    }
})
routes.post('/:id',security() ,async (req, res, next)=>{
    try{
        let image = null;
        
        if (req.files && req.files.image) {
            image = req.files.image;
        }
        const items = await controller.update(req.body,image,req.params.id);
        response.success(req, res, "Item successfully updated", 200);
    }catch(err){
        next(err)
    }
})




module.exports =routes; 
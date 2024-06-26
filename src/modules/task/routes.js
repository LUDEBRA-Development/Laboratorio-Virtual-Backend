const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./Controller');
const security = require('./security');

routes.get('/', security(),  async (req, res, next)=>{
    try{
        const items = await controller.getAll(req.body);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.get('/:id',  async (req, res, next)=>{
    try{
        const items = await controller.getByIdTask(req.params.id);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.get('/course/:id',  async (req, res, next)=>{
    try{
        const items = await controller.getByIdCourse(req.params.id);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.post('/', security(),  async (req, res, next)=>{
    try{
        const items = await controller.add(req.body);
        response.success(req, res, "item successfully add", 200);
    }catch(err){
        next(err)
    }
})
routes.post('/:id',security(),async (req, res, next)=>{

    try{
        let file = null;
        
        if (req.files && req.files.file) {
            file = req.files.file;
        }
        const items = await controller.update(req.body,req.params.id,file);
        response.success(req, res, "Item successfully updated", 200);
    }catch(err){
        next(err)
    }
})

routes.put('/:id',security(),async (req, res, next)=>{
    try{
        const items = await controller.remove(req.params.id);
        response.success(req, res, "Item successfully delete", 200);
    }catch(err){
        next(err)
    }
});

module.exports = routes;
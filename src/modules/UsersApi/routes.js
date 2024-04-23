const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./controller');

routes.get('/', async (req, res, next)=>{
    try{
        const items = await controller.getAll();
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.get('/:id', async (req, res, next)=>{
    try{
        const items = await controller.getById(req.params.id);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.put('/', async (req, res, next)=>{
    try{
        await controller.remove(req.body);
        response.success(req, res, "item successfully removed", 200);
    }catch(err){
        next(err)
    }
})

routes.post('/', async (req, res, next)=>{
    try{
        const items = await controller.add(req.body);
        response.success(req, res, "Operation completed successfully", 200);
    }catch(err){
        next(err)
    }
})


module.exports =routes; 
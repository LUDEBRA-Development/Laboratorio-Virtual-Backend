const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./controller');
const security = require('../security');

routes.get('/', async (req, res, next)=>{
    try{
        const items = await controller.getAll();
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})

routes.get('/:id',  async (req, res, next)=>{
    try{
        const items = await controller.getById(req.params.id);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})


routes.post('/', security(), async (req, res, next)=>{
    try{
        const items = await controller.add(req.body);
        response.success(req, res, "item successfully add", 200);
    }catch(err){
        next(err)
    }
})

module.exports =routes; 
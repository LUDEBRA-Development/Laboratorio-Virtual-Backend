const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./controller');
const security = require('./security');

routes.get('/courses/:id',security(),  async (req, res, next)=>{
    try{
        const items = await controller.getCourse(req.params.id);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})
routes.get('/task/:id', async (req, res, next)=>{
    try{
        const items = await controller.getTasks(req.params.id);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})





module.exports =routes; 
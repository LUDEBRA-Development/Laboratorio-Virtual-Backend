const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./controller');
const security = require('./security');

//get courses
routes.get('/courses',security(),  async (req, res, next)=>{
    try{
        const items = await controller.getCourse(req.body);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})
//get task
routes.post('/tasks', security(), async (req, res, next)=>{
    try{
        const items = await controller.getTasks(req.body);
        response.success(req, res, items, 200);
    }catch(err){
        next(err)
    }
})





module.exports =routes; 
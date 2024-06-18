const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./Controller');
const security = require('./security');

routes.post('/:id',async (req, res, next)=>{
    try{
        await controller.update(req.body, req.params.id);
        response.success(req, res, "Item successfully updated", 200);
    }catch(err){
        console.log(err)
        next(err)
    }
})

module.exports =routes; 
const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./controller');


routes.post('/', async (req, res, next)=>{
    try{
        const items = await controller.file(req.files.image);
        response.success(req, res, items, 200);
    }catch(err){
        response.error(req, res, err, 500)
    }
})

module.exports =routes; 
const express = require('express');
const routes = express.Router();
const response = require('../../red/response')
const controller = require('./controller');

routes.post('/login', async (req, res, next)=>{
    try{
        const token = await controller.login(req.body.Email, req.body.Password);
        response.success(req, res, token, 200);
    }catch(err){
        response.error(req, res, err, 401);
    }
})

module.exports =routes; 
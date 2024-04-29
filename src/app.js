const express = require ('express');
const morgan = require('morgan');
const config = require ('./config');
const courses = require ('./modules/courses/routes'); 
const users = require('./modules/UsersApi/routes');
const auth = require('./modules/auth/routes');
const  error  = require('./red/errors');
const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : true})); 

app.set('port', config.app.port);



//routes
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use('/api/courses',courses); 


app.use(error); 

module.exports = app; 

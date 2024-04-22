const express = require ('express');
const morgan = require('morgan');
const config = require ('./config');
const students = require('./modules/students/routes');
const  error  = require('./red/errors');
const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : true})); 

app.set('port', config.app.port);



//routes
app.use('/api/students',students);


app.use(error); 

module.exports = app; 

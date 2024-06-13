const express = require ('express');
const morgan = require('morgan');
const config = require ('./config');
const courses = require ('./modules/courses/routes');
const userTasks = require('./modules/userTasks/routes');
const tasks = require('./modules/task/routes')
const users = require('./modules/Users/routes');
const auth = require('./modules/auth/routes');
const joinUserCourse = require('./modules/joinUserCourse/routes');
const fileUpload = require('express-fileupload'); 


const  error  = require('./red/errors');
const app = express();
const cors = require('cors'); 


//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : true})); 
app.use(fileUpload({useTempFiles: true,}));
const corsOptions = {
    origin: function (origin, callback) {
        if (origin === 'https://branica.com/fetch') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions))

app.set('port', config.app.port);


//routes
app.use('/api/auth',auth);
app.use('/api/users',users);
app.use('/api/userTasks',userTasks);
app.use('/api/users/info',joinUserCourse);
app.use('/api/courses',courses);
app.use('/api/tasks',tasks);

app.use(error);

module.exports = app; 

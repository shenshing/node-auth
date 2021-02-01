const express = require('express');
const app = express();
const mysql = require('mysql2');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post'); 

// const dbService = require('./database/dbService');

//route middleware
app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);



app.listen(3000, () => {
    console.log('Server up and running')
});
const router = require('express').Router();
const {check_email, dbService} = require('../database/dbService');
const mysql = require('mysql2');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('./validation');
const jwt = require('jsonwebtoken');


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

router.post('/register', async(req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
                        
    try {
        const dateAdded = new Date();
        const query = ('SELECT email FROM user WHERE email=?;');
        connection.query(query, [email], (err, result) => {
            if (err) {
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                if(result.length > 0) {
                    res.status(400).json({
                        message: 'Email already exist'
                    })
                } else {
                    console.log('email not exist');
                    const query = "INSERT INTO user (name, email, password, date) VALUES (?, ?, ?, ?);";
                    connection.query(query, [name, email, hashedPassword, dateAdded], (err, result) => {
                        if (err) {
                            res.status(404).json({
                                message: 'Something went wrong in our End'
                            })
                        } else {
                            res.status(200).json({
                                message: "Successful Register"
                            })
                        }
                    })
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// LOGIN
router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;

    const query = ('SELECT * FROM user WHERE email=?;');
    connection.query(query, [email], async(err, user) => {
            if (err) {
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                if(user.length > 0) {
                    const validPass =  await bcrypt.compare(password, user[0].password);
                    if(!validPass) return res.status(404).json({
                        message: 'invalid password'
                    });
                    const token = jwt.sign({id: user[0].id}, process.env.TOKEN_SECRET);
                    res.header('auth-token', token).send(token);
                } else {
                    res.status(404).json({
                        message: 'email not exist'
                    })
                }
            }
        });

});

module.exports = router;
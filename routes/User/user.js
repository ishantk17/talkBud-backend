const express = require('express');
const { login } = require('./userController');
const userRouter = express.Router();
const bodyParser = require('body-parser');

const JSON = bodyParser.json();

userRouter.post('/login',JSON, login); 

module.exports = userRouter

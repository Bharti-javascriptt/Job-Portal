// const express = require("express");
// ????package import 
import express, { application } from 'express';
const  app= express();
import "express-async-errors"
// import crypto from 'crypto';
// import cloudinary from 'cloudinary'
// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
//     api_key: process.env.CLOUDINARY_CLIENT_API,
//     api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
//   });
// import Cookies from 'js-cookie';

// Example: After a successful login
// Cookies.set('authToken', response.data.token, { expires: 7 }); // Set cookie with expiration of 7 days


  import path from 'path';

import fileUpload from 'express-fileupload';
app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir: path.join(_dirname, '/tmp')
  }));

//!!!!env config
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser';
app.use(cookieParser())


//!!!! connect database
import Connectdb from './config/db.js';
Connectdb();

//! middleware cors 
import cors from 'cors';
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback){
    if (!origin || allowedOrigins.indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow credentials
}));

app.use(cors({
    origin:[process.env.Frontend_URL],
    methods:['Get','post', 'put', 'delete'],
    credentials:true
}));
import morgan from 'morgan';
app.use(morgan("dev"));

//!!!!1middleware hai when we receive json data then we need to inform the application that 
// !! we use json data so it deal with json data 
app.use(express.json()); 
app.use(express.urlencoded({extended:true}))


//???Security package 
import helmet from 'helmet'
app.use(helmet())  // this is for header security 
import xss from 'xss-clean'
app.use(xss())
import mongoSanitize from 'express-mongo-sanitize'  //mongo db security package 
app.use(mongoSanitize());

//???



//???import routtes file 

import registerroutes from './routes/registerroute.js'
import jobsroute from './routes/jobsroute.js'
import  user_admin from './routes/user_admin.js'
import errormiddleware from './middleware/errormiddleware.js';
import applicationroute from './routes/applicationroute.js' 





//!!!!    routing 
app.use('/api/v1/reg', registerroutes)  // this is for registration login logout 
app.use('/api/v1/user', user_admin)
app.use('/api/v1/job', jobsroute); // job  
app.use("/api/v1/application",applicationroute);



app.use(errormiddleware);


// !!!!!!Server
const Port= process.env.PORT||4000
app.listen(Port, ()=>{
    console.log(`Node server is running in ${process.env.Dev_mode} on port no ${Port}`)
})
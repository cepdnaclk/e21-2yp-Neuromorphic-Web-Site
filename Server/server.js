const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const colorse=require('colors');
const connectDB=require('./config/db');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const path = require('path');
const helmet = require("helmet");
const mongoSanitize=require('./middleware/sanitizer');


//First Load the env variable
dotenv.config({path:'./config/config.env'});

//Connect the data base
connectDB();

//Route files
const auth=require('./router/auth');
const contributors=require('./router/contributors');
const publications=require('./router/publications');
const news=require('./router/news');
const projects=require('./router/projects');
const admin=require('./router/admin');
const blogs=require('./router/blogs');

//create a express app
const app=express();

// Sanitize data 
// app.use(mongoSanitize());
app.use(mongoSanitize);


// Enable CORS
// List of allowed origins
const allowedOrigins = [
  "https://2yp-project-full-stack-web-site.vercel.app", // Admin panel
  "https://2yp-project-full-stack-web-site-mcv.vercel.app", // User frontend (change if different)
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like Postman, mobile apps, curl)
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,  // Allow cookies/auth headers if needed
}));

// Set security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);


//body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

//*********************
//    Middlewares
//********************* 
const errorHandler=require('./middleware/error');
// dev loggin middleware
if(process.env.NODE_ENV==="development"){
    app.use(morgan('dev'));
}



//Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));


//*********************
//   Mount routers
//*********************
app.use('/api/v1/auth',auth);
app.use('/api/v1/contributors',contributors);
app.use('/api/v1/publications',publications);
app.use('/api/v1/news',news);
app.use('/api/v1/projects',projects);
app.use('/api/v1/admin',admin);
app.use('/api/v1/blogs',blogs);


//*************** */ 
//   Error handle
//*************** */
app.use(errorHandler);




const PORT=process.env.PORT;
app.listen(PORT,console.log(`Server running is ${process.env.NODE_ENV} mode on port ${PORT}`.green))

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    server.close(()=>process.exit(1));
})
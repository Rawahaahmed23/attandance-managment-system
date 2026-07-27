require('dotenv').config();

const express = require('express')
const cors = require('cors');
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);


const app = express()
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://attendenceapp-ten.vercel.app',
      'https://attandance-managment-system-iv7h.onrender.com',
      'http://localhost:5173'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
}







app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
const errormiddleware = require('./middleware/errormiddleware')
const authRoute = require('./router/auth')
const adminRoute = require('./router/adminRoutes')
const connecdb = require('./utils/db')



const Port = 5000
app.use('/',authRoute)
app.use('/admin', adminRoute)

app.use(errormiddleware)

connecdb().then(()=>{
    app.listen(Port,()=>{
    console.log(`Server started at ${Port}`);
    
})
})

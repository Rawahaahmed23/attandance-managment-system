require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const dns = require("dns");

const app = express();



dns.setServers(["8.8.8.8", "8.8.4.4"]);


const corsOptions = {
  origin: [
    'https://attendenceapp-ten.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS'
  ],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());


// Routes
const errormiddleware = require('./middleware/errormiddleware');
const authRoute = require('./router/auth');
const adminRoute = require('./router/adminRoutes');



app.use('/', authRoute);
app.use('/admin', adminRoute);



app.use(errormiddleware);


const connecdb = require('./utils/db');

const Port = process.env.PORT || 5000;


connecdb()
  .then(() => {
    app.listen(Port, () => {
      console.log(`Server started at ${Port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
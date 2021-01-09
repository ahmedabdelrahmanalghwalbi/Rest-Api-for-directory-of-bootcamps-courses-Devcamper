const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const connectDB = require('./configs/dbConfig');
const bodyParser = require('body-parser');
connectDB();
const bootcampRouter = require('./routes/bootcamp');
const courseRouter = require("./routes/course");
const authRouter = require("./routes/user");
const adminRouter = require("./routes/admin_user_crud");
const reviewController = require("./routes/review");


//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routers
app.use('/bootcamp', bootcampRouter);
app.use('/courses', courseRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/reviews', reviewController);

//handling CORS
app.use((req, res, next) => {
    res.setHeader("Access-Controll-Allow-Orign", "*");
    res.setHeader("Access-Controll-Allow-Methods", "*");
    res.setHeader("Access-Controll-Allow-Headers", "Authorization");
    next();
});

//handling not found the router error
app.use(async (req, res, next) => {
    next(createError.NotFound("the router that you try to access it is not found"));
});

app.use((err, req, res, next) => {
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log(`server on ${process.env.PORT}...!`);
});
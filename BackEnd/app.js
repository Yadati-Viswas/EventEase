const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoSession = require('connect-mongo');
require('dotenv').config();
const router = require('./routes/index');

const app = express();

const port = process.env.PORT;
const host = process.env.HOST;
const url = process.env.MONGO_URL;
app.set('trust proxy', 1);

app.use(cors({
    origin: ['http://localhost:5173', 'https://event-ease-frontend-v1.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

mongoose.connect(url, {
}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}).catch((err) => {
    console.error('Database connection error:', err);
});

app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(router);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);

});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});
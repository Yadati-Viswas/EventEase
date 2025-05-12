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
const sessionSecret = process.env.SESSION_SECRET;
app.set('set engine', 'ejs');

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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoSession({mongoUrl: url})
}));

app.use(flash());

app.use((req, res, next)=>{
    res.locals.user = req.session.user || null;
    console.log(req.session);
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error'); 
    next();
});

app.use(router);
//app.use("/", (req, res) => { });

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




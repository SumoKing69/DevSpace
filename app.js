const express = require('express');
const app = express();
const router = require('./router');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

let sessionsopts = session({
    secret: "DEVSPACE",
    store: MongoStore.create({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60 , httpOnly: true}
})

app.set('view engine','ejs')

app.use(flash())
app.use(sessionsopts)

app.use(function(req,res,next){
    res.locals.user = req.session.user
    next()
})
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/',router)

module.exports = app;

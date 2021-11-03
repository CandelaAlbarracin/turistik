const express=require('express');
const morgan=require('morgan');
const exphbs=require('express-handlebars');
const path = require('path');
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");
const {database} = require("./keys");


//Inicializaciones
const app=express();

require("./lib/passport");

//Configuraciones
app.set('port',process.env.PORT || 4000)
app.set('views',path.join(__dirname,'views'))
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers: require ('./lib/handlebars')
}))
app.set('view engine','.hbs')

//Middlewares
app.use(session({
    secret: "turistik-database",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req,res,next)=>{

    next()
})

//Rutas
app.use(require('./routes'))
app.use(require('./routes/authentication'))
app.use('/alojamientos',require('./routes/accommodations'))
app.use('/restaurantes',require('./routes/restaurants'))
app.use('/tours',require('./routes/tours'))
app.use('/sobrenosotros',require('./routes/aboutus'))
app.use('/explorajujuy',require('./routes/explorejujuy'))
app.use('/denuncias',require('./routes/denuncias'))
//app.use('/alojamientos/detalles',require('./routes/detailsAccommodations'))

//Publico
app.use(express.static(path.join(__dirname,'public')))
//Iniciar servidor
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'))
})
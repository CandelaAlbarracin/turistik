const express=require('express')
const morgan=require('morgan')
const exphbs=require('express-handlebars')
const path=require('path')

//Inicializaciones
const app=express()

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
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

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

//Publico
app.use(express.static(path.join(__dirname,'public')))
//Iniciar servidor
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'))
})
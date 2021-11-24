const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database")
const helpers = require("../lib/helpers");


//login para usuario turista
passport.use("local.signin", new LocalStrategy({
    usernameField: "email",
    passwordField: "contrasena",
    passReqToCallback: true

}, async(req,email,contrasena,done) => {
    //console.log(req.body);
    const rows = await pool.query("SELECT * FROM usuarios WHERE email = ?",[email]);
    if (rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contrasena,user.contrasena);
        if (validPassword){
            done(null,user,req.flash("success","Bienvenido "+user.nombre+" "+user.apellido));
        }else{
            done(null,false,req.flash("message","Contraseña Incorrecta"));
        }
    }else{
        return done(null,false,req.flash("message","El Usuario no existe"));
    }
}));

//registro para usuario turista
passport.use("local.signup", new LocalStrategy({
   usernameField: "email",
   passwordField: "contrasena",
    passReqToCallback: true    

}, async(req,email,contrasena,done) => {
    const {nombre} = req.body;
    const {apellido} = req.body;

    const newUser = {
        nombre,
        apellido,
        email,
        contrasena,
        tipo: "U"
    };
    newUser.contrasena = await helpers.encryptPassword(contrasena);
    const result = await pool.query("INSERT INTO usuarios SET ?",[newUser]);
    //console.log(result);
    newUser.idusuario = result.insertId;
    return done(null,newUser);
}));

passport.serializeUser((user,done) => {
    done(null,user.idusuario);
});

passport.deserializeUser(async(id,done) => {
    const rows = await pool.query("SELECT * FROM usuarios WHERE idusuario = ?",[id]);
    done(null,rows[0]);
});


//registro para usuario emprendedor

//registro para usuario administrador


const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database")
const helpers = require("../lib/helpers");

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
    };
    newUser.contrasena = await helpers.encryptPassword(contrasena);
    const result = await pool.query("INSERT INTO usuarios SET ?",[newUser]);
    console.log(result);
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

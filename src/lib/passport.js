const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database")
const helpers = require("../lib/helpers");

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
        contrasena
    };
    newUser.contrasena = await helpers.encryptPassword(contrasena);
    const result = await pool.query("INSERT INTO usuarios SET ?",[newUser]);
    newUser.id = result.insertId;
    return done(null,newUser);
}));

passport.serializeUser((user,done) => {
    done(null,user.id);
});

passport.deserializeUser(async(id,done) => {
    const rows = await pool.query("SELECT * FROM usuarios WHERE idusuario = ?",[id]);
    done(null,rows[0]);
});


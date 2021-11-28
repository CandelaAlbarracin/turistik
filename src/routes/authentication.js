const express = require('express')
const router = express.Router()
const {isLoggedInUsuario,isLoggedInAdm,isLoggedInEmp}=require('../lib/auth')
const passport = require("passport");
const pool=require('../database')
const helpers = require("../lib/helpers");
const { fstat } = require('fs-extra');
const cloudinary=require('cloudinary')
const multer = require("multer")
const fs=require('fs-extra')
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//ruta para renderizar el formulario de registro
router.get("/signup",(req,res) => {
    res.render("auth/signup");  
});

//ruta para recibir los datos del formulario de registro
router.post("/signup", passport.authenticate("local.signup", {
    successRedirect : "/profile",
    failureRedirect : "/signup",
    failureFlash : true
}));

//ruta para renderizar el formulario de login
router.get("/signin",(req,res) => {
    res.render("auth/signin");
});

//autenticacion para el login
router.post("/signin",(req,res,next) => {
    passport.authenticate("local.signin", {
        successRedirect: "/profile",
        failureRedirect: "/signin",
        failureFlash: true
    }) (req,res,next);
});

//ruta del perfil de usuario
router.get("/profile", (req,res) => {
    if(req.user.tipo=='U'){
        res.render("profile");
    }
    if (req.user.tipo=='A') {
        res.redirect("/actividades")
    }
    if (req.user.tipo=='E'){
        res.render("profile")
    //colocar vista a donde redireccionar
    }      
});

//ruta de cerrar sesion
router.get("/logout",(req,res) =>{
    req.logOut();
    res.redirect("/signin");
});

//ruta para renderizar el formulario 1 de emprendedor
router.get("/form1",(req,res) => {
    res.render("auth/form1");
});

//ruta para recibir los datos del formulario 1 de registro emprendedor
router.post("/form1", async (req,res) => {
    const {nombre,apellido,email,contrasena} = req.body
    const nuevoUsr = {
        nombre,
        apellido,
        email,
        contrasena,
        tipo: "U"
    };
    nuevoUsr.contrasena = await helpers.encryptPassword(contrasena);
    await pool.query("INSERT INTO usuarios set ?",[nuevoUsr]);

    const {dni,cuil} = req.body
    const aux = await pool.query("SELECT MAX(idusuario) AS id_usuario FROM usuarios")
    const nuevoEmp = {
        dni,
        cuil,
        id_usuario: aux[0].id_usuario
    };
    await pool.query("INSERT INTO emprendedores set ?",[nuevoEmp])

    const {nombreemprendimiento,ubicacion,categoria,descripcion} = req.body
    const aux2 = await pool.query("SELECT MAX(idemprendedor) AS id_emprendedor FROM emprendedores")
    const nuevo_Emp = {
        nombreemprendimiento,
        ubicacion,
        descripcion,
        categoria,
        estadosolicitud: "E",
        id_emprendedor: aux2[0].id_emprendedor
    };
    await pool.query("INSERT INTO emprendimientos set ?",[nuevo_Emp]);

    const {telefono,facebook,instagram,youtube} = req.body
    const aux3 = await pool.query("SELECT MAX(idemprendimiento) AS id_emprendimiento FROM emprendimientos")
    const nuevo_Empto = {
        telefono,
        facebook,
        instagram,
        youtube,
        id_emprendimiento: aux3[0].id_emprendimiento
    };
    await pool.query("INSERT INTO contacto set ?",[nuevo_Empto])
    
    const {image,imagensec} = req.files
    const pathimagenPrimaria = image[0].path
    const result = await cloudinary.v2.uploader.upload(pathimagenPrimaria)
    const nuevaIP = {
        link: result.url,
        tipo: "P",
        id_emprendimiento: aux3[0].id_emprendimiento,
        publicid: result.public_id
    }
    await fs.unlink(pathimagenPrimaria)
    await pool.query("INSERT INTO imagenes set ?",[nuevaIP])
    console.log(imagensec)
    if(imagensec){
        console.log("Hola!")
        console.log(imagensec.length)
        for(let i=0; i<imagensec.length; i++){
            console.log(imagensec[i])
            let result2 = await cloudinary.v2.uploader.upload(imagensec[i].path)
            await fs.unlink(imagensec[i].path)
            const nuevaIS = {
                link: result2.url,
                tipo:"S",
                id_emprendimiento: aux3[0].id_emprendimiento,
                publicid: result2.public_id
            }
            await pool.query("INSERT INTO imagenes set ?",[nuevaIS])
        }
    }
    res.redirect("/form1")
});


module.exports=router;
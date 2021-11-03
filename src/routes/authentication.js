const express = require('express')
const router = express.Router()

//ruta para renderizar el formulario
router.get("/signup",(req,res) => {
    res.render("auth/signup");  
});

//ruta para recibir los datos del formulario
router.post("/signup",(req,res) => {
    console.log(req.body);
    res.send("Datos recibidos");
});

module.exports=router
const pool=require('../database')
const helpers = require("../lib/helpers");
const cloudinary=require('cloudinary')
const fs=require('fs-extra');
const router = require('./authentication');
const { route } = require('./requests');
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//ruta para renderizar el formulario 1 de emprendedor
router.get("/",async(req,res) => {
    const loc=await pool.query('SELECT * FROM localidades')
    const dep=await pool.query('SELECT distinctrow departamento FROM localidades ORDER BY departamento')
    const actividadesAloj=await pool.query('SELECT nombre FROM actividades WHERE tipo="A"')
    const actividadesTours=await pool.query('SELECT nombre FROM actividades WHERE tipo="T"')
    res.render("smallenterprise/registerEmp",{dep});
});

router.post("/localidades",async(req,res)=>{
    const {departamento}=req.body
    const loc=await pool.query('SELECT * FROM localidades where departamento=?',[departamento])
    res.json(loc)
})

router.post("/actividades",async(req,res)=>{
    const {tipo}=req.body
    const actividades=await pool.query('SELECT idactividades,nombre FROM actividades WHERE tipo=?',[tipo])
    res.json(actividades)
})

router.post('/mails',async(req,res)=>{
    const {email}=req.body
    const mail=await pool.query('SELECT email FROM usuarios WHERE email=?',[email])
    res.json(mail)
})

//ruta para recibir los datos del formulario 1 de registro emprendedor
router.post("/", async (req,res) => {
    const {nombre,apellido,email,contrasena} = req.body
    const nuevoUsr = {
        nombre,
        apellido,
        email,
        contrasena,
        tipo: "E"
    };
    nuevoUsr.contrasena = await helpers.encryptPassword(contrasena);
    await pool.query("INSERT INTO usuarios set ?",[nuevoUsr]);

    const {precuil,cuil,poscuil} = req.body
    const aux = await pool.query("SELECT MAX(idusuario) AS id_usuario FROM usuarios")
    const nuevoEmp = {
        cuil:`${precuil}-${cuil}-${poscuil}`,
        id_usuario: aux[0].id_usuario
    };
    await pool.query("INSERT INTO emprendedores set ?",[nuevoEmp])

    const {nombreemprendimiento,calle,numero,categoria,descripcion,localidad} = req.body
    const aux2 = await pool.query("SELECT MAX(idemprendedor) AS id_emprendedor FROM emprendedores")
    const nuevo_Emp = {
        nombreemprendimiento,
        ubicacion:`${calle} ${numero}`,
        descripcion,
        categoria,
        estadosolicitud: "P",
        id_emprendedor: aux2[0].id_emprendedor,
        id_localidad:localidad
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

    const {actividades}=req.body
    let actArray=actividades.split(',')
    if (categoria=="A"){
       const {precioxnoche,capacidadhabitaciones,capacidadestacionamientos,tipo,vista,piscina,horno,animales}=req.body
       const nuevo_aloj={
        id_emprendimiento: aux3[0].id_emprendimiento,
        precionoche:precioxnoche,
        capacidadhabitaciones,
        capacidadestacionamientos,
        tipoalojamiento:tipo,
        piscina,
        vista,
        hornobarro:horno,
        animalesautoctonos:animales
       }
       const resultAloj=await pool.query("INSERT INTO alojamientos set ?",[nuevo_aloj])
       for (let i=0;i<actArray.length;i++){
            let actOfrecida={
                id_alojamiento:resultAloj.insertId,
                id_actividad:actArray[i]
            }
            await pool.query("INSERT INTO actividadesofrecidas set ?",[actOfrecida])
       }
    }else{
       const {duracionHoras,duracionMinutos,precio,recomendaciones,dificultad}=req.body
       const nuevo_tour={
           duracion:`${duracionHoras}:${duracionMinutos}`,
           precio,
           recomendaciones,
           dificultad,
           id_emprendimiento:aux3[0].id_emprendimiento
       }
       const resultTours=await pool.query("INSERT INTO tours set ?",[nuevo_tour])
       for (let i=0;i<actArray.length;i++){
            let actOfrecida={
                id_tour:resultTours.insertId,
                id_actividad:actArray[i]
            }
            await pool.query("INSERT INTO toursofrecidos set ?",[actOfrecida])
       }
    }

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
    if(imagensec){
        for(let i=0; i<imagensec.length; i++){
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
    req.flash('info',`¡Gracias por registrarte en Turistik! Su número de solicitud es ${aux3[0].id_emprendimiento} . Le informaremos por mail la decisión tomada por uno de nuestros administradores con respecto a su propuesta. Puedes ver tu emprendimiento iniciando sesión con el correo electronico y contraseña ingresada`)
    res.redirect("/emprendedores")
});

module.exports=router
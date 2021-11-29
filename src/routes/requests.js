const express=require('express')
const nodemailer=require("nodemailer")
const {google}=require('googleapis')
const router=express.Router()
const pool=require('../database')

router.get('/aprobadas',async(req,res)=>{
    const aprobadas=await pool.query('SELECT emprendimientos.idemprendimiento,emprendedores.cuil,usuarios.nombre,usuarios.apellido,emprendimientos.nombreemprendimiento,emprendimientos.categoria FROM emprendimientos JOIN emprendedores ON emprendimientos.id_emprendedor=emprendedores.idemprendedor JOIN usuarios ON emprendedores.id_usuario=usuarios.idusuario WHERE emprendimientos.estadosolicitud="A" ORDER BY emprendimientos.idemprendimiento;')
    for(let i=0;i<aprobadas.length;i++){
        if(aprobadas[i].categoria=='A'){
            aprobadas[i].categoria='Alojamiento'
        }else{
            aprobadas[i].categoria='Tour'
        }
    }
    res.render('./requests/approvedrequests',{aprobadas})
})

router.get('/pendientes',async(req,res)=>{
    const pendientes=await pool.query('SELECT emprendimientos.idemprendimiento,emprendedores.cuil,usuarios.nombre,usuarios.apellido,emprendimientos.nombreemprendimiento,emprendimientos.categoria FROM emprendimientos JOIN emprendedores ON emprendimientos.id_emprendedor=emprendedores.idemprendedor JOIN usuarios ON emprendedores.id_usuario=usuarios.idusuario WHERE emprendimientos.estadosolicitud="P" ORDER BY emprendimientos.idemprendimiento;')
    for(let i=0;i<pendientes.length;i++){
        if(pendientes[i].categoria=='A'){
            pendientes[i].categoria='Alojamiento'
        }else{
            pendientes[i].categoria='Tour'
        }
    }
    res.render('./requests/awaitingrequests',{pendientes})
})

router.post('/buscar',async(req,res)=>{
    const {estadosolicitud,idemprendimiento,cuil,nombreapellido,nombreemprendimiento,categoria}=req.body
    let parametros=[estadosolicitud]
    let consulta="SELECT emprendimientos.idemprendimiento,emprendedores.cuil,usuarios.nombre,usuarios.apellido,emprendimientos.nombreemprendimiento,emprendimientos.categoria FROM emprendimientos JOIN emprendedores ON emprendimientos.id_emprendedor=emprendedores.idemprendedor JOIN usuarios ON emprendedores.id_usuario=usuarios.idusuario WHERE emprendimientos.estadosolicitud=?"

    if (idemprendimiento){
        consulta+=" AND emprendimientos.idemprendimiento = ?"
        parametros.push(idemprendimiento)
    }
    if(cuil){
        consulta+=" AND emprendedores.cuil REGEXP ?"
        parametros.push(cuil)
    }
    if (nombreapellido){
        consulta+=" AND (usuarios.nombre REGEXP ? OR usuarios.apellido REGEXP ?)"
        parametros.push(nombreapellido)
        parametros.push(nombreapellido)
    }
    if (nombreemprendimiento){
        consulta+=" AND emprendimientos.nombreemprendimiento REGEXP ?"
        parametros.push(nombreemprendimiento)
    }
    if (categoria!='Todas'){
        consulta+=" AND emprendimientos.categoria =?"
        parametros.push(categoria)
    }
    consulta+='ORDER BY emprendimientos.idemprendimiento'
    const emprendimientos=await pool.query(consulta,parametros)
    for(let i=0;i<emprendimientos.length;i++){
        if(emprendimientos[i].categoria=='A'){
            emprendimientos[i].categoria='Alojamiento'
        }else{
            emprendimientos[i].categoria='Tour'
        }
    }
    res.json(emprendimientos)
})

router.get('/pendientes/:id',async(req,res)=>{
    res.render('./requests/viewoneawaitingrequests')
})

router.post('/pendientes/:id', async(req,res)=>{
    const {observaciones,resolucion,emailEnvio}=req.body
    let sendhtml
    if (resolucion=="Aceptado"){
        sendhtml=`<table style="height: 32px; width: 100%; border-collapse: collapse; margin-left: auto; margin-right: auto;" border="1">
        <tbody>
        <tr style="height: 18px;">
        <td style="width: 100%; height: 18px; text-align: center;">
        <h1 style="text-align: center;"><strong><img src="https://res.cloudinary.com/turistick/image/upload/v1634951604/Global/clipart249913_gg7bil.png" alt="" width="37" height="37" />TURISTIK</strong></h1>
        </td>
        </tr>
        </tbody>
        </table>
        <h2 style="text-align: center;"><span style="color: #339966;"><em><strong>&iexcl;Felicitaciones!&nbsp;</strong></em></span></h2>
        <p>Hemos decidido aprobar tu solicitud. Tu emprendimiento ya se puede visualizar en la p&aacute;gina de Turistik.</p>
        <p>Adem&aacute;s realizamos las siguientes observaciones:&nbsp;&nbsp; ${observaciones}</p>
        <p>Recuerda que puedes ver tus emprendimientos iniciando sesi&oacute;n en la p&aacute;gina.</p>`
    }else{
        if (resolucion=="Modificacion"){
            sendhtml=`<table style="height: 32px; width: 100%; border-collapse: collapse; margin-left: auto; margin-right: auto;" border="1">
            <tbody>
            <tr style="height: 18px;">
            <td style="width: 100%; height: 18px; text-align: center;">
            <h1 style="text-align: center;"><strong><img src="https://res.cloudinary.com/turistick/image/upload/v1634951604/Global/clipart249913_gg7bil.png" alt="" width="37" height="37" />TURISTIK</strong></h1>
            </td>
            </tr>
            </tbody>
            </table>
            <h2 style="text-align: center;"><span style="color: #339966;"><em><strong><span style="color: #ff9900;">Estas casi adentro...</span>&nbsp;</strong></em></span></h2>
            <p>Notamos que hay unos peque&ntilde;os detalles para modificar antes de poder publicar tu emprendimiento en nuestra p&aacute;gina.&nbsp;</p>
            <p>Hemos realizado las siguientes observaciones: ${observaciones} .</p>
            <p>Para modificar tu emprendimiento accede a tu cuenta con el correo y contrase&ntilde;a que ingresaste al llenar el formulario. Una vez hayas accedido, en la pesta&ntilde;a llamada 'Mis emprendimientos' encontr&aacute;s la im&aacute;gen y nombre de tu emprendimiento y un bot&oacute;n llamado 'Editar' que te permit&aacute; modificar al mismo.&nbsp;</p>
            <p>Puedes comunicarte con nosotros si necesitas m&aacute;s ayuda enviando un correo electr&oacute;nico a turistikjujuy@gmail.com.</p>`
        }else{
            sendhtml=`<table style="height: 32px; width: 100%; border-collapse: collapse; margin-left: auto; margin-right: auto;" border="1">
            <tbody>
            <tr style="height: 18px;">
            <td style="width: 100%; height: 18px; text-align: center;">
            <h1 style="text-align: center;"><strong><img src="https://res.cloudinary.com/turistick/image/upload/v1634951604/Global/clipart249913_gg7bil.png" alt="" width="37" height="37" />TURISTIK</strong></h1>
            </td>
            </tr>
            </tbody>
            </table>
            <h2 style="text-align: center;"><span style="color: #339966;"><em><strong><span style="color: #ff0000;">Lo sentimos...</span>&nbsp;</strong></em></span></h2>
            <p>Hemos decidido rechazar tu solicitud. Debido a que &nbsp;&nbsp; ${observaciones}.</p>
            <p>Puedes comunicarte con nosotros si crees que se trat&oacute; de un error o necesitas m&aacute;s ayuda enviando un correo electr&oacute;nico a turistikjujuy@gmail.com.</p>`
        }
        
    }
    sendMail(emailEnvio,sendhtml)
    .then((result)=>res.status(200).redirect("/solicitudes/pendientes"))
    .catch((error)=>console.log(error.message))
})

async function sendMail(emailEnvio,sendhtml){
    const CLIENT_ID=process.env.CLIENT_ID
    const CLIENT_SECRET=process.env.CLIENT_SECRET
    const REDIRECT_URI=process.env.REDIRECT_URI
    const REFRESH_TOKEN=process.env.REFRESH_TOKEN
    const oAuth2Client= new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)

    oAuth2Client.setCredentials({
        refresh_token:REFRESH_TOKEN
    })
    try{
        const accessToken=await oAuth2Client.getAccessToken()
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                type:"OAuth2",
                user:"turistikjujuy@gmail.com",
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
            
        })
        const mailOption={
            from:"Turistik <turistikjujuy@gmail.com>",
            to:emailEnvio,
            subject:"Respuesta a su solicitud de ser emprendedor en Turistik",
            html:sendhtml
        }

        const result= await transporter.sendMail(mailOption)
        return result
    }catch(err){
        console.log(err)
    }
}

module.exports=router
const express=require('express')
const nodemailer=require("nodemailer")
const {google}=require('googleapis')
const router=express.Router()
const pool=require('../database')
const cloudinary=require('cloudinary')
const {isLoggedInUsuario,isLoggedInAdm,isLoggedInEmp}=require('../lib/auth')
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

router.get('/aprobadas',isLoggedInAdm,async(req,res)=>{
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

router.get('/pendientes',isLoggedInAdm,async(req,res)=>{
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

router.get('/aprobadas/:id',isLoggedInAdm,async(req,res)=>{
    const {id}=req.params
    const emprendimiento=await pool.query('SELECT * FROM emprendimientos WHERE idemprendimiento=?',[id])
    let emp=emprendimiento[0]
    let control=''
    let datosEspecificos
    let actividades
    if (emp.categoria=='A'){
        emp.categoria='Alojamiento'
        datosEspecificos=await pool.query('SELECT * FROM alojamientos WHERE id_emprendimiento=?',[emp.idemprendimiento])
        datosEspecificos=datosEspecificos[0]
        if(datosEspecificos.piscina=='0'){
            datosEspecificos.piscina='No'
        }else{
            datosEspecificos.piscina='Sí'
        }
        if(datosEspecificos.hornobarro=='0'){
            datosEspecificos.hornobarro='No'
        }else{
            datosEspecificos.hornobarro='Sí'
        }
        if(datosEspecificos.animalesautoctonos=='0'){
            datosEspecificos.animalesautoctonos='No'
        }else{
            datosEspecificos.animalesautoctonos='Sí'
        }
        actividades=await pool.query('SELECT nombre from actividades WHERE idactividades in (select id_actividad from actividadesofrecidas where id_alojamiento=?)',[datosEspecificos.idalojamiento])
        control='Alojamiento'
    }else{
        emp.categoria='Tour'
        datosEspecificos=await pool.query('SELECT * FROM tours WHERE id_emprendimiento=?',[emp.idemprendimiento])
        datosEspecificos=datosEspecificos[0]
        let dur=datosEspecificos.duracion.split(':')
        datosEspecificos.duracion={horas:dur[0],minutos:dur[1]}
        actividades=await pool.query('SELECT nombre from actividades WHERE idactividades in (select id_actividad from toursofrecidos where id_tour=?)',[datosEspecificos.idtour])
    }
    const emprendedor=await pool.query('SELECT * FROM emprendedores WHERE idemprendedor=?',[emp.id_emprendedor])
    const emprendedorInd=emprendedor[0]
    const usuario=await pool.query('SELECT * FROM usuarios WHERE idusuario=?',[emprendedorInd.id_usuario])
    const usuarioInd=usuario[0]
    const loc=await pool.query('SELECT * FROM localidades WHERE idlocalidad=?',[emp.id_localidad])
    const locUnica=loc[0]
    const imagenes=await pool.query('SELECT link FROM imagenes WHERE id_emprendimiento=?',[emp.idemprendimiento])
    const contacto=await pool.query('SELECT * FROM contacto WHERE id_emprendimiento=?',[emp.idemprendimiento])
    const contactoUnico=contacto[0]
    res.render('./requests/viewoneapprovedrequests',{emp,emprendedorInd,usuarioInd,locUnica,imagenes,contactoUnico,control,datosEspecificos,actividades})
})

router.get('/aprobadas/eliminar/:id',isLoggedInAdm,async(req,res)=>{
    const {id}=req.params
    const catEmp=await pool.query('SELECT categoria FROM emprendimientos WHERE idemprendimiento=?',[id])
    const categoria=catEmp[0].categoria
    await pool.query('DELETE FROM contacto WHERE id_emprendimiento=?',[id])
    const imgs=await pool.query('SELECT publicid FROM imagenes WHERE id_emprendimiento=?',[id])
    for (let i=0;i<imgs.length;i++){
        await cloudinary.v2.uploader.destroy(imgs[i].publicid)
    }
    await pool.query('DELETE FROM imagenes WHERE id_emprendimiento=?',[id])
    await pool.query('DELETE FROM denuncias WHERE id_emprendimiento=?',[id])
    await pool.query('DELETE FROM calificaciones WHERE id_emprendimiento=?',[id])
    await pool.query('DELETE FROM sitiosguardados WHERE id_emprendimiento=?',[id])
    
    if(categoria=='A'){
        const idaloj=await pool.query('select idalojamiento from alojamientos where id_emprendimiento=?',[id])
        await pool.query('DELETE FROM alojamientos WHERE id_emprendimiento=?',[id])
        await pool.query('DELETE FROM actividadesofrecidas WHERE id_alojamiento=?',[idaloj[0].idalojamiento])
    }

    if (categoria=='T'){
        const idtour=await pool.query('select idtour from tours where id_emprendimiento=?',[id])
        await pool.query('DELETE FROM tours WHERE id_emprendimiento=?',[id])
        await pool.query('DELETE FROM toursofrecidos WHERE id_tour=?',[idtour[0].idtour])
    }

    await pool.query('DELETE FROM emprendimientos WHERE idemprendimiento=?',[id])
    res.redirect('/solicitudes/aprobadas')
})

router.get('/pendientes/:id',isLoggedInAdm,async(req,res)=>{
    const {id}=req.params
    const emprendimiento=await pool.query('SELECT * FROM emprendimientos WHERE idemprendimiento=?',[id])
    let emp=emprendimiento[0]
    let control=''
    let datosEspecificos
    let actividades
    if (emp.categoria=='A'){
        emp.categoria='Alojamiento'
        datosEspecificos=await pool.query('SELECT * FROM alojamientos WHERE id_emprendimiento=?',[emp.idemprendimiento])
        datosEspecificos=datosEspecificos[0]
        if(datosEspecificos.piscina=='0'){
            datosEspecificos.piscina='No'
        }else{
            datosEspecificos.piscina='Sí'
        }
        if(datosEspecificos.hornobarro=='0'){
            datosEspecificos.hornobarro='No'
        }else{
            datosEspecificos.hornobarro='Sí'
        }
        if(datosEspecificos.animalesautoctonos=='0'){
            datosEspecificos.animalesautoctonos='No'
        }else{
            datosEspecificos.animalesautoctonos='Sí'
        }
        actividades=await pool.query('SELECT nombre from actividades WHERE idactividades in (select id_actividad from actividadesofrecidas where id_alojamiento=?)',[datosEspecificos.idalojamiento])
        control='Alojamiento'
    }else{
        emp.categoria='Tour'
        datosEspecificos=await pool.query('SELECT * FROM tours WHERE id_emprendimiento=?',[emp.idemprendimiento])
        datosEspecificos=datosEspecificos[0]
        let dur=datosEspecificos.duracion.split(':')
        datosEspecificos.duracion={horas:dur[0],minutos:dur[1]}
        actividades=await pool.query('SELECT nombre from actividades WHERE idactividades in (select id_actividad from toursofrecidos where id_tour=?)',[datosEspecificos.idtour])
    }
    const emprendedor=await pool.query('SELECT * FROM emprendedores WHERE idemprendedor=?',[emp.id_emprendedor])
    const emprendedorInd=emprendedor[0]
    const usuario=await pool.query('SELECT * FROM usuarios WHERE idusuario=?',[emprendedorInd.id_usuario])
    const usuarioInd=usuario[0]
    const loc=await pool.query('SELECT * FROM localidades WHERE idlocalidad=?',[emp.id_localidad])
    const locUnica=loc[0]
    const imagenes=await pool.query('SELECT link FROM imagenes WHERE id_emprendimiento=?',[emp.idemprendimiento])
    const contacto=await pool.query('SELECT * FROM contacto WHERE id_emprendimiento=?',[emp.idemprendimiento])
    const contactoUnico=contacto[0]
    res.render('./requests/viewoneawaitingrequests',{emp,emprendedorInd,usuarioInd,locUnica,imagenes,contactoUnico,control,datosEspecificos,actividades})
})

router.post('/pendientes/:id', isLoggedInAdm,async(req,res)=>{
    const {observaciones,resolucion,emailEnvio}=req.body
    const {id}=req.params
    let sendhtml
    if (resolucion=="Aceptado"){
        await pool.query('UPDATE emprendimientos SET estadosolicitud="A" WHERE idemprendimiento=?',[id])
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
            const catEmp=await pool.query('SELECT categoria FROM emprendimientos WHERE idemprendimiento=?',[id])
            const categoria=catEmp[0].categoria
            await pool.query('DELETE FROM contacto WHERE id_emprendimiento=?',[id])
            const imgs=await pool.query('SELECT publicid FROM imagenes WHERE id_emprendimiento=?',[id])
            for (let i=0;i<imgs.length;i++){
                await cloudinary.v2.uploader.destroy(imgs[i].publicid)
            }
            await pool.query('DELETE FROM imagenes WHERE id_emprendimiento=?',[id])
            await pool.query('DELETE FROM denuncias WHERE id_emprendimiento=?',[id])
            await pool.query('DELETE FROM calificaciones WHERE id_emprendimiento=?',[id])
            await pool.query('DELETE FROM sitiosguardados WHERE id_emprendimiento=?',[id])
            
            if(categoria=='A'){
                const idaloj=await pool.query('select idalojamiento from alojamientos where id_emprendimiento=?',[id])
                await pool.query('DELETE FROM alojamientos WHERE id_emprendimiento=?',[id])
                await pool.query('DELETE FROM actividadesofrecidas WHERE id_alojamiento=?',[idaloj[0].idalojamiento])
            }
        
            if (categoria=='T'){
                const idtour=await pool.query('select idtour from tours where id_emprendimiento=?',[id])
                await pool.query('DELETE FROM tours WHERE id_emprendimiento=?',[id])
                await pool.query('DELETE FROM toursofrecidos WHERE id_tour=?',[idtour[0].idtour])
            }

            await pool.query('DELETE FROM emprendimientos WHERE idemprendimiento=?',[id])
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
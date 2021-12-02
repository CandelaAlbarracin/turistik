const express=require('express')
const router=express.Router()
const pool=require('../database')
const cloudinary=require('cloudinary')
const fs=require('fs-extra');
const {isLoggedInUsuario,isLoggedInAdm,isLoggedInEmp}=require('../lib/auth')
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

router.get('/',isLoggedInEmp,async(req,res)=>{
    let emprendimientos= await pool.query('SELECT DISTINCTROW emp.idemprendimiento,emp.ubicacion,loc.nombrelocalidad,loc.departamento,emp.nombreemprendimiento, emp.categoria,emp.estadosolicitud, img.link from emprendimientos emp join imagenes img on emp.idemprendimiento=img.id_emprendimiento and img.tipo="P" join localidades loc on emp.id_localidad=loc.idlocalidad join emprendedores on emp.id_emprendedor=emprendedores.idemprendedor where emprendedores.id_usuario=?;',[req.user.idusuario])
    let idencontrado,linkCat
    for(let i=0;i<emprendimientos.length;i++){       
        if(emprendimientos[i].categoria=='A'){
            idencontrado=await pool.query('SELECT idalojamiento FROM alojamientos WHERE id_emprendimiento=?',[emprendimientos[i].idemprendimiento])
            linkCat=`/misemprendimientos/alojamientos/detalles/${idencontrado[0].idalojamiento}`
        }else{
            idencontrado=await pool.query('SELECT idtour FROM tours WHERE id_emprendimiento=?',[emprendimientos[i].idemprendimiento]) 
            linkCat=`/misemprendimientos/tours/detalles/${idencontrado[0].idtour}`
        }
        emprendimientos[i].linkCat=linkCat
        if(emprendimientos[i].estadosolicitud=="A"){
            emprendimientos[i].estadosolicitud='<i class="fas fa-check-circle" style="color: green;"></i> Aprobado'
        }else{
            emprendimientos[i].estadosolicitud='<i class="fas fa-hourglass-half" style="transform: rotate(30deg); color: orange"></i> Pendiente de aprobación'
        }
    }
    res.render('./smallenterprise/myenterprises',{emprendimientos})
})

router.get('/alojamientos/detalles/:id', isLoggedInEmp,async (req,res)=>{
    const { id } = req.params;
    const infoDetalles = await pool.query('SELECT contacto.facebook, contacto.instagram, contacto.telefono, contacto.youtube, emprendimientos.descripcion, alojamientos.idalojamiento ,imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina,alojamientos.vista,alojamientos.hornobarro,alojamientos.animalesautoctonos, emprendimientos.id_localidad from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento INNER JOIN contacto ON contacto.id_emprendimiento=emprendimientos.idemprendimiento where alojamientos.idalojamiento=?', [id]);
    const solo = infoDetalles[0];
    const imag = await pool.query('SELECT  imagenes.link from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where alojamientos.idalojamiento=?', [solo.idalojamiento]);
    const idemp=await pool.query('SELECT id_emprendimiento from alojamientos where idalojamiento=?',[id])
    const emprendimiento=idemp[0]
    const actividades=await pool.query('select nombre from actividades where idactividades in (select id_actividad from actividadesofrecidas where id_alojamiento=?);',[id])
    
    const calificacion=await pool.query('select avg(puntuacion) as promedio from calificaciones where id_emprendimiento=?;',[emprendimiento.id_emprendimiento])
    const promedioCalificacion=calificacion[0].promedio
    let reviews
    
    reviews=await pool.query('select u.nombre,u.apellido, c.puntuacion,c.comentario from calificaciones c join usuarios u on c.id_usuario=u.idusuario where id_emprendimiento=?;',[emprendimiento.id_emprendimiento])
    
    const dueno= await pool.query('select distinct nombre,apellido from usuarios where idusuario in (select id_usuario from emprendedores where idemprendedor in (select id_emprendedor from emprendimientos where idemprendimiento in (select id_emprendimiento from alojamientos where idalojamiento=?)));',[id])
    const duenoindividual=dueno[0]
    const localidad=await pool.query('SELECT nombrelocalidad FROM localidades WHERE idlocalidad=?',[solo.id_localidad])
    loc=localidad[0].nombrelocalidad.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    urlmap=(solo.ubicacion+`,%20${loc}`).replace(' ','%20')
    
    res.render('./smallenterprise/detailsaccommodationsEmp', {solo, emprendimiento,urlmap, imag,loc,duenoindividual,promedioCalificacion,reviews,actividades});
})

router.get('/tours/detalles/:id',isLoggedInEmp,async(req,res)=>{
    const { id } = req.params;
    const infoDetalles = await pool.query('SELECT contacto.facebook, contacto.instagram, contacto.telefono, contacto.youtube, emprendimientos.descripcion, tours.idtour ,imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, tours.dificultad,tours.duracion,tours.recomendaciones,tours.precio , emprendimientos.id_localidad from emprendimientos inner join tours on emprendimientos.idemprendimiento=tours.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento INNER JOIN contacto ON contacto.id_emprendimiento=emprendimientos.idemprendimiento where tours.idtour=?', [id]);
    const solo = infoDetalles[0];
    solo.duracion=formatearHora(solo.duracion)
    const infoOtros = await pool.query('SELECT tours.idtour, tours.precio, imagenes.link FROM tours INNER JOIN emprendimientos on tours.id_emprendimiento=emprendimientos.idemprendimiento inner join imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where (tours.idtour<>? and imagenes.tipo="P") order by rand() limit 4', [solo.idtour])
    const imag = await pool.query('SELECT  imagenes.link from emprendimientos inner join tours on emprendimientos.idemprendimiento=tours.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where tours.idtour=?', [solo.idtour]);
    const idemp=await pool.query('SELECT id_emprendimiento from tours where idtour=?',[id])
    const emprendimiento=idemp[0]
    const actividades=await pool.query('select nombre from actividades where idactividades in (select id_actividad from toursofrecidos where id_tour=?);',[id])
    const calificacion=await pool.query('select avg(puntuacion) as promedio from calificaciones where id_emprendimiento=?;',[emprendimiento.id_emprendimiento])
    const promedioCalificacion=calificacion[0].promedio
    let reviews
    
    reviews=await pool.query('select u.nombre,u.apellido, c.puntuacion,c.comentario from calificaciones c join usuarios u on c.id_usuario=u.idusuario where id_emprendimiento=?;',[emprendimiento.id_emprendimiento])
    
    const dueno= await pool.query('select distinct nombre,apellido from usuarios where idusuario in (select id_usuario from emprendedores where idemprendedor in (select id_emprendedor from emprendimientos where idemprendimiento in (select id_emprendimiento from tours where idtour=?)));',[id])
    const duenoindividual=dueno[0]
    const localidad=await pool.query('SELECT nombrelocalidad FROM localidades WHERE idlocalidad=?',[solo.id_localidad])
    loc=localidad[0].nombrelocalidad.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    map=(solo.ubicacion+`,%20${loc}`).replace(' ','%20')
    urlmap=map.replace(' ','%20')
    
    res.render('./smallenterprise/detailstoursEmp', {solo,emprendimiento,urlmap, imag,loc,duenoindividual,promedioCalificacion,reviews,actividades});
})
function formatearHora(hora){
    horaarray=hora.split(':')
    textohora=''
    if (horaarray[0]!='00'){
         if (horaarray[0]=='01'){
              textohora=`${parseInt(horaarray[0])} hora`
         }else{
              textohora=`${parseInt(horaarray[0])} horas`
         }
         if (horaarray[1]!='00'){
              textohora+=` y ${horaarray[1]} minutos`
         }
    }else{
         if (horaarray[1]!='00'){
              textohora+=`${horaarray[1]} minutos`
         }
    }
    return textohora
}

router.get('/eliminar/:id',isLoggedInEmp,async(req,res)=>{
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
    res.redirect('/misemprendimientos')
})

router.post('/buscar',async(req,res)=>{
    const {nombreemprendimiento,ubicacion,estadosolicitud}=req.body
    let consulta='SELECT DISTINCTROW emp.idemprendimiento,emp.ubicacion,loc.nombrelocalidad,loc.departamento,emp.nombreemprendimiento, emp.categoria,emp.estadosolicitud, img.link from emprendimientos emp join imagenes img on emp.idemprendimiento=img.id_emprendimiento and img.tipo="P" join localidades loc on emp.id_localidad=loc.idlocalidad join emprendedores on emp.id_emprendedor=emprendedores.idemprendedor where emprendedores.id_usuario=?'
    let parametros=[req.user.idusuario]
    if (nombreemprendimiento){
        consulta+=' AND emp.nombreemprendimiento REGEXP ?'
        parametros.push(nombreemprendimiento)
    }
    if(ubicacion){
        consulta+=' AND (emp.ubicacion REGEXP ? OR loc.nombrelocalidad REGEXP ? OR loc.departamento REGEXP ?)'
        parametros.push(ubicacion)
        parametros.push(ubicacion)
        parametros.push(ubicacion)
    }
    if (estadosolicitud!='Cualquiera'){
        consulta+=' AND emp.estadosolicitud=?'
        parametros.push(estadosolicitud)
    }
    const emprendimientos=await pool.query(consulta,parametros)
    let idencontrado,linkCat
    for(let i=0;i<emprendimientos.length;i++){       
        if(emprendimientos[i].categoria=='A'){
            idencontrado=await pool.query('SELECT idalojamiento FROM alojamientos WHERE id_emprendimiento=?',[emprendimientos[i].idemprendimiento])
            linkCat=`/misemprendimientos/alojamientos/detalles/${idencontrado[0].idalojamiento}`
        }else{
            idencontrado=await pool.query('SELECT idtour FROM tours WHERE id_emprendimiento=?',[emprendimientos[i].idemprendimiento]) 
            linkCat=`/misemprendimientos/tours/detalles/${idencontrado[0].idtour}`
        }
        emprendimientos[i].linkCat=linkCat
        if(emprendimientos[i].estadosolicitud=="A"){
            emprendimientos[i].estadosolicitud='<i class="fas fa-check-circle" style="color: green;"></i> Aprobado'
        }else{
            emprendimientos[i].estadosolicitud='<i class="fas fa-hourglass-half" style="transform: rotate(30deg); color: orange"></i> Pendiente de aprobación'
        }
    }
    res.json(emprendimientos)
})

router.get('/editar/:id',isLoggedInEmp,async(req,res)=>{
    const {id}=req.params
    const emprendimiento=await pool.query('SELECT * FROM emprendimientos WHERE idemprendimiento=?',[id])
    const usuario=await pool.query('SELECT * FROM usuarios WHERE idusuario=?',[req.user.idusuario])
    const cuil=await pool.query('SELECT cuil FROM emprendedores WHERE id_usuario=?',[req.user.idusuario])
    const cuilarray=cuil[0].cuil.split('-')
    const objectCuil={precuil:cuilarray[0],cuil:cuilarray[1],poscuil:cuilarray[2]}
    const infoUsuario=usuario[0]
    const emprendimientoUnico=emprendimiento[0]
    let ub=emprendimientoUnico.ubicacion.split(' ')
    const nro= ub.pop()
    const calle=ub.join(' ')
    emprendimientoUnico.ubicacion={calle,nro}
    const loc=await pool.query('SELECT idlocalidad,nombrelocalidad,departamento FROM localidades WHERE idlocalidad=?',[emprendimientoUnico.id_localidad])
    const dep=await pool.query('SELECT DISTINCTROW departamento FROM localidades WHERE departamento<>? ORDER BY nombrelocalidad',[loc[0].departamento])
    const locunico=loc[0]
    let control='T'
    let datosEspecificos
    let actividades
    let otrasActividades
    if (emprendimientoUnico.categoria=='A'){
        control=''
        datosEspecificos=await pool.query('SELECT * FROM alojamientos WHERE id_emprendimiento=?',[emprendimientoUnico.idemprendimiento])
        datosEspecificos=datosEspecificos[0]
        actividades=await pool.query('SELECT * from actividades WHERE idactividades in (select id_actividad from actividadesofrecidas where id_alojamiento=?)',[datosEspecificos.idalojamiento])
        let act=[]
        for (let i=0;i<actividades.length;i++){
            act.push(actividades[i].idactividades)
        }
        otrasActividades=await pool.query('SELECT * from actividades WHERE idactividades not in (?) AND tipo="A"',[act])
    }else{
        emprendimientoUnico.categoria='Tour'
        datosEspecificos=await pool.query('SELECT * FROM tours WHERE id_emprendimiento=?',[emprendimientoUnico.idemprendimiento])
        datosEspecificos=datosEspecificos[0]
        let dur=datosEspecificos.duracion.split(':')
        datosEspecificos.duracion={horas:dur[0],minutos:dur[1]}
        actividades=await pool.query('SELECT * from actividades WHERE idactividades in (select id_actividad from toursofrecidos where id_tour=?)',[datosEspecificos.idtour])
        let act=[]
        for (let i=0;i<actividades.length;i++){
            act.push(actividades[i].idactividades)
        }
        otrasActividades=await pool.query('SELECT * from actividades WHERE idactividades not in (?) AND tipo="T"',[act])
    }
    const contactos=await pool.query('SELECT * FROM contacto WHERE id_emprendimiento=?',[emprendimientoUnico.idemprendimiento])
    const contacto=contactos[0]
    const imgP=await pool.query('SELECT link FROM imagenes WHERE id_emprendimiento=? AND tipo="P"',[emprendimientoUnico.idemprendimiento])
    const imgPrincipal=imgP[0]
    const imagenesSec=await pool.query('SELECT idimagen,link FROM imagenes WHERE id_emprendimiento=? AND tipo="S"',[emprendimientoUnico.idemprendimiento])
    res.render('smallenterprise/editEmp',{emprendimientoUnico,infoUsuario,objectCuil,locunico,dep,control,datosEspecificos,actividades,otrasActividades,contacto,imgPrincipal,imagenesSec})
})

router.get('/nuevo',isLoggedInEmp,async(req,res)=>{
    const usuario=await pool.query('SELECT * FROM usuarios WHERE idusuario=?',[req.user.idusuario])
    const cuil=await pool.query('SELECT cuil FROM emprendedores WHERE id_usuario=?',[req.user.idusuario])
    const cuilarray=cuil[0].cuil.split('-')
    const objectCuil={precuil:cuilarray[0],cuil:cuilarray[1],poscuil:cuilarray[2]}
    const infoUsuario=usuario[0]
    const dep=await pool.query('SELECT distinctrow departamento FROM localidades ORDER BY departamento')
    res.render('smallenterprise/addEmp',{infoUsuario,objectCuil,dep})
})

router.post('/nuevo',async(req,res)=>{
    const {nombreemprendimiento,calle,numero,categoria,descripcion,localidad} = req.body
    const aux2 = await pool.query("SELECT idemprendedor FROM emprendedores WHERE id_usuario=?",[req.user.idusuario])
    const nuevo_Emp = {
        nombreemprendimiento,
        ubicacion:`${calle} ${numero}`,
        descripcion,
        categoria,
        estadosolicitud: "P",
        id_emprendedor: aux2[0].idemprendedor,
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
    res.redirect('/misemprendimientos')
})

router.post('/editar',isLoggedInEmp,async(req,res)=>{
    const {id,nombreemprendimiento,calle,numero,categoria,descripcion}=req.body
    const categoriaInicial=await pool.query('SELECT categoria FROM emprendimientos WHERE idemprendimiento=?',[id])
    const catInicial=categoriaInicial[0].categoria
    const editEmprendimiento={
        nombreemprendimiento,
        ubicacion:`${calle} ${numero}`,
        estadosolicitud:'P',
        categoria,
        descripcion
    }
    await pool.query('UPDATE emprendimientos SET ? WHERE idemprendimiento=?',[editEmprendimiento,id])
    const {duracionHoras,duracionMinutos,precio,recomendaciones,dificultad,precioxnoche,capacidadhabitaciones,capacidadestacionamientos,tipo,piscina,vista,hornobarro,animales}=req.body
    const tour={
        duracion:`${duracionHoras}:${duracionMinutos}`,
        precio,
        recomendaciones,
        dificultad
    }
    const aloj={
        precionoche:precioxnoche,
        capacidadhabitaciones,
        capacidadestacionamientos,
        tipoalojamiento:tipo,
        piscina,
        vista,
        hornobarro,
        animalesautoctonos:animales
    }
    if (categoria!=catInicial){
        if(catInicial=='A'){
            const idaloj=await pool.query('SELECT idalojamiento FROM alojamientos WHERE id_emprendimiento=?',[id])
            await pool.query('DELETE FROM alojamientos WHERE id_emprendimiento=?',[id])
            tours.id_emprendimiento=id
            await pool.query('INSERT INTO tours SET ?',[tour])
            await pool.query('DELETE FROM actividadesofrecidas WHERE id_alojamiento=?',[idaloj[0].idalojamiento])
        }else{
            const idtour=await pool.query('SELECT idtour FROM tours WHERE id_emprendimiento=?',[id])
            await pool.query('DELETE FROM tours WHERE id_emprendimiento=?',[id])
            aloj.id_emprendimiento=id
            await pool.query('INSERT INTO alojamientos set ?',[aloj])
            await pool.query('DELETE FROM toursofrecidos WHERE id_tour=?',[idtour[0].idtour])
        }
    }else{
        if(categoria=='A'){
            await pool.query('UPDATE alojamientos SET ? WHERE id_emprendimiento=?',[aloj,id])
        }else{
            await pool.query('UPDATE tours SET ? WHERE id_emprendimiento=?',[tours,id])
        }
    }
    const {actividades}=req.body
    let actArray=actividades.split(',')
    if (actArray[actArray.length-1]==''){
        actArray.pop()
    }
    if(categoria=="A"){
        const idActualAloj=await pool.query('SELECT idalojamiento FROM alojamientos WHERE id_emprendimiento=?',[id])
        await pool.query('DELETE FROM actividadesofrecidas WHERE id_alojamiento=?',[idActualAloj[0].idalojamiento])
        for (let i=0;i<actArray.length;i++){
            let actOfrecida={
                id_alojamiento:idActualAloj[0].idalojamiento,
                id_actividad:actArray[i]
            }
            await pool.query("INSERT INTO actividadesofrecidas set ?",[actOfrecida])
        }
    }else{
        const idActualTour=await pool.query('SELECT idtour FROM tours WHERE id_emprendimiento=?',[id])
        await pool.query('DELETE FROM tourssofrecidas WHERE id_tour=?',[idActualTour[0].idtour])
        for (let i=0;i<actArray.length;i++){
            let actOfrecida={
                id_tour:idActualTour[0].idtour,
                id_actividad:actArray[i]
            }
            await pool.query("INSERT INTO toursofrecidos set ?",[actOfrecida])
        }
    }
    const {telefono,facebook,instagram,youtube}=req.body
    const contacto={
        telefono,
        facebook,
        instagram,
        youtube
    }
    await pool.query('UPDATE contacto SET ? WHERE id_emprendimiento=?',[contacto,id])
    
    const {image,imagensec}=req.files
    if(image){
        const pathimagenPrimaria=image[0].path 
        const result=await cloudinary.v2.uploader.upload(pathimagenPrimaria)
        const newImgPrimary={
            link:result.url,
            tipo:"P",
            id_emprendimiento:id,
            publicid:result.public_id
        }
        await fs.unlink(pathimagenPrimaria)
        const idImgP=await pool.query('select idimagen from imagenes where tipo="P" and id_emprendimiento=?',[id])
        const idimg=idImgP[0].idimagen
        await pool.query('UPDATE imagenes set ? WHERE idimagen=?',[newImgPrimary,idimg])
    }
    const {Eliminar}=req.body
    const eliminar=Eliminar.split(',')
    const publicsid=await pool.query('select publicid from imagenes where idimagen in (?)',[eliminar])
    await pool.query('Delete from imagenes where idimagen in (?)',[eliminar])
    for (let i=0;i<publicsid.length;i++){
        await cloudinary.v2.uploader.destroy(publicsid[i].publicid)
        
    }
    if (imagensec){
        for (let i=0;i<imagensec.length;i++){
            let result2=await cloudinary.v2.uploader.upload(imagensec[i].path)
            await fs.unlink(imagensec[i].path)
            const newImgSec={
                link:result2.url,
                tipo:"S",
                id_emprendimiento:id,
                publicid:result2.public_id
            }
            await pool.query('INSERT INTO imagenes set ?',[newImgSec])
        }
    }
    req.flash('info', 'Su propuesta modificada ha sido recibida. Cuando un administrador lo autorice volverá a ser visible en la página')
    res.redirect('/misemprendimientos')
})

module.exports=router
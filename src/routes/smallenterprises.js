const express=require('express')
const router=express.Router()
const pool=require('../database')
const cloudinary=require('cloudinary')
const {isLoggedInUsuario,isLoggedInAdm,isLoggedInEmp}=require('../lib/auth')
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

router.get('/',async(req,res)=>{
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

router.get('/alojamientos/detalles/:id', async (req,res)=>{
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

router.get('/tours/detalles/:id',async(req,res)=>{
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

router.get('/eliminar/:id',async(req,res)=>{
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
        await pool.query('DELETE FROM alojamientos WHERE id_emprendimiento=?',[id])
        await pool.query('DELETE FROM actividadesofrecidas WHERE id_emprendimiento=?',[id])
    }

    if (categoria=='T'){
        await pool.query('DELETE FROM tours WHERE id_emprendimiento=?',[id])
        await pool.query('DELETE FROM toursofrecidos WHERE id_emprendimiento=?',[id])
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
module.exports=router
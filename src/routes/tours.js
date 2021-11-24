const { text } = require('express')
const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/',async(req,res)=>{
    const actividades=await pool.query('SELECT img.link,act.idactividades,act.nombre,act.introduccion from actividades act JOIN imagenesactividades img ON act.idactividades=img.id_actividad where img.tipo="P" and act.tipo="T";')
    res.render('./tours/tours',{actividades})
})

router.get('/actividades/:id', async(req,res)=>{
    const {id}=req.params
    const detallesactividades=await pool.query('SELECT * FROM actividades WHERE idactividades=?;',[id])
    const imagenPrincipal=await pool.query('SELECT link FROM imagenesactividades WHERE id_actividad=? AND tipo="P";',[id])
    const imagenesSec=await pool.query('SELECT link FROM imagenesactividades WHERE id_actividad=? AND tipo="S";',[id])
    const tours=await pool.query('select img.link, tours.idtour,emp.nombreemprendimiento, emp.descripcion from emprendimientos emp join imagenes img on emp.idemprendimiento=img.id_emprendimiento and img.tipo="P" join tours on emp.idemprendimiento=tours.id_emprendimiento join toursofrecidos on tours.idtour=toursofrecidos.id_tour and toursofrecidos.id_actividad=?;',[id])
    const detalles=detallesactividades[0]
    const imgPrincipal=imagenPrincipal[0]
    console.log(tours)
    res.render('./tours/activity',{detalles,imgPrincipal,imagenesSec,tours}) 
})

router.get('/detalles/:id', async (req,res)=>{
    const { id } = req.params;
    const infoDetalles = await pool.query('SELECT contacto.facebook, contacto.instagram, contacto.telefono, contacto.youtube, emprendimientos.descripcion, tours.idtour ,imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, tours.dificultad,tours.duracion,tours.recomendaciones,tours.precio , emprendimientos.id_localidad from emprendimientos inner join tours on emprendimientos.idemprendimiento=tours.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento INNER JOIN contacto ON contacto.id_emprendimiento=emprendimientos.idemprendimiento where tours.idtour=?', [id]);
    const solo = infoDetalles[0];
    //solo.duracion=solo.duracion.split(':')
    solo.duracion=formatearHora(solo.duracion)
    const infoOtros = await pool.query('SELECT tours.idtour, tours.precio, imagenes.link FROM tours INNER JOIN emprendimientos on tours.id_emprendimiento=emprendimientos.idemprendimiento inner join imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where (tours.idtour<>? and imagenes.tipo="P") order by rand() limit 4', [solo.idtour])
    const imag = await pool.query('SELECT  imagenes.link from emprendimientos inner join tours on emprendimientos.idemprendimiento=tours.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where tours.idtour=?', [solo.idtour]);
    const idemp=await pool.query('SELECT id_emprendimiento from tours where idtour=?',[id])
    const emprendimiento=idemp[0]
    const actividades=await pool.query('select nombre from actividades where idactividades in (select id_actividad from toursofrecidos where id_tour=?);',[id])
    const calificacion=await pool.query('select avg(puntuacion) as promedio from calificaciones where id_emprendimiento=?;',[emprendimiento.id_emprendimiento])
    const promedioCalificacion=calificacion[0].promedio
    let reviews,calificacionU,guardado
    if (req.user){
         guardado=await pool.query('select idguardado from sitiosguardados where id_emprendimiento=? and id_usuario=?',[emprendimiento.id_emprendimiento,req.user.idusuario])
         reviews=await pool.query('select u.nombre,u.apellido, c.puntuacion,c.comentario from calificaciones c join usuarios u on c.id_usuario=u.idusuario where id_emprendimiento=? and u.idusuario<>?;',[emprendimiento.id_emprendimiento,req.user.idusuario])
         const calificacionUsuario=await pool.query('select c.idcalificacion,c.puntuacion,c.comentario from calificaciones c join usuarios u on c.id_usuario=u.idusuario where id_emprendimiento=? and u.idusuario=?;',[emprendimiento.id_emprendimiento,req.user.idusuario])
         calificacionU=calificacionUsuario[0]
    }else{
         reviews=await pool.query('select u.nombre,u.apellido, c.puntuacion,c.comentario from calificaciones c join usuarios u on c.id_usuario=u.idusuario where id_emprendimiento=?;',[emprendimiento.id_emprendimiento])
    }
    
    const dueno= await pool.query('select distinct nombre,apellido from usuarios where idusuario in (select id_usuario from emprendedores where idemprendedor in (select id_emprendedor from emprendimientos where idemprendimiento in (select id_emprendimiento from tours where idtour=?)));',[id])
    const duenoindividual=dueno[0]
    const localidad=await pool.query('SELECT nombrelocalidad FROM localidades WHERE idlocalidad=?',[solo.id_localidad])
    loc=localidad[0].nombrelocalidad.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    map=(solo.ubicacion+`,%20${loc}`).replace(' ','%20')
    urlmap=map.replace(' ','%20')
    if (req.user){
         res.render('./tours/details_tours', {solo, infoOtros,emprendimiento,urlmap, imag,loc,duenoindividual,promedioCalificacion,reviews,calificacionU,actividades,guardado});
    }else{
         res.render('./tours/details_tours', {solo, infoOtros,emprendimiento,urlmap, imag,loc,duenoindividual,promedioCalificacion,reviews,actividades});
    }
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
module.exports=router
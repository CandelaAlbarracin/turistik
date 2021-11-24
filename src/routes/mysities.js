const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/',async(req,res)=>{
    let sitios= await pool.query('SELECT DISTINCTROW emp.idemprendimiento,emp.ubicacion,loc.nombrelocalidad,loc.departamento,emp.nombreemprendimiento, emp.categoria, img.link from emprendimientos emp join imagenes img on emp.idemprendimiento=img.id_emprendimiento and img.tipo="P" join localidades loc on emp.id_localidad=loc.idlocalidad join sitiosguardados sg on sg.id_emprendimiento=emp.idemprendimiento and sg.id_usuario=?;',[req.user.idusuario])
    let calificaciones,calificacion
    let idencontrado,linkCat
    for(let i=0;i<sitios.length;i++){
        calificaciones= await pool.query('select puntuacion from calificaciones where id_emprendimiento=? and id_usuario=?',[sitios[i].idemprendimiento,req.user.idusuario])
        if (calificaciones.length>0){
            calificacion=calificaciones[0].puntuacion
        }else{
            calificacion=''
        }
        sitios[i].puntuacion=calificacion
        
        if(sitios[i].categoria=='A'){
            idencontrado=await pool.query('SELECT idalojamiento FROM alojamientos WHERE id_emprendimiento=?',[sitios[i].idemprendimiento])
            linkCat=`/alojamientos/detalles/${idencontrado[0].idalojamiento}`
        }else{
            idencontrado=await pool.query('SELECT idtour FROM tours WHERE id_emprendimiento=?',[sitios[i].idemprendimiento]) 
            linkCat=`/tours/detalles/${idencontrado[0].idtour}`
        }
        sitios[i].linkCat=linkCat
    }
    
    res.render('./sities/mysities',{sitios})
})

router.get('/eliminar/:id',async(req,res)=>{
    const {id}=req.params
    await pool.query('DELETE FROM sitiosguardados WHERE id_emprendimiento=? AND id_usuario=?',[id,req.user.idusuario])
    res.redirect('/missitios')
})

router.post('/buscar',async(req,res)=>{
    const {nombreemprendimiento,ubicacion}=req.body
    let consulta='SELECT DISTINCTROW emp.idemprendimiento,emp.ubicacion,loc.nombrelocalidad,loc.departamento,emp.nombreemprendimiento, emp.categoria, img.link from emprendimientos emp join imagenes img on emp.idemprendimiento=img.id_emprendimiento and img.tipo="P" join localidades loc on emp.id_localidad=loc.idlocalidad join sitiosguardados sg on sg.id_emprendimiento=emp.idemprendimiento and sg.id_usuario=?'
    let parametros=[req.user.idusuario]
    if (nombreemprendimiento){
        consulta=`${consulta} and emp.nombreemprendimiento regexp ?`
        parametros.push(nombreemprendimiento)
    }
    if (ubicacion){
        consulta=`${consulta} where (emp.ubicacion regexp ? or loc.nombrelocalidad regexp ? or loc.departamento regexp ?);`
        parametros.push(ubicacion)
        parametros.push(ubicacion)
        parametros.push(ubicacion)
    }

    const sitios=await pool.query(consulta,parametros)
    let calificaciones,calificacion
    let idencontrado,linkCat
    for(let i=0;i<sitios.length;i++){
        calificaciones= await pool.query('select puntuacion from calificaciones where id_emprendimiento=? and id_usuario=?',[sitios[i].idemprendimiento,req.user.idusuario])
        if (calificaciones.length>0){
            calificacion=calificaciones[0].puntuacion
        }else{
            calificacion=''
        }
        sitios[i].puntuacion=calificacion
        
        if(sitios[i].categoria=='A'){
            idencontrado=await pool.query('SELECT idalojamiento FROM alojamientos WHERE id_emprendimiento=?',[sitios[i].idemprendimiento])
            linkCat=`/alojamientos/detalles/${idencontrado[0].idalojamiento}`
        }else{
            idencontrado=await pool.query('SELECT idtour FROM tours WHERE id_emprendimiento=?',[sitios[i].idemprendimiento]) 
            linkCat=`/tours/detalles/${idencontrado[0].idtour}`
        }
        sitios[i].linkCat=linkCat
    }
    res.json(sitios)
})
module.exports=router
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
    const tours=await pool.query('select img.link, tours.idtour,emp.nombreemprendimiento, emp.descripcion from emprendimientos emp join imagenes img on emp.idemprendimiento=img.id_emprendimiento and img.tipo="P" join tours on emp.idemprendimiento=tours.id_emprendimiento join tourssofrecidos tourstof on tours.idtour=toursof.id_tour and toursof.id_tours=?;',[id])
    const detalles=detallesactividades[0]
    const imgPrincipal=imagenPrincipal[0]
    res.render('./tours/activity',{detalles,imgPrincipal,imagenesSec,tours}) 
})
module.exports=router
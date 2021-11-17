const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/',async(req,res)=>{
    const denuncias=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento order by d.nroDenuncia;')
    denuncias.map(function(denuncia){
        if (denuncia.categoria=='A'){
            denuncia.categoria='Alojamiento'
        }else{
            denuncia.categoria='Tour'
        }
    })
    const total=await pool.query('SELECT COUNT(*) as cantidad FROM denuncias;')
    res.render('./denuncias/denuncias',[{denuncias},total[0].cantidad,'',''])
})

router.post('/resultados',async(req,res)=>{
    let {nombreemprendimiento,motivo,categoria}=req.body
    const categoriaarray=JSON.parse('['+categoria+']')
    let denunciasResultado,total
    if (nombreemprendimiento){
        if (motivo=="Todos"){
            denunciasResultado=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.nombreemprendimiento regexp ? AND em.categoria in (?);',[nombreemprendimiento,categoriaarray])
        }else{
            denunciasResultado=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.nombreemprendimiento regexp ? AND em.categoria in (?) AND d.motivo=?;',[nombreemprendimiento,categoriaarray,motivo])
        }
    }else{
        if (motivo=='Todos'){
            if (categoriaarray.length>1){
                denunciasResultado=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento')
            }else{
                denunciasResultado=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.categoria in (?)',[categoriaarray])
            }
        }else{
            if (categoriaarray.length>1){
                denunciasResultado=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND d.motivo=?',[motivo])
            }else{
                denunciasResultado=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.categoria in (?)',[categoriaarray])
            }
        }
    }
    denunciasResultado.map(function(denuncia){
        if (denuncia.categoria=='A'){
            denuncia.categoria='Alojamiento'
        }else{
            denuncia.categoria='Tour'
        }
    })
    total=denunciasResultado.length
    res.json({denunciasResultado,total})
})

module.exports=router
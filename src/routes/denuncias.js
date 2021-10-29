const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/',async(req,res)=>{
    const denuncias=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento;')
    denuncias.map(function(denuncia){
        if (denuncia.categoria=='A'){
            denuncia.categoria='Alojamiento'
        }else if (denuncia.categoria=='R'){
            denuncia.categoria='Restaurante'
        }else{
            denuncia.categoria='Tour'
        }
    })
    const total=await pool.query('SELECT COUNT(*) as cantidad FROM denuncias;')
    res.render('./denuncias/denuncias',[{denuncias},total[0].cantidad,'',''])
})

router.post('/resultados',async(req,res)=>{
    let {nombreemprendimiento,categoria}=req.body
    const categoriaarray=JSON.parse('['+categoria+']')
    const nombrecat={'A':'Alojamiento','R': 'Restaurante','T':'Tours'}
    let cat
    if (categoriaarray.length>1) {
        cat='Todos'
    }else{
        cat=nombrecat[categoriaarray[0]]
    }
    if (nombreemprendimiento){
        const denuncias=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.nombreemprendimiento regexp ? AND em.categoria in (?);',[nombreemprendimiento,categoriaarray])
        const total=await pool.query('SELECT COUNT(*) as cantidad FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.nombreemprendimiento regexp ? AND em.categoria in (?);',[nombreemprendimiento,categoriaarray])
        denuncias.map(function(denuncia){
            if (denuncia.categoria=='A'){
                denuncia.categoria='Alojamiento'
            }else if (denuncia.categoria=='R'){
                denuncia.categoria='Restaurante'
            }else{
                denuncia.categoria='Tour'
            }
        })
        res.render('./denuncias/denuncias',[{denuncias},total[0].cantidad,nombreemprendimiento,cat])
    }else{
        if (categoriaarray.length>1){
            res.redirect('/denuncias')
        }else{
            const denunciacat=await pool.query('SELECT d.nroDenuncia,em.nombreemprendimiento,em.categoria,d.motivo,d.descripcion FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.categoria in (?)',[categoriaarray])
            const totalcat=await pool.query('SELECT count(*) as cantidadcat FROM emprendimientos em join denuncias d ON em.idemprendimiento=d.id_emprendimiento AND em.categoria in (?)',[categoriaarray]) 
            res.render('./denuncias/denuncias',[{denuncias:denunciacat},totalcat[0].cantidadcat,nombreemprendimiento,cat]) 
        }
    }
})

module.exports=router
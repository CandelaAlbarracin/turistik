const express=require('express')
const router=express.Router()
const pool=require('../database')
const cloudinary=require('cloudinary')
const fs=require('fs-extra')
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
router.get('/',async(req,res)=>{
    const actividades=await pool.query('select img.link,act.idactividades,act.nombre,act.tipo from imagenesactividades img join actividades act on img.id_actividad=act.idactividades and img.tipo="P";')
    actividades.map(act=>{
        if (act.tipo=='A'){
            act.tipo='Alojamiento'
        }else if(act.tipo=='T'){
            act.tipo='Tour'
        }
    })
    res.render('./activities/activities',{actividades})
})

router.get('/detalles/:id',async(req,res)=>{
    const {id}=req.params
    const consultaAct=await pool.query('SELECT * FROM actividades where idactividades=?',[id])
    const imagenPrincipal=await pool.query('SELECT link FROM imagenesactividades WHERE id_actividad=? AND tipo="P";',[id])
    const imagenesSec=await pool.query('SELECT link FROM imagenesactividades WHERE id_actividad=? AND tipo="S";',[id])
    const actividad=consultaAct[0]
    const imgPrincipal=imagenPrincipal[0]
    res.render('./activities/details',{actividad,imgPrincipal,imagenesSec})
})

router.get('/editar/:id',async(req,res)=>{
    const {id}=req.params
    const detallesactividades=await pool.query('SELECT * FROM actividades WHERE idactividades=?;',[id])
    const imagenPrincipal=await pool.query('SELECT link FROM imagenesactividades WHERE id_actividad=? AND tipo="P";',[id])
    const imagenesSec=await pool.query('SELECT idactividades,link FROM imagenesactividades WHERE id_actividad=? AND tipo="S";',[id])
    const detalles=detallesactividades[0]
    const imgPrincipal=imagenPrincipal[0]
    res.render('./activities/editar',{detalles,imgPrincipal,imagenesSec})
})

router.get('/agregar',(req,res)=>{
    res.render('./activities/agregar')
})

router.post('/agregar',async(req,res)=>{
    //Inserción de actividad
    const {nombre,introduccion,tipo,descripcion}=req.body
    const newActivity={
        nombre,
        tipo,
        introduccion,
        descripcion
    }
    await pool.query('INSERT INTO actividades set ?',[newActivity])
    const newid= await pool.query('SELECT MAX(idactividades) AS idact FROM actividades')
    const {idact}=newid[0]
    //Subida de imagenes a Cloudinary y guardado en MySQL
    const {image,imagensec}=req.files
    const pathimagenPrimaria=image[0].path
    const result=await cloudinary.v2.uploader.upload(pathimagenPrimaria)
    const newImgPrimary={
        link:result.url,
        tipo:"P",
        id_actividad:idact,
        publicid:result.public_id
    }
    await fs.unlink(pathimagenPrimaria)
    await pool.query('INSERT INTO imagenesactividades set ?',[newImgPrimary])
    if (imagensec){
        for (let i=0;i<imagensec.length;i++){
            let result2=await cloudinary.v2.uploader.upload(imagensec[i].path)
            await fs.unlink(imagensec[i].path)
            const newImgSec={
                link:result2.url,
                tipo:"S",
                id_actividad:idact,
                publicid:result2.public_id
            }
            await pool.query('INSERT INTO imagenesactividades set ?',[newImgSec])
        }
    }
    res.redirect('/actividades')
})

router.post('/editar',async(req,res)=>{
    const {idactividades,nombre,introduccion,tipo,descripcion,Eliminar}=req.body
    const eliminar=Eliminar.split(',')
    const publicsid=await pool.query('select publicid from imagenesactividades where idactividades in (?)',[eliminar])
    await pool.query('Delete from imagenesactividades where idactividades in (?)',[eliminar])//cambiar a eliminar
    for (let i=0;i<publicsid.length;i++){
        await cloudinary.v2.uploader.destroy(publicsid[i].publicid)
    }
    const act={
        nombre,
        tipo,
        introduccion,
        descripcion
    }
    await pool.query('UPDATE actividades set ? WHERE idactividades=?',[act,idactividades])
    const {image,imagensec}=req.files
    if(image){
        const pathimagenPrimaria=image[0].path 
        const result=await cloudinary.v2.uploader.upload(pathimagenPrimaria)
        const newImgPrimary={
            link:result.url,
            tipo:"P",
            id_actividad:idactividades,
            publicid:result.public_id
        }
        await fs.unlink(pathimagenPrimaria)
        const id=await pool.query('select idactividades from imagenesactividades where tipo="P" and id_actividad=?',[idactividades])
        const idimg=id[0].idactividades
        await pool.query('UPDATE imagenesactividades set ? WHERE idactividades=?',[newImgPrimary,idimg])
    }
    
    if (imagensec){
        for (let i=0;i<imagensec.length;i++){
            let result2=await cloudinary.v2.uploader.upload(imagensec[i].path)
            await fs.unlink(imagensec[i].path)
            const newImgSec={
                link:result2.url,
                tipo:"S",
                id_actividad:idact,
                publicid:result2.public_id
            }
            await pool.query('INSERT INTO imagenesactividades set ?',[newImgSec])
        }
    }
    res.redirect('/actividades')
})

module.exports=router
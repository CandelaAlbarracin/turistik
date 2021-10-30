const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/',(req,res)=>{
    res.render('./accommodations/search_accommodations')
})

router.get('/detalles',(req,res)=>{
    res.render('./accommodations/details_accommodations')
})
module.exports=router

router.post('/denunciar',async (req,res)=>{
    const {motivo,descripcion,id_emprendimiento}=req.body
    const nuevaDenuncia={
        motivo,
        descripcion,
        id_emprendimiento
    }
    await pool.query('INSERT INTO denuncias set ?',[nuevaDenuncia])
    //Agregar Mensaje denuncia registrada con exito
    res.redirect('detalles')
})

router.post('/reservas',async(req,res)=>{
    const {id_emprendimiento,id_usuario,fechainicio,fechafin,horario,comentario}=req.body
    const idalojamiento=await pool.query('SELECT aloj.idalojamiento FROM alojamientos aloj JOIN emprendimientos em ON aloj.id_emprendimiento=em.idemprendimiento WHERE em.idemprendimiento=?;',[id_emprendimiento])
    const nuevaReserva={
        id_alojamiento:idalojamiento[0].idalojamiento,
        id_usuario,
        fechainicio,
        fechafin,
        horario,
        comentario
    }
    await pool.query('INSERT INTO reservas(id_alojamiento,id_usuario,fechainicio,fechafin,horario,comentario) VALUES (?,?,?,?,?,?);',[nuevaReserva.id_alojamiento,nuevaReserva.id_usuario,nuevaReserva.fechainicio,nuevaReserva.fechafin,nuevaReserva.horario,nuevaReserva.comentario])
    //Añadir mensaje de reserva exitosa
    res.redirect('detalles')
})
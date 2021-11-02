const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/', async (req,res)=>{
    const infoAlojamientos = await pool.query('SELECT alojamientos.idalojamiento, imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento and tipo="P"');
    //console.log(infoAlojamientos);
    res.render('./accommodations/search_accommodations', {infoAlojamientos});

})

router.get('/detalles/:id', async (req,res)=>{
    const { id } = req.params;
    const infoDetalles = await pool.query('SELECT emprendimientos.descripcion, alojamientos.idalojamiento ,imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where alojamientos.idalojamiento=?',[id]);
    const solo = infoDetalles[0];
    const infoOtros = await pool.query('SELECT alojamientos.idalojamiento, alojamientos.precionoche, imagenes.link FROM alojamientos INNER JOIN emprendimientos on alojamientos.idalojamiento=emprendimientos.idemprendimiento inner join imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where idalojamiento<>? order by rand() limit 4', [solo.idalojamiento])
    // console.log(infoOtros);
    const idemp=await pool.query('SELECT id_emprendimiento from alojamientos where idalojamiento=?',[id])
    const emprendimiento=idemp[0]
    res.render('./accommodations/details_accommodations', {solo, infoOtros,emprendimiento});
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
    alojamiento=await pool.query('SELECT idalojamiento FROM alojamientos WHERE id_emprendimiento=?',[id_emprendimiento])
    //Agregar Mensaje denuncia registrada con exito
    res.redirect(`detalles/${alojamiento[0].idalojamiento}`)
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
    res.redirect(`detalles/${idalojamiento[0].idalojamiento}`)
})
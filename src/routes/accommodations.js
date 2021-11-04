const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/', async (req,res)=>{
    const infoAlojamientos = await pool.query('SELECT alojamientos.idalojamiento, imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento and tipo="P"');
    //console.log(infoAlojamientos);
    res.render('./accommodations/search_accommodations', {});

})

router.post('/buscar',async (req,res)=>{
    const {fechainicio,fechafinal,localidad,tipoalojamiento,capacidadhuespedes}=req.body
    const consulta='SELECT alojamientos.idalojamiento, imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento and tipo="P" WHERE alojamientos.idalojamiento in (?)'
    const fechaslibres=await pool.query('SELECT idalojamiento FROM alojamientos WHERE idalojamiento NOT IN (SELECT id_alojamiento from reservas WHERE (? BETWEEN fechainicio AND fechafin) OR (? BETWEEN fechainicio AND fechafin));',[fechainicio,fechafinal])
    let rta=convertirArray(fechaslibres)
    if (localidad){
        const loc=await pool.query('select idalojamiento from alojamientos where id_emprendimiento in (select idemprendimiento from emprendimientos where id_localidad in (select idlocalidad from localidades where nombrelocalidad=?));',[localidad])
        let locarray=convertirArray(loc)
        rta=rta.filter(x=>locarray.includes(x))
        console.log(rta)
    }
    if (tipoalojamiento!='Todos'){
        const alojamiento=await pool.query('select idalojamiento from alojamientos where tipoalojamiento=?;',[tipoalojamiento])
        let alojarray=convertirArray(alojamiento)
        rta=rta.filter(x=>alojarray.includes(x))
    }
    if (capacidadhuespedes){
        const huespedes=await pool.query('select idalojamiento from alojamientos where capacidadhabitaciones>=?;',[capacidadhuespedes])
        let huespedesarray=convertirArray(huespedes)
        rta=rta.filter(x=>huespedesarray.includes(x))
    }
    // const prueba=await pool.query('select idalojamiento from alojamientos where capacidadhabitaciones>=4')
    // console.log(prueba)
    // const infoAlojamientos=await pool.query(consulta,[rta])
    let infoAlojamientos
    if (rta.length){
        infoAlojamientos=await pool.query(consulta,[rta])
    }else{
        infoAlojamientos=''
    }
    const buscar=true
    let aloj=''
    if (tipoalojamiento!='Todos'){
        aloj=tipoalojamiento
    }
    res.render('./accommodations/search_accommodations', {infoAlojamientos, buscar,fechainicio,fechafinal,localidad,aloj,capacidadhuespedes}) 
})

function convertirArray(rowData){
    rta=[]
    for(let i=0;i<rowData.length;i++){
        rta.push(rowData[i].idalojamiento)
    }
    return rta
}

router.get('/detalles/:id', async (req,res)=>{
    const { id } = req.params;
    const infoDetalles = await pool.query('SELECT emprendimientos.descripcion, alojamientos.idalojamiento ,imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina,emprendimientos.id_localidad from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where alojamientos.idalojamiento=?',[id]);
    const solo = infoDetalles[0];
    const infoOtros = await pool.query('SELECT alojamientos.idalojamiento, alojamientos.precionoche, imagenes.link FROM alojamientos INNER JOIN emprendimientos on alojamientos.idalojamiento=emprendimientos.idemprendimiento inner join imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where idalojamiento<>? order by rand() limit 4', [solo.idalojamiento])
    // console.log(infoOtros);
    const idemp=await pool.query('SELECT id_emprendimiento from alojamientos where idalojamiento=?',[id])
    const emprendimiento=idemp[0]
    const actual=new Date()
    const fechaactual=`${actual.getFullYear()}-${actual.getMonth()+1}-${actual.getDate()}`
    const reservas=await pool.query('SELECT fechainicio,fechafin FROM reservas WHERE id_alojamiento=? AND fechainicio>=?',[id,fechaactual])
    const r=reservas
    for (let i=0;i<r.length;i++){
        fechainicio= new Date(r[i].fechainicio)
        r[i].fechainicio=`${fechainicio.getFullYear()}-${fechainicio.getMonth()+1}-${fechainicio.getDate()}`
        fechafin=new Date (r[i].fechafin)
        r[i].fechafin=`${fechafin.getFullYear()}-${fechafin.getMonth()+1}-${fechafin.getDate()}`
    }
    const localidad=await pool.query('SELECT nombrelocalidad FROM localidades WHERE idlocalidad=?',[solo.id_localidad])
    loc=localidad[0].nombrelocalidad.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    urlmap=(solo.ubicacion+`,%20${loc}`).replace(' ','%20')
    res.render('./accommodations/details_accommodations', {solo, infoOtros,emprendimiento,r,urlmap});
})

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
module.exports=router
const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/', async (req,res)=>{
    // const infoAlojamientos = await pool.query('SELECT alojamientos.idalojamiento, imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento and tipo="P"');
    //console.log(infoAlojamientos);
    const actividades=await pool.query('SELECT img.link,act.idactividades,act.nombre,act.introduccion from actividades act JOIN imagenesactividades img ON act.idactividades=img.id_actividad where img.tipo="P" and act.tipo="A";')
    res.render('./accommodations/newsearch_accommodations', {actividades});
})

router.get('/actividades/:id', async(req,res)=>{
    const {id}=req.params
    const detallesactividades=await pool.query('SELECT * FROM actividades WHERE idactividades=?;',[id])
    const imagenPrincipal=await pool.query('SELECT link FROM imagenesactividades WHERE id_actividad=? AND tipo="P";',[id])
    const imagenesSec=await pool.query('SELECT link FROM imagenesactividades WHERE id_actividad=? AND tipo="S";',[id])
    const alojamientos=await pool.query('select img.link, aloj.idalojamiento,emp.nombreemprendimiento, emp.descripcion from emprendimientos emp join imagenes img on emp.idemprendimiento=img.id_emprendimiento and img.tipo="P" join alojamientos aloj on emp.idemprendimiento=aloj.id_emprendimiento join actividadesofrecidas actof on aloj.idalojamiento=actof.id_alojamiento and actof.id_actividad=?;',[id])
    const detalles=detallesactividades[0]
    const imgPrincipal=imagenPrincipal[0]
    res.render('./accommodations/activity',{detalles,imgPrincipal,imagenesSec,alojamientos}) 
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
    res.render('./accommodations/view', {infoAlojamientos, buscar,fechainicio,fechafinal,localidad,aloj,capacidadhuespedes}) 
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
    //const infoDetalles = await pool.query('SELECT emprendimientos.descripcion, alojamientos.idalojamiento ,imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina,emprendimientos.id_localidad from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where alojamientos.idalojamiento=?',[id]);
    const infoDetalles = await pool.query('SELECT contacto.facebook, contacto.instagram, contacto.telefono, contacto.youtube, emprendimientos.descripcion, alojamientos.idalojamiento ,imagenes.link, emprendimientos.ubicacion, emprendimientos.nombreemprendimiento, alojamientos.precionoche, alojamientos.capacidadhabitaciones, alojamientos.capacidadestacionamientos, alojamientos.tipoalojamiento, alojamientos.piscina,emprendimientos.id_localidad from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento INNER JOIN contacto ON contacto.id_emprendimiento=emprendimientos.idemprendimiento where alojamientos.idalojamiento=?', [id]);
    const solo = infoDetalles[0];
    const infoOtros = await pool.query('SELECT alojamientos.idalojamiento, alojamientos.precionoche, imagenes.link FROM alojamientos INNER JOIN emprendimientos on alojamientos.idalojamiento=emprendimientos.idemprendimiento inner join imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where (idalojamiento<>? and imagenes.tipo="P") order by rand() limit 4', [solo.idalojamiento])
    const imag = await pool.query('SELECT  imagenes.link from emprendimientos inner join alojamientos on emprendimientos.idemprendimiento=alojamientos.id_emprendimiento INNER JOIN imagenes on emprendimientos.idemprendimiento=imagenes.id_emprendimiento where alojamientos.idalojamiento=?', [solo.idalojamiento]);
    const idemp=await pool.query('SELECT id_emprendimiento from alojamientos where idalojamiento=?',[id])
    const emprendimiento=idemp[0]
    // const actual=new Date()
    // const fechaactual=`${actual.getFullYear()}-${actual.getMonth()+1}-${actual.getDate()}`
    // const reservas=await pool.query('SELECT fechainicio,fechafin FROM reservas WHERE id_alojamiento=? AND fechainicio>=?',[id,fechaactual])
    // const r=reservas
    // for (let i=0;i<r.length;i++){
    //     fechainicio= new Date(r[i].fechainicio)
    //     r[i].fechainicio=`${fechainicio.getFullYear()}-${fechainicio.getMonth()+1}-${fechainicio.getDate()}`
    //     fechafin=new Date (r[i].fechafin)
    //     r[i].fechafin=`${fechafin.getFullYear()}-${fechafin.getMonth()+1}-${fechafin.getDate()}`
    // }
    const actividades=await pool.query('select nombre from actividades where idactividades in (select id_actividad from actividadesofrecidas where id_alojamiento=?);',[id])
    
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
    
    const dueno= await pool.query('select distinct nombre,apellido from usuarios where idusuario in (select id_usuario from emprendedores where idemprendedor in (select id_emprendedor from emprendimientos where idemprendimiento in (select id_emprendimiento from alojamientos where idalojamiento=?)));',[id])
    const duenoindividual=dueno[0]
    const localidad=await pool.query('SELECT nombrelocalidad FROM localidades WHERE idlocalidad=?',[solo.id_localidad])
    loc=localidad[0].nombrelocalidad.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    urlmap=(solo.ubicacion+`,%20${loc}`).replace(' ','%20')
    if (req.user){
        res.render('./accommodations/details_accommodations', {solo, infoOtros,emprendimiento,urlmap, imag,loc,duenoindividual,promedioCalificacion,reviews,calificacionU,actividades,guardado});
    }else{
        res.render('./accommodations/details_accommodations', {solo, infoOtros,emprendimiento,urlmap, imag,loc,duenoindividual,promedioCalificacion,reviews,actividades});
    }
    
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
    req.flash("info","Hemos recibido su denuncia. Gracias por contribuir a que Turistik sea un lugar mejor")
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

router.post('/resultados',async(req,res)=>{
    const {actividades}=req.body
    const actarray=actividades.split(',')
    const infoAlojamientos=await pool.query('SELECT DISTINCTROW aloj.idalojamiento,aloj.precionoche,aloj.capacidadhabitaciones,aloj.tipoalojamiento,aloj.vista,aloj.hornobarro,aloj.animalesautoctonos,emp.idemprendimiento,emp.nombreemprendimiento, loc.nombrelocalidad FROM alojamientos aloj JOIN emprendimientos emp ON aloj.id_emprendimiento=emp.idemprendimiento JOIN localidades loc ON emp.id_localidad=loc.idlocalidad join actividadesofrecidas actof on actof.id_alojamiento=aloj.idalojamiento and actof.id_actividad in (?);',[actarray])
    const actividades2=await pool.query('SELECT img.link,act.idactividades,act.nombre,act.introduccion from actividades act JOIN imagenesactividades img ON act.idactividades=img.id_actividad where img.tipo="P" and act.tipo="A";')
    for(let i=0;i<infoAlojamientos.length;i++){
        let calificacion=await pool.query('SELECT AVG(puntuacion) AS promedioCalificacion FROM sitio WHERE id_emprendimiento=?',[infoAlojamientos[i].idemprendimiento])
        infoAlojamientos[i].promCalificacion=calificacion[0].promedioCalificacion
        let imagenes=await pool.query('SELECT imagenes.link As img FROM imagenes inner join emprendimientos on imagenes.id_emprendimiento=emprendimientos.idemprendimiento where imagenes.tipo="P" and emprendimientos.idemprendimiento=(?);',[infoAlojamientos[i].idemprendimiento]);
        infoAlojamientos[i].imagenePrincipal=imagenes[0].img
    }
    console.log(infoAlojamientos);
    //res.send('Procesar resultados')
    res.render('./accommodations/view',{infoAlojamientos, actividades2})
})

router.post('/calificar',async(req,res)=>{
    const {idemprendimiento,puntuacion,comentario}=req.body
    const calificacion={
        id_usuario:req.user.idusuario,
        id_emprendimiento:idemprendimiento,
        puntuacion,
        comentario
    }
    await pool.query('INSERT INTO calificaciones set ?',[calificacion])
    const id=await pool.query('select idalojamiento from alojamientos where id_emprendimiento=?',idemprendimiento)
    res.redirect('/alojamientos/detalles/'+id[0].idalojamiento)
})

router.get('/eliminarCalificacion/:id/:aloj',async(req,res)=>{
    const {id,aloj}=req.params
    await pool.query('delete from calificaciones where idcalificacion=?',[id])
    res.redirect('/alojamientos/detalles/'+aloj)
})

router.post('/modificarCalificacion/:idcalificacion/:idaloj',async(req,res)=>{
    const {idemprendimiento,puntuacion,comentario}=req.body
    const {idcalificacion,idaloj}=req.params
    const calificacion={
        id_usuario:req.user.idusuario,
        id_emprendimiento:idemprendimiento,
        puntuacion,
        comentario
    }
    await pool.query('UPDATE calificaciones set ? WHERE idcalificacion=?',[calificacion,idcalificacion])
    res.redirect('/alojamientos/detalles/'+idaloj)
})

router.post('/guardar',async(req,res)=>{
    const {idemprendimiento}=req.body
    const sitioGuardado={
        id_emprendimiento:idemprendimiento,
        id_usuario:req.user.idusuario
    }
    await pool.query('INSERT INTO sitiosguardados set ?',[sitioGuardado])
    res.json({ok:'guardado'})
})

router.post('/eliminar', async(req,res)=>{
    const {idemprendimiento}=req.body
    await pool.query('DELETE FROM sitiosguardados WHERE id_emprendimiento=? and id_usuario=?',[idemprendimiento,req.user.idusuario])
    res.json({ok:'eliminado'})
})
module.exports=router
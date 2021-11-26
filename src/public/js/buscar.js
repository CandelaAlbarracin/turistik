function refinarBusqueda(){
    const alojamientos=document.getElementsByClassName('booking-card')
    const hornoSi=document.getElementById('hornoSi').checked
    const hornoNo=document.getElementById('hornoNo').checked
    const animalesSi=document.getElementById('animalesSi').checked
    const animalesNo=document.getElementById('animalesNo').checked
    const sinResultado=document.getElementById('sinResultado')
    const arrayprecio=precio()
    const arrayvista=vista()
    sinResultado.setAttribute('hidden','')
    let array=arrayprecio
    array=array.filter(x=>arrayvista.includes(x))
    if (hornoSi || hornoNo){
        const arrayhorno=horno()
        array=array.filter(x=>arrayhorno.includes(x))
    }
    if (animalesSi || animalesNo){
        const arrayanimales=animales()
        array=array.filter(x=>arrayanimales.includes(x))
    }

    const loc=document.getElementById('localidadlista').value
    if (loc){
        const arraylocalidad=localidad()
        array=array.filter(x=>arraylocalidad.includes(x))
    }
    const tipoaloj=document.getElementById('tipoalojamiento').value
    if (tipoaloj){
        const arraytipoaloj=tipoAlojamiento()
        array=array.filter(x=>arraytipoaloj.includes(x))
    }
    const huespedes=document.getElementById('huespedes').value
    if (huespedes){
        const arrayhuspedes=cantidadHuespedes()
        array=array.filter(x=>arrayhuspedes.includes(x))
    }
    
    let contar=0
    for (let i=0;i<alojamientos.length;i++){
        if (array.includes(alojamientos[i].id)){
            document.getElementById(alojamientos[i].id).removeAttribute('hidden')
        }else{
            document.getElementById(alojamientos[i].id).setAttribute('hidden','')
            contar+=1
        } 
    }
    if (contar==alojamientos.length){
        sinResultado.removeAttribute('hidden')
    }
}

function precio(){
    let precios=[]
    for (let i=1;i<=8;i++){
        precios.push(document.getElementById(`p${i}`).checked)
    }

    const alojamientos=document.getElementsByClassName('booking-card')
    const preciosaloj=document.getElementsByClassName('precio')
    let valrangos=[0,1500,2500,3500,4500,5500,6500,8000,9999999]
    let rangos=[0,1,2,3,4,5,6,7]
    rangos=rangos.filter(x=>precios[x])
    let alojamientosenprecio=[]
    for (let i=0;i<alojamientos.length;i++){
        let precio=parseInt(preciosaloj[i].innerText)
        for (let idx=0; idx<rangos.length;idx++){
            let indice=rangos[idx]
            if (precio>=valrangos[indice] && precio<=valrangos[indice+1]){
                alojamientosenprecio.push(alojamientos[i].id)
                break
            }
        }
    }
    return alojamientosenprecio
}

function horno(){
    const hornoSi=document.getElementById('hornoSi').checked
    const hornoNo=document.getElementById('hornoNo').checked

    const alojamientos=document.getElementsByClassName('booking-card')
    let alojHorno=[]
    let alojNoHorno=[]
    for(let i=0;i<alojamientos.length;i++){
        spanhorno=alojamientos[i].getElementsByClassName('fa-igloo')
        if (spanhorno.length>0){
            alojHorno.push(alojamientos[i].id)
        }else{
            alojNoHorno.push(alojamientos[i].id)
        }
    }
    let aloj=[]
    if (hornoSi){
        aloj=alojHorno
    }else{
        aloj=alojNoHorno
    }
    return aloj  
}

function animales(){
    const animalesSi=document.getElementById('animalesSi').checked
    const alojamientos=document.getElementsByClassName('booking-card')
    let animales=[]
    let animalesNo=[]
    for(let i=0;i<alojamientos.length;i++){
        spananimales=alojamientos[i].getElementsByClassName('fa-horse-head')
        if(spananimales.length>0){
            animales.push(alojamientos[i].id)
        }else{
            animalesNo.push(alojamientos[i].id)
        }
    }
    let aloj=[]
    if (animalesSi){
        aloj=animales
    }else{
        aloj=animalesNo
    }
    return aloj
}

function vista(){
    const vCerro=document.getElementById('vCerro').checked
    const vRio=document.getElementById('vRios').checked
    const vCiudad=document.getElementById('vCiudad').checked
    const vCampo=document.getElementById('vCampo').checked
    let aloj=[]
    const alojamientos=document.getElementsByClassName('booking-card')
    const vista=document.getElementsByClassName('vista')
    const views=[vCerro,vRio,vCiudad,vCampo]
    let vistas=['Cerro','Río','Ciudad','Campo']
    let vistasnew=[]
    for (let i=0;i<vistas.length;i++){
        if(views[i]){
            vistasnew.push(vistas[i])
        }
    }
    for(let i=0;i<vista.length;i++){
        for(let idx=0;idx<vistasnew.length;idx++){
            if(vista[i].innerText==vistasnew[idx]){
                aloj.push(alojamientos[i].id)
                break
            }
        }
    }
    return aloj
}

function localidad(){
    const loc=document.getElementById('localidadlista').value
    const alojamientos=document.getElementsByClassName('booking-card')
    const localidad=document.getElementsByClassName('localidad')
    let aloj=[]
    for (let i=0;i<localidad.length;i++){
        if(localidad[i].innerText.includes(loc)){
            aloj.push(alojamientos[i].id)
        }
    }
    return aloj
}

function tipoAlojamiento(){
    const alojamientos=document.getElementsByClassName('booking-card')
    const tipoaloj=document.getElementById('tipoalojamiento').value
    const tipo=document.getElementsByClassName('tipo')
    let aloj=[]
    for(let i=0;i<tipo.length;i++){
        if (tipo[i].innerText==tipoaloj){
            aloj.push(alojamientos[i].id)
        }
    }
    return aloj
}

function cantidadHuespedes(){
    const alojamientos=document.getElementsByClassName('booking-card')
    const huespedes=document.getElementById('huespedes').value
    const cantidadesH=document.getElementsByClassName('huespedes')
    let aloj=[]
    for(let i=0;i<cantidadesH.length;i++){
        if (parseInt(cantidadesH[i].innerText)>=huespedes){
            aloj.push(alojamientos[i].id)
        }
    }
    return aloj
}

function quitarRadioHorno(){
    const hornoSi=document.getElementById('hornoSi')
    const hornoNo=document.getElementById('hornoNo')
    hornoSi.checked=false
    hornoNo.checked=false
    refinarBusqueda()
}

function quitarRadioAnimales(){
    const animalesSi=document.getElementById('animalesSi')
    const animalesNo=document.getElementById('animalesNo')
    animalesSi.checked=false
    animalesNo.checked=false
    refinarBusqueda()
}
function refinarBusqueda(){
    const alojamientos=document.getElementsByClassName('booking-card')
    const sinResultado=document.getElementById('sinResultado')
    sinResultado.setAttribute('hidden','')
    const arrayprecio=precio()
    const arrayduracion=duracionTour()
    let array=arrayprecio
    array=array.filter(x=>arrayduracion.includes(x))
    const loc=document.getElementById('localidadlista').value
    if (loc){
        const arraylocalidad=localidad()
        array=array.filter(x=>arraylocalidad.includes(x))
    }
    const difTour=document.getElementById('dificultad').value
    if (difTour){
        const arraydificultad=dificultadTour()
        array=array.filter(x=>arraydificultad.includes(x))
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

    const tours=document.getElementsByClassName('booking-card')
    const preciostours=document.getElementsByClassName('precio')
    let valrangos=[0,1500,2500,3500,4500,5500,6500,8000,9999999]
    let rangos=[0,1,2,3,4,5,6,7]
    rangos=rangos.filter(x=>precios[x])
    let toursenprecio=[]
    for (let i=0;i<tours.length;i++){
        let precio=parseInt(preciostours[i].innerText)
        for (let idx=0; idx<rangos.length;idx++){
            let indice=rangos[idx]
            if (precio>=valrangos[indice] && precio<=valrangos[indice+1]){
                toursenprecio.push(tours[i].id)
                break
            }
        }
    }
    return toursenprecio
}

function duracionTour(){
    // const vCerro=document.getElementById('vCerro').checked
    // const vRio=document.getElementById('vRios').checked
    // const vCiudad=document.getElementById('vCiudad').checked
    // const vCampo=document.getElementById('vCampo').checked
    // let aloj=[]
    // const alojamientos=document.getElementsByClassName('booking-card')
    // const vista=document.getElementsByClassName('vista')
    // const views=[vCerro,vRio,vCiudad,vCampo]
    // let vistas=['Cerro','Río','Ciudad','Campo']
    // let vistasnew=[]
    // for (let i=0;i<vistas.length;i++){
    //     if(views[i]){
    //         vistasnew.push(vistas[i])
    //     }
    // }
    // for(let i=0;i<vista.length;i++){
    //     for(let idx=0;idx<vistasnew.length;idx++){
    //         if(vista[i].innerText==vistasnew[idx]){
    //             aloj.push(alojamientos[i].id)
    //             break
    //         }
    //     }
    // }
    // return aloj
    let duraciones=[]
    for (let i=1;i<=11;i++){
        duraciones.push(document.getElementById(`hora${i}`).checked)
    }
    const tours=document.getElementsByClassName('booking-card')
    const duracionesTours=document.getElementsByClassName('duracion')
    let valrangos=[0,1,2,3,4,5,6,7,8,9,10,11,12,99]
    let rangos=[0,1,2,3,4,5,6,7,8,9,10,11,12,13]
    rangos=rangos.filter(x=>duraciones[x])
    let toursenduracion=[]
    for (let i=0;i<tours.length;i++){
        let strDuracion=duracionesTours[i].innerText
        let horas
        if (!strDuracion.includes('hora')){
            horas=0
        }else{
            horas=duracionesTours[i].innerText.split(' ')
            horas=parseInt(horas[0])
        }
        for (let idx=0; idx<rangos.length;idx++){
            let indice=rangos[idx]
            if (horas>=valrangos[indice] && horas<=valrangos[indice+1]){
                toursenduracion.push(tours[i].id)
                break
            }
        }
    }
    return toursenduracion
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

function dificultadTour(){
    const alojamientos=document.getElementsByClassName('booking-card')
    const tipoaloj=document.getElementById('dificultad').value
    const tipo=document.getElementsByClassName('dificultad')
    let aloj=[]
    for(let i=0;i<tipo.length;i++){
        if (tipo[i].innerText==tipoaloj){
            aloj.push(alojamientos[i].id)
        }
    }
    return aloj
}

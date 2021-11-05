function regexValidarFecha() {
    let sep              = "[/]",
    
        dia1a28          = "(0?[1-9]|1\\d|2[0-8])",
        dia29            = "(29)",
        dia29o30         = "(29|30)",
        dia31            = "(31)",
        
        mes1a12          = "(0?[1-9]|1[0-2])",
        mes2             = "(0?2)",
        mesNoFeb         = "(0?[13-9]|1[0-2])",
        mes31dias        = "(0?[13578]|1[02])",
        
        diames29Feb      = dia29+sep+mes2,
        diames1a28       = dia1a28+sep+mes1a12,
        diames29o30noFeb = dia29o30+sep+mesNoFeb,
        diames31         = dia31+sep+mes31dias,
        diamesNo29Feb    = "(?:"+diames1a28+"|"+diames29o30noFeb+"|"+diames31+")",
        
        anno1a9999     = "(0{2,3}[1-9]|0{1,2}[1-9]\\d|0?[1-9]\\d{2}|[1-9]\\d{3})",
        annoMult4no100   = "\\d{1,2}(?:0[48]|[2468][048]|[13579][26])",
        annoMult400      = "(?:0?[48]|[13579][26]|[2468][048])00",
        annoBisiesto     = "("+annoMult4no100+"|"+annoMult400+")",
        
        fechaNo29Feb     = diamesNo29Feb+sep+anno1a9999,
        fecha29Feb       = diames29Feb+sep+annoBisiesto,
        
        fechaFinal       = "^(?:"+fechaNo29Feb+"|"+fecha29Feb+")$";
    
    return new RegExp(fechaFinal);
}

function validarFecha(fecha) {
    let fechaValida = regexValidarFecha();
    const texto=fecha.split('-').reverse().join('/')
    if (fechaValida.exec(texto)) {
        return true
    }
    return false;
}

const fechainicio=document.getElementById('fechainicio')
const fechafinal=document.getElementById('fechafinal')
const fechainicialinvalida=document.getElementById("fi-invalida")
const fechafinalinvalida=document.getElementById("ff-invalida")
const fechainicialmenor=document.getElementById('fi-menor')

function validarInicial(){
    const fecha = fechainicio.value
    const fechanueva=new Date(fecha).setDate(new Date(fecha).getDate()+1)
    resultado = validarFecha(fecha);
    actual=new Date(new Date().setHours(0,0,0))
    if (resultado) {
        fechainicialinvalida.setAttribute('hidden','')
        if (new Date(fechanueva)<actual){
            fechainicialmenor.removeAttribute('hidden')
        }else{
            fechainicialmenor.setAttribute('hidden','')
        }
    } else {
        fechainicialinvalida.removeAttribute('hidden')
    }
    fechafinal.setAttribute('min',fecha)
}

function validarFinal(){
    const fecha = fechafinal.value
    resultado = validarFecha(fecha);
    if (resultado) {
        fechafinalinvalida.setAttribute('hidden','')
        if (new Date(fecha)<new Date(fechainicio.value)){
           fechafinal.value=fechainicio.value
        }
    } else {
        fechafinalinvalida.removeAttribute('hidden')
    }
}

window.onload = function(){
    const fecha = new Date(); 
    let mes = fecha.getMonth()+1;
    let dia = fecha.getDate(); 
    const ano = fecha.getFullYear(); 
    if(dia<10)
      dia='0'+dia;
    if(mes<10)
      mes='0'+mes;
    actual=`${ano}-${mes}-${dia}`
    fechainicio.value=actual
    fechafinal.value=actual
    fechainicio.setAttribute('min',actual)
    fechafinal.setAttribute('min',actual)
}

function colocarLocalidad(){
    const locvalor=document.getElementById('localidadlista').value
    const locinput=document.getElementById('locinput')
    locinput.value=locvalor
}

function refinarBusqueda(){
    const alojamientos=document.getElementsByClassName('alojamiento')
    const piscinaSi=document.getElementById('pSi').checked
    const piscinaNo=document.getElementById('pNo').checked
    const estacionamientoSi=document.getElementById('eSi').checked
    const estacionamientoNo=document.getElementById('eNo').checked

    const arrayprecio=precio()
    const arraypiscina=piscina()
    const arrayestacionamiento=estacionamiento()
    let array=arrayprecio
    if (piscinaSi || piscinaNo){
        array=arrayprecio.filter(x=>arraypiscina.includes(x))
    }
    if (estacionamientoSi || estacionamientoNo){
        array=array.filter(x=>arrayestacionamiento.includes(x))
    }

    for (let i=0;i<alojamientos.length;i++){
        if (array.includes(alojamientos[i].id)){
            document.getElementById(alojamientos[i].id).removeAttribute('hidden')
        }else{
            document.getElementById(alojamientos[i].id).setAttribute('hidden','')
        } 
    }
}

function precio(){
    const p1=document.getElementById('p1').checked
    const p2=document.getElementById('p2').checked
    const p3=document.getElementById('p3').checked
    const p4=document.getElementById('p4').checked
    const p5=document.getElementById('p5').checked
    const p6=document.getElementById('p6').checked
    const p7=document.getElementById('p7').checked

    const alojamientos=document.getElementsByClassName('alojamiento')
    const preciosaloj=document.getElementsByClassName('precio')

    const precios=[p1,p2,p3,p4,p5,p6,p7]
    let valrangos=[0,2000,3000,4500,6000,8000,10000,9999999]
    let rangos=[0,1,2,3,4,5,6]
    rangos=rangos.filter(x=>precios[x])
    let alojamientosenprecio=[]
    for (let i=0;i<alojamientos.length;i++){
        let precio=parseInt(preciosaloj[i].textContent.substr(1),10)
        for (let idx=0; idx<rangos.length;idx++){
            let indice=rangos[idx]
            if (precio>=valrangos[indice] && precio<=valrangos[indice+1]){
                alojamientosenprecio.push(alojamientos[i].id)
                break
            }
        }
    }
    return alojamientosenprecio
    // for(let i=0;i<alojamientos.length;i++){
    //     if (!alojamientosenprecio.includes(alojamientos[i].id)){
    //         //let idaloj=`precio-aloj${alojamientos[i].id}`
    //         document.getElementById(alojamientos[i].id).setAttribute('hidden','')
    //     }else{
    //         document.getElementById(alojamientos[i].id).removeAttribute('hidden')
    //     }
    // }
}

function piscina(){
    const piscinaSi=document.getElementById('pSi').checked
    const piscinaNo=document.getElementById('pNo').checked

    const alojamientos=document.getElementsByClassName('alojamiento')
    let alojPiscina=[]
    let alojNoPiscina=[]
    for(let i=0;i<alojamientos.length;i++){
        spanpiscina=alojamientos[i].getElementsByClassName('fa-swimming-pool')
        if (spanpiscina.length>0){
            alojPiscina.push(alojamientos[i].id)
        }else{
            alojNoPiscina.push(alojamientos[i].id)
        }
    }
    let aloj=[]
    if (piscinaSi){
        aloj=alojPiscina
    }else{
        aloj=alojNoPiscina
    }
    return aloj
    // for (let i=0;i<alojamientos.length;i++){
    //     if (aloj.includes(alojamientos[i].id)){
    //         document.getElementById(alojamientos[i].id).removeAttribute('hidden')
    //     }else{
    //         document.getElementById(alojamientos[i].id).setAttribute('hidden','')
    //     } 
    // }   
}

function estacionamiento(){
    const estacionamientoSi=document.getElementById('eSi').checked

    const alojamientos=document.getElementsByClassName('alojamiento')
    let est=[]
    let estNo=[]
    for(let i=0;i<alojamientos.length;i++){
        spancar=alojamientos[i].getElementsByClassName('estacionamiento')
        if(parseInt(spancar[0].textContent.substr(20))>0){
            est.push(alojamientos[i].id)
        }else{
            estNo.push(alojamientos[i].id)
        }
    }
    let aloj=[]
    if (estacionamientoSi){
        aloj=est
    }else{
        aloj=estNo
    }
    return aloj
    // for (let i=0;i<alojamientos.length;i++){
    //     if (aloj.includes(alojamientos[i].id)){
    //         document.getElementById(alojamientos[i].id).removeAttribute('hidden')
    //     }else{
    //         document.getElementById(alojamientos[i].id).setAttribute('hidden','')
    //     }
    // }
}

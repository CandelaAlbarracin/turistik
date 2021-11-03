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
    fechafinal.setAttribute('min',fecha)
    fechainicio.setAttribute('min',actual.getFullYear()+'-'+(actual.getMonth()+1)+'-'+actual.getDate())
    if (resultado) {
        fechainicialinvalida.setAttribute('hidden','')
        if (new Date(fechanueva)<actual){
            fechainicialmenor.removeAttribute('hidden')
            return false
        }else{
            fechainicialmenor.setAttribute('hidden','')
            return true
        }
    } else {
        fechainicialinvalida.removeAttribute('hidden')
        return false
    }
}

function validarFinal(){
    const fecha = fechafinal.value
    resultado = validarFecha(fecha);
    if (resultado) {
        fechafinalinvalida.setAttribute('hidden','')
        if (new Date(fecha)<new Date(fechainicio.value)){
           fechafinal.value=fechainicio.value
           return false
        }
        return true
    } else {
        fechafinalinvalida.removeAttribute('hidden')
        return false
    }
}
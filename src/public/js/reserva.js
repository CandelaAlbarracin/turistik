async function validarReserva(){
    const reservado=document.getElementById('reservado')
    const r= validarFechaReserva()
    if (r){
        if (validarInicial() && validarFinal()){
            await document.reservacion.submit()
        }
    }else{
        reservado.removeAttribute('hidden')
    }
}

function validarFechaReserva(){
    const fechasiniciales=document.getElementsByClassName('fechasiniciales')
    const fechasfinales=document.getElementsByClassName('fechasfinales')
    const fechainicioselect=document.getElementById('fechainicio').value
    const fechafinselect=document.getElementById('fechafinal').value
    let reserva=[]
    let reservas=[]
    let valido
    for (let i=0;i<fechasiniciales.length;i++){
        inicio=fechasiniciales[i].textContent
        fin=fechasfinales[i].textContent
        reserva=fechasIntermedias(inicio,fin)
        reserva.forEach(element=>{
            reservas.push(element)
        })
    }
    posiblereserva=fechasIntermedias(fechainicioselect,fechafinselect)
    posiblereserva.forEach(element => {
        rta=reservas.includes(element)
        if (rta){
            valido= false
        }else{
            valido= true
        }
    });
    return valido
    
}
function fechasIntermedias(fechaInicio,fechaFin){
    const inicio=new Date(fechaInicio)
    const fin=new Date(fechaFin)
    let fechas=[]
    let diff=fin-inicio
    let diferenciaDias = Math.floor(diff / (1000 * 60 * 60 * 24))
    for (let i=0;i<=diferenciaDias;i++){
        c=incrementarDias(inicio,1)
        fechas.push(`${c.getFullYear()}-${c.getMonth()+1}-${c.getDate()}`)
    }
    return fechas
}
function incrementarDias(fecha,dias){
  return new Date(fecha.setDate(fecha.getDate() + dias));
}
async function reserva(){
    if (await tarjeta()){
        console.log('reserva')
        $('#reservacion').modal('show')
        
    }
}
async function tarjeta(){
     const optVisa=document.getElementById('visa').checked
    const optMaster=document.getElementById('mastercard').checked
    const optAmex=document.getElementById('amex').checked
    const exp=document.getElementById('cc-exp').value
    const codigo = document.getElementById('cc-number').value
    const nombre=document.getElementById("nombre").value
    const codseg=document.getElementById("cc-cvc").value
    const actual=new Date()
    let valida=false
    if (!nombre){
        await alert('Debe ingresar el nombre del titular de la tarjeta')
        return false
    }
    if (codigo){
        if (optVisa || optMaster || optAmex){
            valida=fValidarTarjeta()
        }else{
            await alert('No ha seleccionado ninguna entidad bancaria')
            return false
        }
        if (exp.length==0){
            await alert('Ingrese la fecha de Expiraci??n')
            return false
        }else{
            
            if (2000+parseInt(exp.substr(5,2),10)<actual.getFullYear()){
                await alert('Tarjeta Expirada')
                console.log(2000+parseInt(exp.substr(5,2),10))
                return false
            }else{
                if (2000+parseInt(exp.substr(5,2),10)==actual.getFullYear()){
                    if (parseInt(exp.substr(0,2),10)<actual.getMonth()+1){
                        await alert('Tarjeta Expirada')
                        console.log(parseInt(exp.substr(0,2),10)) 
                        return false
                    }
                }
            }
            
        }
    }else{
        await alert('Ingrese un n??mero de tarjeta')
        return false
    }
    if (!codseg ||codseg.length<3){
        await alert('Debe ingresar el c??digo de seguridad de la tarjeta')
        return false
    }
    if (valida){
        return true
    }else{
        return false
    }
    
    
    
}
function fValidarTarjeta(){
     const optVisa=document.getElementById('visa').checked
    const optMaster=document.getElementById('mastercard').checked
    const optAmex=document.getElementById('amex').checked
    let codigo = document.getElementById('cc-number').value.replace(' ','').replace(' ','').replace(' ','')
    const msg = "La tarjeta ingresada no es v??lida";
    VISA = new RegExp("(^4[0-9]{3}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$)");
    MASTERCARD = new RegExp("(^5[1-5][0-9]{2}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$)");
    AMEX = new RegExp("(^3[47][0-9]{13}$)");
    if(luhn(codigo)){
        if((optVisa && !VISA.exec(codigo)) || optMaster && !MASTERCARD.exec(codigo) || optAmex && !AMEX.exec(codigo)){
            alert(msg);
            return false
        }else{
            //Valida
            return true
        }
    } else {
        alert(msg);
        return false
    }
}
function luhn(value) {
    // Accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;
    // The Luhn Algorithm. It's so pretty.
    let nCheck = 0, bEven = false;
    value = value.replace(/\D/g, "");
    for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
        nDigit = parseInt(cDigit, 10);
        if (bEven && (nDigit *= 2) > 9) nDigit -= 9; nCheck +=  nDigit; bEven = !bEven;
    }
    return (nCheck % 10) == 0;
}

function contarCaracteres(){
    const contador=document.getElementById('contador')
    const comentario=document.getElementById('comentario').value
    contador.innerText=comentario.length+'/500'
}



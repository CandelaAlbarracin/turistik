form = document.querySelector('#emprendimiento');
form.precuil.addEventListener('keypress', function (e){
	if (!validarNro(event)){
  	e.preventDefault();
  }
})
form.poscuil.addEventListener('keypress', function (e){
	if (!validarNro(event)){
  	e.preventDefault();
  }
})
form.cuil.addEventListener('keypress', function (e){
	if (!validarNro(event)){
  	e.preventDefault();
  }
})
form.numero.addEventListener('keypress',function(e){
    if(!validarNro(event)){
        e.preventDefault()
    }
})
form.capacidadHuespedes.addEventListener('keypress',function(e){
    if(!validarNro(event)){
        e.preventDefault()
    }
})
form.capacidadEstacionamiento.addEventListener('keypress',function(e){
    if(!validarNro(event)){
        e.preventDefault()
    }
})
form.horas.addEventListener('keypress',function(e){
    if(!validarNro(event)){
        e.preventDefault()
    }
})
form.minutos.addEventListener('keypress',function(e){
    if(!validarNro(event)){
        e.preventDefault()
    }
})
function validarNro(valor){
    let key = valor.charCode;
    return key >= 48 && key <= 57;
}

function verificarEmail(){
    const mailRegistrado=document.getElementById('mailRegistrado')
    const email=document.getElementById('email')
    if (email.value!=''){
        ajax({
            method:'POST',
            url:'/emprendedores/mails',
            success:(res)=>{
                if(res.length>0){
                    mailRegistrado.removeAttribute('hidden')
                    mailRegistrado.innerHTML='Este mail ya se encuentra registrado'
                }else{
                    mailRegistrado.setAttribute('hidden','')
                }
            },
            error:(err)=>{
                console.log(err)
            },
            data:{
                email:email.value
            }
        })
    }
}

function cambiarLoc(){
    const departamento=document.getElementById('departamento')
    const contenedorResultados=document.getElementById('localidad')
    if (departamento.value){

    ajax({
        method:'POST',
        url:'/emprendedores/localidades',
        success:(res)=>{
            contenedorResultados.innerHTML='<option value="" disabled selected>Localidad</option>'
            if (res.length>0){
                for(let i=0;i<res.length;i++){
                    contenedorResultados.innerHTML+=`<option value="${res[i].idlocalidad}" class="${res[i].departamento}">${res[i].nombrelocalidad}</option>`
                }
            }
        },
        error:(err)=>{
            console.log(err)
        },
        data:{
            departamento:document.getElementById('departamento').value
        }
    })
    }
}

function irpaso2(){
    const eleccion=document.getElementById('categoria').value
    const contenedorChecks=document.getElementById('contenedorChecks')
    const mailRegistrado=document.getElementById('mailRegistrado')
    if (mailRegistrado.hasAttribute('hidden')){
        document.getElementById('datospersonales').setAttribute('hidden','')
        document.getElementById('inicioEmp').setAttribute('hidden','')
        if (eleccion=='T'){
            const formTours=document.getElementById('formTours')
            formTours.removeAttribute('hidden')
            
        }else{
            const formAloj=document.getElementById('formAloj')
            formAloj.removeAttribute('hidden')
        }
        document.getElementById('actividades').removeAttribute('hidden')
        ajax({
            method:'POST',
            url:'/emprendedores/actividades',
            success:(res)=>{
                contenedorChecks.innerHTML=''
                if (res.length>0){
                    for(let i=0;i<res.length;i++){
                        contenedorChecks.innerHTML+=`<input class="checks" type="checkbox" name="act${res[i].idactividades}" id="act${res[i].idactividades}" onclick="cambioInput()">${res[i].nombre}<br>`
                    }
                }
            },
            error:(err)=>{
                console.log(err)
            },
            data:{
                tipo:eleccion
            }
        })
    }else{
        alert('Debe ingresar un email diferente. El mail ingresa ya está registrado')
    }
    
}

function volverPaso1(){
    const eleccion=document.getElementById('categoria').value
    document.getElementById('datospersonales').removeAttribute('hidden')
    document.getElementById('inicioEmp').removeAttribute('hidden')
    document.getElementById('actividades').setAttribute('hidden','')
    if (eleccion=='T'){
        const formTours=document.getElementById('formTours')
        formTours.setAttribute('hidden','')
        
    }else{
        const formAloj=document.getElementById('formAloj')
        formAloj.setAttribute('hidden','')
    }
}

function irPaso3(){
    const eleccion=document.getElementById('categoria').value
    const actividades=document.getElementsByClassName('checks')
    let oneCheck=false
    for(let i=0;i<actividades.length;i++){
        if (actividades[i].checked){
            oneCheck=true
            break
        }
    }
    if (!oneCheck){
        alert('Debe seleccionar al menos una actividad')
    }else{
        if (eleccion=='T'){
            const horas=document.getElementById('horas').value
            const minutos=document.getElementById('minutos').value
            const preciotours=document.getElementById('preciotours').value
            const dificultad=document.getElementById('dificultad').value
            if((horas||minutos) && preciotours && dificultad){
              const formTours=document.getElementById('formTours')
                formTours.setAttribute('hidden','')
                document.getElementById('actividades').setAttribute('hidden','')
                document.getElementById('contacto').removeAttribute('hidden')
                document.getElementById('imagenes').removeAttribute('hidden')
                document.getElementById('botonSubmit').removeAttribute('hidden')
            }else{
                alert('Debe completar los campos obligatorios para tours')
            }
        }else{
            const precioAloj=document.getElementById('precioAloj').value
            const capacidadHuespedes=document.getElementById('capacidadHuespedes').value
            const capacidadEstacionamiento=document.getElementById('capacidadEstacionamiento').value
            const tipo=document.getElementById('tipo').value
            const vista=document.getElementById('vista').value
            const piscina=document.getElementById('piscina').value
            const hornoBarro=document.getElementById('hornoBarro').value
            const animales=document.getElementById('animales').value
            if(precioAloj && capacidadHuespedes && capacidadEstacionamiento && tipo && vista && piscina && hornoBarro && animales){
               const formAloj=document.getElementById('formAloj')
               formAloj.setAttribute('hidden','')
               document.getElementById('actividades').setAttribute('hidden','')
               document.getElementById('contacto').removeAttribute('hidden')
                document.getElementById('imagenes').removeAttribute('hidden')
                document.getElementById('botonSubmit').removeAttribute('hidden')
            }else{
                alert('Debe completar los campos obligatorios para alojamiento')
            }
            
        }
    }
}

function volverPaso2(){
    const eleccion=document.getElementById('categoria').value
    document.getElementById('contacto').setAttribute('hidden','')
    document.getElementById('imagenes').setAttribute('hidden','')
    document.getElementById('botonSubmit').setAttribute('hidden','')
    if (eleccion=='T'){
        const formTours=document.getElementById('formTours')
        formTours.removeAttribute('hidden')
        
    }else{
        const formAloj=document.getElementById('formAloj')
        formAloj.removeAttribute('hidden')
    }
    document.getElementById('actividades').removeAttribute('hidden')
}

function cambioInput(){
    const inputs=document.getElementsByClassName("checks")
    const act=document.getElementById('inputactividades')
    let array=[]
    let checks=false
    for(let i=0;i<inputs.length;i++){
        if (inputs[i].checked){
            array.push(inputs[i].id.substring(3))
            checks=true
        }
    }
    act.value=array
}

const ajax=(options)=>{
    let {url,method,success,error,data}=options
    const xhr= new XMLHttpRequest()
    xhr.addEventListener("readystatechange",e=>{
        if (xhr.readyState !==4) return;
        if (xhr.status>=200 && xhr.status<300){
            let json=JSON.parse(xhr.responseText)
            success(json)
        }else{
            let message=xhr.statusText || "Ocurrió un error"
            error(`Error ${xhr.status}: ${message}`)
        }
    })
    xhr.open(method||"GET",url)
    xhr.setRequestHeader("Content-type","application/json;charset=utf-8")
    xhr.send(JSON.stringify(data))
}
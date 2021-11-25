form = document.querySelector('#buscador');
form.cuil.addEventListener('keypress', function (e){
	if (!validarCUIL(event)){
  	e.preventDefault();
  }
})
form.nrosolicitud.addEventListener('keypress',function(e){
    if(!esNumero(event)){
        e.preventDefault()
    }
})

function validarCUIL(valor){
    let key = valor.charCode;
    return key >= 48 && key <= 57 || key==45;
}

function esNumero(valor){
    let key = valor.charCode;
    return key >= 48 && key <= 57;
}

function buscarSolicitud(){
    const contenedorResultados=document.getElementById('cuerpoTabla')
    const contenedorError=document.getElementById('error')
    ajax({
        method:'POST',
        url:'/solicitudes/buscar',
        success:(res)=>{
            contenedorError.innerHTML=''
            contenedorResultados.innerHTML=''
            if (res.length>0){
                for(let i=0;i<res.length;i++){
                    contenedorResultados.innerHTML+=`<tr>
                        <td scope="row" class="fw-bold">${res[i].idemprendimiento}</td>
                        <td>${res[i].cuil}</td>
                        <td>${res[i].nombre}</td>
                        <td>${res[i].apellido}</td>
                        <td>${res[i].nombreemprendimiento}</td>
                        <td>${res[i].categoria}</td>
                        <td><a role="button" class="btn btn-primary" href="#"><i class="fas fa-eye"></i> Ver más</a></td>
                    </tr>`
                }
            }else{
                contenedorError.innerHTML="<p class='fs-5 fst-italic'>No se han encontrado resultados</p>"
            }
            
        },
        error:(err)=>{
            contenedorError.innerHTML='<p class="fw-bold fs-5" style="color:red">Ocurrió un error, por favor vuelve a intentar</p>'
            contenedorResultados.innerHTML=''
        },
        data:{
            estadosolicitud:document.getElementById('estadosolicitud').value,
            idemprendimiento:document.getElementById('nrosolicitud').value,
            cuil:document.getElementById('cuil').value,
            nombreapellido:document.getElementById('nombreapellido').value,
            nombreemprendimiento:document.getElementById('emprendimiento').value,
            categoria:document.getElementById('Categoria').value
        }
    })
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
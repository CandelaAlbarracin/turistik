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
function cambiarBoton(idemp){
    const botonGuardar=document.getElementById('botonGuardar')
    if(botonGuardar.textContent.includes('Guardar en mis sitios')){
        guardarSitio(idemp)
        botonGuardar.classList.remove('btn-outline-success')
        botonGuardar.classList.add('btn-success')
        botonGuardar.innerHTML=`<i class="fas fa-bookmark"></i> Guardado en mis sitios`
    }else{
        eliminarSitio(idemp)
        botonGuardar.classList.remove('btn-success')
        botonGuardar.classList.add('btn-outline-success')
        botonGuardar.innerHTML=`<i class="far fa-bookmark"></i> Guardar en mis sitios`
    }
}

function guardarSitio(idemprendimiento){
    const msjerrorGuardado=document.getElementById('errorGuardado')
    ajax({
        method:"POST",
        url:'/alojamientos/guardar',
        success:(res)=>{
            msjerrorGuardado.innerHTML='<br><div class="alert alert-success alert-dismissible fade show" role="alert"><strong>¡Guardado!</strong> Hemos guardado con éxtito este sitio. Puedes verlo en <a href="/missitios" class="alert-link">Mis Sitios</a><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
        },
        error:(err)=>{
            msjerrorGuardado.innerHTML='<br><div class="alert alert-danger" role="alert">¡Ops! Lo sentimos, no pudimos guardar tu sitio. Intenta nuevamente</div>'
            const botonGuardar=document.getElementById('botonGuardar')
            botonGuardar.classList.remove('btn-success')
            botonGuardar.classList.add('btn-outline-success')
            botonGuardar.innerHTML=`<i class="far fa-bookmark"></i> Guardar en mis sitios`
        },
        data:{
            idemprendimiento
        }
    })
}

function eliminarSitio(idemprendimiento){
    const msjerror=document.getElementById('errorGuardado')
    ajax({
        method:"POST",
        url:'/alojamientos/eliminar',
        success:(res)=>{
            msjerror.innerHTML='<br><div class="alert alert-primary alert-dismissible fade show" role="alert"> Hemos eliminado el sitio de tus sitios guardados<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
        },
        error:(err)=>{
            msjerror.innerHTML='<br><div class="alert alert-danger" role="alert">¡Ops! Lo sentimos, no pudimos guardar tu sitio. Intenta nuevamente</div>'
            const botonGuardar=document.getElementById('botonGuardar')
            botonGuardar.classList.remove('btn-success')
            botonGuardar.classList.add('btn-outline-success')
            botonGuardar.innerHTML=`<i class="far fa-bookmark"></i> Guardar en mis sitios`
        },
        data:{
            idemprendimiento
        }
    })
}


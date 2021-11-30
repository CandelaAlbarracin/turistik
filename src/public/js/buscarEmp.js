function buscarEmprendimientos(){
    const contenerdorResultados=document.getElementById('contenedorResultados')
    ajax({
        method:'POST',
        url:'/misemprendimientos/buscar',
        success:(res)=>{
            contenerdorResultados.innerHTML=''
            if (res.length>0){
                for(let i=0;i<res.length;i++){
                    contenerdorResultados.innerHTML+=`<div class="col">
                    <div class="card h-100">
                    <img src="${res[i].link}" class="card-img-top" alt="imagen-${res[i].nombreemprendimiento}">
                    <div class="card-body">
                        <h5 class="card-title text-center fs-5">${res[i].nombreemprendimiento}</h5>
                        <p class="text-center text-muted fst-italic"><span style="color: crimson;"><i class="fas fa-map-marker"></i></span> ${res[i].ubicacion}, ${res[i].nombrelocalidad}, ${res[i].departamento}</p>
    
                        <p class="text-center" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<p>Los estado de solicitud indican si tu emprendimiento es visible en la página.</p><p>Un estado <b>Pendiente de aprobación</b> indica que los administradores del sitio están evaluando su propuesta y aún no se encuentra visible en la página.</p><p>Un estado <b>Aprobado</b> significa que su emprendimiento está visible en la página.</p>"><i class="fas fa-info-circle" style="color: darkcyan;"></i> Estado de la solicitud: ${res[i].estadosolicitud}</p>
    
                        <div class="d-grid gap-2">
                            <a role="button" class="btn btn-primary" href="${res[i].linkCat}"><i class="far fa-eye"></i> Ver</a>
                            <a role="button" class="btn btn-warning" href="/misemprendimientos/editar/${res[i].idemprendimiento}"><i class="fas fa-edit"></i> Editar</a>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#EliminarSitio${res[i].idemprendimiento}"><i class="fas fa-trash-alt"></i> Eliminar</button>
                            
                            <div class="modal fade" id="EliminarSitio${res[i].idemprendimiento}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Confirmación de eliminación</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        ¿Está seguro que desea eliminar su emprendimiento ${res[i].nombreemprendimiento}?
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                        <a role="button" class="btn btn-danger" href="/misemprendimientos/eliminar/${res[i].idemprendimiento}">Eliminar</a>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    </div>
                </div>`
                }
            }else{
                contenerdorResultados.innerHTML='<p class="fw-bold fs-5">No se han encontrado resultados</p>'
            }
        },
        error:(err)=>{
            contenerdorResultados.innerHTML='<p class="fw-bold fs-5" style="color:red">Ocurrió un error, por favor vuelve a intentar</p>'
        },
        data:{
            nombreemprendimiento:document.getElementById('nombreemp').value,
            ubicacion:document.getElementById('ubicacion').value,
            estadosolicitud:document.getElementById('estado').value
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
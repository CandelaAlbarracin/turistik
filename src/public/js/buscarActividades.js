function buscarAct(){
    ajax({
        method:"POST",
        url:'/actividades/buscar',
        success:(res)=>{
            const contenedorActividades=document.getElementById('contenedorActividades')
            contenedorActividades.innerHTML=''
            const {act}=res
            if (act.length>0){
                for (let i=0;i<act.length;i++){
                    if (act[i].tipo=='A'){
                        act[i].tipo='Alojamiento'
                    }else{
                        act[i].tipo='Tour'
                    }
                    contenedorActividades.innerHTML+=`<div class="card m-3" style="width: 18rem;">
                    <img src="${act[i].link}" class="card-img-top" height="200px" alt="${act[i].nombre}">
                    <div class="card-body">
                        <h5 class="card-title text-center">${act[i].nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted text-center">Categoría: ${act[i].tipo}</h6>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <a class="btn btn-primary" role="button" href="/actividades/detalles/${act[i].idactividades}"><i class="far fa-eye"></i> Ver Todo</a>
                            <a class="btn btn-warning" role="button" href="/actividades/editar/${act[i].idactividades}"><i class="fas fa-edit"></i>Editar</a>
                            <button class="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#EliminarActividad${act[i].idactividades}" ><i class="fas fa-trash-alt"></i>Eliminar</button>
                            <div class="modal fade" id="EliminarActividad${act[i].idactividades}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Confirmación de eliminación</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        ¿Está seguro que desea eliminar ${act[i].nombre}?
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                        <a role="button" class="btn btn-danger" href="/actividades/eliminar/${act[i].idactividades}">Eliminar</a>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                }
            }else{
                contenedorActividades.innerHTML='<p class="fst-italic fs-4">No se ha encontrado actividades que coincidan con lo buscado</p>'
            }
            
        },
        error:(err)=>{console.log(err)},
        data:{
            nombre:document.getElementById('nombreactividad').value,
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

const nombreactividad=document.getElementById('nombreactividad')

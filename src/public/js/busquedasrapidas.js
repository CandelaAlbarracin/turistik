function busquedaRapida(){
    ajax({
        method:"POST",
        url:'/actividades/buscar',
        success:(res)=>{
            const contenedorTarjetas=document.getElementById('contenedorTarjetas')
            contenedorTarjetas.innerHTML=''
            const {act}=res
            if (act.length>0){
                for(let i=0;i<act.length;i++){
                    contenedorTarjetas.innerHTML+=`<div class="col2" ontouchstart="this.classList.toggle('hover');">
                    <div class="container2">
                        <div class="front" style="background-image: url(${act[i].link})">
                            <div class="inner">
                                <p>${act[i].nombre}</p>
                                <span>Ver</span>
                            </div>
                        </div>
                        <div class="back">
                            <div class="inner">
                            <p>${act[i].introduccion}</p>
                            <a class="btn btn-primary" href="/alojamientos/actividades/${act[i].idactividades}" role="button">Conocer más</a>
                            </div>
                        </div>
                    </div>
                    <div class="text-center fst-italic">
                    <input type="checkbox" name="act${act[i].idactividades}" id="act${act[i].idactividades}" class="check" onclick="cambioInput()">
                    <label class="m-2" for="act${act[i].idactividades}"> ¡Quiero ${act[i].nombre}!</label>
                    </div>
                    </div>`
                    }
            }else{
                contenedorTarjetas.innerHTML='<p class="fst-italic fs-4">No se ha encontrado actividades que coincidan con lo buscado</p>'
            }
            
        },
        error:(err)=>{console.log(err)},
        data:{
            nombre:document.getElementById('nombreAct').value,
            categoria:'"A"'
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

function cambioInput(){
    const inputs=document.getElementsByClassName("check")
    const act=document.getElementById('inputactividades')
    let array=[]
    let checks=false
    for(let i=0;i<inputs.length;i++){
        if (inputs[i].checked){
            array.push(inputs[i].id.substring(3))
            checks=true
        }
    }
    const botonSubmit=document.getElementById('botonSubmit')
    if (!checks){
        botonSubmit.setAttribute('disabled','')
    }else{
        botonSubmit.removeAttribute('disabled')
    }
    act.value=array
}
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

function buscarDen(){
    ajax({
        method:"POST",
        url:'/denuncias/resultados',
        success:(res)=>{
            const {denunciasResultado,total}=res
            const tabla=document.getElementById('cuerpoTabla')
            const cantidadDenuncias=document.getElementById('cantidadDenuncias')
            const noencontrado=document.getElementById('noencontrado')
            if (total==0){
                tabla.innerHTML=''
                cantidadDenuncias.innerHTML=''
                noencontrado.innerHTML='No se han encontrado resultados'
            }else{
                noencontrado.innerHTML=''
                cantidadDenuncias.textContent=`Cantidad de denuncias: ${total}`
                tabla.innerHTML=''
                for (let i=0;i<denunciasResultado.length;i++){
                    tabla.innerHTML+=`<tr>
                    <th scope="row" class="text-center">${denunciasResultado[i].nroDenuncia}</th>
                        <td>${denunciasResultado[i].nombreemprendimiento}</td>
                        <td>${denunciasResultado[i].categoria}</td>
                        <td>${denunciasResultado[i].motivo}</td>
                        <td>${denunciasResultado[i].descripcion}</td>
                    </tr>`
                }
            }
        },
        error:(err)=>{noencontrado.innerHTML=err},
        data:{
            nombreemprendimiento:document.getElementById('emprendimiento').value,
            motivo:document.getElementById('Motivo').value,
            categoria:document.getElementById('Categoria').value
        }
    })
}
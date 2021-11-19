function borrarCalificacion(){
    const estrellas=document.getElementsByClassName('estrella')
    const comentario=document.getElementById('comentario')
    for (let i=0;i<estrellas.length;i++){
        estrellas[i].checked=false
    }
    comentario.value=''
}

function enviarCalificacion(idemprendimiento){
    const estrellas=document.getElementsByClassName('estrella')
    let puntuacion
    for (let i=0;i<estrellas.length;i++){
        if (estrellas[i].checked){
            puntuacion=estrellas[i].value
            break
        }
    }
    const comentario=document.getElementById('comentario').value
    if (puntuacion){
        document.calificacionsitio.submit()
    }else{
        alert('Debe ingresar una puntuación')
    }
    
}

function modificarCalificacion(idemprendimiento,puntuacion,comentario, idcalificacion,idalojamiento){
    const calificacionUsuario=document.getElementById('calificacionUsuario')
    calificacionUsuario.setAttribute('hidden','')
    const modificacion=document.getElementById('modificacion')
    modificacion.removeAttribute('hidden')
    let radios=''
    for(let i=5;i>=1;i--){
        if (puntuacion==i){
            radios+=`<input type="radio" class="estrella" name="puntuacion" value="${i}" id="${i}" checked><label for="${i}">☆</label>`
        }else{
           radios+=`<input type="radio" class="estrella" name="puntuacion" value="${i}" id="${i}"><label for="${i}">☆</label>` 
        }
    }
    modificacion.innerHTML=`
    <h4>Califica este sitio</h4>
    <form action="/alojamientos/modificarCalificacion/${idcalificacion}/${idalojamiento}" method="post" name="calificacionsitio">
    <input type="text" name="idemprendimiento" value="${idemprendimiento}" hidden>
    <div class="rating"> 
        ${radios}
    </div>
    <div class="comment-area">
        <textarea class="form-control" name='comentario' placeholder="¿Cuál es tu opinion?" rows="4">${comentario}</textarea> 
    </div>
    <div class="comment-btns mt-2">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="reset" class="btn btn-secondary" onclick="document.getElementById('modificacion').setAttribute('hidden','');document.getElementById('calificacionUsuario').removeAttribute('hidden')">Cancelar</button>
            <button type="submit" class="btn btn-success">Enviar</button>
        </div>
    </div>
    </form>`

}




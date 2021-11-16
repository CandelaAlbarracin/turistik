function ver(){
    const archivos=document.getElementById('imagenprincipal').files
    const imagen=document.getElementById('imgprincipal')
     if (!archivos || !archivos.length) {
        imagen.src = "";
        return;
    }
    const primerArchivo = archivos[0];
    const objectURL = URL.createObjectURL(primerArchivo);
    imagen.src=objectURL
    const imagenPreview=document.getElementById('imagenPreview')
    imagenPreview.style.backgroundImage='url('+objectURL+')'
}

function cargarImg(){
    let modalbody=document.getElementById('modal-body')
    const imagenes=document.getElementsByClassName('imgload')
    console.log(modalbody)
    modalbody.innerHTML=''
    for ( i=0;i<imagenes.length/2;i++){
        modalbody.innerHTML+=`<div class="col"><input type="checkbox" id="check${imagenes[i].id}"><img src="${imagenes[i].src}" id="${imagenes[i].id}" width="80px"></div>`
    }
}

function actualizarVista(){
    const titulo=document.getElementById('titulo')
    const inputActividad=document.getElementById('nombreactividad').value
    const intro=document.getElementById('intro')
    const inputIntro=document.getElementById('introduccion').value

    titulo.innerHTML=inputActividad
    intro.innerHTML=inputIntro
}

function enviarForm(){
    const descripcion=document.getElementById('descripcion')
    const markupStr = $('#summernote').summernote('code');
    descripcion.value=markupStr
    const archivos=document.getElementById('imagenprincipal').files
    if (!archivos || !archivos.length){
        alert('Debe ingresar una imagen principal')
    }
}
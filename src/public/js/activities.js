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

function verImagenes(){
    const archivos=document.getElementById('imagenSecundaria').files
    const contenedor=document.getElementById('ImgSubidas')
    contenedor.innerHTML=""
     if (!archivos || !archivos.length) {
        contenedor.innerHTML = "";
        return;
    }
    for (let i=0;i<archivos.length;i++){
        let objectURL = URL.createObjectURL(archivos[i]);
        contenedor.innerHTML+=`<img class="m-2" src=${objectURL} width="250px">`
    }
}

function cargarImg(){
    let modalbody=document.getElementById('modal-body')
    const imagenes=document.getElementsByClassName('imgload')
    modalbody.innerHTML=''
    let array=[]
    for ( i=0;i<imagenes.length;i++){
        array.push(`<div class="col"><input type="checkbox" class="checks" id="check${imagenes[i].id}"><img src="${imagenes[i].src}" id="${imagenes[i].id}" width="80px"></div>`)
    }
    const dataArr = new Set(array);
    let result = [...dataArr];
    modalbody.innerHTML=result.join('')
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
    const nuevo=document.getElementById('nuevo')
    if (nuevo){
        if (!archivos || !archivos.length){
            alert('Debe ingresar una imagen principal')
        }
    }
}

function imgEliminar(){
    const checks=document.getElementsByClassName('checks')
    const inputEliminar=document.getElementById('eliminar')
    let array=[]
    for (let i=0;i<checks.length;i++){
        if (checks[i].checked){
            let id=checks[i].id.substring(8)
            array.push(id)
        }
    }
    const dataArr = new Set(array);
    let result = [...dataArr];
    inputEliminar.value+=','+result
    const img=document.getElementsByClassName('imgload')
    for (let j=0;j<img.length;j++){
        let newid=img[j].id.substring(3)
        if (result.includes(newid)){
            img[j].setAttribute('hidden','')
            img[j].classList.remove('imgload')
        }
    }
    if(document.getElementsByClassName('imgload').length/2-1<0){
        document.getElementById('swiperImg').setAttribute('hidden','')
    }
    const cerrarmodal=document.getElementById('cerrarmodal')
    cerrarmodal.click()  
}
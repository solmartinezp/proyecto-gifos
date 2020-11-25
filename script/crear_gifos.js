let video= document.getElementById('video');
let previewGif= document.getElementById('previewGif');
let gifOverlay= document.getElementById('gifOverlay');
let repetir= document.getElementById('repetir');
let botonComenzar= document.getElementById('botonParaComenzar');
let botonGrabar= document.getElementById('botonParaGrabar');
let botonFinalizar= document.getElementById('botonParaFinalizar');
let botonSubir= document.getElementById('botonParaSubir');
let divVideo= document.getElementById('empezando-a-grabar');
let divSinVideo= document.getElementById('sin-grabar');
let pasoUno= document.getElementById('paso-1');
let pasoDos= document.getElementById('paso-2');
let pasoTres= document.getElementById('paso-3');
var constraints = { audio: false, video: { height: {max: 480} } }; 
let recorder;
let timer= document.getElementById('timer');
let form = new FormData();
const api_key= 'tYfyavSpnKco2La9SHFSM4tERSdov3EK';

//Setup del timer
var tiempoInicial;
var tiempoAct;
var diferencia;
var tInterval;
var tiempoGuardado;
var pausado = 0;
var running = 0;

//Cuando aprieto grabar
function empezarTimer(){
  if(!running){
    tiempoInicial = new Date().getTime();
    tInterval = setInterval(mostrarTime, 1000);   
 
    pausado = 0;
    running = 1;
  }
}

//Cuando aprieto finalizar
function pausarTimer(){
  if (!diferencia){
    // si el timer nunca empezó, no pasa nada cuando aprieto pausa
  } else if (!pausado) {
    clearInterval(tInterval);
    tiempoGuardado = diferencia;
    pausado = 1;
    running = 0;
  } else {
    // si el timer ya estaba pausado, cuando vuelvo a clickear, empezar de nuevo
    empezarTimer();
  }
}


//Cuando aprieto subir gifos o cuando aprieto repetir captura
function resetTimer(){
  clearInterval(tInterval);
  tiempoGuardado = 0;
  diferencia = 0;
  pausado = 0;
  running = 0;
}

function mostrarTime(){
  tiempoAct = new Date().getTime();
  if (tiempoGuardado){
    diferencia = (tiempoAct - tiempoInicial) + tiempoGuardado;
  } else {
    diferencia =  tiempoAct - tiempoInicial;
  }

  var horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  var segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  
  horas = (horas < 10) ? "0" + horas : horas;
  minutos = (minutos < 10) ? "0" + minutos : minutos;
  segundos = (segundos < 10) ? "0" + segundos : segundos;
  timer.innerHTML = horas + ':' + minutos + ':' + segundos;
  timer.style.display= "inline-block";
}

// Fin del setup timer

botonComenzar.addEventListener('click', getStreamAndRecord);

function getStreamAndRecord() {
  botonComenzar.style.display= "none";
  //Cambio texto
  let txt=  "<h1 class='title'> ¿Nos das acceso <br/> a tu cámara? </h1>" + 
  "<h3> El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.</h3>";
  divSinVideo.innerHTML= txt;
  divSinVideo.style.width= '300px';

  //Cambio botones
  pasoUno.style.color= "white";
  pasoUno.style.background= "#572EE5";

  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { height: { max: 480 } } })
    .then(function (stream) {
        divSinVideo.style.display= "none";
        divVideo.style.display= "inline-block";
        botonGrabar.style.display= "inline-block";
        pasoDos.style.color= "white";
        pasoDos.style.background= "#572EE5";

        pasoUno.style.color= "#572EE5";
        pasoUno.style.background= "white";

        video.srcObject = stream;
        video.play();

        recorder = RecordRTC(stream, {
          type: 'gif',
          frameRate: 1,
          quality: 10,
          width: 360,
          hidden: 240,
          onGifRecordingStarted: function() {
           console.log('started')
         },
        });
    });

}

botonGrabar.addEventListener('click', empezarGrabacion);

function empezarGrabacion() {
  empezarTimer();
  timer.style.display= "inline-block";
  botonGrabar.style.display="none";
  botonFinalizar.style.display="inline-block";

  recorder.startRecording();
  console.log('empezamos');
}

botonFinalizar.addEventListener('click', finalizarGrabacion);

function finalizarGrabacion () {
  pausarTimer();
  botonFinalizar.style.display="none";
  botonSubir.style.display="inline-block";
  timer.style.display="none";
  recorder.stopRecording( ()=> {
    repetir.style.display= "inline-block";
    video.style.display= "none";
    previewGif.style.display="inline-block";

    let blob = recorder.getBlob();
    let urlNuevo= URL.createObjectURL(recorder.getBlob());
    previewGif.setAttribute('src', urlNuevo);

    form.append("file", recorder.getBlob(), "myGifo.gif");
    form.append("api_key", api_key);
    
    console.log(form.get('file'))
    console.log('paramos');
    resetTimer();
  });
}

repetir.addEventListener('click', resetGrabacion);

function resetGrabacion() {
    recorder.reset();
    timer.innerHTML= "00:00:00";
    timer.style.display= "none";
    repetir.style.display= "none";
    botonFinalizar.style.display="inline-block";
    botonSubir.style.display="none";

    video.style.display= "inline-block";
    previewGif.style.display="none";

    empezarGrabacion();
}



botonSubir.addEventListener('click', subirGif);

function subirGif() {
  //Cerrar la cámara
  stream = video.srcObject;
  tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  video.srcObject = null;
  
  pasoTres.style.color= "white";
  pasoTres.style.background= "#572EE5";

  pasoDos.style.color= "#572EE5";
  pasoDos.style.background= "white";

  repetir.style.display= "none";

  gifOverlay.style.display= "flex";

  fetch("https://upload.giphy.com/v1/gifs", {
    method: "POST",
    body: form,
  })
    .then((resp) => {
      return resp.json();
    })
    .then((j) => {
      console.log(j.data);
      let gifoId = j.data.id;

      //Nuevo gif creado
      let imgOverlay= document.getElementById('imgOverlay');
      let textOverlay= document.getElementById('textOverlay');

      imgOverlay.style.animation= "none";
      imgOverlay.setAttribute('src', 'img/desktop/DAY/ok.svg');
      textOverlay.innerHTML= "GIFO subido con éxito";

      let overlayPlus= document.createElement('div');
      overlayPlus.classList.add('icons-gif');
      let txt= '<img id="downloadImg" src="img/desktop/DAY/icons/icon-download.svg" onclick="downloadGifCreado('+ "'" + gifoId + "'" +')" alt="Download" />' + 
              '<img id="linkImg" onclick="copiarLink('+ "'" + gifoId + "'" +')" src= "img/desktop/DAY/icon-link-normal.svg"/> ';

      overlayPlus.innerHTML= txt;
      gifOverlay.insertBefore(overlayPlus, imgOverlay);

      // Guardar nuevo gif en localStorage
    let gifCreados= localStorage.getItem('gifCreados');
    if (!gifCreados || gifCreados == "[]") {
        gifCreados= [];
    } else {
        gifCreados= JSON.parse(gifCreados);
    }
    
    gifCreados.push(gifoId);
    localStorage.setItem('gifCreados', JSON.stringify(gifCreados));
    })
    .catch((err) => console.log(err));
}

function downloadGifCreado (id) {
  let url_download= `https://api.giphy.com/v1/gifs/${id}?api_key=${api_key}`;
  fetch(url_download)
    .then(r=> r.json())
    .then(j=> {
      console.log(j.data);
      let src= j.data.images.original.url;
      downloadGif(src);
    })
    .catch((e)=> console.log(e));
}

function copiarLink(id) {
  let url_copy= `https://api.giphy.com/v1/gifs/${id}?api_key=${api_key}`;
  fetch(url_copy)
    .then(r=> r.json())
    .then(j=> {
      let link= j.data.url;

      let hiddentextarea = document.createElement('textarea');
      document.body.appendChild(hiddentextarea);
      hiddentextarea.value = link;
      hiddentextarea.select();
      let exitoso= document.execCommand('copy');
      if (exitoso) {
        alert('Enlace copiado con éxito!');
      }
      else {
        alert('Error en copiar el enlace');
      }

      document.body.removeChild(hiddentextarea);
    })
    .catch((e)=> console.log(e));
}

function cargar() {
  if (window.screen.width < 900) {
    window.location = "index.html";
  }
}

cargar(); //Si se está en version mobile, te redirige al index porque 
//no está habilitada la opción de crear gif en mobile

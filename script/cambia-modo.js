let aLi= document.getElementById('cambiaModo'); 
let body= document.getElementsByTagName('body')[0];

let tema = localStorage.getItem("modo");
    if (tema == "nocturno") {
        cambiarModo();
    }

aLi.addEventListener('click', cambiarModo);

function cambiarModo() {
    if (body.className != 'modoNoche') {
        body.classList.toggle('modoNoche');
        aLi.innerHTML= 'Modo Diurno';
        localStorage.setItem('modo', 'nocturno');
        
    } else {
        body.classList.toggle('modoNoche'); 
        aLi.innerHTML= 'Modo Nocturno';
        localStorage.setItem('modo', 'diurno');
    }
}


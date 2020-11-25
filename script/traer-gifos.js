let gifosVacio= document.getElementById('principal_sin_contenido');
let misGifosSection= document.getElementById('misgifos_section');
let botonesPagina= document.getElementById('botones-pagina');
let paginaUno= document.getElementById('pagina1');

function cargarPaginaGifos() { 
    if (!localStorage.getItem('gifCreados') || localStorage.getItem('gifCreados')== "[]") {
        //Decir que no agregaste ningun favorito
        gifosVacio.style.display= 'flex';
        botonesPagina.style.display= "none";
        botonesPagina.classList.remove('active');
    } else {
        gifosVacio.style.display= 'none';
        misGifosSection.innerHTML= "";
        let gifosLleno= localStorage.getItem('gifCreados');
        let gifosArrayLleno= gifosLleno.split(','); //El localStorage te devuelve un string por eso lo paso a array
        let myRegex= /[a-z0-9]/gi; 
        var filtradoGifos= [];
        gifosArrayLleno.filter((x) => {
            filtradoGifos.push(x.match(myRegex).join(''));
        });
        mostrarGifos(0, 12);
    }
}

function mostrarGifos (offset, limit) { 
    misGifosSection.innerHTML ="";
    let gifosLleno= localStorage.getItem('gifCreados');
    let gifosArrayLleno= gifosLleno.split(','); //El localStorage te devuelve un string por eso lo paso a array
    let myRegex= /[a-z0-9]/gi; 
    var filtradoGifos= [];
    gifosArrayLleno.filter((x) => {
        filtradoGifos.push(x.match(myRegex).join(''));
    });

    let idMas= JSON.parse(gifosLleno);

    let url_id= `https://api.giphy.com/v1/gifs?api_key=${api_key}&ids=${idMas}`;
    let offSet= offset;

    if( offSet == 0) {
        paginaUno.classList.add('pintando');
    } else {
        paginaUno.classList.remove('pintando');
    }

    let lengthId= idMas.length;

    if (!botonesPagina.classList.contains('active')) {
        botonesPagina.classList.add('active');
        let offsetOriginal= 0;
        let cantidadDePag= Math.ceil(lengthId/12);
                
        if (lengthId > 12) {
            for(let y=1; y<cantidadDePag; y++) {
                offsetOriginal += 12;
                let boton= document.createElement('button');
                boton.setAttribute('id', 'pagina'+(y+1));
                boton.classList.add('boton');
                boton.setAttribute('onclick', 'mostrarMasGifos('+offsetOriginal+', 12)');
                boton.innerHTML= (y+1);
                botonesPagina.appendChild(boton);             
                botonesPagina.style.display= "flex";     
                if (offsetOriginal== offset ) {
                    boton.classList.add('pintado');
                } else {
                    boton.classList.remove('pintando');
                    }  
                }        
                    
        } else {
            botonesPagina.style.display="flex"; 
        }
    }

    fetch(url_id)
    .then(r=> r.json())
    .then(j=> {
        let names;
        let id_gif;
        let src;
        let user;

        //Cuando son mas de 12 gifs dibujo con un for hasta 12.
        if (lengthId-offSet > 12) {
            for (let x= 0; x<12; x++) {
                names= j.data[x].title;
                id_gif=  j.data[x].id; 
                src= j.data[x].images.original.url; 
                user= j.data[x].username;

                let gifoContainer= document.createElement('div');
                gifoContainer.classList.add('gifoContainer');
                let giph= document.createElement('img');
                giph.classList.add('foto-s2');
                giph.setAttribute('src', src);
                misGifosSection.appendChild(gifoContainer);
                gifoContainer.appendChild(giph); 

                if (window.screen.width < 900) {
                    gifoContainer.setAttribute('onclick', 'expandir(event,"' + id_gif + '")');
                } else { 
                     //AGREGAR HOVER
                let divHover= document.createElement('div');
                let txt="<div class='icons-hover'><img class='icons-gifos' onclick='eliminarGifo("+ 'event,"' + id_gif + '"' +")' src='img/desktop/DAY/icons/icon-trash-normal.svg' alt='Icon Fav'/>" + 
                                "<img class='icons-gifos' onclick='downloadGif("+ '"' + src + '"' +")' src='img/desktop/DAY/icons/icon-download.svg' alt='Icon Fav'/>" +
                                "<img class='icons-gifos' onclick='expandir("+ 'event,"' + id_gif + '"' +")' src='img/desktop/DAY/icons/icon-max-normal.svg' alt='Icon Fav'/></div>" +
                                "<div class='text-hover'> <h3>"+user+"</h3>" +
                                "<h2>"+names+"</h2></div>";
                divHover.innerHTML= txt;
                divHover.classList.add("hoverContent");
                gifoContainer.appendChild(divHover);
                }
            }
        } else {
            //dibujo desde el valor pasado hasta el length del array de IDs
                for (let x= offSet; x<lengthId; x++) {
                    names= j.data[x].title; 
                    id_gif=  j.data[x].id; 
                    src= j.data[x].images.original.url; 
                    user= j.data[x].username;

                    let gifoContainer= document.createElement('div');
                    gifoContainer.classList.add('gifoContainer');
                    let giph= document.createElement('img');
                    giph.classList.add('foto-s2');
                    giph.setAttribute('src', src);
                    misGifosSection.appendChild(gifoContainer);
                    gifoContainer.appendChild(giph); 

                    if (window.screen.width < 900) {
                        gifoContainer.setAttribute('onclick', 'expandir(event,"' + id_gif + '")');
                    } else { 
                        //AGREGAR HOVER
                    let divHover= document.createElement('div');
                    let txt="<div class='icons-hover'><img class='icons-gifos' onclick='eliminarGifo("+ 'event,"' + id_gif + '"' +")' src='img/desktop/DAY/icons/icon-trash-normal.svg' alt='Icon Fav'/>" + 
                                    "<img class='icons-gifos' onclick='downloadGif("+ '"' + src + '"' +")' src='img/desktop/DAY/icons/icon-download.svg' alt='Icon Fav'/>" +
                                    "<img class='icons-gifos' onclick='expandir("+ 'event,"' + id_gif + '"' +")' src='img/desktop/DAY/icons/icon-max-normal.svg' alt='Icon Fav'/></div>" +
                                    "<div class='text-hover'> <h3>"+user+"</h3>" +
                                    "<h2>"+names+"</h2></div>";
                    divHover.innerHTML= txt;
                    divHover.classList.add("hoverContent");
                    gifoContainer.appendChild(divHover);
                    }
                }
        }
    })
    .catch(err=> console.log(err));

}

function eliminarGifo (evento, id) {
    let gifosLleno= localStorage.getItem('gifCreados');
    let gifosArrayLleno= gifosLleno.split(','); //El localStorage te devuelve un string por eso lo paso a array
    let myRegex= /[a-z0-9]/gi; 
    var filtradoGifos= [];
    gifosArrayLleno.filter((x) => {
            filtradoGifos.push(x.match(myRegex).join(''));
        });
        let gifSinRepetidos= [...new Set(filtradoGifos)]; //Saco los repetidos del array 
        let localNuevo= gifSinRepetidos.filter((x)=> x !=id); //Saco del array en localStorage
        //el elemento que coincida con el id seleccionado
        localStorage.setItem('gifCreados', JSON.stringify(localNuevo)); //Nuevo array en localStorage 
        //con el id seleccionado eliminado
        misGifosSection.innerHTML= "";

        if (!localStorage.getItem('gifCreados') || localStorage.getItem('gifCreados') == '[]') {
            botonesPagina.style.display= "none";
            botonesPagina.classList.remove('active');
        }    
        cargarPaginaGifos();
}

function mostrarMasGifos (offset, limit) {
    misGifosSection.innerHTML= "";
    mostrarGifos(offset, 12);
    
}
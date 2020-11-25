const api_key= 'tYfyavSpnKco2La9SHFSM4tERSdov3EK';

let slider1= document.getElementById('slider1');
let slider2= document.getElementById('slider2');
let trending_gif= document.getElementById('trending-gif');

function getTrendings(limit, offset) { 
    console.log('probando');
    let url_trending = `https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=${limit}&offset=${offset}`; 
    fetch (url_trending)
        .then ( r => {
            return r.json();
        })
        .then ( g => {
            for (let x= 0; x< g.data.length; x++) {
                let containerImg= document.createElement('div');
                containerImg.classList.add('containerImg');
                let giph= document.createElement('img');
                giph.classList.add('foto-s2');
                giph.setAttribute('src', g.data[x].images.original.url);
                trending_gif.appendChild(containerImg);
                containerImg.appendChild(giph);

                if (window.screen.width < 900) {
                    containerImg.setAttribute('onclick', 'expandir(event,"' + g.data[x].id + '")');
                } else {
                //Agregar hover
                let divHover= document.createElement('div');
                let sourceFavorito;
                let clase;
                if (!localStorage.getItem('favArray') || localStorage.getItem('favArray')== '[]') { //Si no hay nada guardado en Fav
                    sourceFavorito= "img/desktop/DAY/icons/icon-fav.svg";
                } else {
                    let favArray= localStorage.getItem('favArray');
                    let favArrayLleno= favArray.split(','); //El localStorage te devuelve un string
                    let myRegex= /[a-z0-9]/gi; //Por eso lo paso a array
                    let filtrado= [];
                    favArrayLleno.filter((x) => {
                        filtrado.push(x.match(myRegex).join(''));
                    });
                    let incluidoId= filtrado.includes(g.data[x].id);
                    if (incluidoId) {
                        sourceFavorito= "img/desktop/DAY/icons/icon-fav-active.svg";
                        clase= "elementoActivo";
                    } else {
                        sourceFavorito= "img/desktop/DAY/icons/icon-fav.svg";
                        clase= "";
                    } 
                }

                let txt="<div class='icons-hover'><img id='imagen"+[x]+"' class='icons-gif "+ clase+"' onclick='agregando("+ 'event,"' + g.data[x].id + '"' +")' src='"+ sourceFavorito+ "' alt='Icon Fav'/>" + 
                                    "<img class='icons-gif' onclick='downloadGif("+ '"' + g.data[x].images.original.url + '"' +")' src='img/desktop/DAY/icons/icon-download.svg' alt='Icon Fav'/>" +
                                    "<img class='icons-gif' onclick='expandir("+ 'event,"' + g.data[x].id + '"' +")' src='img/desktop/DAY/icons/icon-max-normal.svg' alt='Icon Fav'/></div>" +
                                    "<div class='text-hover'> <h2>"+ g.data[x].username+"</h2>" +
                                    "<h2>"+g.data[x].title+"</h2></div>";
                    divHover.innerHTML= txt;
                    divHover.classList.add("hoverContent");
                    containerImg.appendChild(divHover);
                    console.log('me termine de dibujar');
            }
        }
        })
        .catch ( e => {
            console.log(e);
        });
}

if (window.screen.width < 900) {
    getTrendings(12, 0);
} else { 
    getTrendings(3,0);
}

var index = 0;

function moverSlides(num){
    var cantidad=index+=num;
    if (cantidad>=0){
        trending_gif.innerHTML= "";
        console.log(cantidad);
        getTrendings(3, cantidad);
   }  
}


function agregando(event, id) {
    console.log('agregando gif');
    //CAMBIAR EL ICON CUANDO ESTA MARCADO COMO FAVORITO
    let elementFav= event.target; 

    let chequearSrc= elementFav.getAttribute('src'); 
    if (chequearSrc== "img/desktop/DAY/icons/icon-fav.svg") {
        elementFav.setAttribute('src', "img/desktop/DAY/icons/icon-fav-active.svg");
        elementFav.classList.add('elementoActivo');
    } else {
        elementFav.setAttribute('src', "img/desktop/DAY/icons/icon-fav.svg");
        elementFav.classList.remove('elementoActivo');
    }
        
    //GUARDAR EL ID DE LOS GIFS MARCADOS COMO FAVORITO
    favArray= localStorage.getItem('favArray');
    if (!favArray || favArray == "[]") {
        favArray= [];
    } else {
        if (typeof(favoritoSection) != 'undefined') {
            favoritoSection.innerHTML= "";
        } 
        favArray= JSON.parse(favArray);
    }
    let repetidoIdFav= favArray.includes(id);
       if (repetidoIdFav) {
        console.log('ya ta');
        let nuevoArr= favArray.filter((x)=> x != id);
        favArray= nuevoArr;
       } else {
        favArray.push(id);
       }

    localStorage.setItem('favArray', JSON.stringify(favArray));

    if(typeof(cargarPagina) == 'function') { 
       cargarPagina();
    } 
    location.reload();
   
}
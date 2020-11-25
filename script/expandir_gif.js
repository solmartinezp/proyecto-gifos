let divModal= document.getElementById('modal');
let closeBtn= document.getElementById('close-btn');
let gifExpandido= document.getElementsByClassName('gifExpandido')[0];
let tituloGif= document.getElementsByClassName('nombreGif')[0];
let iconsGif= document.getElementsByClassName('masExpandido-icons');
let downloadOnly= document.getElementsByClassName('onlyDownload');
let downloadA= document.getElementById('download-target');

async function expandir(event, id) {
    divModal.style.display="flex";
    let url_id= `https://api.giphy.com/v1/gifs/${id}?api_key=${api_key}`;
    gifExpandido.style.display= "none";
    let resp= await fetch(url_id);
    let json= await resp.json();
    let nombre= json.data.title;
    let idParaFav= id;
    let sourceGif= json.data.images.original.url;
    gifExpandido.setAttribute('src', sourceGif);
    gifExpandido.style.display= "inline-block";
    tituloGif.innerHTML= nombre;
    
    let chequearSiEsTrending= event.target;
    // let favA= iconsGif[0].firstElementChild;
    let favA= document.getElementById('a-target');
    let imgTarget= favA.firstElementChild;
    if (chequearSiEsTrending.classList.contains('icons-gifos')) { //Si el gif está en la sección de Mis Gifos
        favA.style.display= "none"; //Le saco la opción de agregar a favoritos
    } else {  //Si el gif está en la sección de Trendings:
        let sourceImg; 
        let favArr= localStorage.getItem('favArray');
        if (!favArr || favArr == '[]') {
            sourceImg= "img/desktop/DAY/icons/icon-fav.svg";
        } else {
            let favArrayLleno= favArr.split(','); //El localStorage te devuelve un string
            let myRegex= /[a-z0-9]/gi; //Por eso lo paso a array
            let filtrado= [];
            favArrayLleno.filter((x) => {
                filtrado.push(x.match(myRegex).join(''));
            });
            for (let y=0; y<filtrado.length; y++) {
                if (filtrado[y]== idParaFav) {
                    sourceImg= "img/desktop/DAY/icons/icon-fav-active.svg";
                    imgTarget.classList.add('active');
                    favA.classList.add('active');
                } else {
                    sourceImg= "img/desktop/DAY/icons/icon-fav.svg";
                    imgTarget.classList.remove('active');
                    favA.classList.remove('active');
                }
            }
            
        }
        
        imgTarget.setAttribute('src', sourceImg);  

        favA.addEventListener('click', (e) => {
            e.preventDefault();
            //CAMBIAR EL ICON CUANDO ESTA MARCADO COMO FAVORITO
            let chequearSrc= imgTarget.getAttribute('src'); 
            if (chequearSrc== "img/desktop/DAY/icons/icon-fav.svg") {
                imgTarget.setAttribute('src', "img/desktop/DAY/icons/icon-fav-active.svg");
                if (!imgTarget.classList.contains('active')) {
                    imgTarget.classList.add('active');
                }
            } else {
                imgTarget.setAttribute('src', "img/desktop/DAY/icons/icon-fav.svg");
                if (imgTarget.classList.contains('active')) {
                    imgTarget.classList.remove('active');
                }
            }

            //GUARDAR EL ID DE LOS GIFS MARCADOS COMO FAVORITO
            if (!favArr || favArr == "[]") {
                favArr= [];
            } else {
                if (typeof(favoritoSection) != 'undefined') {
                    favoritoSection.innerHTML= "";
                } 
                favArr= JSON.parse(favArr);
            }
            let repetidoIdFav= favArr.includes(id);
            if (repetidoIdFav) {
                console.log('ya ta');
                let nuevoArr= favArr.filter((x)=> x != id);
                favArr= nuevoArr;

            } else {
                favArr.push(id);
            }

            localStorage.setItem('favArray', JSON.stringify(favArr));
    //
        })
        }

        downloadA.addEventListener('click', (e) => {
            e.preventDefault();
            downloadGif(sourceGif);
        })


}

/*Cerrar modal*/
closeBtn.addEventListener('click', ()=> {
    divModal.style.display="none";
    
    if(typeof(cargarPagina) == 'function') { 
        cargarPagina();
     } 
})

/*Cerrar modal cuando clickeo afuera */
window.addEventListener('click', (event) => {
    if (event.target == modal) {
      divModal.style.display = "none";
    }
  });


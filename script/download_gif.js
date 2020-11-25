async function downloadGif(source) {
    let blob= await fetch(source).then(r=> r.blob());
    invokeSaveAsDialog(blob);
}
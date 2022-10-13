import { validateAlbum, extractMetaAndStoreB64, createNewAlbum } from "../lib/saveManager.js"
const loadingScreen = document.getElementById("loading_screen")
const loadingScreenText = document.getElementById("loading_text")
let isLoading = false
let albumList = document.querySelectorAll("album")
const uploadBtn = document.getElementById("upload_album")

uploadBtn.addEventListener("change", async(e) => {
    isLoading = true
    try{
        loadingScreen.style.display = "flex"
        loadingScreen.style.opacity = "1"
        const albumName = e.target.files[0].webkitRelativePath.split('/')[0]
        console.log(await validateAlbum(albumName))
        console.log(await extractMetaAndStoreB64(e.target.files, loadingScreenText))
        console.log(await createNewAlbum(albumName, loadingScreenText))
        loadingScreen.style.opacity = "0"
        setTimeout(() => {
            loadingScreen.style.display = "none"
        }, 200);
    }
    catch(error){
        loadingScreen.style.opacity = "0"
        loadingScreen.style.display = "none"
        isLoading = false
        console.error(error)
        alert(error)
    }
    finally{
        isLoading = false
    }
})
window.addEventListener("keyup", (e) => {
    //Prevent tabbing while loading (Not working yet)
    if(e.code == "Tab" && isLoading){
        e.preventDefault()
    }
})
export function updateAlbumList(){
    albumList = document.querySelectorAll("album")
    for (const album of albumList){
        album.addEventListener("click", () => {
            //Open album modal
        })
    }
}
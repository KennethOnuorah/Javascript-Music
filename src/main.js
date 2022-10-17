import { validateAlbum, extractMetaAndStoreB64, createNewAlbum } from "../lib/saveManager.js"
import { load } from "../lib/loadManager.js"
import { openAlbumModal, modalOpen } from "../lib/albumModal.js"

const loadingScreen = document.getElementById("loading_screen")
const loadingScreenText = document.getElementById("loading_text")
let isLoading = false

const uploadBtn = document.getElementById("upload_album")

window.addEventListener("load", () => {
    load().then(() => { updateAlbumList() })
})
window.addEventListener("keyup", (e) => {
    //Prevent tabbing while loading (Not working yet)
    if(e.code == "Tab" && isLoading){
        e.preventDefault()
    }
})
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
        console.error(error)
    }
    finally{
        isLoading = false
        updateAlbumList()
    }
})
/**
 * Update the list of albums the user has created
 */
function updateAlbumList(){
    const albumList = document.querySelectorAll(".grid_item")
    for (const album of albumList){
        album.addEventListener("click", function(){
            openAlbumModal(album.id)
        })
    }
}
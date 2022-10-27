import { validateAlbum, extractMetaAndStoreB64, createNewAlbum, songOrderCorrection } from "../lib/saveManager.js"
import { load } from "../lib/loadManager.js"
import { openAlbumModal, modalOpen } from "../lib/albumModal.js"

const loadingScreen = document.getElementById("loading_screen")
const loadingScreenText = document.getElementById("loading_text")
let isLoading = false
const uploadBtn = document.getElementById("upload_album")
const searchBar = document.getElementById("album_search_bar")

window.addEventListener("load", () => {
    load().then(() => { updateAlbumList() })
})
window.addEventListener("keydown", (e) => {
    //Prevent tabbing while loading (Not working yet)
    if(e.key == "Tab" && loadingScreen.style.opacity == "1"){
        e.preventDefault()
    }
})
uploadBtn.addEventListener("change", async(e) => {
    isLoading = true
    try{
        loadingScreen.style.display = "flex"
        loadingScreen.style.opacity = "1"
        const albumName = e.target.files[0].webkitRelativePath.split('/')[0]
        reenableAllAlbums()
        console.log(await validateAlbum(albumName))
        console.log(await extractMetaAndStoreB64(e.target.files, loadingScreenText))
        songOrderCorrection(albumName, loadingScreenText)
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
searchBar.addEventListener("input", () => {
    let undesiredResults = 0
    const albumList = document.querySelectorAll(".grid_item")
    for(const album of albumList){
        album.style.display = album.id.toLowerCase().includes(searchBar.value.toLowerCase()) ? "flex" : "none"
        if(document.getElementById(album.id).style.display == "none") 
            undesiredResults += 1
    }
    let noResults = (undesiredResults == albumList.length)
    noResults ? 
        document.getElementById("nothing_prompt").style.display = "block" : 
        document.getElementById("nothing_prompt").style.display = "none"
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
function reenableAllAlbums(){
    searchBar.value = ""
    document.getElementById("nothing_prompt").style.display = "none"
    const albumList = document.querySelectorAll(".grid_item")
    for (const album of albumList){
        album.style.display = "flex"
    }
}
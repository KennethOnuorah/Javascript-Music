import { startNewSongQueue, currentAlbumPlaying } from "../lib/musicController.js"

const loadingScreen = document.getElementById("loading_screen")
const loadingScreenText = document.getElementById("loading_text")
const footer = document.getElementById("footer")

const modal = document.querySelector(".album_modal")
const modalContent = document.querySelector(".album_modal_content")
const modalAlbumCover = document.querySelector(".modal_cover")
const modalTitle = document.querySelector(".modal_title")
const modalArtists = document.querySelector(".modal_artists")
const modalYears = document.querySelector(".modal_years")
export let modalOpen = false
let currentAlbumKey = ""

const changeCoverButton = document.getElementById("change_cover")
const changeCoverButtonLabel = document.getElementById("change_cover_label")
const deleteAlbumButton = document.getElementById("delete_album")
const playAlbumButton = document.getElementById("play_album")
/**
* Opens the album modal
* @param {String} albumKey - The localforage key for gaining access to a particular album
*/
export function openAlbumModal(albumKey){
    let album = {}
    modalOpen = true
    modal.style.display = "flex"
    modal.style.animation = "fade_in 0.2s forwards"
    modalContent.style.animation = "shift_up 0.2s forwards"
    if(currentAlbumKey != albumKey){
        currentAlbumKey = albumKey
        modalTitle.innerHTML = "-"
        modalArtists.innerHTML = "Artist(s): "
        modalYears.innerHTML = "Recorded: "
        modalAlbumCover.src = "../images/default_album_cover.png"
        loadingScreen.style.display = "flex"
        loadingScreen.style.opacity = "1"
        loadingScreenText.innerHTML = ""
        localforage.getItem(albumKey).then((value) => { 
            album = value
            modalTitle.innerHTML = albumKey
            const uniqueArtistList = Array.from(new Set(album["songArtist"]))
            const uniqueYearsList = Array.from(new Set(album["songYear"])).map(Number)
            modalArtists.innerHTML = uniqueArtistList.length <= 3 ? 
                "Artist(s): " + uniqueArtistList.join(", ") : 
                "Artist(s): " + uniqueArtistList.slice(0, 3).join(", ") + `, and ${uniqueArtistList.length - 3} others`
            modalYears.innerHTML = uniqueYearsList.length > 1 ? 
                `Recorded: ${Math.min(...uniqueYearsList)} - ${Math.max(...uniqueYearsList)}` : 
                `Recorded: ${uniqueYearsList}`
            localforage.getItem(currentAlbumKey).then((value) => { modalAlbumCover.src = value["cover"] })
            loadingScreen.style.opacity = "0"
            setTimeout(() => {
                loadingScreen.style.display = "none"
            }, 200)
        })
    }
}
async function deleteAlbum(){
    try{
        document.getElementById(currentAlbumKey).remove()
        localforage.removeItem(currentAlbumKey)
        localforage.removeItem(`${currentAlbumKey}_html`)
        const albumList = await localforage.getItem("albumList")
        albumList.splice(albumList.indexOf(currentAlbumKey), 1)
        localforage.setItem("albumList", albumList)
        modal.style.animation = "fade_out 0.2s forwards"
        modalContent.style.animation = "0"
    }
    catch(e){
        console.error(e)
    }
}
modal.addEventListener("click", (e) => {
    if(e.target == modal){
        modalOpen = false
        modal.style.animation = "fade_out 0.2s forwards"
        modalContent.style.animation = "0"
        setTimeout(() => {
            modal.style.display = "none"
        }, 200);
    }
})
playAlbumButton.addEventListener("click", async() => {
    try{
        loadingScreen.style.display = "flex"
        loadingScreen.style.opacity = "1"
        loadingScreenText.innerHTML = `Setting up album: ${currentAlbumKey}`
        await startNewSongQueue(currentAlbumKey)
    }
    catch(error) {
        console.error(error)
    }
    finally{
        loadingScreen.style.opacity = "0"
        footer.style.display = "inline-flex"
        footer.style.opacity = "1"
        footer.style.animation = "shift_up 0.2s forwards"
        modal.style.animation = "fade_out 0.2s forwards"
        setTimeout(() => {
            loadingScreen.style.display = "none"
            modal.style.display = "none"
            modal.style.animation = "0"
        }, 200)
    }
})
deleteAlbumButton.addEventListener("click", () => {
    if(!confirm(`${currentAlbumKey} will be deleted. Press OK to confirm deletion.`)) return
    deleteAlbum()
})
changeCoverButton.addEventListener("change", (e) => {
    const img = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onload = () => {
        modalAlbumCover.src = reader.result
        document.getElementById(`${currentAlbumKey}_cover`).src = reader.result
        localforage.getItem(currentAlbumKey).then((value) => {
            let obj = value
            obj["cover"] = reader.result
            localforage.setItem(currentAlbumKey, obj)
            localforage.setItem(`${currentAlbumKey}_html`, document.getElementById(currentAlbumKey).outerHTML)
        })
    }
    reader.onerror = (e) => {
        console.error(e)
    }
})
//To allow tabbing for change cover button
changeCoverButtonLabel.addEventListener("focus", (e) => {
    e.preventDefault()
})
changeCoverButtonLabel.addEventListener('keyup', (e) => {
    if(e.code == "Enter") {
        changeCoverButton.click()
    }
})
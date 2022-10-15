const loadingScreen = document.getElementById("loading_screen")
const loadingScreenText = document.getElementById("loading_text")

const modal = document.querySelector(".album_modal")
const modalContent = document.querySelector(".album_modal_content")
const modalTitle = document.querySelector(".modal_title")
const modalArtists = document.querySelector(".modal_artists")
const modalYears = document.querySelector(".modal_years")
export let modalOpen = false
let modalAlbumKey = ""

const changeCoverButton = document.getElementById("change_cover")
/**
* Opens the album modal
* @param {String} albumKey - The localforage key for getting access to a particular album
*/
export function openAlbumModal(albumKey){
    let album = {}
    modalOpen = true
    modal.style.display = "flex"
    modal.style.animation = "fade_in 0.2s forwards"
    modalContent.style.animation = "shift_up 0.2s forwards"

    if(modalAlbumKey != albumKey){
        modalAlbumKey = albumKey

        modalTitle.innerHTML = "-"
        modalArtists.innerHTML = "Artist(s): "
        modalYears.innerHTML = "Recorded: "

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
            modalYears.innerHTML = uniqueYearsList.length > 1 ? `Recorded: ${Math.min(...uniqueYearsList)} - ${Math.max(...uniqueYearsList)}` : `Recorded: ${uniqueYearsList}`
            loadingScreen.style.opacity = "0"
            setTimeout(() => {
                loadingScreen.style.display = "none"
            }, 200);
        })
    }
}
changeCoverButton.addEventListener("change", function(e){
    const img = e.target.files[0]
})
modal.addEventListener("click", function(e){
    if(e.target == modal){
        modalOpen = false
        modal.style.animation = "fade_out 0.2s forwards"
        modalContent.style.animation = "0"
        setTimeout(() => {
            modal.style.display = "none"
        }, 200);
    }
})

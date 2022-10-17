const albumGridSection = document.getElementById("album_grid_section")
const loadingScreen = document.getElementById("loading_screen")
const loadingScreenText = document.getElementById("loading_text")

/**
 * Loads all albums from localforage into the DOM
 */
export async function load(){
    try{
        loadingScreen.style.display = "flex"
        loadingScreen.style.opacity = "1"
        let albumList = await localforage.getItem("albumList")
        albumList = albumList.split(',').filter(String)
        albumList.splice(albumList.indexOf("", albumList.length))
        for(const album of albumList){
            const html = await localforage.getItem(`${album}_html`)
            loadingScreenText.innerHTML = `Loading album: ${album}`
            albumGridSection.innerHTML += html
        }
        loadingScreen.style.opacity = "0"
        setTimeout(() => {
            loadingScreen.style.display = "none"
        }, 200)
    }
    catch(e) {
        loadingScreen.style.opacity = "0"
        setTimeout(() => {
            loadingScreen.style.display = "none"
        }, 200)
        console.error(e)
    }
}
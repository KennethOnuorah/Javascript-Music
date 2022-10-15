const requiredAudioExtensions = [
    "audio/mpeg", 
    "audio/wav", 
    "audio/ogg", 
    "audio/flac"]
/**
* Checks if the album to be uploaded has not already been uploaded.
* @param {String} albumName - The name of the the uploading album
*/
export function validateAlbum(albumName) {
    return new Promise((resolve, reject) => {
        localforage.getItem("albumList").then((list) => {
            list = list == null ? "" : list
            let albumList = list.split(",")
            if(!albumList.includes(albumName)){
                albumList.push(albumName)
                localforage.setItem("albumList", albumList.toString())
                resolve("Directory validation: Completed")
            }else{
                reject("Upload failed. An album with this name already exists.")
            }
        })
    })
}
/**
* Extracts metadata from each audio file of FileList, then converts them to base64 and stores them w/ localforage.
* @param {FileList} files - A list of audio files
* @param {HTMLElement} statusText - A text element in the DOM that tracks the progress of data extraction (should preferably be text from a loading screen)
*/
export function extractMetaAndStoreB64(files, statusText) {
    const album = { 
        cover: "../images/default_album_cover.png", songs: [], songsB64: [], 
        songArtist: [], songYear: [] 
    }
    return new Promise((resolve, reject) => {
        const albumName = files[0].webkitRelativePath.split('/')[0]
        for (const file of files) {
            if (!requiredAudioExtensions.includes(file.type))
                return
            statusText.innerHTML = `Extracting metadata from ${file.name}...`
            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    album["songs"].push(tag.tags.title) 
                    album["songArtist"].push(tag.tags.artist) 
                    album["songYear"].push(tag.tags.year)
                },
                onError: (error) => {
                    console.error(error)
                }
            })
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                statusText.innerHTML = `Saving ${file.name} in storage...`
                album["songsB64"].push(reader.result)
            }
            reader.onerror = (e) => {
                console.error(e)
            }
        }
        localforage.getItem(albumName).then(() => {
            localforage.getItem(albumName).then(() => {
                let setterObj = {}
                setterObj = album
                console.log(`Album:`, setterObj)
                localforage.setItem(albumName, setterObj)
                resolve("Metadata extraction: Completed")   
            })
        })
    })
}
/**
* Creates and adds a new album element in the DOM
* @param {String} albumName - The name of the album
* @param {HTMLElement} statusText - A text element in the DOM that tracks the progress of data extraction (should preferably be text from a loading screen)
*/
export function createNewAlbum(albumName, statusText){
    return new Promise((resolve, reject) => {
        statusText.innerHTML = `Creating album for /${albumName}...`
        const albumGridSection = document.getElementById("album_grid_section")
        const albumDiv = document.createElement("div")
        albumDiv.className = "grid_item"
        albumDiv.id = albumName

        const albumImage = document.createElement("input")
        albumImage.type = "image"
        albumImage.id = `${albumName}_cover`
        albumImage.src = "../images/default_album_cover.png"
        albumImage.width = albumImage.height = 250

        const albumTitle = document.createElement("h3")
        albumTitle.textContent = albumName

        albumDiv.appendChild(albumImage)
        albumDiv.appendChild(albumTitle)
        albumGridSection.prepend(albumDiv)
        resolve("Album creation: Completed")
    })
}
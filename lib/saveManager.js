const acceptedFileTypes = [
    "audio/mpeg", 
    "audio/wav", 
    "audio/ogg", 
    "audio/flac"
]
/**
* Checks if the album to be uploaded has not already been uploaded.
* @param {String} albumName - The name of the the uploading album
*/
export function validateAlbum(albumName) {
    return new Promise((resolve, reject) => {
        localforage.getItem("albumList").then((list) => {
            list = list == null ? [] : list
            let albumList = list
            if(!albumList.includes(albumName)){
                albumList.push(albumName)
                localforage.setItem("albumList", albumList)
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
    return new Promise((resolve, reject) => {
        const album = { 
            cover: "../images/default_album_cover.png", songs: [], songsB64: [], 
            songArtist: [], songYear: []
        }
        const albumName = files[0].webkitRelativePath.split('/')[0]
        for (const file of files) {
            if (!acceptedFileTypes.includes(file.type))
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
            reader.onload = () => {
                statusText.innerHTML = `Saving ${file.name} in storage...`
                album["songsB64"].push(`${file.name}===>${reader.result}`)
            }
            reader.onerror = (e) => {
                console.error(e)
            }
            reader.readAsDataURL(file)
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
* A function for issue #8
* @param {String} albumName - The name of the album
* @param {HTMLElement} statusText - A text element in the DOM that tracks the progress of song correction (should preferably be text from a loading screen)
*/
export async function songOrderCorrection(albumName, statusText){
    try{
        statusText.innerHTML = "Finishing up..."
        let songsList = (await localforage.getItem(albumName))["songs"]
        let songsB64List = (await localforage.getItem(albumName))["songsB64"]
        let newSongsB64List = Array(songsList.length).fill("")
        for (let i = 0; i < songsList.length; i++){
            for(let j = 0; j < songsB64List.length; j++){
                if(songsB64List[j].split('===>')[0].includes(songsList[i])){
                    newSongsB64List[songsList.indexOf(songsList[i])] = songsB64List[j]
                }
            }
        }
        newSongsB64List = newSongsB64List.map(item => item.split('===>')[1])
        localforage.getItem(albumName).then((value) => {
            value["songsB64"] = newSongsB64List
            localforage.setItem(albumName, value)
        })
    }
    catch (error){
        console.error(error)
    }
}
/**
* Creates and adds a new album element in the DOM
* @param {String} albumName - The name of the album
* @param {HTMLElement} statusText - A text element in the DOM that tracks the progress of album creation (should preferably be text from a loading screen)
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
        albumGridSection.append(albumDiv)
        localforage.setItem(`${albumName}_html`, albumDiv.outerHTML)
        resolve("Album creation: Completed")
    })
}
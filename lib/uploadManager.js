const audioExtensions = [
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/flac"
]
/**
* Checks if the directory to be uploaded has not already been uploaded.
* @param {String} dirName - The name of the directory
*/
export function validateDirectory(dirName) {
    return new Promise((resolve, reject) => {
        //Placeholder
        resolve("Album validation: Completed")
    })
}
/**
* Extracts metadata from each audio file of FileList.
* @param {FileList} files - A list of audio files
*/
export function extractAudioMetadata(files) {
    return new Promise((resolve, reject) => {
        for (const file of files){
            if(!audioExtensions.includes(file.type))
                return
            let songName = ""
            let songArtist = ""
            let songAlbum = ""
            let songYear = 0
            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    songName = tag.tags.title
                    songArtist = tag.tags.artist
                    songAlbum = files[0].webkitRelativePath.split('/')[0]
                    songYear = tag.tags.year
                    console.log(`Song: ${songName}\nArtist: ${songArtist}\nAlbum: ${songAlbum}\nYear: ${songYear}`)
                },
                onError: (error) => {
                    console.error(error)
                }
            })
        }
        resolve("Metadata extraction: Completed")
    })
}
/**
* Converts each audio file in FileList into base64 format.
* @param {FileList} files - A list of audio files
*/
export function convertAudioToBase64(files) {
    console.log(`Converting files of ${files[0].webkitRelativePath.split('/')[0]} to base64...`)
    return new Promise((resolve, reject) => {
        for(const file of files){
            if(!audioExtensions.includes(file.type))
                return
            const reader = new FileReader()
            let base64 = ""
            reader.readAsDataURL(file)
            reader.onload = () => {
                base64 = reader.result
            }
            reader.onerror = (e) => {
                console.error(e)
            }
        }
        resolve("Base64 conversion: Completed")
    })
}

/*
    HOW EACH ALBUM ENTRY IN JSON OBJECT SHOULD LOOK LIKE:
    ====================================================
    {
        albumName1 {
            cover: "", <= converted to base64 format
            songs: [],
            songsB64: [],
            songArtists: [],
            songYears: []
        }
        albumName2 {
            cover: "",
            songs: [],
            songsB64: [],
            songArtists: [],
            songYears: [],
        } 
    }
    
    ALL ALBUM NAMES SHOULD BE IN AN ARRAY STORED IN LOCALFORAGE, SO 
    THAT WE CAN LOOP THROUGH EACH ALBUM ENTRY IN THE JSON:
    =====================================================
    localforage.setItem("allAlbums", Array.from(localforage.getItem("allAlbums")).push("albumName1"))
*/
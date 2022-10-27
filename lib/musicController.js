const currentSong = document.getElementById("song")
const artistAndSongName = document.getElementById("artist_and_song_name")
export let currentAlbumPlaying = ""
let songQueue = []
let songQueueShuffled = []
let songs, songsB64, artists
let currentSongIndex = 0
let isPaused = true 
let isDraggingLengthBar = false
let shuffleMode = false
const playModeList = ["Play once", "Repeat album", "Repeat song"]
let currentPlayMode = "Play once"
let mousePositionX = 0
let startingNewQueue = false

const tabTitle = document.getElementsByTagName("title")[0]
const footer = document.getElementById("footer")
const songLengthBar = document.querySelector(".song_length_slider")
const songTimeDisplay = document.querySelector(".time_display")
const songTimeDisplayText = document.querySelector(".time_display_text")
const shuffleBtn = document.getElementById("shuffle_btn")
const prevSongBtn = document.getElementById("prev_song_btn")
const playSongBtn = document.getElementById("play_song_btn")
const playIcon = document.getElementById("play_icon")
const skipSongBtn = document.getElementById("skip_song_btn")
const playModeBtn = document.getElementById("play_mode_btn")
const playModeBtnIcon = document.getElementById("play_mode_btn_icon")
const volumeAdjuster = document.getElementById("volume_slider")
const volumePercentage = document.getElementById("volume_percentage")
/**
* Starts a new song queue then plays the first song of the queue. Also takes into account whether or not the user is in shuffle mode
* @param {String} albumName - The name of the album to play
*/
export async function startNewSongQueue(albumName){
    try{
        currentAlbumPlaying != "" ? document.getElementById(currentAlbumPlaying).style.animation = "0" : console.warn("There is no album that is currently playing")
        document.getElementById(albumName).style.animation = "glowing_outline 1.5s infinite"
        currentAlbumPlaying = albumName
        songs = (await localforage.getItem(albumName))["songs"]
        songsB64 = (await localforage.getItem(albumName))["songsB64"]
        artists = (await localforage.getItem(albumName))["songArtist"]
        songQueue = songs.map(song => songs.indexOf(song))
        songQueueShuffled = shuffle(songQueue)
        currentSongIndex = 0
        console.log(`${albumName}:`, songs, "\nNorm. queue:", songQueue, "\nShuf. queue:", songQueueShuffled)
        startingNewQueue = true
        artistAndSongName.innerHTML = "[Press play to begin]"
        currentSong.currentTime = 0
        isPaused = true
        currentSong.pause()
        playIcon.src = "../images/icons/play_icon.png"
        playIcon.style.transform = "translate(0.75px, 2px)"
    }
    catch(error) {
        console.error(error)
    }
}
export function resetSongQueue(){
    currentSong.src = ""
    currentSong.currentTime = ""
    artistAndSongName.innerHTML = "-"
    songs = songsB64 = artists = songQueue = songQueueShuffled = []
    currentAlbumPlaying = ""
    playIcon.src = "../images/icons/play_icon.png"
    playIcon.style.transform = "translate(0.75px, 2px)"
    isPaused = true
    footer.style.opacity = "0"
    setTimeout(() => {
        footer.style.display = "none"
    }, 200)
}

window.addEventListener("mousemove", (e) => {
    mousePositionX = e.clientX
})
currentSong.addEventListener("timeupdate", () => {
    songLengthBar.max = currentSong.duration * 1000
    if(!isDraggingLengthBar){
        songLengthBar.value = (currentSong.currentTime * 1000).toString()
    }
})
currentSong.addEventListener("ended", () => {
    if(currentPlayMode == "Repeat song"){
        currentSong.currentTime = "0"
        currentSong.play()
        return
    }
    currentSongIndex != songQueue.length - 1 ? onSongEnded() : repeatAlbum()
})
//For when the user is playing/pausing with their headphone buttons
currentSong.addEventListener("playing", () => {
    isPaused = false
    playIcon.src = "../images/icons/pause_icon.png"
    playIcon.style.transform = "translate(0px, 2px)"
})
currentSong.addEventListener("pause", () => {
    if(currentSong.duration != currentSong.currentTime){  
        isPaused = true
        playIcon.src = "../images/icons/play_icon.png"
        playIcon.style.transform = "translate(0.75px, 2px)"
    }
})

songLengthBar.addEventListener("input", () => {
    songTimeDisplay.style.opacity = "1"
    mousePositionX > (window.innerWidth * 1/10) && mousePositionX < (window.innerWidth * 9/10) ? songTimeDisplay.style.transform = `translate(${mousePositionX - 20}px, ${-100}px)` : console.warn("Cannot move time display past this point")
    songTimeDisplayText.innerHTML = (songLengthBar.value / 1000).toString().toHHMMSS()
})
songLengthBar.addEventListener("mousedown", () => {
    isDraggingLengthBar = true
    songTimeDisplay.style.transform = `translate(${mousePositionX - 20}px, ${-100}px)`
    songTimeDisplayText.innerHTML = (songLengthBar.value / 1000).toString().toHHMMSS()
})
songLengthBar.addEventListener("mouseup", () => {
    songTimeDisplay.style.opacity = "0"
    isDraggingLengthBar = false
    currentSong.currentTime = (songLengthBar.value / 1000).toString()
})

shuffleBtn.addEventListener("click", () => {
    toggleShuffleMode(shuffleBtn)
})
prevSongBtn.addEventListener("click", () => {
    currentSongIndex != 0 ? changeCurrentSong(-1) : currentSong.currentTime = "0"
})
playSongBtn.addEventListener("click", () => {
    isPaused = !isPaused
    if(startingNewQueue){
        startingNewQueue = false
        if(!shuffleMode){
            artistAndSongName.innerHTML = `${artists[currentSongIndex]} - ${songs[currentSongIndex]}`
            tabTitle.innerHTML = songs[currentSongIndex]
            currentSong.src = songsB64[songQueue[currentSongIndex]]
        }
        else{
            artistAndSongName.innerHTML = `${artists[songQueueShuffled[currentSongIndex]]} - ${songs[songQueueShuffled[currentSongIndex]]}`
            tabTitle.innerHTML = songs[songQueueShuffled[currentSongIndex]]
            currentSong.src = songsB64[songQueueShuffled[currentSongIndex]]
        }
    }
    if(isPaused){
        playIcon.src = "../images/icons/play_icon.png"
        playIcon.style.transform = "translate(0.75px, 2px)"
        currentSong.pause()
    }
    else{
        playIcon.src = "../images/icons/pause_icon.png"
        playIcon.style.transform = "translate(0px, 2px)"
        currentSong.play()
    }
})
skipSongBtn.addEventListener("click", () => {
    currentSongIndex != songQueue.length - 1 ? changeCurrentSong(1) : 
        currentPlayMode == "Repeat album" ? repeatAlbum() : console.warn("You have reached the end of the album.")
})
playModeBtn.addEventListener("click", () => {
    let modeIndex = playModeList.indexOf(currentPlayMode)
    modeIndex = modeIndex == 2 ? 0 : modeIndex + 1
    currentPlayMode = playModeList[modeIndex]
    switch (currentPlayMode) {
        case "Play once":
            playModeBtnIcon.src = "../images/icons/loop_icon1.png"
            playModeBtn.style.opacity = "0.4"
            playModeBtn.title = "Repeat album"
            break
        case "Repeat album":
            playModeBtn.style.opacity = "1"
            playModeBtn.title = "Repeat song"
            break
        case "Repeat song":
            playModeBtnIcon.src = "../images/icons/loop_icon2.png"
            playModeBtn.title = "Play album once"
            break
        default:
            break
    }
})
volumeAdjuster.addEventListener("input", () => {
    currentSong.volume = (parseFloat(volumeAdjuster.value) * (1/100)).toString()
    volumePercentage.innerHTML = `${Math.round(parseFloat(currentSong.volume) * 100)}%`
})

function toggleShuffleMode(btn){
    shuffleMode = !shuffleMode
    btn.style.opacity = shuffleMode ? "1" : "0.4"
    btn.title = shuffleMode ? "Disable shuffle mode" : "Enable shuffle mode"
}
function onSongEnded(){
    console.log(`"${!shuffleMode ? songs[currentSongIndex] : songs[songQueueShuffled[currentSongIndex]]}" has ended. Now playing next song...`)
    currentSongIndex += 1
    if(shuffleMode){
        artistAndSongName.innerHTML = `${artists[songQueueShuffled[currentSongIndex]]} - ${songs[songQueueShuffled[currentSongIndex]]}`
        tabTitle.innerHTML = songs[songQueueShuffled[currentSongIndex]]
        currentSong.src = songsB64[songQueueShuffled[currentSongIndex]]
    }
    else{
        artistAndSongName.innerHTML = `${artists[currentSongIndex]} - ${songs[currentSongIndex]}`
        tabTitle.innerHTML = songs[currentSongIndex]
        currentSong.src = songsB64[songQueue[currentSongIndex]]
    }
    currentSong.play()
}
function changeCurrentSong(change){
    if(change < 0 && parseInt(currentSong.currentTime) > 3){
        currentSong.currentTime = "0"
        return
    }
    isPaused = false
    playIcon.src = "../images/icons/pause_icon.png"
    console.log(`"${!shuffleMode ? songs[currentSongIndex] : songs[songQueueShuffled[currentSongIndex]]}" has been skipped. Playing ${change < 0 ? "previous" : "next"} song...`)
    currentSongIndex += change
    if(shuffleMode){
        artistAndSongName.innerHTML = `${artists[songQueueShuffled[currentSongIndex]]} - ${songs[songQueueShuffled[currentSongIndex]]}`
        tabTitle.innerHTML = songs[songQueueShuffled[currentSongIndex]]
        currentSong.src = songsB64[songQueueShuffled[currentSongIndex]]
    }
    else{
        artistAndSongName.innerHTML = `${artists[currentSongIndex]} - ${songs[currentSongIndex]}`
        tabTitle.innerHTML = songs[currentSongIndex]
        currentSong.src = songsB64[songQueue[currentSongIndex]]
    }
    currentSong.play()
}
function repeatAlbum(){
    songQueueShuffled = shuffle(songQueue)
    currentSongIndex = 0
    if(!shuffleMode){
        artistAndSongName.innerHTML = `${artists[currentSongIndex]} - ${songs[currentSongIndex]}`
        currentSong.src = songsB64[songQueue[currentSongIndex]]
    }
    else{
        artistAndSongName.innerHTML = `${artists[songQueueShuffled[currentSongIndex]]} - ${songs[songQueueShuffled[currentSongIndex]]}`
        currentSong.src = songsB64[songQueueShuffled[currentSongIndex]]
    }
    currentSong.play()
}

//Helper functions
function shuffle(array){
    array = array.map(value => ({ value, sort: realRandom() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    return array
}
function realRandom(){
    return Math.pow(10, 14) * Math.random() * Math.random()
}
String.prototype.toHHMMSS = function () {
    let sec_num = parseInt(this, 10)
    let hours   = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    let seconds = sec_num - (hours * 3600) - (minutes * 60)

    if (hours < 10) {hours = "0" + hours}
    if (minutes < 10) {minutes = "0"+minutes}
    if (seconds < 10) {seconds = "0"+seconds}
    let time = hours + ':' + minutes + ':' + seconds
    if(time.length === 8 && time.substring(0,3) === "00:"){                     
        return time.substring(3)      
    }
    else{                     
        return time              
    }
}
let uploadBtn = document.getElementById("upload_album")
const audioFileExtensions = [".mp3", ".wav", ".ogg", ".flac"]
uploadBtn.addEventListener("change", function(event) {
    console.log(event.target.files)
})
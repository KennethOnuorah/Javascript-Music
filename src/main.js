import { validateDirectory, extractAudioMetadata, convertAudioToBase64 } from "../lib/uploadManager.js"

const uploadBtn = document.getElementById("upload_album")
uploadBtn.addEventListener("change", async(e) => {
    try{
        const directoryName = e.target.files[0].webkitRelativePath.split('/')[0]
        console.log("Validating album: In progress")
        const validateResult = await validateDirectory(directoryName)
        console.log(validateResult)
        console.log("Metadata extraction: In progress")
    }
    catch(error){
        console.error(error)
    }
})
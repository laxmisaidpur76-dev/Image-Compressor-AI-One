let originalImage = null;
let originalSize = 0;

// Upload
document.getElementById("upload").addEventListener("change", function(e){
    const file = e.target.files[0];
    if(!file) return;

    originalSize = file.size;

    const img = new Image();

    img.onload = function(){
        originalImage = img;

        document.getElementById("originalImage").src = img.src;
        document.getElementById("originalImage").style.display = "block";

        document.getElementById("width").value = img.width;
        document.getElementById("height").value = img.height;

        updateInfo(originalSize, 0);
        compressPreview();
    };

    img.src = URL.createObjectURL(file);
});

// Live preview
document.getElementById("width").oninput = compressPreview;
document.getElementById("height").oninput = compressPreview;
document.getElementById("quality").oninput = compressPreview;
document.getElementById("format").onchange = compressPreview;

// Preview compress
function compressPreview(){
    if(!originalImage) return;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let w = parseInt(document.getElementById("width").value) || originalImage.width;
    let h = parseInt(document.getElementById("height").value) || originalImage.height;
    let quality = parseFloat(document.getElementById("quality").value) || 0.7;
    let format = document.getElementById("format").value;

    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0,0,w,h);
    ctx.drawImage(originalImage, 0, 0, w, h);

    const previewURL = canvas.toDataURL(format, quality);

    document.getElementById("previewImage").src = previewURL;
    document.getElementById("previewImage").style.display = "block";

    canvas.toBlob(function(blob){
        if(blob){
            updateInfo(originalSize, blob.size);
        }
    }, format, format === "image/png" ? undefined : quality);
}

// Size info
function updateInfo(original, compressed){
    document.getElementById("originalSize").innerText =
        "Original: " + (original/1024).toFixed(1) + " KB";

    document.getElementById("compressedSize").innerText =
        "Compressed: " + (compressed/1024).toFixed(1) + " KB";
}

// 🔥 Download ONLY (no auto open)
function compressAndDownload(){
    if(!originalImage){
        alert("पहले image upload करो");
        return;
    }

    const canvas = document.getElementById("canvas");
    const format = document.getElementById("format").value;
    const filename = document.getElementById("filename").value || "image";
    const quality = parseFloat(document.getElementById("quality").value) || 0.7;

    let ext = "jpg";
    if(format === "image/png") ext = "png";
    if(format === "image/webp") ext = "webp";

    canvas.toBlob(function(blob){
        if(!blob){
            alert("Error");
            return;
        }

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename + "." + ext;
        a.click();

        URL.revokeObjectURL(url);
    }, format, format === "image/png" ? undefined : quality);
}
window.onload = function() {
    const loadBotton = document.getElementById('loadButton');
    loadBotton.onclick = () => {
        let imgPath = document.getElementById('filePathInput').value;
        viewImage(imgPath);
    }
    
    function viewImage(imgPath) {
        httpRequest = new XMLHttpRequest();
    
        if (!httpRequest) {
            alert("Building Request failed!");
            return false;
        }
    
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    let imgBox = document.getElementById('imageViewer');
                    imgBox.textContent = httpRequest.responseText;
                } else {
                    alert("Some problem with request!")
                }
            }
        }
        httpRequest.open("POST", "api/viewImage");
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(`filePath=${encodeURIComponent(imgPath)}`); 
    }
}

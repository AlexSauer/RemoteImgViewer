function loadImage(imgPath) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert("Building Request failed!");
        return false;
    }

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let curImg = document.getElementById('myImage');
                let response = httpRequest.responseText;
                curImg.src = `data:imge/jpg;base64, ${response}`;
            } else {
                alert("Some problem with request!")
            }
        }
    }
    httpRequest.open("POST", "api/viewImage");
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(`filePath=${encodeURIComponent(imgPath)}`); 
}

function viewImage(url) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert("Building Request failed!");
        return false;
    }

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let curImg = document.getElementById('myImage');
                let response = httpRequest.responseText;
                curImg.src = `data:imge/jpg;base64, ${response}`;
            } else {
                alert("Some problem with request!")
            }
        }
    }
    httpRequest.open("GET", url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(); 
}

window.onload = function() {
    const loadBotton = document.getElementById('loadButton');
    loadBotton.onclick = () => {
        let imgPath = document.getElementById('filePathInput').value;
        loadImage(imgPath);
    }

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.onclick = () => {
        viewImage('api/prevImage')
    }
    nextButton.onclick = () => {
        viewImage('api/nextImage')
    }
    

}

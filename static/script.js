function requestImage(imgPath, cur_index, cur_channel) {
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
    httpRequest.open("POST", "api/requestImage/");
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(`filePath=${encodeURIComponent(imgPath)}&index=${cur_index}&channel=${cur_channel}`); 
}

window.onload = function() {
    let CUR_INDEX = 0;
    let CUR_CHANNEL = document.getElementById('channelSelect').value;
    let CUR_PATH = ''
    const loadBotton = document.getElementById('loadButton');
    loadBotton.onclick = () => {
        CUR_INDEX = 0;
        CUR_PATH = document.getElementById('filePathInput').value;
        requestImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const channelInput = document.getElementById('channelSelect');

    prevButton.onclick = () => {
        CUR_INDEX = Math.max(0, CUR_INDEX -1);
        requestImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }
    nextButton.onclick = () => {
        CUR_INDEX = CUR_INDEX+1;
        requestImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL)
    }

    channelInput.onchange = () => {
        CUR_CHANNEL = channelInput.value;
        requestImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }


    

}

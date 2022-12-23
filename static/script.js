var IMAGES = {}

async function requestImage(imgPath, cur_index, cur_channel) {
    // Makes a request to api/requestImage to get the base64 encoded image
    console.log(`Requesting ${imgPath}, ${cur_channel}, ${cur_index}`)
    try {
        const response = await fetch('api/requestImage/',
                                     {
                                      method: 'POST',
                                      headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                               },
                                      body: `filePath=${encodeURIComponent(imgPath)}&index=${cur_index}&channel=${cur_channel}`
                                     });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        // const data = await response.text();
        return data;
      }
      catch (error) {
        console.error(`Could not get Image: ${error}`);
      }
}

function viewImage(base64img) {
    // Changes the src of #myImage to the base64 code of the specified images
    let curImg = document.getElementById('myImage');
    curImg.src = `data:imge/jpg;base64, ${base64img}`; 
}

function updateIndexDisplay(index, path) {
    let displayIndex = document.getElementById('indexDisplay');
    let max_index = IMAGES[path]['n_slices'];
    displayIndex.textContent = `Current index: ${index}/${max_index}`;
}

function updateChannel(path) {
    let n_channels = IMAGES[path]['n_channels'];
    let channelSelect = document.getElementById('channelSelectDiv');
    if (n_channels == 0){
        channelSelect.style.display = 'none';
    } else {
        channelSelect.style.display = 'block';
    }

}


async function loadImage(path, index, channel){
    // Saves all previously seen image in the IMAGES object
    // This object has the structure {path1: {channel1_index1: base64, ....},
    //                                ....,
    //                                {pathN: {channel1_index1: base64, ....}}
    let key = `${channel}_${index}`
    if (!(path in IMAGES)) {
        // The images path hasn't been seen before
        let response = await requestImage(path, index, channel);
        let new_entry = {
            'n_slices' : response['n_slices'],
            'n_channels' : response['n_chnanels']
        };
        new_entry[key] = response['base64img'];
        IMAGES[path] = new_entry;
    } else if (!(key in IMAGES[path])) {
        // The image path has been seen but not that slice/channel
        let response = await requestImage(path, index, channel);
        IMAGES[path][key] = response['base64img'];
    }
    // If the image was already cached or is now loaded, return it
    return IMAGES[path][key]; 
}

function viewAndCacheImage(path, index, channel){
    let curImagePromise = loadImage(path, index, channel);
    // Display the current image and update index and channels
    curImagePromise
    .then((imgbase64) => {
        updateIndexDisplay(index, path);
        updateChannel(path);
        viewImage(imgbase64);
    })
    .then(() => loadImage(path, index+1, channel)) // Cache next index
    .catch( (error) => console.log(`Loading failed ${error}`));
}

window.onload = function() {
    let CUR_INDEX = 0;
    let CUR_CHANNEL = document.getElementById('channelSelect').value;
    let CUR_PATH = ''
    
    const loadBotton = document.getElementById('loadButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const channelInput = document.getElementById('channelSelect');

    loadBotton.onclick = () => {
        CUR_INDEX = 0;
        CUR_PATH = document.getElementById('filePathInput').value;
        viewAndCacheImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }

    prevButton.onclick = () => {
        CUR_INDEX = Math.max(0, CUR_INDEX -1);
        viewAndCacheImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }
    nextButton.onclick = () => {
        CUR_INDEX = CUR_INDEX+1;
        viewAndCacheImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL)
    }

    channelInput.onchange = () => {
        CUR_CHANNEL = channelInput.value;
        viewAndCacheImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }
}

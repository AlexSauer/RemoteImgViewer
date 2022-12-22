var IMAGES = {}

async function requestImage(imgPath, cur_index, cur_channel) {
    // Makes a request to api/requestImage to get the base64 encoded image
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
        // const data = await response.json();
        const data = await response.text();
        // console.log(data);
        return data;
      }
      catch (error) {
        console.error(`Could not get Image: ${error}`);
      }
}


function viewImage(path, index, channel){
    // Changes the src of #myImage to the base64 code of the specified images
    // Saves all previously seen image in the IMAGES object
    // This object has the structure {path1: {channel1_index1: base64, ....},
    //                                ....,
    //                                {pathN: {channel1_index1: base64, ....}}
    let curImg = document.getElementById('myImage');
    let key = `${channel}_${index}`
    if (!(path in IMAGES)) {
        // The images path hasn't been seen before
        let imgPromise = requestImage(path, index, channel);
        imgPromise.then( (base64img) => {
            IMAGES[path] = {key : base64img};
            curImg.src = `data:imge/jpg;base64, ${base64img}`; 
        }).catch( (error) => {
            console.log(`Failed with ${error}`);
        })
    } else {
        // The image path has been seen but not that slice/channel
        if (!(key in IMAGES[path])) {
            let imgPromise = requestImage(path, index, channel);
            imgPromise.then( (base64img) => {
                IMAGES[path][key] = base64img;
                curImg.src = `data:imge/jpg;base64, ${base64img}`; 
            }).catch( (error) => {
                console.log(`Failed with ${error}`);
            })
        }  else {
        // We have already seen exactly the same img&slice&channel
        curImg.src = `data:imge/jpg;base64, ${IMAGES[path][key]}`; 
        }
    }
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
        viewImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }

    prevButton.onclick = () => {
        CUR_INDEX = Math.max(0, CUR_INDEX -1);
        viewImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }
    nextButton.onclick = () => {
        CUR_INDEX = CUR_INDEX+1;
        viewImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL)
    }

    channelInput.onchange = () => {
        CUR_CHANNEL = channelInput.value;
        viewImage(CUR_PATH, CUR_INDEX, CUR_CHANNEL);
    }
}

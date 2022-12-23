import tifffile
from collections import namedtuple
from flask import Flask, render_template, url_for, request
from utils import generateBase64Img, local2serverPath, resizeImg

global_storage = {}
app = Flask(__name__)
Response = namedtuple('Response', 'file base64img n_slices n_channels')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/requestImage/', methods=['POST'])
def requestImage():
    """
    API that accepts the filepath, index and channel and returns a Response named tuple 
    """
    if request.method == 'POST':
        filePath = local2serverPath(request.form['filePath'])
        cur_index =  int(request.form['index'])
        cur_channel = int(request.form['channel'])
        print(filePath, cur_index, cur_channel)
    else:
        raise ValueError("api/requestImage only accepts POST requests")

    return returnImage(filePath, cur_index, cur_channel)._asdict()


def returnImage(filePath, cur_index, channel):
    """
    Function that reads in <filePath> and returns the base64 string of the image of <cur_index> and <channel>.
    Also performs some caching and stores the results of previously computed images. 
    """
    # Load in the file if it hasn't been requested before
    if filePath not in global_storage.keys():
        img = resizeImg(tifffile.imread(filePath))
        assert len(img.shape) in [3,4], f'Unexpected image shape: {img.shape}'
        global_storage[filePath] = img
    
    # Generate the base64 image for that combination of index/channel if it hasn't been requested before
    new_slice = generateBase64Img(global_storage[filePath], cur_index, channel)

    # Prepare response
    img_shape = global_storage[filePath].shape
    n_slices = img_shape[0]
    n_channels = img_shape[1] if len(img_shape) == 4 else 0

    return Response(
        file = filePath,
        base64img = new_slice, 
        n_slices = n_slices,
        n_channels = n_channels
    ) 


if __name__ == '__main__':
    app.run(debug=True)
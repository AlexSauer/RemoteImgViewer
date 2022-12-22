import tifffile
from flask import Flask, render_template, url_for, request
from utils import generateBase64Img, local2serverPath, resizeImg

global_storage = {}
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/requestImage/', methods=['POST'])
def requestImage():
    if request.method == 'POST':
        filePath = local2serverPath(request.form['filePath'])
        cur_index =  int(request.form['index'])
        cur_channel = int(request.form['channel'])
        print(filePath, cur_index, cur_channel)
    else:
        raise ValueError("api/requestImage only accepts POST requests")

    return returnImage(filePath, cur_index, cur_channel)


def returnImage(filePath, cur_index, channel):
    if filePath not in global_storage.keys():
        img = resizeImg(tifffile.imread(filePath))
        global_storage[filePath] = {'raw': img}
    cur_key = f'{channel}_{cur_index}'
    if cur_key not in global_storage[filePath].keys():
        new_slice = generateBase64Img(global_storage[filePath]['raw'], cur_index, channel)
        global_storage[filePath][cur_key] = new_slice
        return new_slice
    else:
        return global_storage[filePath][cur_key]



if __name__ == '__main__':
    app.run(debug=True)
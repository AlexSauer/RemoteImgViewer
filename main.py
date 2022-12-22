import io
import numpy as np 
import base64
import tifffile
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
from flask import Flask, render_template, url_for, request


global_storage = {}

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/requestImage/', methods=['POST'])
def requestImage():
    if request.method == 'POST':
        filePath = request.form['filePath']  
        cur_index =  int(request.form['index'])
        cur_channel = int(request.form['channel'])
        print(filePath, cur_index)
    else:
        raise ValueError("api/requestImage only accepts POST requests")

    return returnImage(filePath, cur_index, cur_channel)


def returnImage(filePath, cur_index, channel):
    if filePath not in global_storage.keys():
        img = tifffile.imread(filePath)
        global_storage[filePath] = {'raw': img}
    if cur_index not in global_storage[filePath].keys():
        new_slice = generateBase64(global_storage[filePath]['raw'], cur_index, channel)
        global_storage[filePath][cur_index] = new_slice
        return new_slice
    else:
        return global_storage[filePath][cur_index]


def generateBase64(img, index, channel):
    fig = plt.Figure(figsize=(5,5))
    plt.imshow(img[index, channel])

    my_stringIObytes = io.BytesIO()
    plt.savefig(my_stringIObytes, format='jpg')
    my_stringIObytes.seek(0)
    my_base64_jpgData = base64.b64encode(my_stringIObytes.read())
    return my_base64_jpgData

if __name__ == '__main__':
    app.run(debug=True)
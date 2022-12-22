import io
import numpy as np 
import base64
import tifffile
import matplotlib.pyplot as plt
# from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import matplotlib
matplotlib.use('Agg')
from flask import Flask, render_template, url_for, request, session


global_warehouse = ['global variable']

app = Flask(__name__)
app.secret_key = '52065471885156399091'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/setImage/', methods=['POST'])
def setImage():
    if request.method == 'POST':
        session['filePath'] = request.form['filePath']
        # session['image'] = tifffile.imread(request.form['filePath'])
        session['cur_idx'] = 0
        session['max_idx'] = 10 #session['image'].shape[0]
    else:
        raise ValueError("api/viewImage only accepts POST requests")

    return get_img(session['cur_idx'])

@app.route('/api/prevImage/')
def showPrevImage():
    new_idx = max(0, session['cur_idx']-1)
    print(global_warehouse)
    global_warehouse.append('prevImage was called')
    return get_img(new_idx)

@app.route('/api/nextImage/')
def showNextImage():
    new_idx = min(session['max_idx'], session['cur_idx']+1)
    print(global_warehouse)
    global_warehouse.append('nextImage was called')
    return get_img(new_idx)

def get_img(index):
    fig = plt.Figure(figsize=(5,5))
    plt.imshow(np.random.randn(25,25))
    # plt.imshow(session['image'][index])

    my_stringIObytes = io.BytesIO()
    plt.savefig(my_stringIObytes, format='jpg')
    my_stringIObytes.seek(0)
    my_base64_jpgData = base64.b64encode(my_stringIObytes.read())
    return my_base64_jpgData

if __name__ == '__main__':
    app.run(debug=True)
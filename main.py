import io
import numpy as np 
import base64
import matplotlib.pyplot as plt
from flask import Flask, render_template, url_for, request, session

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/viewImage', methods=['POST'])
def viewImage():
    if request.method == 'POST':
        print(request.form['filePath'])
        session['filePath'] = request.form['filePath']
    else:
        raise ValueError("api/viewImage only accepts POST requests")

    return 'API successful response!'

def get_img():
    fig = plt.Figure(figsize=(5,5))
    plt.imshow(np.random.randn(25,25))

    my_stringIObytes = io.BytesIO()
    plt.savefig(my_stringIObytes, format='jpg')
    my_stringIObytes.seek(0)
    my_base64_jpgData = base64.b64encode(my_stringIObytes.read())
    return my_base64_jpgData

if __name__ == '__main__':
    app.run(debug=True)
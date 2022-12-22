import io
import base64
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

def generateBase64Img(img, index, channel):
    fig = plt.Figure(figsize=(5,5))
    plt.imshow(img[index, channel])

    my_stringIObytes = io.BytesIO()
    plt.savefig(my_stringIObytes, format='jpg')
    my_stringIObytes.seek(0)
    my_base64_jpgData = base64.b64encode(my_stringIObytes.read())
    return my_base64_jpgData


def local2serverPath(path):
    return path

def resizeImg(img):
    return img
import io
import os
import sys
import base64
import matplotlib.pyplot as plt
import matplotlib
from skimage.transform import resize
matplotlib.use('Agg')

def generateBase64Img(img, index, channel):
    """
    Generate a plot of the <index> and <channel> of <img>.
    Transform the plot into base64 and return the final string
    """
    fig = plt.Figure(figsize=(5,5))
    if len(img.shape) == 4:
        plt.imshow(img[index, channel])
    elif len(img.shape) == 3:
        plt.imshow(img[index])
    else:
        raise ValueError(f'Unexpected shape of img: {img.shape}')

    my_stringIObytes = io.BytesIO()
    plt.savefig(my_stringIObytes, format='jpg')
    my_stringIObytes.seek(0)
    my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('utf-8')
    return my_base64_jpgData


def local2serverPath(path):
    # Locally (when working on my Mac) I don't have to modify the path
    if sys.platform == 'darwin':
        return path
    # If I am on the cluster, I want the replace the mounted paths with the actual cluster paths
    else:
        if path.startswith('/Users/alexandersauer/bmrc_mnt_2/'):
            path = path.replace('/Users/alexandersauer/bmrc_mnt_2/', '/well/rittscher/projects/PanVision/')
        elif path.startswith('/Users/alexandersauer/mnt_rescomp/'):
            path = path.replace('/Users/alexandersauer/mnt_rescomp/', f'/well/rittscher/users/{os.getlogin()}/')
        return path

def resizeImg(img):
    """
    To speed up generating the plots, downsample the whole image
    """
    return img
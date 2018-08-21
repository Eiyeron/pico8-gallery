from app_env import config, env, determine_image_url, determine_cart_url, load_carts
from os import path
import json


def update_index():
    index_template = env.get_template('index.j2')
    carts = load_carts(path.join(config["Path"]["cart_dir"], 'carts.json'))
    print("Found {} carts.".format(len(carts)))
    index_result = index_template.render(carts=carts)
    with open("dist/index.html", "w") as output:
        output.write(index_result)

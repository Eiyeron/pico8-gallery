from jinja2 import Environment, Template, FileSystemLoader
import json
from configparser import ConfigParser
from os import path

config = ConfigParser()
config.read("conf.ini")

env = Environment(
    loader = FileSystemLoader("templates")
)

def build_url(*args):
    return path.join(config["Path"]["root_dir"], *args)


def build_static_url(*args):
    return path.join(config["Path"]["static_dir"], *args)


def determine_image_url(cart, folder_name):
    url_cart_root = build_url("carts", folder_name)
    fs_cart_root = path.join(config["Path"]["cart_dir"], folder_name)

    if "cart" in cart:
        return path.join(url_cart_root, cart["cart"])

    elif path.isfile(path.join(fs_cart_root, folder_name+".p8.png")):
        return path.join(url_cart_root, folder_name+".p8.png")

    elif path.isfile(path.join(fs_cart_root, folder_name+".png")):
        return path.join(url_cart_root, folder_name+".png")

    return build_static_url("img/missing_cart.png")


def determine_cart_url(cart, folder_name):
    url_cart_root = build_url("carts", folder_name)
    fs_cart_root = path.join(config["Path"]["cart_dir"], folder_name)

    if "index" in cart:
        return build_url(fs_cart_root, cart["index"])

    elif path.isfile(path.join(fs_cart_root, folder_name+".html")):
        return path.join(url_cart_root, folder_name+".html")

    return "#"

def get_links():
    if config.has_section("Links"):
        return [entry.split(',') for key,entry in config.items("Links")]

    return []

def load_carts(file_path):
    cart_entries = []
    with open(file_path) as cart_list:
        data = json.loads(cart_list.read())
        for key in data:
            cart = data[key]
            index_file = determine_cart_url(cart, key)

            img_file = determine_image_url(cart, key)

            cart_entries.append({
                "name": cart["name"],
                "description": cart["info"],
                "page_url": index_file,
                "image_url": img_file,
                "tags": cart["tags"]
            })

    return cart_entries
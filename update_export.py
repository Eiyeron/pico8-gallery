from app_env import config, env, determine_image_url, determine_cart_url, load_carts, get_links
from os import path
import subprocess

def update_export():
    carts = load_carts(path.join(config["Path"]["cart_dir"], 'carts.json'))
    cart_dir = config["Path"]["cart_dir"]

    appdata = config["Pico8"]["pico_appdata"]
    plate_path = path.join(appdata, "plates", "pico8_plate.html")
    print(f"{appdata}")
    for cart in carts:
        cart_name = cart["name"]
        cart_html = cart["folder"] + ".html"
        cart_path = cart["folder"] + ".p8.png"
        cart_cwd = path.join(cart_dir, cart["folder"])
        args = ["pico8", "-export", f"{cart_html} -p pico8_plate", cart_path]
        command = ' '.join(args)
        print(f"{command}")
        subprocess.run(args, cwd=cart_cwd)

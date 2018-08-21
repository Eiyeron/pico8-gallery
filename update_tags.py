from app_env import config, env, determine_image_url, determine_cart_url, load_carts
from os import path
import json

def update_tags():
    index_template = env.get_template('index.j2')
    carts = load_carts(path.join(config["Path"]["cart_dir"], 'carts.json'))

    tags = []
    for cart in carts:
        for tag in cart["tags"]:
            lower_tag = tag.lower()
            if lower_tag not in tags:
                tags.append(lower_tag)

    def is_tag_in_cart(tag_to_match, cart):
        lower_tag = tag_to_match.lower()
        for tag in cart["tags"]:
            if tag.lower() == lower_tag:
                return True
        return False

    for tag in tags:
        print("> {}".format(tag))
        with open(path.join(config["Path"]["tags_dir"], tag+".html"), "w") as tag_file:
            filtered_carts = list(filter(lambda cart : is_tag_in_cart(tag, cart), carts))
            index_result = index_template.render(carts=filtered_carts, page_kind="tag", tag=tag)
            tag_file.write(index_result)

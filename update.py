#!/usr/bin/env python3
from update_index import update_index
from update_tags import update_tags
from update_style import update_style
from update_plate import update_plate


if __name__ == "__main__":
    print("-Updating index-")
    update_index()
    print("-Updating tags-")
    update_tags()
    print("-Updating stylesheet-")
    update_style()
    print("-Upadting Pico-8 plate-")
    update_plate()

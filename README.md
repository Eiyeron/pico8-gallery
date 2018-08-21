# pico8-gallery
A small static site containing a few of my Pico-8 sketches

# Licencing
All my carts are under the [Creative Commons CC-BY-SA-NC 3.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) licence.

The source of the site and its generator are under the provided MIT Licence.

# How to
## Generate

The requirements.txt file will come later, but the project mainly depends on Python3, Jinja2 and pyScss
```console
$ pip install jinja2
$ pip install pyscss
```

Once those packages are installed, run update.py in the repository's folder.
The generator will read the cart listing located at `dist/carts/carts.json` to generate the index and tags pages.
The generator will also generate a Pico-8 plate `pico8_plate.html` that you need to place in in Pico8's `plate` folder so you can export your own carts.
## Add a cart
Once you placed the generated plate file in the right folder, in Pico-8 instance, type this in the console:
```lua
load your_cart
export your_cart.html -p pico8_plate.html
```

Move then the cart file (saved as a png), the generated html and js file in a `dist/carts/your_cart` subfolder and add an entry in carts.json:
```json
    /* snip */
    "your_cart": {
        "name": "Its name",
        "info": "The cart's info",
        "tags": ["some", "tags"]
        /* "cart_dir" : "Another file location for the cart picture than the cart index name if needed" */
        /* "index" : "Another file location for the cart html file than the cart index name if needed" */
    },
    /* snip */
```

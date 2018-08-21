from app_env import config
import scss.config
from scss import Compiler
from os import path

current_folder = path.dirname(__file__)


compiler = Compiler(search_path=[current_folder])

def generate_sheet(origin, target):
    with open(origin, 'r') as stylesheet:
        result = compiler.compile_string(stylesheet.read())
        with open(target, 'w') as output:
            output.write(result)

def update_style():
    generate_sheet('index.scss', 'dist/static/css/index.css')
    generate_sheet('pico_cart_style.scss', 'dist/static/css/pico8.css')

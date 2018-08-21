from app_env import config
import os
from os import path
import shutil
import filecmp
current_folder = path.dirname(__file__)

folders_to_copy = ["img", "fnts"]

def copy_folder_to_static(folder_name, target_folder_name):

    for root, subdirs, files in os.walk(folder_name):
        target_destination = path.join(target_folder_name, root)
        if not path.exists(target_destination):
            print("> Creating {}.".format(target_destination))
            os.makedirs(target_destination)

        for f in files:
            original_file = path.join(root, f)
            target_file = path.join(target_destination, f)
            if not path.exists(target_file):
                print("> Copying {} => {}".format(original_file, target_file))
            elif not filecmp.cmp(original_file, target_file, shallow=False):
                print("> Updating {} => {}".format(original_file, target_file))
            else:
                print("> {} is up to date.".format(target_file))
            shutil.copyfile(original_file, target_file)

def update_static():
    for folder_to_copy in folders_to_copy:
        copy_folder_to_static(path.join("static", folder_to_copy), "dist")

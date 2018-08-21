document.addEventListener("DOMContentLoaded", function(event) {
    let page_kind = document.querySelectorAll("main")[0].getAttribute("data-page_kind");
    if(page_kind == "tag")
    {
        return;
    }

    let entries = document.querySelectorAll(".entry");
    let showing_title = document.getElementById("showing");
    let original_showing_text = showing_title.textContent;
    let current_selected_tag = "";

    function filter_entries_by_tag(tag)
    {
        if (current_selected_tag == tag)
        {
            entries.forEach(entry=>
            {
                mark_all_entry_tag_as_inactive(entry);
                entry.style.display = ""
            });
            current_selected_tag = "";
            showing_title.textContent = original_showing_text;
            return;
        }

        function mark_entry_tag_as_active(entry, tag)
        {
            let tags = entry.getElementsByClassName('tag');
            for (let i = 0; i < tags.length; ++i)
            {
                tags[i].dataset.active = tags[i].dataset.tag == tag;
            }
        }

        function mark_all_entry_tag_as_inactive(entry)
        {
            let tags = entry.getElementsByClassName('tag');
            for (let i = 0; i < tags.length; ++i)
            {
                tags[i].dataset.active = false;
            }
        }

        console.log("CLick!", tag);
        entries.forEach(entry => {
            let tags = entry.dataset.tags.split(",");
            if (tags.includes(tag))
            {
                entry.style.display = "";
                mark_entry_tag_as_active(entry, tag);
            }
            else
            {
                entry.style.display = "none";
            }

            showing_title.textContent = "Showing carts with tag " + tag + ".";
            current_selected_tag = tag;
        });
    }

    entries.forEach(entry => {
        let tags = entry.getElementsByClassName('tag');
        let tagsAsList = [];
        for (let i = 0; i < tags.length; ++i)
        {
            tagsAsList.push(tags[i].dataset.tag);
            tags[i].addEventListener('click', (event) =>
            {
                filter_entries_by_tag(tags[i].dataset.tag);
                event.preventDefault();
            });
        }

        entry.dataset.tags = tagsAsList;
    });
});

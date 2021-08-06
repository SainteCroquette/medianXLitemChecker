// ==UserScript==
// @name NotArmory Item Checker dev+test
// @namespace
// @version 1.0
// @description NotArmory helper
// @author SainteCroquette
// @match https://tsw.vn.cz/char/*
// @match https://tsw.vn.cz/acc/char.php?name=*
// @icon https://www.google.com/s2/favicons?domain=vn.cz
// @grant none
// ==/UserScript==

const RAINBOW = ["#ff0000",
    "#f08100",
    "#bec600",
    "#4dff00",
    "#00d7d2",
    "#00d7d2",
    "#009eff",
    "#001bff",
    "#760dff",
    "#a800ff",
    "#d100ff",
    "#ff00ab",
    "#ff005a"]

const COLOR_CODES = [
    [100, "#4dff00"],
    [90, "#7fef00"],
    [80, "#9fde00"],
    [70, "#b7cd00"],
    [60, "#cbba00"],
    [50, "#dba600"],
    [40, "#e99100"],
    [30, "#f37900"],
    [20, "#fa5f00"],
    [10, "#fe4000"],
    [0, "#ff0000"]
]

function rainbow_string(str) {
    let time = Math.floor(Date.now() / 100)
    let colored = ""
    for (let i = 0; i < str.length; i++) {
        colored += "<span style=\"color:" + RAINBOW[(time + i) % RAINBOW.length] + ";\">" + str[i] + "</span>"
    }
    return colored
}

function findDiff(str1, str2) {
    let i = 0;
    let j = 0;
    let values = []

    while (i < str1.length) {
        if (str1[i] === '#') {
            values.push(parseInt(str2.substr(j, str2.length)))
            j += values[values.length - 1].toString().length - 1
        }
        ++i;
        ++j;
    }
    return values;
}

function get_percentage_color(p) {
    for (let i = 0; i < COLOR_CODES.length; i++) {
        if (p >= COLOR_CODES[i][0]) {
            return COLOR_CODES[i][1]
        }
    }
    return COLOR_CODES[COLOR_CODES.length - 1][1]
}

function calc_avg(array) {
    let total = 0
    array.forEach(elem => {
        total += elem
    })
    return total / array.length
}

function format_attribute_line(before, after, minMax, val) {
    let code = before + "<span style=\"color:grey;padding-left:5px;\">"
    for (let i = 0; i < minMax.length; i++) {
        code += "(" + minMax[i][0] + " - " + minMax[i][1] + ") - "
    }
    code += "</span><span style=\"color:"
        + get_percentage_color(val) + ";\">"
        + val.toFixed(0) + "%</span>"
        + after
    return code
}

function insert_ranges(html, attr, minMax, val, itemProperties) {
    if (!minMax || val === undefined)
        return html
    let idx = html.indexOf(attr) + attr.length
    let before = html.substring(0, idx)
    let after = html.substring(idx);
    let total = 0
    for (let i = 0; i < val.length; i++) {
        total += (val[i] - minMax[i][0]) / (minMax[i][1] - minMax[i][0]) * 100
    }
    const prop = total / val.length
    itemProperties.push(prop)
    return format_attribute_line(before, after, minMax, prop)
}

function get_item_table_container() {
    return document.getElementById("itemdump_wrapper")
}

function get_item_name(elem) {
    return elem.children[0].innerText.split(" (")[0].split(" [")[0]
}

function get_attribute_container(elem) {
    return elem.children[1].children[0].children[1].children[1]
}

function create_attribute_regex(ref) {
    let regex = ref
    regex = regex.replaceAll("+", "\\+")
    regex = regex.replaceAll("%", "\\%")
    regex = regex.replaceAll("(", "\\(")
    regex = regex.replaceAll(")", "\\)")
    regex = regex.replaceAll("#", "\\d+")
    regex = "\^\w*" + regex + "$"
    return regex
}

function iterate_item_attributes(refTable, name, attributes, container, itemProperties) {
    refTable[name].forEach(ref => {
        const reg = new RegExp(create_attribute_regex(ref[0]))
        attributes.forEach(att => {
            if (att.match(reg)) {
                container.innerHTML = insert_ranges(container.innerHTML, att, ref.slice(1), findDiff(ref[0], att), itemProperties)
            }
        })
    })
}

function get_main_table_item_name(elem) {
    return elem.children[0]
}

function get_item_viewer_title(elem) {
    return elem.children[1].children[0].children[1].children[0].children[0]
}

function format_item_total_value(avg, elem) {
    get_item_viewer_title(elem).innerHTML += " - <span style=\"color:" + get_percentage_color(avg) + ";\">" + avg + "%</span>"
    let table_item_name = get_main_table_item_name(elem)
    table_item_name.innerHTML += " - <span style=\"color:" + get_percentage_color(avg) + ";\">" + avg + "%</span>"
    if (avg >= 100) {
        setInterval(function () {
            table_item_name.innerHTML = rainbow_string(table_item_name.innerText);
        }, 100);
    }
}

function iterate_table_entries(nodes, refTable) {
    nodes.forEach(elem => {
        const name = get_item_name(elem)

        let itemProperties = []
        if (refTable[name]) {
            let attributesContainer = get_attribute_container(elem)
            let attributes = attributesContainer.innerText.split('\n')
            attributes = attributes.map(strings => strings.trim())
            iterate_item_attributes(refTable, name, attributes, attributesContainer, itemProperties)
        }
        if (itemProperties.length > 0) {
            let avg = calc_avg(itemProperties).toFixed(0)
            format_item_total_value(avg, elem)
        }
    })
}

(function () {
    'use strict';
    const sacred_unique_url = "https://raw.githubusercontent.com/SainteCroquette/medianXLitemChecker/main/sacred_unique.json"
    const set_url = "https://raw.githubusercontent.com/SainteCroquette/medianXLitemChecker/main/set.json"
    $.ajax({
        url: sacred_unique_url,
        success: (data) => {
            const su_items = JSON.parse(data)
            $.ajax({
                url: set_url,
                success: (data) => {
                    const set_items = JSON.parse(data)
                    const items = Object.assign({}, su_items, set_items)
                    const container = get_item_table_container()
                    const nodes = container.querySelectorAll(".item-inline")
                    iterate_table_entries(nodes, items)
                }
            })
        }
    })
})();
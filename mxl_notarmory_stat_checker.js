const RAINBOW = ["#ff0000", "#f08100","#bec600", "#4dff00", "#00d7d2", "#00d7d2", "#009eff", "#001bff", "#760dff", "#a800ff", "#d100ff", "#ff00ab", "#ff005a"]

function rainbow_string(str) {
    let time = Math.floor(Date.now() / 100)
    let colored = ""
    for (let i = 0; i < str.length; i++) {
        colored += "<span style=\"color:"+RAINBOW[(time + i) % RAINBOW.length]+ ";\">" + str[i] + "</span>"
    }
    return colored
}


function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function findDiff(str1, str2){
  let diff= "g";
  let i = 0;
  let j = 0;
    while (i < str1.length) {
        if (str1[i] == '#') {
            return parseInt(str2.substr(i, str2.length))
        }
        ++i;
        ++j;
    }
  return diff;
}

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

function color_result(p)
{
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

function insert_ranges(html, attr, minMax, val, arrayVal)
{
    if (!minMax)
        return html
    let idx = html.indexOf(attr) + attr.length
    let before = html.substring(0, idx)
    let after = html.substring(idx);
    let prop = (val - minMax[0]) / (minMax[1] - minMax[0]) * 100
    arrayVal.push(prop)
    return before +"<span style=\"color:grey;padding-left:5px;\">("+ minMax[0] + " - " + minMax[1] + ") - </span><span style=\"color:"+color_result(prop)+";\">" + prop.toFixed(0)+ "%</span>" + after
}

(function() {
    'use strict';
    const sacred_unique_url = "https://raw.githubusercontent.com/SainteCroquette/medianXLitemChecker/main/sacred_unique.json"
    const set_url = "https://raw.githubusercontent.com/SainteCroquette/medianXLitemChecker/main/set.json"
    fetch(sacred_unique_url)
        .then(response => response.text())
        .then((sacred_uniques) => {
        const su_items = JSON.parse(sacred_uniques)
        fetch(set_url)
        .then(response => response.text())
        .then((sets) => {
        const set_items = JSON.parse(sets)
        const items = Object.assign({}, su_items , set_items)
        const container = document.getElementById("itemdump_wrapper")
        const nodes = container.querySelectorAll(".item-inline")
        nodes.forEach(elem => {
            const name = elem.children[0].innerText.split(" (")[0].split(" [")[0]
            const attributes = elem.children[1].children[0].children[1].children[1]
            let itemProps = []
            if (items[name]) {
                let containerr = elem.children[1].children[0].children[1].children[1]
                let stats = elem.children[1].children[0].children[1].children[1].innerText.split('\n')
                stats = stats.map(strings => strings.trim())
                items[name].forEach(ref => {
                    let reAt = ref[0]
                    reAt = reAt.replace("+", "\\+")
                    reAt = reAt.replace("%", "\\%")
                    reAt = reAt.replace("#", "\\d+")
                    reAt = "\\w*" + reAt + "$"
                    const reg = new RegExp(reAt)
                    stats.forEach(att => {

                        if (att.match(reg)) {
                            containerr.innerHTML = insert_ranges(containerr.innerHTML, att, ref[1], findDiff(ref[0], att), itemProps)
                            }
                    })})
                }
            if (itemProps.length > 0) {
            let avg = calc_avg(itemProps).toFixed(0)
            elem.children[1].children[0].children[1].children[0].children[0].innerHTML += " - <span style=\"color:"+color_result(avg)+";\">" +avg + "%</span>"
            elem.children[0].innerHTML += " - <span style=\"color:"+color_result(avg)+";\">" +avg + "%</span>"
                if (avg >= 100) {
                setInterval(function(){ elem.children[0].innerHTML = rainbow_string( elem.children[0].innerText);}, 100);

            }
            }
        })
    }).catch((error)=>{
        console.error(error);
      })
        }).catch((error)=>{
        console.error(error);
      })
})();
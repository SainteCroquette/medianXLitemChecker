// ==UserScript==
// @name         relic scrapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.median-xl.com/doc/wiki/relics
// @icon         https://www.google.com/s2/favicons?domain=median-xl.com
// @grant        none
// ==/UserScript==

function find_skill(attributes) {
    let regex = new RegExp("\\+\\(\\d+ to \\d+\\) to")
    let skill = undefined
    attributes.forEach(line => {
        if (line.match(regex))
            skill = line.split("to ")[2]
    })
    return skill
}

function parse_relic(node) {
    let text_container = node.children[2]
    let attr = ""
    for (let i = 1; i < text_container.children.length; i++) {
        attr += text_container.children[i].innerText
    }
    let attributes = attr.split("\n")
    let skill = find_skill(attributes)
    console.log("COTW " + skill)

}

(function() {
    'use strict';

    const container = document.querySelector(".uniques").children[0]

    for (let i = 0; i < container.children.length; i++) {
        for (let j = 0; j < container.children[i].children.length; j++) {
            parse_relic(container.children[i].children[j])
        }
    }
    // Your code here...
})();
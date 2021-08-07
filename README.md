# NotArmory stat checker


This is a script meant to display possibles ranges of values for each attributes of predefined items.
It will then compute a score in percentage for each of the said attributes to give the item a rating from 0 to 100% (which will have a nice rainbow effect)
However as of now i cannot make the difference between base attributes and the potential bonus that could have been added, so some errors can show up, such as 300% rating

<img src="https://i.imgur.com/hdCEjFh.png" alt="rendre preview" width="700"/>


## Requirements

You need a browser that can run user scripts. Usually you just need to download a plugin such as the few below:
* [Violentmonkey](https://violentmonkey.github.io/get-it/)
* [Tampermonkey](https://www.tampermonkey.net/)


## Installation

Create a new user script:
example with Tampermonkey

<img src="https://i.imgur.com/uAiyp7G.png" alt="new user script" width="500"/>

Then paste this in it, and you're done !
(dont forget to save)

```js
// ==UserScript==
// @name NotArmory Item Checker
// @namespace
// @version 1.0
// @description NotArmory helper
// @author SainteCroquette
// @match https://tsw.vn.cz/char/*
// @match https://tsw.vn.cz/acc/char.php?name=*
// @icon https://www.google.com/s2/favicons?domain=vn.cz
// @grant none
// ==/UserScript==

'use strict';

$.ajax({
  url: 'https://raw.githubusercontent.com/SainteCroquette/medianXLitemChecker/main/mxl_notarmory_stat_checker.js',
  success: (data) => {
    eval(data);
  }
})
```

Just reload tsw.vs.cz & you're good to go !

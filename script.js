console.log("Time = Money")

const maybePluralize = (count, noun, suffix = 's') =>
    `${count} ${noun}${count !== 1 ? suffix : ''}`;

function round(value, digits) {
    return +value.toFixed(digits);
}

function convert(usdAmount, options) {
    var seconds = usdAmount / (options.usdPerHour / 60 / 60);

    if (seconds < 60) {
        return maybePluralize(round(seconds, 0), 'second');
    }

    var minutes = seconds / 60;
    if (minutes < 60) {
        return maybePluralize(round(minutes, 0), 'minute');
    }

    var hours = minutes / 60;
    if (hours < 30) {
        return maybePluralize(round(hours, 0), 'hour');
    }

    var days = hours / options.hoursPerDay;
    if (days < Math.max(7, Math.min(100, options.daysPerMonth * 2))) {
        return maybePluralize(round(days, 1), 'day');
    }

    var months = days / options.daysPerMonth;
    if (months < 24) {
        return maybePluralize(round(months, 2), 'month');
    }

    var years = months / 12;
    return maybePluralize(round(years, 2), 'year');
}

var cached_options = null;

function replacePrices(el, options) {
    var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    while (n = walk.nextNode()) {
        forEveryNode(n);
    }
}

get_options(function (options) {
    console.log("loaded options")
    cached_options = options;

    if (document.readyState === 'complete') {
        console.log("already complete");
        replacePrices(document, options);
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            console.log("DOMContentLoaded");
            // initial HTML document has been completely loaded and parsed
            replacePrices(document, options);
            //....
        })
        document.onreadystatechange = function () {
            if (document.readyState === 'complete') {
                console.log("readyState", document.readyState);
                replacePrices(document, options);
            }
        }
    }
});

function convertString(s, multiplier, options) {
    //If there are commas, get rid of them
    s = s.replace(/,/g, '');
    var result = convert(parseFloat(s) * multiplier, options);

    console.log("Replace ", s, " * ", multiplier, " -> ", result)
    return result;
}

function replaceUsd(s, options) {
    s = s.replace(/\$([\d,]+(?:\.\d+)?)/g,
        function (string, c1) {
            return convertString(c1, 1, options)
        });

    s = s.replace(/([\d,]+(?:\.\d+)?)\s*¢/g,
        function (string, c1) {
            return convertString(c1, 0.01, options)
        });

    return s;
}

var textnode_backlog = [];

// https://stackoverflow.com/a/19630050
// Modify the content somehow...
var forEveryNode = function (node) {
    var parent = null;
    if (node.parentNode) {
        parent = node.parentNode.nodeName.toLowerCase();
    }
    if (node.nodeName.toLowerCase() == "#text"
        && parent != 'script'
        && parent != 'style') {
        if (cached_options) {
            var new_value = replaceUsd(node.data, cached_options);
            // Don't trigger mutation if we don't change the data.
            if (node.data != new_value) {
                node.data = new_value;
            }
        }
    }
}

// TODO: handle replacing prices made of multiple text or even block elements.

function observe(el) {
    // Create a MutationObserver to handle events
    // (e.g. filtering TextNode elements)
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == 'characterData') {
                if (mutation.oldValue != mutation.target.data) {
                    forEveryNode(mutation.target);
                }
            }
            if (mutation.addedNodes) {
                [].slice.call(mutation.addedNodes).forEach(function (node) {
                    forEveryNode(node);
                });
            }
            if (mutation.type == 'childList') {
                if (document.readyState === 'complete' && cached_options) {
                    replacePrices(mutation.target, cached_options);

                }
            }
        });
    });

    // Start observing "childList" events in document and its descendants
    observer.observe(el, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
        characterDataOldValue: true,
    });
}

observe(document);




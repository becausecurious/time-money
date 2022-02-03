console.log("Time = Money")

// TODO: check why this breaks run code snippet on https://stackoverflow.com/questions/1480588/input-size-vs-width

// TODO: replace sooner - https://stackoverflow.com/questions/19625502/chrome-extension-to-replace-text-in-web-pages-and-facebook-posts-before-text-i.

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

function convertString(s, multiplier, options) {
    //If there are commas, get rid of them
    s = s.replace(/,/g, '');
    var result = convert(parseFloat(s) * multiplier, options);

    console.log("Replace ", s, " -> ", result)
    return result;
}

function replacePrices(options) {

    var pageText = document.body.innerHTML;

    // TODO: handle cents https://www.walmart.com/
    document.body.innerHTML = pageText.replace(/\$([\d,]+(?:\.\d+)?)/g,
        function (string, c1) {
            return convertString(c1, 1, options)
        });

    var pageText = document.body.innerHTML;

    document.body.innerHTML = pageText.replace(/([\d,]+(?:\.\d+)?)\s*¢/g,
        function (string, c1) {
            return convertString(c1, 0.01, options)
        });
}

get_options(function (options) {
    if (document.readyState !== 'loading') {
        replacePrices(options);
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            // initial HTML document has been completely loaded and parsed
            replacePrices(options);
            //....
        });
    }

});

/**
 * Created by jason on 10/1/14.
 */
Handlebars.registerHelper("formatMoney", function(value, decPlaces, thouSeparator, decSeparator) {
    if ( typeof(value) === "undefined" )  {
        return 0
    } else {
        var n = value,
            decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 0 : decPlaces,
            decSeparator = decSeparator == undefined ? "." : decSeparator,
            thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
            sign = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
    }
});

Handlebars.registerHelper("isBlank", function(value) {
    if ( typeof(value) === "undefined" )  {
        return 0
    } else {
        return value;
    }
});

Handlebars.registerHelper("toLocaleString", function(value, dec) {
    if ( typeof(value) === "undefined" )  {
        return 0
    } else {
        var d = parseInt(dec);
        if ( typeof(d) !== "number" ) {
            dec = 0;
        }
        var t = parseFloat(value);
        t = t.toFixed(dec);
        //t = parseFloat(t);
        t = FF.Format.numberWithCommas(t);
        return t;
    }
});

Handlebars.registerHelper("waterOnly", function(water_only) {
    return ( water_only === "1" || water_only === 1 );
});

Handlebars.registerHelper('dateFormat', function(context, block) {
    console.log(context);
    var d = new Date(context);
    console.log(d);
    if (window.moment) {
        var f = block.hash.format || "MMM Do, YYYY";

        return moment(d).format(f);
    }else{
        return context;   //  moment plugin not available. return data as is.
    };
});

Handlebars.registerHelper('statusFormat', function(statusCode, machineStatus, format) {
    if (format == 'color') {
        if (machineStatus == 'offline') {
            return 'grey';
        } else {
            if (statusCode > 0) {
                return 'green';
            } else if (statusCode == 0) {
                return 'yellow';
            } else if (statusCode < 0 ) {
                return 'red';
            } else {
                return 'red';
            }
        }

    } else if (format == 'code') {
        if (statusCode > 0) {
            return 'OK';
        } else if (statusCode == 0) {
            return 'idle';
        } else if (statusCode < 0 ) {
            return 'fault';
        } else {
            return 'fault';
        }
    } else {
        return statusCode;
    }
});

Handlebars.registerHelper('runTimeFormat', function(seconds) {

    seconds = Math.round(seconds);

    var hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    var minutes = Math.floor(seconds / 60);
    var seconds = seconds - minutes * 60;

    var time = "";
    if (hours > 0) {
        time = hours.toString() + ":" + minutes.toString() + ":" + pad(seconds.toString(),2);
    } else {
        time = minutes.toString() + ":" + FF.Format.pad(seconds.toString(),2);
    }
    return time;
});

Handlebars.registerHelper('round', function(number, decimalPlaces) {
    return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10,decimalPlaces);
})

Handlebars.registerHelper('formatDelta', function(numerator, denominator) {

    var value = Handlebars.helpers.deltaValue(numerator, denominator);
    if ( value === '-'  ) {
        return 'delta-none';
    } else if ( value > 0 ) {
        return 'delta-down';
    } else if ( value < 0 ) {
        return 'delta-up';
    } else {
        return 'delta-none'
    }
})

Handlebars.registerHelper('formatDeltaValue', function(numerator, denominator) {
    var value = Handlebars.helpers.deltaValue(numerator, denominator);
    if (value === '-') {
        value = '';
    } else {
        value = value.toString() + ' %';
    }
    return value;
})

Handlebars.registerHelper('deltaValue', function(numerator, denominator) {
    numerator = parseInt(numerator, 10);
    denominator = parseInt(denominator, 10);

    var delta = 0;
    // BUG - Divide by zero throws NaN

    // Divide by 0
    if ( denominator === 0 ) {
        if ( numerator === 0 ) {
            delta = '-';
        } else {
            delta = 100;
        }
    } else {
        delta = parseInt(((denominator - numerator) / denominator) * 100);
    }
    return delta;
})
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
        return FF.Format.toLocaleString(value,dec);

    }
});

Handlebars.registerHelper("waterOnly", function(water_only) {
    return ( water_only === "1" || water_only === 1 );
});

Handlebars.registerHelper('dateFormat', function(context, block) {
    console.log(context);
    var d = new Date(context);
    console.log(d);
    //TODO this is where date format goes @jason
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
    if ( value === '-' || value === 0  ) {
        return 'delta-none';
    } else if ( value > 0 ) {
        return 'delta-down';
    } else if ( value < 0 ) {
        return 'delta-up';
    } else {
        return 'delta-none'
    }
})

Handlebars.registerHelper('formatDeltaValue', function(value) {
    if ( typeof value == "undefined" ) {
        return 'No Readings';
    } else {
        if (value === '-') {
            value = '';
        } else {
            value = value.toString() + ' %';
        }
        return value;
    }
})

Handlebars.registerHelper('digits', function(cycles) {
    //TODO Why would cycles come in as null
    if (typeof(cycles) != "undefined" && cycles !==null) {
        console.log(cycles);
        return 'digits-' + cycles.toString().length;
    } else {
        return '';
    }
});
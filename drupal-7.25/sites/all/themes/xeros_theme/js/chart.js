//// Constants
var KPI_COST = "KPI_COST",
    KPI_COLD = "KPI_COLD",
    KPI_HOT = "KPI_HOT",
    KPI_TIME = "KPI_TIME",
    KPI_CHEMICAL = "KPI_CHEMICAL";


//// Defined Chart types
//var CHART_KPI = "CHART_KPI",
//    CHART_BAR_H = "CHART_BAR_H",
//    CHART_DONUT = "CHART_DONUT";

var kpiChart = function(kpiType) {

    var data = getData(kpiType);

//    sets up the page
    var margin = {top: 1, right: 10, bottom: 16, left: 26},
        width = 316 - margin.left - margin.right,
        height = 130 - margin.top - margin.bottom;

    var chartMargins = [4, 50, 18, 16];
    var axisMargins = [4, 20, 0, 0];

//    // sets up the page
//    var width = 292,
//        height = 130;

////    converts date string to date object
//    var parseDate = d3.time.format("%x").parse;

//    translate the actual x data into the pixel space of the DOM
    var x = d3.time.scale()
        .range([0, width]);

// translate the actual y data into the pixel space of the DOM
    var y = d3.scale.linear()
        .range([height, 0]);

// setup the x-axis notation
    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(d3.time.months, 2)
        .tickFormat(d3.time.format("%b"))
        .tickSize(0)
        .orient("bottom");


//    .ticks(d3.time.days, 1)

        // use this based on chart date range
//    .tickFormat(d3.time.format('%a %d'))

// setup the y-axis notation
    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(-width)
        .ticks(8)
        .orient("left");

// create the individual points for the line
    var lineA = d3.svg.line()
        .x(function (d) {
            return x(d[0]);// date
        })
        .y(function (d) {
            return y(d[1]); // value 1
        });

    var lineB = d3.svg.line()
        .x(function (d) {
            return x(d[0]);// date
        })
        .y(function (d) {
            return y(d[2]); // value 1
        });

// adds SVG element to DOM, positioning properly
    var svg = d3.selectAll(".kpis .kpi-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// find the extent (min / max) of the values
    x.domain(d3.extent(data, function (d) {
        return d[0]; // date
    }));
//    y.domain(d3.extent(data, function (d) {
//        return d[1]; // value 1
//    }));
//    y.domain([0,800]);
    var extentA = d3.extent(data, function (d) {
        return d[1]; // value 1
    });
    var extentB = d3.extent(data, function (d) {
        return d[2]; // value 2
    });
    y.domain([d3.min([extentA[0], extentB[0]]), d3.max([extentA[1], extentB[1]])])

// append the notation for x-axis to the DOM and position
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

// append the notation for y-axis to the DOM and position
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
//        .append("text")
//        .attr("transform", "rotate(-90)")
//        .attr("y", 6)
//        .attr("dy", ".71em")
//        .style("text-anchor", "end")
//        .text("Price ($)");

// append the line itself
    svg.append("path")
        .datum(data)
        .attr("class", "line-a")
        .attr("d", lineA);

    svg.append("path")
        .datum(data)
        .attr("class", "line-b")
        .attr("d", lineB);

};


function getData(kpiType) {

    var data = dummyData();
    switch (kpiType) {
        case KPI_COST:
            data = data.slice(0,30);
            break;
        case KPI_COLD:
            data = data.slice(30,60);
            break;
        case KPI_HOT:
            data = data.slice(0,180);
            break;
        case KPI_TIME:
            data = data.slice(180);
            break;
        case KPI_CHEMICAL:
            data = data;
            break;

    }




}

function dummyData() {
    var dataA = [
        {"date": "3/12/12", "value": "543.97"},
        {"date": "3/13/12", "value": "559.84"},
        {"date": "3/14/12", "value": "581"},
        {"date": "3/15/12", "value": "577.04"},
        {"date": "3/16/12", "value": "577.05"},
        {"date": "3/19/12", "value": "592.36"},
        {"date": "3/20/12", "value": "597.15"},
        {"date": "3/21/12", "value": "593.74"},
        {"date": "3/22/12", "value": "590.62"},
        {"date": "3/23/12", "value": "587.38"},
        {"date": "3/26/12", "value": "598.15"},
        {"date": "3/27/12", "value": "605.54"},
        {"date": "3/28/12", "value": "608.64"},
        {"date": "3/29/12", "value": "600.99"},
        {"date": "3/30/12", "value": "590.83"},
        {"date": "4/2/12", "value": "609.63"},
        {"date": "4/3/12", "value": "620.17"},
        {"date": "4/4/12", "value": "615.23"},
        {"date": "4/5/12", "value": "624.46"},
        {"date": "4/9/12", "value": "626.98"},
        {"date": "4/10/12", "value": "619.3"},
        {"date": "4/11/12", "value": "617.09"},
        {"date": "4/12/12", "value": "613.71"},
        {"date": "4/13/12", "value": "596.43"},
        {"date": "4/16/12", "value": "571.69"},
        {"date": "4/17/12", "value": "600.83"},
        {"date": "4/18/12", "value": "599.49"},
        {"date": "4/19/12", "value": "578.9"},
        {"date": "4/20/12", "value": "564.65"},
        {"date": "4/23/12", "value": "563.38"},
        {"date": "4/24/12", "value": "552.13"},
        {"date": "4/25/12", "value": "601.13"},
        {"date": "4/26/12", "value": "598.86"},
        {"date": "4/27/12", "value": "594.23"},
        {"date": "4/30/12", "value": "575.49"},
        {"date": "5/1/12", "value": "573.66"},
        {"date": "5/2/12", "value": "577.46"},
        {"date": "5/3/12", "value": "573.36"},
        {"date": "5/4/12", "value": "557.03"},
        {"date": "5/7/12", "value": "561.2"},
        {"date": "5/8/12", "value": "559.92"},
        {"date": "5/9/12", "value": "560.9"},
        {"date": "5/10/12", "value": "562.22"},
        {"date": "5/11/12", "value": "558.47"},
        {"date": "5/14/12", "value": "550.1"},
        {"date": "5/15/12", "value": "545.12"},
        {"date": "5/16/12", "value": "538.14"},
        {"date": "5/17/12", "value": "522.41"},
        {"date": "5/18/12", "value": "522.67"},
        {"date": "5/21/12", "value": "553.12"},
        {"date": "5/22/12", "value": "548.87"},
        {"date": "5/23/12", "value": "562.26"},
        {"date": "5/24/12", "value": "557.1"},
        {"date": "5/25/12", "value": "554.11"},
        {"date": "5/29/12", "value": "563.95"},
        {"date": "5/30/12", "value": "570.75"},
        {"date": "5/31/12", "value": "569.33"},
        {"date": "6/1/12", "value": "552.83"},
        {"date": "6/4/12", "value": "556.08"},
        {"date": "6/5/12", "value": "554.64"},
        {"date": "6/6/12", "value": "563.15"},
        {"date": "6/7/12", "value": "563.4"},
        {"date": "6/8/12", "value": "571.88"},
        {"date": "6/11/12", "value": "562.86"},
        {"date": "6/12/12", "value": "567.78"},
        {"date": "6/13/12", "value": "563.84"},
        {"date": "6/14/12", "value": "563.22"},
        {"date": "6/15/12", "value": "565.78"},
        {"date": "6/18/12", "value": "577.26"},
        {"date": "6/19/12", "value": "578.87"},
        {"date": "6/20/12", "value": "577.22"},
        {"date": "6/21/12", "value": "569.27"},
        {"date": "6/22/12", "value": "573.63"},
        {"date": "6/25/12", "value": "562.47"},
        {"date": "6/26/12", "value": "563.71"},
        {"date": "6/27/12", "value": "566.14"},
        {"date": "6/28/12", "value": "560.77"},
        {"date": "6/29/12", "value": "575.51"},
        {"date": "7/2/12", "value": "583.9"},
        {"date": "7/3/12", "value": "590.69"},
        {"date": "7/5/12", "value": "601.07"},
        {"date": "7/6/12", "value": "597.07"},
        {"date": "7/9/12", "value": "604.96"},
        {"date": "7/10/12", "value": "599.36"},
        {"date": "7/11/12", "value": "595.64"},
        {"date": "7/12/12", "value": "590.19"},
        {"date": "7/13/12", "value": "596.17"},
        {"date": "7/16/12", "value": "598.08"},
        {"date": "7/17/12", "value": "598.11"},
        {"date": "7/18/12", "value": "597.44"},
        {"date": "7/19/12", "value": "605.38"},
        {"date": "7/20/12", "value": "595.51"},
        {"date": "7/23/12", "value": "595.05"},
        {"date": "7/24/12", "value": "592.18"},
        {"date": "7/25/12", "value": "566.61"},
        {"date": "7/26/12", "value": "566.52"},
        {"date": "7/27/12", "value": "576.65"},
        {"date": "7/30/12", "value": "586.37"},
        {"date": "7/31/12", "value": "601.88"},
        {"date": "8/1/12", "value": "597.98"},
        {"date": "8/2/12", "value": "598.95"},
        {"date": "8/3/12", "value": "606.74"},
        {"date": "8/6/12", "value": "613.49"},
        {"date": "8/7/12", "value": "611.88"},
        {"date": "8/8/12", "value": "610.84"},
        {"date": "8/9/12", "value": "614.33"},
        {"date": "8/10/12", "value": "615.29"},
        {"date": "8/13/12", "value": "623.5"},
        {"date": "8/14/12", "value": "625.17"},
        {"date": "8/15/12", "value": "624.32"},
        {"date": "8/16/12", "value": "629.78"},
        {"date": "8/17/12", "value": "641.43"},
        {"date": "8/20/12", "value": "658.29"},
        {"date": "8/21/12", "value": "649.29"},
        {"date": "8/22/12", "value": "661.97"},
        {"date": "8/23/12", "value": "655.8"},
        {"date": "8/24/12", "value": "656.38"},
        {"date": "8/27/12", "value": "668.71"},
        {"date": "8/28/12", "value": "667.84"},
        {"date": "8/29/12", "value": "666.52"},
        {"date": "8/30/12", "value": "657.02"},
        {"date": "8/31/12", "value": "658.38"},
        {"date": "9/4/12", "value": "668.01"},
        {"date": "9/5/12", "value": "663.32"},
        {"date": "9/6/12", "value": "669.29"},
        {"date": "9/7/12", "value": "673.42"},
        {"date": "9/10/12", "value": "655.9"},
        {"date": "9/11/12", "value": "653.78"},
        {"date": "9/12/12", "value": "662.88"},
        {"date": "9/13/12", "value": "675.94"},
        {"date": "9/14/12", "value": "684.15"},
        {"date": "9/17/12", "value": "692.56"},
        {"date": "9/18/12", "value": "694.67"},
        {"date": "9/19/12", "value": "694.86"},
        {"date": "9/20/12", "value": "691.49"},
        {"date": "9/21/12", "value": "692.87"},
        {"date": "9/24/12", "value": "683.66"},
        {"date": "9/25/12", "value": "666.59"},
        {"date": "9/26/12", "value": "658.32"},
        {"date": "9/27/12", "value": "674.29"},
        {"date": "9/28/12", "value": "660.22"},
        {"date": "10/1/12", "value": "652.59"},
        {"date": "10/2/12", "value": "654.49"},
        {"date": "10/3/12", "value": "664.52"},
        {"date": "10/4/12", "value": "659.92"},
        {"date": "10/5/12", "value": "645.86"},
        {"date": "10/8/12", "value": "631.59"},
        {"date": "10/9/12", "value": "629.29"},
        {"date": "10/10/12", "value": "634.3"},
        {"date": "10/11/12", "value": "621.62"},
        {"date": "10/12/12", "value": "623.21"},
        {"date": "10/15/12", "value": "628.21"},
        {"date": "10/16/12", "value": "643.09"},
        {"date": "10/17/12", "value": "637.96"},
        {"date": "10/18/12", "value": "626.11"},
        {"date": "10/19/12", "value": "603.55"},
        {"date": "10/22/12", "value": "627.49"},
        {"date": "10/23/12", "value": "607.03"},
        {"date": "10/24/12", "value": "610.47"},
        {"date": "10/25/12", "value": "603.25"},
        {"date": "10/26/12", "value": "597.77"},
        {"date": "10/31/12", "value": "589.18"},
        {"date": "11/1/12", "value": "590.39"},
        {"date": "11/2/12", "value": "570.85"},
        {"date": "11/5/12", "value": "578.59"},
        {"date": "11/6/12", "value": "576.84"},
        {"date": "11/7/12", "value": "554.77"},
        {"date": "11/8/12", "value": "534.63"},
        {"date": "11/9/12", "value": "543.89"},
        {"date": "11/12/12", "value": "539.68"},
        {"date": "11/13/12", "value": "539.75"},
        {"date": "11/14/12", "value": "533.77"},
        {"date": "11/15/12", "value": "522.57"},
        {"date": "11/16/12", "value": "524.62"},
        {"date": "11/19/12", "value": "562.45"},
        {"date": "11/20/12", "value": "557.66"},
        {"date": "11/21/12", "value": "558.45"},
        {"date": "11/23/12", "value": "568.19"},
        {"date": "11/26/12", "value": "586.11"},
        {"date": "11/27/12", "value": "581.39"},
        {"date": "11/28/12", "value": "579.56"},
        {"date": "11/29/12", "value": "585.95"},
        {"date": "11/30/12", "value": "581.89"},
        {"date": "12/3/12", "value": "582.79"},
        {"date": "12/4/12", "value": "572.51"},
        {"date": "12/5/12", "value": "535.67"},
        {"date": "12/6/12", "value": "544.07"},
        {"date": "12/7/12", "value": "530.16"},
        {"date": "12/10/12", "value": "526.75"},
        {"date": "12/11/12", "value": "538.25"},
        {"date": "12/12/12", "value": "535.88"},
        {"date": "12/13/12", "value": "526.62"},
        {"date": "12/14/12", "value": "506.84"},
        {"date": "12/17/12", "value": "515.82"},
        {"date": "12/18/12", "value": "530.81"},
        {"date": "12/19/12", "value": "523.26"},
        {"date": "12/20/12", "value": "518.71"},
        {"date": "12/21/12", "value": "516.32"},
        {"date": "12/24/12", "value": "517.16"},
        {"date": "12/26/12", "value": "510.03"},
        {"date": "12/27/12", "value": "512.08"},
        {"date": "12/28/12", "value": "506.64"},
        {"date": "12/31/12", "value": "529.09"},
        {"date": "1/2/13", "value": "545.85"},
        {"date": "1/3/13", "value": "538.96"},
        {"date": "1/4/13", "value": "523.95"},
        {"date": "1/7/13", "value": "520.86"},
        {"date": "1/8/13", "value": "522.27"},
        {"date": "1/9/13", "value": "514.1"},
        {"date": "1/10/13", "value": "520.48"},
        {"date": "1/11/13", "value": "517.29"},
        {"date": "1/14/13", "value": "498.84"},
        {"date": "1/15/13", "value": "483.1"},
        {"date": "1/16/13", "value": "503.16"},
        {"date": "1/17/13", "value": "499.77"},
        {"date": "1/18/13", "value": "497.1"},
        {"date": "1/22/13", "value": "501.85"},
        {"date": "1/23/13", "value": "511.03"},
        {"date": "1/24/13", "value": "447.89"},
        {"date": "1/25/13", "value": "437.33"},
        {"date": "1/28/13", "value": "447.22"},
        {"date": "1/29/13", "value": "455.61"},
        {"date": "1/30/13", "value": "454.18"},
        {"date": "1/31/13", "value": "452.85"},
        {"date": "2/1/13", "value": "450.99"},
        {"date": "2/4/13", "value": "439.76"},
        {"date": "2/5/13", "value": "455.19"},
        {"date": "2/6/13", "value": "454.7"},
        {"date": "2/7/13", "value": "468.22"},
        {"date": "2/8/13", "value": "474.98"},
        {"date": "2/11/13", "value": "479.93"},
        {"date": "2/12/13", "value": "467.9"},
        {"date": "2/13/13", "value": "467.01"},
        {"date": "2/14/13", "value": "466.59"},
        {"date": "2/15/13", "value": "460.16"},
        {"date": "2/19/13", "value": "459.99"},
        {"date": "2/20/13", "value": "448.85"},
        {"date": "2/21/13", "value": "446.06"},
        {"date": "2/22/13", "value": "450.81"},
        {"date": "2/25/13", "value": "442.8"},
        {"date": "2/26/13", "value": "448.97"},
        {"date": "2/27/13", "value": "444.57"},
        {"date": "2/28/13", "value": "441.4"},
        {"date": "3/1/13", "value": "430.47"},
        {"date": "3/4/13", "value": "420.05"},
        {"date": "3/5/13", "value": "431.14"},
        {"date": "3/6/13", "value": "425.66"},
        {"date": "3/7/13", "value": "430.58"},
        {"date": "3/8/13", "value": "431.72"},
        {"date": "3/11/13", "value": "437.87"}
    ];
    var dataB = [
        {"date": "3/12/12", "value": "605.15"},
        {"date": "3/13/12", "value": "617.78"},
        {"date": "3/14/12", "value": "615.99"},
        {"date": "3/15/12", "value": "621.13"},
        {"date": "3/16/12", "value": "625.04"},
        {"date": "3/19/12", "value": "633.98"},
        {"date": "3/20/12", "value": "633.49"},
        {"date": "3/21/12", "value": "639.98"},
        {"date": "3/22/12", "value": "646.05"},
        {"date": "3/23/12", "value": "642.59"},
        {"date": "3/26/12", "value": "649.33"},
        {"date": "3/27/12", "value": "647.02"},
        {"date": "3/28/12", "value": "655.76"},
        {"date": "3/29/12", "value": "648.41"},
        {"date": "3/30/12", "value": "641.24"},
        {"date": "4/2/12", "value": "646.92"},
        {"date": "4/3/12", "value": "642.62"},
        {"date": "4/4/12", "value": "635.15"},
        {"date": "4/5/12", "value": "632.32"},
        {"date": "4/9/12", "value": "630.84"},
        {"date": "4/10/12", "value": "626.86"},
        {"date": "4/11/12", "value": "635.96"},
        {"date": "4/12/12", "value": "651.01"},
        {"date": "4/13/12", "value": "624.6"},
        {"date": "4/16/12", "value": "606.07"},
        {"date": "4/17/12", "value": "609.57"},
        {"date": "4/18/12", "value": "607.45"},
        {"date": "4/19/12", "value": "599.3"},
        {"date": "4/20/12", "value": "596.06"},
        {"date": "4/23/12", "value": "597.6"},
        {"date": "4/24/12", "value": "601.27"},
        {"date": "4/25/12", "value": "609.72"},
        {"date": "4/26/12", "value": "615.47"},
        {"date": "4/27/12", "value": "614.98"},
        {"date": "4/30/12", "value": "604.85"},
        {"date": "5/1/12", "value": "604.43"},
        {"date": "5/2/12", "value": "607.26"},
        {"date": "5/3/12", "value": "611.02"},
        {"date": "5/4/12", "value": "596.97"},
        {"date": "5/7/12", "value": "607.55"},
        {"date": "5/8/12", "value": "612.79"},
        {"date": "5/9/12", "value": "609.15"},
        {"date": "5/10/12", "value": "613.66"},
        {"date": "5/11/12", "value": "605.23"},
        {"date": "5/14/12", "value": "604"},
        {"date": "5/15/12", "value": "611.11"},
        {"date": "5/16/12", "value": "628.93"},
        {"date": "5/17/12", "value": "623.05"},
        {"date": "5/18/12", "value": "600.4"},
        {"date": "5/21/12", "value": "614.11"},
        {"date": "5/22/12", "value": "600.8"},
        {"date": "5/23/12", "value": "609.46"},
        {"date": "5/24/12", "value": "603.66"},
        {"date": "5/25/12", "value": "591.53"},
        {"date": "5/29/12", "value": "594.34"},
        {"date": "5/30/12", "value": "588.23"},
        {"date": "5/31/12", "value": "580.86"},
        {"date": "6/1/12", "value": "570.98"},
        {"date": "6/4/12", "value": "578.59"},
        {"date": "6/5/12", "value": "570.41"},
        {"date": "6/6/12", "value": "580.57"},
        {"date": "6/7/12", "value": "578.23"},
        {"date": "6/8/12", "value": "580.45"},
        {"date": "6/11/12", "value": "568.5"},
        {"date": "6/12/12", "value": "565.1"},
        {"date": "6/13/12", "value": "561.09"},
        {"date": "6/14/12", "value": "559.05"},
        {"date": "6/15/12", "value": "564.51"},
        {"date": "6/18/12", "value": "570.85"},
        {"date": "6/19/12", "value": "581.53"},
        {"date": "6/20/12", "value": "577.51"},
        {"date": "6/21/12", "value": "565.21"},
        {"date": "6/22/12", "value": "571.48"},
        {"date": "6/25/12", "value": "560.7"},
        {"date": "6/26/12", "value": "564.68"},
        {"date": "6/27/12", "value": "569.3"},
        {"date": "6/28/12", "value": "564.31"},
        {"date": "6/29/12", "value": "580.07"},
        {"date": "7/2/12", "value": "580.47"},
        {"date": "7/3/12", "value": "587.83"},
        {"date": "7/5/12", "value": "595.92"},
        {"date": "7/6/12", "value": "585.98"},
        {"date": "7/9/12", "value": "586.01"},
        {"date": "7/10/12", "value": "581.7"},
        {"date": "7/11/12", "value": "571.19"},
        {"date": "7/12/12", "value": "570.48"},
        {"date": "7/13/12", "value": "576.52"},
        {"date": "7/16/12", "value": "574.92"},
        {"date": "7/17/12", "value": "576.73"},
        {"date": "7/18/12", "value": "580.76"},
        {"date": "7/19/12", "value": "593.06"},
        {"date": "7/20/12", "value": "610.82"},
        {"date": "7/23/12", "value": "615.51"},
        {"date": "7/24/12", "value": "607.57"},
        {"date": "7/25/12", "value": "607.99"},
        {"date": "7/26/12", "value": "613.36"},
        {"date": "7/27/12", "value": "634.96"},
        {"date": "7/30/12", "value": "632.3"},
        {"date": "7/31/12", "value": "632.97"},
        {"date": "8/1/12", "value": "632.68"},
        {"date": "8/2/12", "value": "628.75"},
        {"date": "8/3/12", "value": "641.33"},
        {"date": "8/6/12", "value": "642.82"},
        {"date": "8/7/12", "value": "640.54"},
        {"date": "8/8/12", "value": "642.23"},
        {"date": "8/9/12", "value": "642.35"},
        {"date": "8/10/12", "value": "642"},
        {"date": "8/13/12", "value": "660.01"},
        {"date": "8/14/12", "value": "668.66"},
        {"date": "8/15/12", "value": "667.54"},
        {"date": "8/16/12", "value": "672.87"},
        {"date": "8/17/12", "value": "677.14"},
        {"date": "8/20/12", "value": "675.54"},
        {"date": "8/21/12", "value": "669.51"},
        {"date": "8/22/12", "value": "677.18"},
        {"date": "8/23/12", "value": "676.8"},
        {"date": "8/24/12", "value": "678.63"},
        {"date": "8/27/12", "value": "669.22"},
        {"date": "8/28/12", "value": "677.25"},
        {"date": "8/29/12", "value": "688.01"},
        {"date": "8/30/12", "value": "681.68"},
        {"date": "8/31/12", "value": "685.09"},
        {"date": "9/4/12", "value": "681.04"},
        {"date": "9/5/12", "value": "680.72"},
        {"date": "9/6/12", "value": "699.4"},
        {"date": "9/7/12", "value": "706.15"},
        {"date": "9/10/12", "value": "700.77"},
        {"date": "9/11/12", "value": "692.19"},
        {"date": "9/12/12", "value": "690.88"},
        {"date": "9/13/12", "value": "706.04"},
        {"date": "9/14/12", "value": "709.68"},
        {"date": "9/17/12", "value": "709.98"},
        {"date": "9/18/12", "value": "718.28"},
        {"date": "9/19/12", "value": "727.5"},
        {"date": "9/20/12", "value": "728.12"},
        {"date": "9/21/12", "value": "733.99"},
        {"date": "9/24/12", "value": "749.38"},
        {"date": "9/25/12", "value": "749.16"},
        {"date": "9/26/12", "value": "753.46"},
        {"date": "9/27/12", "value": "756.5"},
        {"date": "9/28/12", "value": "754.5"},
        {"date": "10/1/12", "value": "761.78"},
        {"date": "10/2/12", "value": "756.99"},
        {"date": "10/3/12", "value": "762.5"},
        {"date": "10/4/12", "value": "768.05"},
        {"date": "10/5/12", "value": "767.65"},
        {"date": "10/8/12", "value": "757.84"},
        {"date": "10/9/12", "value": "744.09"},
        {"date": "10/10/12", "value": "744.56"},
        {"date": "10/11/12", "value": "751.48"},
        {"date": "10/12/12", "value": "744.75"},
        {"date": "10/15/12", "value": "740.98"},
        {"date": "10/16/12", "value": "744.7"},
        {"date": "10/17/12", "value": "755.49"},
        {"date": "10/18/12", "value": "695"},
        {"date": "10/19/12", "value": "681.79"},
        {"date": "10/22/12", "value": "678.67"},
        {"date": "10/23/12", "value": "680.35"},
        {"date": "10/24/12", "value": "677.3"},
        {"date": "10/25/12", "value": "677.76"},
        {"date": "10/26/12", "value": "675.15"},
        {"date": "10/31/12", "value": "680.3"},
        {"date": "11/1/12", "value": "687.59"},
        {"date": "11/2/12", "value": "687.92"},
        {"date": "11/5/12", "value": "682.96"},
        {"date": "11/6/12", "value": "681.72"},
        {"date": "11/7/12", "value": "667.12"},
        {"date": "11/8/12", "value": "652.29"},
        {"date": "11/9/12", "value": "663.03"},
        {"date": "11/12/12", "value": "665.9"},
        {"date": "11/13/12", "value": "659.05"},
        {"date": "11/14/12", "value": "652.55"},
        {"date": "11/15/12", "value": "647.26"},
        {"date": "11/16/12", "value": "647.18"},
        {"date": "11/19/12", "value": "668.21"},
        {"date": "11/20/12", "value": "669.97"},
        {"date": "11/21/12", "value": "665.87"},
        {"date": "11/23/12", "value": "667.97"},
        {"date": "11/26/12", "value": "661.15"},
        {"date": "11/27/12", "value": "670.71"},
        {"date": "11/28/12", "value": "683.67"},
        {"date": "11/29/12", "value": "691.89"},
        {"date": "11/30/12", "value": "698.37"},
        {"date": "12/3/12", "value": "695.25"},
        {"date": "12/4/12", "value": "691.03"},
        {"date": "12/5/12", "value": "687.82"},
        {"date": "12/6/12", "value": "691.13"},
        {"date": "12/7/12", "value": "684.21"},
        {"date": "12/10/12", "value": "685.42"},
        {"date": "12/11/12", "value": "696.88"},
        {"date": "12/12/12", "value": "697.56"},
        {"date": "12/13/12", "value": "702.7"},
        {"date": "12/14/12", "value": "701.96"},
        {"date": "12/17/12", "value": "720.78"},
        {"date": "12/18/12", "value": "721.07"},
        {"date": "12/19/12", "value": "720.11"},
        {"date": "12/20/12", "value": "722.36"},
        {"date": "12/21/12", "value": "715.63"},
        {"date": "12/24/12", "value": "709.5"},
        {"date": "12/26/12", "value": "708.87"},
        {"date": "12/27/12", "value": "706.29"},
        {"date": "12/28/12", "value": "700.01"},
        {"date": "12/31/12", "value": "707.38"},
        {"date": "1/2/13", "value": "723.25"},
        {"date": "1/3/13", "value": "723.67"},
        {"date": "1/4/13", "value": "737.97"},
        {"date": "1/7/13", "value": "734.75"},
        {"date": "1/8/13", "value": "733.3"},
        {"date": "1/9/13", "value": "738.12"},
        {"date": "1/10/13", "value": "741.48"},
        {"date": "1/11/13", "value": "739.99"},
        {"date": "1/14/13", "value": "723.25"},
        {"date": "1/15/13", "value": "724.93"},
        {"date": "1/16/13", "value": "715.19"},
        {"date": "1/17/13", "value": "711.32"},
        {"date": "1/18/13", "value": "704.51"},
        {"date": "1/22/13", "value": "702.87"},
        {"date": "1/23/13", "value": "741.5"},
        {"date": "1/24/13", "value": "754.21"},
        {"date": "1/25/13", "value": "753.67"},
        {"date": "1/28/13", "value": "750.73"},
        {"date": "1/29/13", "value": "753.68"},
        {"date": "1/30/13", "value": "753.83"},
        {"date": "1/31/13", "value": "755.69"},
        {"date": "2/1/13", "value": "775.6"},
        {"date": "2/4/13", "value": "759.02"},
        {"date": "2/5/13", "value": "765.74"},
        {"date": "2/6/13", "value": "770.17"},
        {"date": "2/7/13", "value": "773.95"},
        {"date": "2/8/13", "value": "785.37"},
        {"date": "2/11/13", "value": "782.42"},
        {"date": "2/12/13", "value": "780.7"},
        {"date": "2/13/13", "value": "782.86"},
        {"date": "2/14/13", "value": "787.82"},
        {"date": "2/15/13", "value": "792.89"},
        {"date": "2/19/13", "value": "806.85"},
        {"date": "2/20/13", "value": "792.46"},
        {"date": "2/21/13", "value": "795.53"},
        {"date": "2/22/13", "value": "799.71"},
        {"date": "2/25/13", "value": "790.77"},
        {"date": "2/26/13", "value": "790.13"},
        {"date": "2/27/13", "value": "799.78"},
        {"date": "2/28/13", "value": "801.2"},
        {"date": "3/1/13", "value": "806.19"},
        {"date": "3/4/13", "value": "821.5"},
        {"date": "3/5/13", "value": "838.6"},
        {"date": "3/6/13", "value": "831.38"},
        {"date": "3/7/13", "value": "832.6"},
        {"date": "3/8/13", "value": "831.52"}
    ];
//    converts date string to date object
    var parseDate = d3.time.format("%x").parse;
    var data = [];

    var len = Math.min(dataA.length, dataB.length);
    for (var i = 0; i < len; i++) {
        var row = [];
        row[0] = parseDate(dataA[i]["date"]);
        row[1] = dataA[i]["value"];
        row[2] = dataB[i]["value"];

        data.push(row);
        console.log(row);
    }
    return data;
}


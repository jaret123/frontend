// ------------ charts ---------------- //

var chart = {
    data : [], // Data to put in the chart
    selector : "", // Where to draw the chart
    colors : [], // Array of colors to use,
    classes : [],
    drawKPI : function () {
        self = this;
        var data = self.data;
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        var name = data["name"];
        var data = data["chartData"];

        function replaceNull(value) {
            if (value !== "") {
                return parseInt(value, 10); // value 1
            }
            return 0;
        }

        //    sets up the page
        //    var margin = {top: 1, right: 10, bottom: 16, left: 26},
        var margin = {top: 15, right: 25, bottom: 25, left: 40},
            width = 327 - (margin.left + margin.right),
            height = 150 - (margin.top + margin.bottom);

        //    translate the actual x data into the pixel space of the DOM
        var x = d3.time.scale()
            .range([0, width]);

        // translate the actual y data into the pixel space of the DOM
        var y = d3.scale.linear()
            .range([height, 0]);

        // setup the x-axis notation
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(6)
            //.ticks(d3.time.months, 2)
            .tickFormat(d3.time.format("%b"), 2)
            .tickSize(0)
            .orient("bottom");

        // If we are dealing with less than 3 months data, put days on the ticks
        if ( data.length < 80 ) {
            xAxis.tickFormat(d3.time.format("%b %d"), 2)
        }
        //    .ticks(d3.time.days, 1)

        // use this based on chart date range
        //    .tickFormat(d3.time.format('%a %d'))

        // setup the y-axis notation
        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(-width)
            .ticks(6)
            .orient("left");

        // create the individual points for the line
        var lineA = d3.svg.line()
            .x(function (d) {
                return x(parseDate(d["date"]));// date
            })
            .y(function (d) {
                var value = d["value"];
                if (value !== "") {
                    return y(parseInt(value, 10)); // value 1
                }
                return y(parseInt(0, 10));
        //            return replaceNull(d["value"]);
            });

        var lineB = d3.svg.line()
            .x(function (d) {
                return x(parseDate(d["date"]));// date
            })
            .y(function (d) {
                var value = d["value_xeros"];
                if (value !== "") {
                    return y(parseInt(value, 10)); // value 1
                }
                return y(0);
        //            return replaceNull(d["value_xeros"]);
            });

        // adds SVG element to DOM, positioning properly
        var selector = ".kpi-chart." + name;
        var svg = d3.selectAll(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // find the extent (min / max) of the values
        x.domain(d3.extent(data, function (d) {
            return parseDate(d["date"]); // date
        }));
        var extentA = d3.extent(data, function (d) {
            var value = d["value"];
            if (value !== "") {
                return parseInt(value, 10); // value 1
            }
            return 0;
            //return replaceNull(d["value"]);
        });
        var extentB = d3.extent(data, function (d) {
            var value = d["value_xeros"];
            if (value !== "") {
                return parseInt(value, 10); // value 1
            }
            return 0;
        //        return replaceNull(d["value_value"]);
        });
        var min = d3.min([extentA[0], extentB[0]]);
        var max = d3.max([extentA[1], extentB[1], 500]); // Added 1000 to deal with no records found

        var round = 1000;

        max = round * (Math.ceil( max / round ) );
        y.domain([min, max]);

        // append the notation for x-axis to the DOM and position
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // append the notation for y-axis to the DOM and position
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // append the line itself
        svg.append("path")
            .datum(data)
            .attr("class", "line-a")
            .attr("d", lineA);

        svg.append("path")
            .datum(data)
            .attr("class", "line-b")
            .attr("d", lineA)
            .transition()
            .delay(500)
            .duration(1500)
            .attr("d", lineB)
    },
    drawBar: function () {
        self = this;
        var data = [],
            colors = [],
            selector = "",
            domainMax;

        data = self.data;
        colors = self.colors;
        selector = self.selector;
        classes = self.classes;

        domainMax = data[2];

        var margin = {top: 10, right: 20, bottom: 0, left: 20},
            width = 120 - (margin.left + margin.right),
            height = 100 - (margin.top + margin.bottom),
            barHeight = 20;

        var x = d3.scale.linear()
            .domain([0, domainMax])
            .range([0, width]);

        //Create SVG element
        var svg = d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", barHeight * 2);

        var bar = svg.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * barHeight + ")";
            });

        bar.append("rect")
            .attr("width", x)
            .attr("height", barHeight - 1)
            .attr("fill", function (d, i) {
                return colors[i];
            });

        bar.append("text")
            .attr("x", function (d, i) {
                if (x(d) > width / 2) {
                    return x(d) - 5;
                }
                else {
                    return x(d) + 5;
                }

            })
            .attr("class", function (d, i) {
                return classes[i];
            })
            .attr("text-anchor", function (d, i) {
                if (x(d) > width / 2) {
                    return "end";
                }
                else {
                    return "start";
                }

            })
            .style("fill", function (d, i) {
                if (x(d) > width / 2) {
                    return "#FFF";
                }
                else {
                    return colors[1];
                }

            })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function (d) {
                return d;
            });
    },
    drawDonut: function () {
        self = this;
        var data = [],
            colors = [],
            selector = "";

        data = self.data;
        colors = self.colors;
        selector = self.selector;

        // data range 0 - 60 minutes

        var inner = data[0], //data[0], // total of full circle
            outer = data[1], //data[1], // outer value
            total = data[2]; //data[2]; // inner value

        var donutWidth = 5;

        var dataOuter = [outer, total - outer],
            dataInner = [inner, total - inner];

        var margin = {top: 25, right: 25, bottom: 25, left: 15},
            width = 100 ,
            height = 100,
            radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

        var colorOuter = d3.scale.ordinal()
            .range([colors[1], "#FFFFFF"]);

        var colorInner = d3.scale.ordinal()
            .range([colors[0], '#ddd']);

        var outerArc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius - donutWidth);

        var innerArc = d3.svg.arc()
            .outerRadius(radius - donutWidth)
            .innerRadius(radius - 2 * donutWidth);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d, i) {
                return d;
            });

        var svg = d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height - 20) + ")");

        // Draw the donut in the SVG
        var donut = svg.selectAll(".arc")
            .data(pie(dataOuter))
            .enter().append("g")
            .attr("class", "arc");

        donut.append("path")
            .attr("d", outerArc)
            .style("fill", function (d, i) {
                return colorOuter(i);
            });

        donut.data(pie(dataInner))
            .append("path")
            .attr("d", innerArc)
            .style("fill", function (d, i) {
                return colorInner(i);
            });

        svg.append("g").append("text")
            .attr("width", width)
            .attr("y", 0)
            .attr("x", 0)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("fill", colorInner)
            .text(inner)

        svg.append("g").append("text")
            .attr("width", width)
            .attr("y", -30)
            .attr("x", 30)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("fill", colorOuter)
            .text(outer)

//        // Add text labels
//        svg.append("text")
//            .attr("x", 5)
//            .attr("class", function (d, i) {
//                return classes[i];
//            })
//            .attr("text-anchor", 5)
//            .style("fill", function (d, i) {
//                  return colors[1];
//            })
//            .attr("y", 10)
//            .attr("dy", ".35em")
//            .text(function (d) {
//                return d;
//            });
    }

}

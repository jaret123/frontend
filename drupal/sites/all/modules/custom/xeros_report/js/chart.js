// ------------ charts ---------------- //

var chart = {
    data : [], // Data to put in the chart
    selector : "", // Where to draw the chart
    colors : [], // Array of colors to use,
    classes : [],
    minExtent : 20,
    drawKPI : function () {
        self = this;
//        var data = chart.data;
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        var name = chart.data.meta.cssClass;
        var data = {
            actual : chart.data.actual,
            model : chart.data.model
        };

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
            //.ticks(ticks)
            //.ticks(10)
            .ticks(d3.time.months, 1)
            .tickFormat(d3.time.format("%b"))
            //.tickSize(0)
            .orient("bottom");

        // setup the y-axis notation
        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(-width)
            .ticks(6)
            .orient("left")
            ;

        // If we are dealing with less than 3 months data, put days on the ticks
//        if ( data.length < 90 ) {
//            xAxis.tickFormat(d3.time.format("%b %-d"), 2);
//            xAxis.ticks(d3.time.weeks, 1)
//        }
        if ( data.actual.chart.length < 30 ) {
            xAxis.tickFormat(d3.time.format("%-d"));
            xAxis.ticks(5);
        }
        if ( data.actual.chart.length < 8 ) {
            xAxis.tickFormat(d3.time.format("%-d"));
            xAxis.ticks(data.length - 1);
        }
        if ( data.actual.chart.length == 1 ) {
            xAxis.tickFormat(d3.time.format("%b %-d"));
            xAxis.ticks(1);
        }

        // create the individual points for the line
        var lineA = d3.svg.line()
            .x(function (d) {
                return x(parseDate(d.date));// date
            })
            .y(function (d) {
                var value = d.cost;
                if (value !== "") {
                    return y(parseInt(value, 10)); // value 1
                }
                return y(0);
            })
            .interpolate("cardinal");


        var lineB = d3.svg.line()
            .x(function (d) {
                return x(parseDate(d.date));// date
            })
            .y(function (d) {
                var value = d.cost;
                if (value !== "") {
                    return y(parseInt(value, 10)); // value 1
                }
                return y(0);
            })
            .interpolate("cardinal");

        // adds SVG element to DOM, positioning properly
        var selector = ".kpi-chart." + name;
        // Add the SVG
        var svg = d3.selectAll(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "none")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//        svg.append("g")
//            .append("rect")
//            .attr("x", 0)
//            .attr("y", 0)
//            .attr("width",  width + margin.left + margin.right)
//            .attr("height", height + margin.top + margin.bottom)
//            .attr("transform", "translate(" + -(margin.left) + "," + -(margin.top) + ")")
//        ;

        // find the extent (min / max) of the values
        x.domain(d3.extent(data.actual.chart, function (d) {
            return parseDate(d["date"]); // date
        }));
        var extentA = d3.extent(data.actual.chart, function (d) {
            var value = d["cost"];
            if (value !== "") {
                return parseInt(value, 10); // value 1
            }
            return 0;
            //return replaceNull(d["value"]);
        });
        var extentB = d3.extent(data.model.chart, function (d) {
            var value = d.cost;
            if (value !== "") {
                return parseInt(value, 10); // value 1
            }
            return 0;
        //        return replaceNull(d["value_value"]);
        });
        var min = d3.min([extentA[0], extentB[0], 0]);
        var max = d3.max([extentA[1], extentB[1], this.minExtent]); // Added 100 to deal with no records found

        var round = 10;

        max = round * (Math.ceil( max / round ) );
        y.domain([min, max]);

        // append the notation for x-axis to the DOM and position
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("transform", "translate(0," + height + ")")
            //.attr("font-size", "12px")
            .call(xAxis);

        // append the notation for y-axis to the DOM and position
        svg.append("g")
            .attr("class", "y axis")
            .attr("fill", "none")
            .attr("stroke", "white")
            .call(yAxis);

        if (data.actual.chart.length > 1) {

            svg.append("path")
                .datum(data.actual.chart)
                .attr("class", "line-b")
                .attr("d", lineA)
                .attr("stroke", "#0086bd")
                .attr("fill", "none")
                .transition()
                .delay(500)
                .duration(1500)
                .attr("d", lineB)
                .attr("fill", "none")
                .style({
                    'stroke-width' : '3px',
                    'shape-rendering' : 'smoothEdges'
                });

        // append the line itself
        // Draw the xeros line, starting at LineA and animating to LineB

        svg.append("path")
            .datum(data.model.chart)
            .attr("class", "line-a")
            .attr("d", lineA)
            .attr("stroke", "#fff")
            .attr("fill", "none")
            .style({
                'stroke-width' : '3px',
                'shape-rendering' : 'smoothEdges'
            });
        ;




            if (data.actual.chart.length < 8) {
                // Actual data rendered at the reference data then animated
                svg.selectAll("dot")
                    .data(data.actual.chart)
                    .enter().append("circle")
                    .attr("fill", "#0086bd")
                    .attr("r", 3.5)
                    .attr("cx", function (d) {
                        return x(parseDate(d["date"]));// date
                    })
                    .attr("cy", function (d) {
                        var value = d["cost"];
                        if (value !== "") {
                            return y(parseInt(value, 10)); // value 1
                        }
                        return y(0);
                    })
                    .transition()
                    .delay(500)
                    .duration(1500)
                    .attr("cx", function (d) {
                        return x(parseDate(d["date"]));// date
                    })
                    .attr("cy", function (d) {
                        var value = d["cost_xeros"];
                        if (value !== "") {
                            return y(parseInt(value, 10)); // value 1
                        }
                        return y(0);
                    });

                // Reference data
                svg.selectAll("dot")
                    .data(data.model.chart)
                    .enter().append("circle")
                    .attr("fill", "white")
                    .attr("r", 3.5)
                    .attr("cx", function (d) {
                        return x(parseDate(d["date"]));// date
                    })
                    .attr("cy", function (d) {
                        var value = d["cost"];
                        if (value !== "") {
                            return y(parseInt(value, 10)); // value 1
                        }
                        return y(0);
                    })
                ;

            }
        }
        if ( data.actual.chart.length == 1 ) {
            //gxAxis.attr("transform", "translate(" + width / 2 + "," + height + ")");
            svg.selectAll("dot")
                .data(data.actual.chart)
                .enter().append("circle")
                .attr("fill", "#0086bd")
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return x(parseDate(d["date"]));// date
                })
                .attr("cy", function (d) {
                    var value = d["cost"];
                    if (value !== "") {
                        return y(parseInt(value, 10)); // value 1
                    }
                    return y(0);
                })
                .attr("transform", "translate(" + width / 2 + "," + 0 + ")")
                .transition()
                .delay(500)
                .duration(1500)
                .attr("cx", function (d) {
                    return x(parseDate(d["date"]));// date
                })
                .attr("cy", function (d) {
                    var value = d["cost_xeros"];
                    if (value !== "") {
                        return y(parseInt(value, 10)); // value 1
                    }
                    return y(0);
                });
            svg.selectAll("dot")
                    .data(data.model.chart)
                    .enter().append("circle")
                    .attr("fill", "white")
                    .attr("r", 3.5)
                    .attr("cx", function (d) {
                        return x(parseDate(d["date"]));// date
                    })
                    .attr("cy", function (d) {
                        var value = d["cost"];
                        if (value !== "") {
                            return y(parseInt(value, 10)); // value 1
                        }
                        return y(0);
                    })
                    .attr("transform", "translate(" + width / 2 + "," + 0 + ")")
                ;


        }
        // We need to explicitly set the styles on text to make rendering in the PDF better.
        svg.selectAll("text")
            .attr("fill", "white")
            .attr("stroke", "none")
            .attr("font-family", "Arial")
            .attr("font-size", "12px");
    },
    drawBar: function () {
        self = this;
        var data = [],
            colors = [],
            selector = "",
            domainMax = 0;

        var ar = chart.data;

        domainMax = ar.splice(2,1);
        data = ar;
        colors = chart.colors;
        selector = chart.selector;
        classes = chart.classes;

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
                return d.toLocaleString();
            });
        // We need to explicitly set the styles on text to make rendering in the PDF better.
        svg.selectAll("text")
            .attr("fill", "white")
            .attr("stroke", "none")
            .attr("font-family", "Arial")
            .attr("font-size", "12px");
    },
    drawDonut: function () {
        self = this;
        var data = [],
            colors = [],
            selector = "";

        data = chart.data;
        colors = chart.colors;
        selector = chart.selector;

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
            .attr("transform", "translate(" + width / 2 + "," + (height - 30) + ")");

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
            .text(inner.toLocaleString())

        svg.append("g").append("text")
            .attr("width", width)
            .attr("y", -30)
            .attr("x", 30)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("fill", colorOuter)
            .text(outer.toLocaleString())

        svg.selectAll("text")
            .attr("fill", "white")
            .attr("stroke", "none")
            .attr("font-family", "Arial")
            .attr("font-size", "12px");

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
